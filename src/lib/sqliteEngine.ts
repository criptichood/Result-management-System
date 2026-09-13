import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
// @ts-ignore
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { Course, Department, Enrollment, Result, User } from '../types';
import { mockCourses, mockDepartments, mockEnrollments, mockResults, mockUsers } from './mockData';

const IDB_DB_NAME = 'fuaz_srms_sqlite_db';
const IDB_STORE_NAME = 'sqlite_file_store';
const IDB_KEY = 'current_database_binary';

export interface QueryResult {
  columns: string[];
  values: any[][];
  rows: Record<string, any>[];
  executionTimeMs: number;
  rowsAffected?: number;
}

export interface TableInfo {
  name: string;
  rowCount: number;
  columns: { name: string; type: string; notnull: number; pk: number; dflt_value: any }[];
}

class SQLiteEngine {
  private SQL: SqlJsStatic | null = null;
  private db: Database | null = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.initialized && this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        this.SQL = await initSqlJs({
          locateFile: () => sqlWasmUrl
        });

        const savedBytes = await this.loadFromIndexedDB();
        if (savedBytes && savedBytes.length > 0) {
          try {
            this.db = new this.SQL.Database(savedBytes);
            // Verify schema integrity
            const tables = this.db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
            if (tables.length === 0 || tables[0].values.length === 0) {
              this.bootstrapSchemaAndSeed();
            }
          } catch (err) {
            console.warn('Failed to load existing SQLite binary, re-bootstrapping:', err);
            this.db = new this.SQL.Database();
            this.bootstrapSchemaAndSeed();
          }
        } else {
          this.db = new this.SQL.Database();
          this.bootstrapSchemaAndSeed();
        }

        this.initialized = true;
        await this.persistToIndexedDB();
      } catch (error) {
        console.warn('SQLite initialization warning (running in hybrid mode):', error);
        // Do not crash the entire app if WASM is restricted in preview sandbox
        this.initialized = false;
      }
    })();

    return this.initPromise;
  }

  isReady(): boolean {
    return this.initialized && this.db !== null;
  }

  getDatabase(): Database {
    if (!this.db) {
      throw new Error('SQLite Database is not initialized yet. Await init() first.');
    }
    return this.db;
  }

  private bootstrapSchemaAndSeed(): void {
    if (!this.db) return;

    // Create Relational Tables
    this.db.exec(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL CHECK(role IN ('Student', 'Lecturer', 'Chief Examiner', 'Admin')),
        college TEXT,
        department TEXT,
        matric_number TEXT,
        level INTEGER,
        phone_number TEXT,
        emergency_contact TEXT,
        address TEXT
      );

      CREATE TABLE IF NOT EXISTS departments (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        college TEXT NOT NULL,
        hod TEXT,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        credit_units INTEGER NOT NULL,
        semester INTEGER NOT NULL CHECK(semester IN (1, 2)),
        level INTEGER NOT NULL,
        department TEXT NOT NULL,
        college TEXT NOT NULL,
        lecturer_id TEXT,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS enrollments (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        semester INTEGER NOT NULL CHECK(semester IN (1, 2)),
        academic_year TEXT NOT NULL,
        FOREIGN KEY(student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS results (
        id TEXT PRIMARY KEY,
        enrollment_id TEXT NOT NULL UNIQUE,
        ca_score REAL,
        exam_score REAL,
        total_score REAL,
        grade TEXT,
        status TEXT NOT NULL DEFAULT 'Draft' CHECK(status IN ('Draft', 'Submitted', 'Published', 'Rejected')),
        lecturer_id TEXT,
        moderation_notes TEXT,
        last_updated TEXT,
        FOREIGN KEY(enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS moderation_logs (
        id TEXT PRIMARY KEY,
        course_id TEXT NOT NULL,
        course_code TEXT NOT NULL,
        examiner_id TEXT NOT NULL,
        examiner_name TEXT NOT NULL,
        action TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        notes TEXT,
        affected_student_count INTEGER,
        details TEXT
      );

      CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    // Insert Default System Settings
    const defaultSettings = [
      ['lecturerViewEmail', 'false'],
      ['lecturerViewPhone', 'false'],
      ['courseRegistrationOpen', 'true'],
      ['currentSession', '2024/2025'],
      ['currentSemester', '1'],
    ];

    const stmtSetting = this.db.prepare(`INSERT OR REPLACE INTO system_settings (key, value) VALUES (?, ?)`);
    defaultSettings.forEach(([k, v]) => stmtSetting.run([k, v]));
    stmtSetting.free();

    // Seed Users
    const stmtUser = this.db.prepare(`
      INSERT OR REPLACE INTO users (id, name, email, role, college, department, matric_number, level, phone_number, emergency_contact, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    mockUsers.forEach(u => {
      stmtUser.run([
        u.id,
        u.name,
        u.email,
        u.role,
        u.college || null,
        u.department || null,
        u.matricNumber || null,
        u.level || null,
        u.phoneNumber || null,
        u.emergencyContact || null,
        u.address || null
      ]);
    });
    stmtUser.free();

    // Seed Departments
    const stmtDept = this.db.prepare(`
      INSERT OR REPLACE INTO departments (id, name, code, college, hod, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    mockDepartments.forEach(d => {
      stmtDept.run([d.id, d.name, d.code, d.college, d.HOD || null, d.description || null]);
    });
    stmtDept.free();

    // Seed Courses
    const stmtCourse = this.db.prepare(`
      INSERT OR REPLACE INTO courses (id, code, title, credit_units, semester, level, department, college, lecturer_id, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    mockCourses.forEach(c => {
      stmtCourse.run([
        c.id,
        c.code,
        c.title,
        c.creditUnits,
        c.semester,
        c.level,
        c.department,
        c.college,
        c.lecturerId || null,
        c.description || null
      ]);
    });
    stmtCourse.free();

    // Seed Enrollments
    const stmtEnroll = this.db.prepare(`
      INSERT OR REPLACE INTO enrollments (id, student_id, course_id, semester, academic_year)
      VALUES (?, ?, ?, ?, ?)
    `);
    mockEnrollments.forEach(e => {
      stmtEnroll.run([e.id, e.studentId, e.courseId, e.semester, e.academicYear]);
    });
    stmtEnroll.free();

    // Seed Results
    const stmtResult = this.db.prepare(`
      INSERT OR REPLACE INTO results (id, enrollment_id, ca_score, exam_score, total_score, grade, status, lecturer_id, moderation_notes, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    mockResults.forEach(r => {
      stmtResult.run([
        r.id,
        r.enrollmentId,
        r.caScore ?? null,
        r.examScore ?? null,
        r.totalScore ?? null,
        r.grade ?? null,
        r.status,
        r.lecturerId || null,
        r.moderationNotes || null,
        r.lastUpdated || new Date().toISOString()
      ]);
    });
    stmtResult.free();
  }

  // Raw SQL execution for query runner & console
  executeQuery(sql: string, params: any[] = []): QueryResult {
    if (!this.db) throw new Error('Database is not initialized.');
    
    const startTime = performance.now();
    try {
      const results = this.db.exec(sql, params);
      const executionTimeMs = Number((performance.now() - startTime).toFixed(2));

      if (results.length === 0) {
        // Non-SELECT statements or empty results
        const rowsAffected = this.db.getRowsModified();
        this.persistToIndexedDB().catch(console.error);
        return {
          columns: [],
          values: [],
          rows: [],
          executionTimeMs,
          rowsAffected
        };
      }

      const res = results[0];
      const rows = res.values.map(row => {
        const obj: Record<string, any> = {};
        res.columns.forEach((col, idx) => {
          obj[col] = row[idx];
        });
        return obj;
      });

      return {
        columns: res.columns,
        values: res.values,
        rows,
        executionTimeMs
      };
    } catch (err: any) {
      const executionTimeMs = Number((performance.now() - startTime).toFixed(2));
      throw new Error(`SQL Error (${executionTimeMs}ms): ${err.message || String(err)}`);
    }
  }

  // Get metadata for all tables
  getTablesInfo(): TableInfo[] {
    if (!this.db) return [];
    
    const tableNamesRes = this.db.exec(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%' 
      ORDER BY name ASC
    `);

    if (tableNamesRes.length === 0 || tableNamesRes[0].values.length === 0) return [];

    const tables: TableInfo[] = [];
    tableNamesRes[0].values.forEach(([tableName]) => {
      const name = String(tableName);
      // Count rows
      const countRes = this.db!.exec(`SELECT COUNT(*) as count FROM "${name}"`);
      const rowCount = countRes.length > 0 && countRes[0].values[0] ? Number(countRes[0].values[0][0]) : 0;

      // Table columns info
      const colRes = this.db!.exec(`PRAGMA table_info("${name}")`);
      const columns = colRes.length > 0 ? colRes[0].values.map(c => ({
        name: String(c[1]),
        type: String(c[2]),
        notnull: Number(c[3]),
        dflt_value: c[4],
        pk: Number(c[5])
      })) : [];

      tables.push({ name, rowCount, columns });
    });

    return tables;
  }

  // Export current SQLite database binary
  exportDatabaseBinary(): Uint8Array {
    if (!this.db) throw new Error('Database not initialized.');
    return this.db.export();
  }

  // Generate full SQL schema and data dump
  generateSqlDump(): string {
    if (!this.db) throw new Error('Database not initialized.');

    let dump = `-- FUAZ Student Result Management System (SRMS)\n`;
    dump += `-- Generated SQLite Database Dump: ${new Date().toISOString()}\n\n`;
    dump += `PRAGMA foreign_keys = OFF;\n\n`;

    const tables = this.getTablesInfo();

    tables.forEach(table => {
      // Schema
      const schemaRes = this.db!.exec(`SELECT sql FROM sqlite_master WHERE type='table' AND name='${table.name}'`);
      if (schemaRes.length > 0 && schemaRes[0].values[0]) {
        dump += `${schemaRes[0].values[0][0]};\n\n`;
      }

      // Rows
      const rowsRes = this.db!.exec(`SELECT * FROM "${table.name}"`);
      if (rowsRes.length > 0 && rowsRes[0].values.length > 0) {
        const { columns, values } = rowsRes[0];
        const colsFormatted = columns.map(c => `"${c}"`).join(', ');

        values.forEach(row => {
          const valsFormatted = row.map(val => {
            if (val === null || val === undefined) return 'NULL';
            if (typeof val === 'number') return val;
            return `'${String(val).replace(/'/g, "''")}'`;
          }).join(', ');

          dump += `INSERT INTO "${table.name}" (${colsFormatted}) VALUES (${valsFormatted});\n`;
        });
        dump += `\n`;
      }
    });

    dump += `PRAGMA foreign_keys = ON;\n`;
    return dump;
  }

  // Import external SQLite database binary
  async importDatabaseBinary(buffer: ArrayBuffer | Uint8Array): Promise<void> {
    if (!this.SQL) throw new Error('SQLite WASM engine not loaded.');
    const uint8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    this.db = new this.SQL.Database(uint8);
    await this.persistToIndexedDB();
  }

  // Reset database back to default seed
  async resetDatabase(): Promise<void> {
    if (!this.SQL) throw new Error('SQLite WASM engine not loaded.');
    this.db = new this.SQL.Database();
    this.bootstrapSchemaAndSeed();
    await this.persistToIndexedDB();
  }

  // IndexedDB Helpers
  public async persistToIndexedDB(): Promise<void> {
    if (!this.db) return;
    try {
      const bytes = this.db.export();
      const db = await this.openIndexedDB();
      const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
      const store = tx.objectStore(IDB_STORE_NAME);
      store.put(bytes, IDB_KEY);
    } catch (e) {
      console.warn('Failed to persist SQLite DB to IndexedDB:', e);
    }
  }

  private async loadFromIndexedDB(): Promise<Uint8Array | null> {
    try {
      const db = await this.openIndexedDB();
      return new Promise((resolve) => {
        const tx = db.transaction(IDB_STORE_NAME, 'readonly');
        const store = tx.objectStore(IDB_STORE_NAME);
        const req = store.get(IDB_KEY);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      console.warn('Could not read SQLite DB from IndexedDB:', e);
      return null;
    }
  }

  private openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(IDB_DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
          db.createObjectStore(IDB_STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const sqliteEngine = new SQLiteEngine();
