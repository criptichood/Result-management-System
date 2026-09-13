import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Layers, Key, Copy, Terminal } from 'lucide-react';
import { TableInfo } from '../../../lib/sqliteEngine';
import { generateTableDdl } from './sqlPresets';

interface SqlViewSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableInfo: TableInfo | null;
  onCopySql: (sql: string) => void;
  onQueryInConsole: (tableName: string) => void;
}

export const SqlViewSchemaModal: React.FC<SqlViewSchemaModalProps> = ({
  isOpen,
  onClose,
  tableInfo,
  onCopySql,
  onQueryInConsole,
}) => {
  if (!tableInfo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <DialogTitle className="text-base font-bold font-mono">
                Schema: {tableInfo.name}
              </DialogTitle>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              {tableInfo.columns.length} columns • {tableInfo.rowCount} rows
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
                  {tableInfo.columns.map((col, idx) => (
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
                onClick={() => onCopySql(generateTableDdl(tableInfo))}
                className="h-6 text-xs text-emerald-600 hover:text-emerald-700 gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Copy DDL</span>
              </Button>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed border border-slate-800">
              {generateTableDdl(tableInfo)}
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onQueryInConsole(tableInfo.name);
              onClose();
            }}
            className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
            Query in SQL Console
          </Button>
          <Button
            size="sm"
            onClick={onClose}
            className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs cursor-pointer"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
