import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Plus, Key, Save } from 'lucide-react';
import { TableInfo } from '../../../lib/sqliteEngine';

interface SqlInsertRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTable: string;
  tableInfo: TableInfo | null;
  onSave: (insertFormData: Record<string, string>) => Promise<void>;
  isInserting: boolean;
}

export const SqlInsertRowModal: React.FC<SqlInsertRowModalProps> = ({
  isOpen,
  onClose,
  selectedTable,
  tableInfo,
  onSave,
  isInserting,
}) => {
  const [insertFormData, setInsertFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (tableInfo && isOpen) {
      const initialData: Record<string, string> = {};
      tableInfo.columns.forEach((col) => {
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
          initialData[col.name] = '2025/2026';
        } else {
          initialData[col.name] = '';
        }
      });
      setInsertFormData(initialData);
    }
  }, [tableInfo, selectedTable, isOpen]);

  if (!tableInfo) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(insertFormData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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

        <form onSubmit={handleSubmit} className="space-y-3.5 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tableInfo.columns.map((col) => {
              const isPk = !!col.pk;
              const isRequired = !!col.notnull && !col.dflt_value;

              return (
                <div
                  key={col.name}
                  className={col.name === 'description' || col.name === 'address' ? 'sm:col-span-2' : ''}
                >
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
                      onChange={(e) => setInsertFormData((prev) => ({ ...prev, [col.name]: e.target.value }))}
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
                      onChange={(e) => setInsertFormData((prev) => ({ ...prev, [col.name]: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="1">1 (First Semester)</option>
                      <option value="2">2 (Second Semester)</option>
                    </select>
                  ) : col.name === 'status' && selectedTable === 'results' ? (
                    <select
                      value={insertFormData[col.name] || 'Draft'}
                      onChange={(e) => setInsertFormData((prev) => ({ ...prev, [col.name]: e.target.value }))}
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
                      onChange={(e) => setInsertFormData((prev) => ({ ...prev, [col.name]: e.target.value }))}
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
              onClick={onClose}
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
  );
};
