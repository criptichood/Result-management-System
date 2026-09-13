import React, { useRef, useEffect } from 'react';
import { 
  Table as TableIcon, 
  Search, 
  Plus, 
  Layers, 
  FileSpreadsheet, 
  RefreshCw, 
  Key, 
  MoreVertical, 
  Copy, 
  Terminal 
} from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { TableInfo, QueryResult } from '../../../lib/sqliteEngine';
import { generateTableDdl } from './sqlPresets';

interface SqlTableEditorTabProps {
  tables: TableInfo[];
  selectedTable: string;
  setSelectedTable: (tableName: string) => void;
  tableBrowseData: QueryResult | null;
  tableSearchText: string;
  setTableSearchText: (text: string) => void;
  isTableLoading: boolean;
  activeThreeDotMenu: string | null;
  setActiveThreeDotMenu: (tableName: string | null) => void;
  loadTables: () => void;
  loadTableData: (tableName: string) => void;
  onOpenInsertModal: () => void;
  onOpenSchemaModal: (tableInfo: TableInfo) => void;
  onCopySql: (sql: string) => void;
  onQueryInConsole: (tableName: string) => void;
  onExportCsv: (data?: QueryResult | null, filenamePrefix?: string) => void;
}

export const SqlTableEditorTab: React.FC<SqlTableEditorTabProps> = ({
  tables,
  selectedTable,
  setSelectedTable,
  tableBrowseData,
  tableSearchText,
  setTableSearchText,
  isTableLoading,
  activeThreeDotMenu,
  setActiveThreeDotMenu,
  loadTables,
  loadTableData,
  onOpenInsertModal,
  onOpenSchemaModal,
  onCopySql,
  onQueryInConsole,
  onExportCsv,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const currentTableInfo = tables.find((t) => t.name === selectedTable);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveThreeDotMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setActiveThreeDotMenu]);

  const filteredTableRows =
    tableBrowseData?.rows.filter((row) => {
      if (!tableSearchText.trim()) return true;
      return Object.values(row).some((val) =>
        String(val).toLowerCase().includes(tableSearchText.toLowerCase())
      );
    }) || [];

  return (
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
                  <TableIcon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isSelected
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400 group-hover:text-emerald-600'
                    }`}
                  />
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
                          onClick={() => onOpenSchemaModal(t)}
                          className="w-full px-3 py-1.5 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-2 cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5 text-emerald-600" />
                          <span>View Table Schema</span>
                        </button>

                        <button
                          onClick={() => {
                            onCopySql(generateTableDdl(t));
                            setActiveThreeDotMenu(null);
                          }}
                          className="w-full px-3 py-1.5 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-2 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-blue-600" />
                          <span>Copy CREATE TABLE SQL</span>
                        </button>

                        <button
                          onClick={() => {
                            onQueryInConsole(t.name);
                            setActiveThreeDotMenu(null);
                          }}
                          className="w-full px-3 py-1.5 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-2 cursor-pointer"
                        >
                          <Terminal className="w-3.5 h-3.5 text-purple-600" />
                          <span>Query in SQL Console</span>
                        </button>

                        <button
                          onClick={() => {
                            onExportCsv(tableBrowseData, t.name);
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
                onClick={onOpenInsertModal}
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
                  onClick={() => onOpenSchemaModal(currentTableInfo)}
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
                onClick={() => onExportCsv(tableBrowseData, selectedTable)}
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
                        const colSchema = currentTableInfo?.columns.find((c) => c.name === colName);
                        return (
                          <TableHead
                            key={idx}
                            className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap py-2.5"
                          >
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
                                ) : c.includes('grade') ? (
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
                          colSpan={tableBrowseData.columns.length + 1}
                          className="h-28 text-center text-xs text-slate-500"
                        >
                          {tableSearchText
                            ? 'No records match your search filter.'
                            : 'Table contains 0 records.'}
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
              onClick={() => onQueryInConsole(selectedTable)}
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Terminal className="w-3 h-3" />
              <span>Custom SQL query on {selectedTable}</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
