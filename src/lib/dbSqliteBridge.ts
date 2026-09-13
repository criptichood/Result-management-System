import { DBState } from './dbStateInit';
import { sqliteEngine } from './sqliteEngine';

export async function syncStateToSqliteBridge(state: DBState): Promise<void> {
  if (!sqliteEngine.isReady()) {
    try {
      await sqliteEngine.init();
    } catch {
      return;
    }
  }
  if (!sqliteEngine.isReady()) return;

  try {
    // Sync Users
    const stmtUser = sqliteEngine.getDatabase().prepare(`
      INSERT OR REPLACE INTO users (id, name, email, role, college, department, matric_number, level, phone_number, emergency_contact, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    state.users.forEach((u) => {
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
        u.address || null,
      ]);
    });
    stmtUser.free();

    // Sync Courses
    const stmtCourse = sqliteEngine.getDatabase().prepare(`
      INSERT OR REPLACE INTO courses (id, code, title, credit_units, semester, level, department, college, lecturer_id, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    state.courses.forEach((c) => {
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
        c.description || null,
      ]);
    });
    stmtCourse.free();

    // Sync Departments
    const stmtDept = sqliteEngine.getDatabase().prepare(`
      INSERT OR REPLACE INTO departments (id, name, code, college, hod, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    state.departments.forEach((d) => {
      stmtDept.run([d.id, d.name, d.code, d.college, d.HOD || null, d.description || null]);
    });
    stmtDept.free();

    // Sync Enrollments
    const stmtEnroll = sqliteEngine.getDatabase().prepare(`
      INSERT OR REPLACE INTO enrollments (id, student_id, course_id, semester, academic_year)
      VALUES (?, ?, ?, ?, ?)
    `);
    state.enrollments.forEach((e) => {
      stmtEnroll.run([e.id, e.studentId, e.courseId, e.semester, e.academicYear]);
    });
    stmtEnroll.free();

    // Sync Results
    const stmtResult = sqliteEngine.getDatabase().prepare(`
      INSERT OR REPLACE INTO results (id, enrollment_id, ca_score, exam_score, total_score, grade, status, lecturer_id, moderation_notes, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    state.results.forEach((r) => {
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
        r.lastUpdated || new Date().toISOString(),
      ]);
    });
    stmtResult.free();

    // Sync Moderation Logs
    const stmtLog = sqliteEngine.getDatabase().prepare(`
      INSERT OR REPLACE INTO moderation_logs (id, course_id, course_code, examiner_id, examiner_name, action, timestamp, notes, affected_student_count, details)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    (state.moderationLogs || []).forEach((l) => {
      stmtLog.run([
        l.id,
        l.courseId,
        l.courseCode,
        l.examinerId,
        l.examinerName,
        l.action,
        l.timestamp,
        l.notes || null,
        l.affectedStudentCount || null,
        l.details || null,
      ]);
    });
    stmtLog.free();

    // Sync Settings
    const stmtSetting = sqliteEngine
      .getDatabase()
      .prepare(`INSERT OR REPLACE INTO system_settings (key, value) VALUES (?, ?)`);
    Object.entries(state.settings || {}).forEach(([k, v]) => {
      stmtSetting.run([k, String(v)]);
    });
    stmtSetting.free();

    // Persist binary snapshot to IndexedDB
    await sqliteEngine.persistToIndexedDB();
  } catch (e) {
    console.warn('Failed to sync state to SQLite:', e);
  }
}

export function reloadStateFromSqliteBridge(state: DBState): DBState {
  if (!sqliteEngine.isReady()) return state;
  try {
    const usersRes = sqliteEngine.executeQuery('SELECT * FROM users');
    const coursesRes = sqliteEngine.executeQuery('SELECT * FROM courses');
    const deptsRes = sqliteEngine.executeQuery('SELECT * FROM departments');
    const enrollsRes = sqliteEngine.executeQuery('SELECT * FROM enrollments');
    const resultsRes = sqliteEngine.executeQuery('SELECT * FROM results');

    state.users = usersRes.rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      role: r.role,
      college: r.college || undefined,
      department: r.department || undefined,
      matricNumber: r.matric_number || undefined,
      level: r.level ? Number(r.level) : undefined,
      phoneNumber: r.phone_number || undefined,
      emergencyContact: r.emergency_contact || undefined,
      address: r.address || undefined,
    }));

    state.courses = coursesRes.rows.map((r: any) => ({
      id: r.id,
      code: r.code,
      title: r.title,
      creditUnits: Number(r.credit_units),
      semester: Number(r.semester) as 1 | 2,
      level: Number(r.level),
      department: r.department,
      college: r.college,
      lecturerId: r.lecturer_id || undefined,
      description: r.description || undefined,
    }));

    state.departments = deptsRes.rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      code: r.code,
      college: r.college,
      HOD: r.hod || undefined,
      description: r.description || undefined,
    }));

    state.enrollments = enrollsRes.rows.map((r: any) => ({
      id: r.id,
      studentId: r.student_id,
      courseId: r.course_id,
      semester: Number(r.semester) as 1 | 2,
      academicYear: r.academic_year,
    }));

    state.results = resultsRes.rows.map((r: any) => ({
      id: r.id,
      enrollmentId: r.enrollment_id,
      caScore: r.ca_score !== null && r.ca_score !== undefined ? Number(r.ca_score) : null,
      examScore: r.exam_score !== null && r.exam_score !== undefined ? Number(r.exam_score) : null,
      totalScore: r.total_score !== null && r.total_score !== undefined ? Number(r.total_score) : null,
      grade: r.grade || null,
      status: r.status,
      lecturerId: r.lecturer_id,
      lastUpdated: r.last_updated,
      moderationNotes: r.moderation_notes || undefined,
    }));

    return state;
  } catch (e) {
    console.warn('Could not reload state from SQLite:', e);
    return state;
  }
}
