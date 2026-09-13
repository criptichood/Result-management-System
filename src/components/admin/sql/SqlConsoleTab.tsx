import React from 'react';
import { 
  Code2, 
  Trash2, 
  Copy, 
  Check, 
  Play, 
  AlertCircle, 
  Table as TableIcon, 
  CheckCircle2, 
  Clock, 
  Search, 
  FileSpreadsheet, 
  CheckCircle 
} from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { QueryResult } from '../../../lib/sqliteEngine';
import { QUERY_PRESETS, QueryPreset } from './sqlPresets';

interface SqlConsoleTabProps {
  activeSql: string;
  setActiveSql: (sql: string) => void;
  selectedPresetId: string;
  setSelectedPresetId: (id: string) => void;
  queryResult: QueryResult | null;
  queryError: string | null;
  isExecuting: boolean;
  filterText: string;
  setFilterText: (filter: string) => void;
  copiedSql: boolean;
  handleExecute: (sqlToRun?: string) => Promise<void>;
  handlePresetSelect: (preset: QueryPreset) => void;
  handleCopySql: (text: string) => void;
  handleClearSql: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleExportCsv: (data?: QueryResult | null, filenamePrefix?: string) => void;
}

export const SqlConsoleTab: React.FC<SqlConsoleTabProps> = ({
  activeSql,
  setActiveSql,
  selectedPresetId,
  setSelectedPresetId,
  queryResult,
  queryError,
  isExecuting,
  filterText,
  setFilterText,
  copiedSql,
  handleExecute,
  handlePresetSelect,
  handleCopySql,
  handleClearSql,
  handleKeyDown,
  handleExportCsv,
}) => {
  const filteredConsoleRows =
    queryResult?.rows.filter((row) => {
      if (!filterText.trim()) return true;
      return Object.values(row).some((val) =>
        String(val).toLowerCase().includes(filterText.toLowerCase())
      );
    }) || [];

  return (
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
              {copiedSql ? (
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 mr-1" />
              )}
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
                  <TableHead className="w-12 text-center text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    #
                  </TableHead>
                  {queryResult.columns.map((col, idx) => (
                    <TableHead
                      key={idx}
                      className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100"
                    >
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConsoleRows.length > 0 ? (
                  filteredConsoleRows.map((row, rIdx) => (
                    <TableRow
                      key={rIdx}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800"
                    >
                      <TableCell className="text-center text-[11px] text-slate-400 font-mono">
                        {rIdx + 1}
                      </TableCell>
                      {queryResult.columns.map((col, cIdx) => {
                        const val = row[col];
                        const isNull = val === null || val === undefined;
                        return (
                          <TableCell
                            key={cIdx}
                            className="font-mono text-xs text-slate-800 dark:text-slate-200 py-2"
                          >
                            {isNull ? (
                              <span className="text-slate-400 italic font-sans text-[11px]">
                                NULL
                              </span>
                            ) : typeof val === 'boolean' ? (
                              <Badge
                                variant={val ? 'success' : 'secondary'}
                                className="text-[10px] py-0 px-1.5 font-mono"
                              >
                                {String(val)}
                              </Badge>
                            ) : col.includes('grade') ? (
                              <Badge
                                variant={
                                  val === 'A'
                                    ? 'success'
                                    : val === 'F'
                                    ? 'destructive'
                                    : 'default'
                                }
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
                    <TableCell
                      colSpan={queryResult.columns.length + 1}
                      className="h-24 text-center text-xs text-slate-500"
                    >
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
            <p className="font-bold text-sm">SQL Statement executed successfully!</p>
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
            No active query executed yet. Choose a template or type a query above, then click{' '}
            <strong>&quot;Run Query&quot;</strong>.
          </div>
        )}
      </Card>
    </div>
  );
};
