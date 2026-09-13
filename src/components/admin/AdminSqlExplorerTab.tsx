import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, 
  Play, 
  Download, 
  Upload, 
  RotateCcw, 
  Table as TableIcon, 
  Terminal, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileCode, 
  Copy, 
  Check, 
  Search,
  HardDrive,
  Code2,
  Trash2,
  FileSpreadsheet,
  Layers,
  Key,
  MoreVertical,
  RefreshCw,
  Plus,
  Save,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { db } from '../../lib/db';
import { TableInfo, QueryResult, sqliteEngine } from '../../lib/sqliteEngine';

interface AdminSqlExplorerTabProps {
  onRefreshData?: () => void;
  showToast?: (message: string, type?: 'success' | 'info') => void;
}

const QUERY_PRESETS = [
  {
    id: 'broadsheet',
    label: 'Student Grade Broadsheet (SELECT)',
    category: 'Query',
    description: 'JOIN users, courses, enrollments and published results',
    query: `SELECT 
  u.name AS student_name,
  u.matric_number,
  c.code AS course_code,
  c.title AS course_title,
  r.ca_score,
  r.exam_score,
  r.total_score,
  r.grade,
  r.status
FROM results r
JOIN enrollments e ON r.enrollment_id = e.id
JOIN users u ON e.student_id = u.id
JOIN courses c ON e.course_id = c.id
WHERE r.status = 'Published'
ORDER BY u.name ASC, c.code ASC;`
  },
  {
    id: 'carryovers',
    label: 'Failed Results & Carryovers (SELECT)',
    category: 'Query',
    description: 'Find all failed results (grade F or score < 40)',
    query: `SELECT 
  u.name AS student_name,
  u.matric_number,
  u.level AS student_level,
  c.code AS course_code,
  c.title AS course_title,
  r.total_score,
  r.grade,
  e.academic_year
FROM results r
JOIN enrollments e ON r.enrollment_id = e.id
JOIN users u ON e.student_id = u.id
JOIN courses c ON e.course_id = c.id
WHERE r.grade = 'F' OR r.total_score < 40
ORDER BY u.name ASC;`
  },
  {
    id: 'course_stats',
    label: 'Course Stats & Averages (SELECT)',
    category: 'Query',
    description: 'Aggregated metrics, average, min and max scores per course',
    query: `SELECT 
  c.code,
  c.title,
  c.credit_units,
  COUNT(r.id) AS total_graded,
  ROUND(AVG(r.total_score), 2) AS average_score,
  MIN(r.total_score) AS min_score,
  MAX(r.total_score) AS max_score
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
LEFT JOIN results r ON e.id = r.enrollment_id AND r.status = 'Published'
GROUP BY c.id
ORDER BY total_graded DESC;`
  },
  {
    id: 'insert_course',
    label: 'Insert New Course (INSERT DML)',
    category: 'Insert',
    description: 'Add a new course record directly into SQLite database',
    query: `INSERT INTO courses (
  id, 
  code, 
  title, 
  credit_units, 
  semester, 
  level, 
  department, 
  college, 
  description
) VALUES (
  'c_' || hex(randomblob(4)), 
  'CSC 411', 
  'Cloud Computing Architecture', 
  3, 
  1, 
  400, 
  'Computer Science', 
  'College of Physical Sciences', 
  'Architectures and distributed virtualization paradigms'
);`
  },
  {
    id: 'insert_student',
    label: 'Insert Student Account (INSERT DML)',
    category: 'Insert',
    description: 'Add a new student user record into SQLite users table',
    query: `INSERT INTO users (
  id, 
  name, 
  email, 
  role, 
  college, 
  department, 
  matric_number, 
  level, 
  phone_number
) VALUES (
  'u_' || hex(randomblob(4)), 
  'Abubakar Danladi', 
  'abubakar.d@fuaz.edu.ng', 
  'Student', 
  'College of Physical Sciences', 
  'Computer Science', 
  'UG/2021/01/01/099', 
  400, 
  '+234 809 111 2233'
);`
  },
  {
    id: 'update_setting',
    label: 'Update Academic Session (UPDATE DML)',
    category: 'Update',
    description: 'Update the active session in system_settings table',
    query: `UPDATE system_settings 
SET value = '2024/2025' 
WHERE key = 'currentSession';`
  },
  {
    id: 'students',
    label: 'Student Directory (SELECT)',
    category: 'Query',
    description: 'All registered student accounts with department and level',
    query: `SELECT id, name, matric_number, department, level, email 
FROM users 
WHERE role = 'Student' 
ORDER BY level ASC, name ASC;`
  }
];

export const AdminSqlExplorerTab: React.FC<AdminSqlExplorerTabProps> = ({ onRefreshData, showToast }) => {
  const [activeSubTab, setActiveSubTab] = useState<'tables' | 'console' | 'maintenance'>('tables');
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [activeSql, setActiveSql] = useState<string>(QUERY_PRESETS[0].query);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('broadsheet');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>('');
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [isEngineReady, setIsEngineReady] = useState<boolean>(false);
  
  // Table Explorer state
  const [selectedTable, setSelectedTable] = useState<string>('courses');
  const [tableBrowseData, setTableBrowseData] = useState<QueryResult | null>(null);
  const [tableSearchText, setTableSearchText] = useState<string>('');
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false);
  
  // Schema Modal state
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState<boolean>(false);
  const [schemaModalTable, setSchemaModalTable] = useState<TableInfo | null>(null);
  const [activeThreeDotMenu, setActiveThreeDotMenu] = useState<string | null>(null);

  // Insert Row Modal state
  const [isInsertModalOpen, setIsInsertModalOpen] = useState<boolean>(false);
  const [insertFormData, setInsertFormData] = useState<Record<string, string>>({});
  const [isInserting, setIsInserting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const loadTables = async () => {
    try {
      await sqliteEngine.init();
      setIsEngineReady(true);
      const tbls = db.getSqliteTables();
      setTables(tbls);
      if (tbls.length > 0 && !selectedTable) {
        setSelectedTable(tbls[0].name);
      }
    } catch (e) {
      console.error('Failed to load SQLite tables:', e);
    }
  };

  const loadTableData = async (tableName: string) => {
    setIsTableLoading(true);
    try {
      const res = await db.executeSql(`SELECT * FROM "${tableName}" LIMIT 200;`);
      setTableBrowseData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTableLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      loadTableData(selectedTable);
    }
  }, [selectedTable]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveThreeDotMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExecute = async (sqlToRun?: string) => {
    const sql = (sqlToRun || activeSql).trim();
    if (!sql) return;

    setIsExecuting(true);
    setQueryError(null);

    try {
      const result = await db.executeSql(sql);
      setQueryResult(result);
      loadTables();
      if (selectedTable) {
        loadTableData(selectedTable);
      }
      if (onRefreshData) onRefreshData();

      const isMutation = result.rowsAffected !== undefined;
      const message = isMutation 
        ? `SQL executed successfully (${result.rowsAffected} row(s) modified in ${result.executionTimeMs}ms). Database & UI synchronized.`
        : `SQL executed successfully (${result.rows.length} rows returned in ${result.executionTimeMs}ms)`;

      if (showToast) {
        showToast(message, 'success');
      }
    } catch (err: any) {
      setQueryError(err.message || String(err));
      setQueryResult(null);
    } finally {
      setIsExecuting(false);
    }
  };

  const handlePresetSelect = (preset: typeof QUERY_PRESETS[0]) => {
    setSelectedPresetId(preset.id);
    setActiveSql(preset.query);
    setQueryError(null);
    if (showToast) {
      showToast(`Loaded "${preset.label}" into SQL editor. Click "Run Query" to execute.`, 'info');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
    }
  };

  const handleCopySql = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
    if (showToast) showToast('Copied to clipboard.', 'success');
  };

  const handleClearSql = () => {
    setActiveSql('');
    setSelectedPresetId('');
    setQueryError(null);
  };

  const generateTableDdl = (tableInfo: TableInfo) => {
    const colDefs = tableInfo.columns.map(c => {
      const parts = [`  "${c.name}"`, c.type || 'TEXT'];
      if (c.pk) parts.push('PRIMARY KEY');
      if (c.notnull && !c.pk) parts.push('NOT NULL');
      if (c.dflt_value) parts.push(`DEFAULT ${c.dflt_value}`);
      return parts.join(' ');
    });
    return `CREATE TABLE "${tableInfo.name}" (\n${colDefs.join(',\n')}\n);`;
  };

  const handleOpenSchemaModal = (tableInfo: TableInfo) => {
    setSchemaModalTable(tableInfo);
    setIsSchemaModalOpen(true);
    setActiveThreeDotMenu(null);
  };

  const handleCopyTableSchema = (tableInfo: TableInfo) => {
    const ddl = generateTableDdl(tableInfo);
    handleCopySql(ddl);
    setActiveThreeDotMenu(null);
  };

  const handleQueryTableInConsole = (tableName: string) => {
    setActiveSql(`SELECT * FROM "${tableName}" LIMIT 50;`);
    setActiveSubTab('console');
    setActiveThreeDotMenu(null);
    if (showToast) {
      showToast(`Loaded query for "${tableName}" into SQL console.`, 'info');
    }
  };

  // Open Insert Row Modal for the active table
  const handleOpenInsertModal = () => {
    const info = tables.find(t => t.name === selectedTable);
    if (!info) return;

    const initialData: Record<string, string> = {};
    info.columns.forEach(col => {
      if (col.pk && col.name === 'id') {
        const prefix = selectedTable.charAt(0);
        initialData[col.name] = `${prefix}_${Date.now().toString(36)}`;
      } else if (col.name === 'semester') {
        initialData[col.name] = '1';
      } else if (col.name === 'level') {
        initialData[col.name] = '100';
      } else if (col.name === 'role') {
        initialData[col.name] = 'Student';
      } else if (col.name === 'status') {
        initialData[col.name] = 'Draft';
      } else if (col.name === 'academic_year') {
        initialData[col.name] = '2024/2025';
      } else {
        initialData[col.name] = '';
      }
    });

    setInsertFormData(initialData);
    setIsInsertModalOpen(true);
  };

  // Save New Row via SQL INSERT
  const handleSaveNewRow = async (e: React.FormEvent) => {
    e.preventDefault();
    const info = tables.find(t => t.name === selectedTable);
    if (!info) return;

    setIsInserting(true);
    try {
      const colNames: string[] = [];
      const colValues: string[] = [];

      info.columns.forEach(col => {
        const val = insertFormData[col.name];
        if (val !== undefined && val !== '') {
          colNames.push(`"${col.name}"`);
          if (col.type?.toUpperCase().includes('INT') || col.type?.toUpperCase().includes('REAL') || col.type?.toUpperCase().includes('NUM')) {
            const num = Number(val);
            colValues.push(isNaN(num) ? 'NULL' : String(num));
          } else {
            colValues.push(`'${val.replace(/'/g, "''")}'`);
          }
        }
      });

      if (colNames.length === 0) {
        throw new Error('Please fill in at least one field.');
      }

      const sql = `INSERT INTO "${selectedTable}" (${colNames.join(', ')}) VALUES (${colValues.join(', ')});`;
      await db.executeSql(sql);

      await loadTables();
      await loadTableData(selectedTable);
      if (onRefreshData) onRefreshData();

      setIsInsertModalOpen(false);
      if (showToast) {
        showToast(`Added new record to "${selectedTable}" in SQLite database.`, 'success');
      }
    } catch (err: any) {
      if (showToast) {
        showToast(`Insert failed: ${err.message}`, 'info');
      } else {
        alert(err.message);
      }
    } finally {
      setIsInserting(false);
    }
  };

  const handleExportCsv = (data?: QueryResult | null, filenamePrefix: string = 'query_result') => {
    const target = data || queryResult;
    if (!target || target.rows.length === 0) return;
    try {
      const headers = target.columns.join(',');
      const rows = target.rows.map(r => 
        target.columns.map(col => {
          const val = r[col];
          if (val === null || val === undefined) return '""';
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        }).join(',')
      );
      const csvContent = [headers, ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (showToast) showToast(`Exported ${target.rows.length} rows to CSV.`, 'success');
    } catch (err: any) {
      if (showToast) showToast(`Export failed: ${err.message}`, 'info');
    }
  };

  const handleDownloadSqliteFile = () => {
    try {
      const binary = db.exportSqliteBinary();
      const blob = new Blob([binary], { type: 'application/x-sqlite3' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fuaz_srms_database_${new Date().toISOString().split('T')[0]}.sqlite`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (showToast) showToast('Exported SQLite database binary (.sqlite).', 'success');
    } catch (err: any) {
      if (showToast) showToast(`Export failed: ${err.message}`, 'info');
    }
  };

  const handleDownloadSqlDump = () => {
    try {
      const dump = db.generateSqlDump();
      const blob = new Blob([dump], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fuaz_srms_schema_and_data_${new Date().toISOString().split('T')[0]}.sql`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (showToast) showToast('Exported SQL schema and data script (.sql).', 'success');
    } catch (err: any) {
      if (showToast) showToast(`Dump failed: ${err.message}`, 'info');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      await db.importSqliteBinary(arrayBuffer);
      await loadTables();
      if (onRefreshData) onRefreshData();
      if (showToast) showToast(`Restored SQLite database from ${file.name}.`, 'success');
      setActiveSubTab('tables');
      loadTableData(selectedTable || 'courses');
    } catch (err: any) {
      if (showToast) showToast(`Import failed: ${err.message}`, 'info');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('Are you sure you want to reset the SQLite database to initial institutional seed data? All custom records will be replaced.')) {
      return;
    }
    try {
      await db.resetDatabase();
      await loadTables();
      if (onRefreshData) onRefreshData();
      if (showToast) showToast('Database reset to institutional seed state.', 'success');
      loadTableData(selectedTable || 'courses');
    } catch (err: any) {
      if (showToast) showToast(`Reset failed: ${err.message}`, 'info');
    }
  };

  const filteredConsoleRows = queryResult?.rows.filter(row => {
    if (!filterText.trim()) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(filterText.toLowerCase())
    );
  }) || [];

  const currentTableInfo = tables.find(t => t.name === selectedTable);
  const filteredTableRows = tableBrowseData?.rows.filter(row => {
    if (!tableSearchText.trim()) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(tableSearchText.toLowerCase())
    );
  }) || [];

  return (
    <div className="space-y-6">
      {/* Studio Header Bar & Sub-Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-[#059669] dark:text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  SQLite Database Studio
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  SQLite WASM • Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Full relational SQLite database connected directly to the application state.
              </p>
            </div>
          </div>

          {/* Sub-Navigation Pill Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto">
            <button
              id="subtab-tables"
              onClick={() => setActiveSubTab('tables')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'tables'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table Editor</span>
              <span className="ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {tables.length || 6}
              </span>
            </button>

            <button
              id="subtab-console"
              onClick={() => setActiveSubTab('console')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'console'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>SQL Console (Queries & DML)</span>
            </button>

            <button
              id="subtab-maintenance"
              onClick={() => setActiveSubTab('maintenance')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'maintenance'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Backup & Import</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file input for import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".sqlite,.db,.sqlite3" 
        className="hidden" 
      />

      {/* TAB 1: SUPABASE-STYLE TABLE EDITOR (IMMEDIATE DATA GRID VIEW + INSERT ROW) */}
      {activeSubTab === 'tables' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Table List Selector Sidebar */}
          <div className="lg:col-span-1 space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Tables ({tables.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadTables}
                className="h-6 w-6 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                title="Refresh table list"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>

            <div className="space-y-1.5">
              {tables.map((t) => {
                const isSelected = selectedTable === t.name;
                const isMenuOpen = activeThreeDotMenu === t.name;

                return (
                  <div
                    key={t.name}
                    className={`group relative rounded-xl transition-all border flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100 shadow-2xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedTable(t.name)}
                      className="flex-1 p-3 text-left flex items-center gap-2.5 cursor-pointer overflow-hidden"
                    >
                      <TableIcon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 group-hover:text-emerald-600'}`} />
                      <div className="truncate">
                        <p className="text-xs font-bold font-mono leading-tight truncate">{t.name}</p>
                        <p className="text-[10px] text-slate-400">{t.columns.length} columns</p>
                      </div>
                    </button>

                    <div className="flex items-center pr-2 gap-1.5">
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] font-mono font-bold px-1.5 py-0 ${
                          isSelected ? 'border-emerald-300 text-emerald-800 dark:text-emerald-300' : ''
                        }`}
                      >
                        {t.rowCount}
                      </Badge>

                      {/* Three-Dot Actions Menu */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveThreeDotMenu(isMenuOpen ? null : t.name);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Table actions"
                          aria-label={`Options for ${t.name}`}
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {isMenuOpen && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-1.5 z-30 animate-in fade-in-50 zoom-in-95"
                          >
                            <button
                              onClick={() => handleOpenSchemaModal(t)}
                              className="w-full px-3 py-1.5 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-2 cursor-pointer"
                            >
                              <Layers className="w-3.5 h-3.5 text-emerald-600" />
                              <span>View Table Schema</span>
                            </button>

                            <button
                              onClick={() => handleCopyTableSchema(t)}
                              className="w-full px-3 py-1.5 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-2 cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5 text-blue-600" />
                              <span>Copy CREATE TABLE SQL</span>
                            </button>

                            <button
                              onClick={() => handleQueryTableInConsole(t.name)}
                              className="w-full px-3 py-1.5 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-2 cursor-pointer"
                            >
                              <Terminal className="w-3.5 h-3.5 text-purple-600" />
                              <span>Query in SQL Console</span>
                            </button>

                            <button
                              onClick={() => {
                                handleExportCsv(tableBrowseData, t.name);
                                setActiveThreeDotMenu(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-2 cursor-pointer"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Export to CSV</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table Data View (Primary Top-Level Grid) */}
          <div className="lg:col-span-3">
            <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs overflow-hidden">
              {/* Table Data Header Bar */}
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <TableIcon className="w-4 h-4 text-[#059669] dark:text-emerald-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                        {selectedTable}
                      </span>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {currentTableInfo?.rowCount || 0} rows
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {currentTableInfo?.columns.length || 0} columns
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Search inside table */}
                  <div className="relative w-full sm:w-44">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={tableSearchText}
                      onChange={(e) => setTableSearchText(e.target.value)}
                      placeholder={`Filter ${selectedTable}...`}
                      className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Insert Row Button */}
                  <Button
                    size="sm"
                    onClick={handleOpenInsertModal}
                    className="h-8 bg-[#059669] hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-2xs cursor-pointer"
                    title={`Insert a new record into ${selectedTable}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Insert Row</span>
                  </Button>

                  {/* View Schema Modal Button */}
                  {currentTableInfo && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenSchemaModal(currentTableInfo)}
                      className="h-8 text-xs text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer"
                      title="View column definitions and schema DDL"
                    >
                      <Layers className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      <span>Schema</span>
                    </Button>
                  )}

                  {/* Export Table CSV */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportCsv(tableBrowseData, selectedTable)}
                    disabled={!tableBrowseData || tableBrowseData.rows.length === 0}
                    className="h-8 text-xs text-slate-700 dark:text-slate-300 hover:text-emerald-700 cursor-pointer"
                    title="Export table rows to CSV"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    <span>CSV</span>
                  </Button>

                  {/* Refresh Table Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => loadTableData(selectedTable)}
                    disabled={isTableLoading}
                    className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    title="Refresh data"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTableLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>

              {/* Data Grid View */}
              <CardContent className="p-0">
                {isTableLoading ? (
                  <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Loading table records from SQLite...</span>
                  </div>
                ) : tableBrowseData && tableBrowseData.columns.length > 0 ? (
                  <div className="overflow-x-auto max-h-[560px]">
                    <Table>
                      <TableHeader className="bg-slate-100 dark:bg-slate-800/90 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                        <TableRow>
                          <TableHead className="w-10 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            #
                          </TableHead>
                          {tableBrowseData.columns.map((colName, idx) => {
                            const colSchema = currentTableInfo?.columns.find(c => c.name === colName);
                            return (
                              <TableHead key={idx} className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap py-2.5">
                                <div className="flex items-center gap-1.5">
                                  {colSchema?.pk ? (
                                    <Key className="w-3 h-3 text-amber-500 flex-shrink-0" />
                                  ) : null}
                                  <span>{colName}</span>
                                  {colSchema?.type && (
                                    <span className="text-[10px] font-normal text-slate-400 font-mono">
                                      {colSchema.type.toLowerCase()}
                                    </span>
                                  )}
                                </div>
                              </TableHead>
                            );
                          })}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTableRows.length > 0 ? (
                          filteredTableRows.map((row, rIdx) => (
                            <TableRow 
                              key={rIdx} 
                              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 transition-colors"
                            >
                              <TableCell className="text-center text-[10px] text-slate-400 font-mono py-2">
                                {rIdx + 1}
                              </TableCell>
                              {tableBrowseData.columns.map((c, cIdx) => {
                                const val = row[c];
                                const isNull = val === null || val === undefined;

                                return (
                                  <TableCell key={cIdx} className="font-mono text-xs text-slate-800 dark:text-slate-200 py-2">
                                    {isNull ? (
                                      <span className="text-slate-400 italic font-sans text-[11px]">NULL</span>
                                    ) : typeof val === 'boolean' ? (
                                      <Badge variant={val ? 'success' : 'secondary'} className="text-[10px] py-0 px-1.5 font-mono">
                                        {String(val)}
                                      </Badge>
                                    ) : c.includes('grade') ? (
                                      <Badge 
                                        variant={val === 'A' ? 'success' : val === 'F' ? 'destructive' : 'default'} 
                                        className="text-[10px] py-0 px-1.5 font-bold"
                                      >
                                        {String(val)}
                                      </Badge>
                                    ) : (
                                      String(val)
                                    )}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={tableBrowseData.columns.length + 1} className="h-28 text-center text-xs text-slate-500">
                              {tableSearchText ? 'No records match your search filter.' : 'Table contains 0 records.'}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-12 text-center text-xs text-slate-400">
                    No data available for this table.
                  </div>
                )}
              </CardContent>

              {/* Table Footer Status */}
              <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  Showing {filteredTableRows.length} of {currentTableInfo?.rowCount || 0} rows
                </span>
                <button
                  onClick={() => handleQueryTableInConsole(selectedTable)}
                  className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Terminal className="w-3 h-3" />
                  <span>Custom SQL query on {selectedTable}</span>
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE SQL QUERY CONSOLE (SELECT, INSERT, UPDATE, DELETE) */}
      {activeSubTab === 'console' && (
        <div className="space-y-4">
          {/* Query Presets Chips */}
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Quick Query & DML Templates (Click to load into editor)</span>
              </span>
              <span className="text-[11px] text-slate-400">
                SELECT, INSERT, UPDATE, and DELETE directly into running SQLite
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUERY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all border cursor-pointer ${
                    selectedPresetId === preset.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-700'
                  }`}
                  title={preset.description}
                >
                  {preset.category === 'Insert' ? (
                    <span className="text-emerald-600 font-bold mr-1">+</span>
                  ) : preset.category === 'Update' ? (
                    <span className="text-blue-600 font-bold mr-1">✎</span>
                  ) : null}
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* SQL Editor Card */}
          <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs overflow-hidden">
            {/* Editor Header / Action Bar */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                  SQL Editor
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Supports SELECT, INSERT, UPDATE, DELETE, JOIN, and SQLite functions
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSql}
                  disabled={!activeSql}
                  className="h-8 text-xs text-slate-600 dark:text-slate-400 hover:text-red-600 cursor-pointer"
                  title="Clear editor"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Clear
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopySql(activeSql)}
                  disabled={!activeSql}
                  className="h-8 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
                  title="Copy SQL query"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copiedSql ? 'Copied' : 'Copy'}
                </Button>

                <Button
                  id="btn-run-sql"
                  onClick={() => handleExecute()}
                  disabled={isExecuting || !activeSql.trim()}
                  className={`h-8 bg-[#059669] hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer ${
                    isExecuting ? 'opacity-80 animate-pulse' : ''
                  }`}
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${isExecuting ? 'animate-spin' : ''}`} />
                  <span>{isExecuting ? 'Executing...' : 'Run Query'}</span>
                  <kbd className="hidden sm:inline-block ml-1 text-[10px] bg-emerald-800 text-emerald-200 px-1 py-0.2 rounded">
                    Ctrl+Enter
                  </kbd>
                </Button>
              </div>
            </div>

            {/* Code Input Area */}
            <div className="p-4 bg-slate-950 font-mono text-xs sm:text-sm">
              <textarea
                id="sql-editor-textarea"
                value={activeSql}
                onChange={(e) => {
                  setActiveSql(e.target.value);
                  setSelectedPresetId('');
                }}
                onKeyDown={handleKeyDown}
                rows={7}
                spellCheck={false}
                aria-label="SQL Editor"
                placeholder="Type your SQL query or INSERT statement here... e.g. INSERT INTO courses (...) VALUES (...);"
                className="w-full bg-transparent text-emerald-400 font-mono focus:outline-hidden resize-y leading-relaxed"
              />
            </div>

            {/* Query Error Output */}
            {queryError && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border-t border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-800 dark:text-red-300 font-mono">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="whitespace-pre-wrap">{queryError}</div>
              </div>
            )}
          </Card>

          {/* Query Results Section */}
          <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <span className="font-bold flex items-center gap-1.5">
                  <TableIcon className="w-4 h-4 text-[#059669] dark:text-emerald-400" />
                  Query Results
                </span>
                {queryResult && (
                  <>
                    <span className="text-slate-400">•</span>
                    {queryResult.rowsAffected !== undefined ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {queryResult.rowsAffected} row(s) modified/inserted (Sync Active)
                      </span>
                    ) : (
                      <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <strong>{queryResult.rows.length}</strong> rows returned
                      </span>
                    )}
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {queryResult.executionTimeMs} ms
                    </span>
                  </>
                )}
              </div>

              {queryResult && queryResult.rows.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-56">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                    <input
                      type="text"
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                      placeholder="Filter results..."
                      className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportCsv(queryResult, 'query_results')}
                    className="h-7 text-xs text-slate-700 dark:text-slate-300 hover:text-emerald-700 cursor-pointer"
                    title="Export table to CSV"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    CSV
                  </Button>
                </div>
              )}
            </div>

            {/* Results Table View */}
            {queryResult && queryResult.columns.length > 0 ? (
              <div className="overflow-x-auto max-h-[480px]">
                <Table>
                  <TableHeader className="bg-slate-100 dark:bg-slate-800/90 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-12 text-center text-[11px] font-bold text-slate-600 dark:text-slate-400">#</TableHead>
                      {queryResult.columns.map((col, idx) => (
                        <TableHead key={idx} className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                          {col}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredConsoleRows.length > 0 ? (
                      filteredConsoleRows.map((row, rIdx) => (
                        <TableRow key={rIdx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                          <TableCell className="text-center text-[11px] text-slate-400 font-mono">
                            {rIdx + 1}
                          </TableCell>
                          {queryResult.columns.map((col, cIdx) => {
                            const val = row[col];
                            const isNull = val === null || val === undefined;
                            return (
                              <TableCell key={cIdx} className="font-mono text-xs text-slate-800 dark:text-slate-200 py-2">
                                {isNull ? (
                                  <span className="text-slate-400 italic font-sans text-[11px]">NULL</span>
                                ) : typeof val === 'boolean' ? (
                                  <Badge variant={val ? 'success' : 'secondary'} className="text-[10px] py-0 px-1.5 font-mono">
                                    {String(val)}
                                  </Badge>
                                ) : col.includes('grade') ? (
                                  <Badge 
                                    variant={val === 'A' ? 'success' : val === 'F' ? 'destructive' : 'default'} 
                                    className="text-[10px] py-0 px-1.5 font-bold"
                                  >
                                    {String(val)}
                                  </Badge>
                                ) : (
                                  String(val)
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={queryResult.columns.length + 1} className="h-24 text-center text-xs text-slate-500">
                          No matching records found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : queryResult && queryResult.rowsAffected !== undefined ? (
              <div className="p-8 text-center text-xs text-emerald-700 dark:text-emerald-400 flex flex-col items-center justify-center gap-2">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
                <p className="font-bold text-sm">
                  SQL Statement executed successfully!
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  {queryResult.rowsAffected} row(s) inserted or modified in SQLite and synced into the application state.
                </p>
              </div>
            ) : queryResult ? (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                Query executed successfully. 0 rows returned.
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-400 dark:text-slate-500">
                No active query executed yet. Choose a template or type a query above, then click <strong>&quot;Run Query&quot;</strong>.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 3: BACKUP, EXPORT & MAINTENANCE */}
      {activeSubTab === 'maintenance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Binary .sqlite */}
          <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    Export SQLite Database (.sqlite)
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Download the exact binary SQLite database file with all tables, constraints, and records.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                This file can be opened directly with tools like <strong>DB Browser for SQLite</strong> or <strong>DBeaver</strong>, or backed up for offline testing.
              </p>
              <Button
                onClick={handleDownloadSqliteFile}
                className="bg-[#059669] hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download .sqlite Binary</span>
              </Button>
            </CardContent>
          </Card>

          {/* Export SQL Script Dump */}
          <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    Export SQL Script Dump (.sql)
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Generate standard SQL DDL schema creation and INSERT statements.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Plaintext SQL script containing full table creation definitions and INSERT batches for version control or migration.
              </p>
              <Button
                variant="outline"
                onClick={handleDownloadSqlDump}
                className="border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs gap-1.5 cursor-pointer"
              >
                <FileCode className="w-4 h-4 text-blue-600" />
                <span>Download .sql Script</span>
              </Button>
            </CardContent>
          </Card>

          {/* Import Database Binary */}
          <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    Import SQLite Database (.sqlite)
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Upload an external SQLite database file to replace current state.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Accepts <code>.sqlite</code>, <code>.db</code>, or <code>.sqlite3</code> files. Replaces tables and updates all student, course, and grade records in real time.
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-amber-300 text-amber-900 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-bold text-xs gap-1.5 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-amber-600" />
                <span>Choose .sqlite File to Import</span>
              </Button>
            </CardContent>
          </Card>

          {/* Reset to Clean Seed State */}
          <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    Re-Seed Institutional Database
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Reset tables and populate standard FUAZ academic data.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Clears all custom testing records and restores standard departments, courses, user accounts, and test results.
              </p>
              <Button
                variant="destructive"
                onClick={handleResetDatabase}
                className="font-bold text-xs gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Database to Seed State</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL 1: INSERT ROW MODAL */}
      {isInsertModalOpen && currentTableInfo && (
        <Dialog open={isInsertModalOpen} onOpenChange={setIsInsertModalOpen}>
          <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold font-mono">
                    Insert Record into &quot;{selectedTable}&quot;
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    Input values for each column to insert directly into SQLite table.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSaveNewRow} className="space-y-3.5 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentTableInfo.columns.map((col) => {
                  const isPk = !!col.pk;
                  const isRequired = !!col.notnull && !col.dflt_value;

                  return (
                    <div key={col.name} className={col.name === 'description' || col.name === 'address' ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 font-mono flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          {isPk && <Key className="w-3 h-3 text-amber-500" />}
                          {col.name}
                          {isRequired && <span className="text-red-500">*</span>}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {col.type || 'TEXT'}
                        </span>
                      </label>

                      {col.name === 'role' ? (
                        <select
                          value={insertFormData[col.name] || 'Student'}
                          onChange={(e) => setInsertFormData(prev => ({ ...prev, [col.name]: e.target.value }))}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="Student">Student</option>
                          <option value="Lecturer">Lecturer</option>
                          <option value="Chief Examiner">Chief Examiner</option>
                          <option value="Admin">Admin</option>
                        </select>
                      ) : col.name === 'semester' ? (
                        <select
                          value={insertFormData[col.name] || '1'}
                          onChange={(e) => setInsertFormData(prev => ({ ...prev, [col.name]: e.target.value }))}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="1">1 (First Semester)</option>
                          <option value="2">2 (Second Semester)</option>
                        </select>
                      ) : col.name === 'status' && selectedTable === 'results' ? (
                        <select
                          value={insertFormData[col.name] || 'Draft'}
                          onChange={(e) => setInsertFormData(prev => ({ ...prev, [col.name]: e.target.value }))}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Submitted">Submitted</option>
                          <option value="Published">Published</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      ) : (
                        <input
                          type={col.type?.includes('INT') || col.type?.includes('REAL') ? 'number' : 'text'}
                          value={insertFormData[col.name] || ''}
                          onChange={(e) => setInsertFormData(prev => ({ ...prev, [col.name]: e.target.value }))}
                          placeholder={col.dflt_value ? `Default: ${col.dflt_value}` : `Enter ${col.name}...`}
                          required={isRequired}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500 font-mono"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <DialogFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsInsertModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isInserting}
                  size="sm"
                  className="bg-[#059669] hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isInserting ? 'Inserting...' : 'Insert Record'}</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* MODAL 2: VIEW SCHEMA MODAL */}
      {isSchemaModalOpen && schemaModalTable && (
        <Dialog open={isSchemaModalOpen} onOpenChange={setIsSchemaModalOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <DialogTitle className="text-base font-bold font-mono">
                    Schema: {schemaModalTable.name}
                  </DialogTitle>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  {schemaModalTable.columns.length} columns • {schemaModalTable.rowCount} rows
                </Badge>
              </div>
              <DialogDescription className="text-xs text-slate-500">
                Relational column specifications, data constraints, and generated SQL DDL.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Columns Specs Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Column Definitions
                </h4>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50 dark:bg-slate-800/80">
                      <TableRow>
                        <TableHead className="text-xs">Column</TableHead>
                        <TableHead className="text-xs">Type</TableHead>
                        <TableHead className="text-xs">Primary Key</TableHead>
                        <TableHead className="text-xs">Nullable</TableHead>
                        <TableHead className="text-xs">Default</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schemaModalTable.columns.map((col, idx) => (
                        <TableRow key={idx} className="border-b border-slate-100 dark:border-slate-800">
                          <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {col.pk ? <Key className="w-3 h-3 text-amber-500" /> : null}
                            {col.name}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            <Badge variant="outline" className="text-[10px] font-mono">
                              {col.type || 'TEXT'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            {col.pk ? (
                              <span className="font-semibold text-amber-600 dark:text-amber-400">Yes (PK)</span>
                            ) : (
                              <span className="text-slate-400">No</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs">
                            {col.notnull ? (
                              <span className="text-slate-700 dark:text-slate-300 font-semibold">NOT NULL</span>
                            ) : (
                              <span className="text-slate-400">Nullable</span>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-slate-500">
                            {col.dflt_value || '—'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* SQL DDL Code View */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    CREATE TABLE DDL Script
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopySql(generateTableDdl(schemaModalTable))}
                    className="h-6 text-xs text-emerald-600 hover:text-emerald-700 gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy DDL</span>
                  </Button>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed border border-slate-800">
                  {generateTableDdl(schemaModalTable)}
                </div>
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between sm:justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQueryTableInConsole(schemaModalTable.name)}
                className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                Query in SQL Console
              </Button>
              <Button
                size="sm"
                onClick={() => setIsSchemaModalOpen(false)}
                className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs cursor-pointer"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
