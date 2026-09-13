import React, { useState, useEffect, useRef } from 'react';
import { Database, Table as TableIcon, Terminal, HardDrive } from 'lucide-react';
import { db } from '../../lib/db';
import { TableInfo, QueryResult, sqliteEngine } from '../../lib/sqliteEngine';
import {
  QUERY_PRESETS,
  QueryPreset,
  SqlInsertRowModal,
  SqlViewSchemaModal,
  SqlTableEditorTab,
  SqlConsoleTab,
  SqlMaintenanceTab,
} from './sql';

interface AdminSqlExplorerTabProps {
  onRefreshData?: () => void;
  showToast?: (message: string, type?: 'success' | 'info') => void;
}

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

  // Table Explorer state
  const [selectedTable, setSelectedTable] = useState<string>('courses');
  const [tableBrowseData, setTableBrowseData] = useState<QueryResult | null>(null);
  const [tableSearchText, setTableSearchText] = useState<string>('');
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false);

  // Modal states
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState<boolean>(false);
  const [schemaModalTable, setSchemaModalTable] = useState<TableInfo | null>(null);
  const [activeThreeDotMenu, setActiveThreeDotMenu] = useState<string | null>(null);

  const [isInsertModalOpen, setIsInsertModalOpen] = useState<boolean>(false);
  const [isInserting, setIsInserting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadTables = async () => {
    try {
      await sqliteEngine.init();
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

  const handlePresetSelect = (preset: QueryPreset) => {
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

  const handleOpenSchemaModal = (tableInfo: TableInfo) => {
    setSchemaModalTable(tableInfo);
    setIsSchemaModalOpen(true);
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

  const handleSaveNewRow = async (insertFormData: Record<string, string>) => {
    const info = tables.find((t) => t.name === selectedTable);
    if (!info) return;

    setIsInserting(true);
    try {
      const colNames: string[] = [];
      const colValues: string[] = [];

      info.columns.forEach((col) => {
        const val = insertFormData[col.name];
        if (val !== undefined && val !== '') {
          colNames.push(`"${col.name}"`);
          if (
            col.type?.toUpperCase().includes('INT') ||
            col.type?.toUpperCase().includes('REAL') ||
            col.type?.toUpperCase().includes('NUM')
          ) {
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
      const rows = target.rows.map((r) =>
        target.columns
          .map((col) => {
            const val = r[col];
            if (val === null || val === undefined) return '""';
            const str = String(val).replace(/"/g, '""');
            return `"${str}"`;
          })
          .join(',')
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
    if (
      !window.confirm(
        'Are you sure you want to reset the SQLite database to initial institutional seed data? All custom records will be replaced.'
      )
    ) {
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

  const currentTableInfo = tables.find((t) => t.name === selectedTable);

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

      {/* TAB 1: TABLE EDITOR */}
      {activeSubTab === 'tables' && (
        <SqlTableEditorTab
          tables={tables}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          tableBrowseData={tableBrowseData}
          tableSearchText={tableSearchText}
          setTableSearchText={setTableSearchText}
          isTableLoading={isTableLoading}
          activeThreeDotMenu={activeThreeDotMenu}
          setActiveThreeDotMenu={setActiveThreeDotMenu}
          loadTables={loadTables}
          loadTableData={loadTableData}
          onOpenInsertModal={() => setIsInsertModalOpen(true)}
          onOpenSchemaModal={handleOpenSchemaModal}
          onCopySql={handleCopySql}
          onQueryInConsole={handleQueryTableInConsole}
          onExportCsv={handleExportCsv}
        />
      )}

      {/* TAB 2: SQL QUERY CONSOLE */}
      {activeSubTab === 'console' && (
        <SqlConsoleTab
          activeSql={activeSql}
          setActiveSql={setActiveSql}
          selectedPresetId={selectedPresetId}
          setSelectedPresetId={setSelectedPresetId}
          queryResult={queryResult}
          queryError={queryError}
          isExecuting={isExecuting}
          filterText={filterText}
          setFilterText={setFilterText}
          copiedSql={copiedSql}
          handleExecute={handleExecute}
          handlePresetSelect={handlePresetSelect}
          handleCopySql={handleCopySql}
          handleClearSql={handleClearSql}
          handleKeyDown={handleKeyDown}
          handleExportCsv={handleExportCsv}
        />
      )}

      {/* TAB 3: BACKUP, EXPORT & MAINTENANCE */}
      {activeSubTab === 'maintenance' && (
        <SqlMaintenanceTab
          handleDownloadSqliteFile={handleDownloadSqliteFile}
          handleDownloadSqlDump={handleDownloadSqlDump}
          handleResetDatabase={handleResetDatabase}
          fileInputRef={fileInputRef}
        />
      )}

      {/* MODAL 1: INSERT ROW MODAL */}
      {isInsertModalOpen && currentTableInfo && (
        <SqlInsertRowModal
          isOpen={isInsertModalOpen}
          onClose={() => setIsInsertModalOpen(false)}
          selectedTable={selectedTable}
          tableInfo={currentTableInfo}
          onSave={handleSaveNewRow}
          isInserting={isInserting}
        />
      )}

      {/* MODAL 2: VIEW SCHEMA MODAL */}
      {isSchemaModalOpen && schemaModalTable && (
        <SqlViewSchemaModal
          isOpen={isSchemaModalOpen}
          onClose={() => setIsSchemaModalOpen(false)}
          tableInfo={schemaModalTable}
          onCopySql={handleCopySql}
          onQueryInConsole={handleQueryTableInConsole}
        />
      )}
    </div>
  );
};
