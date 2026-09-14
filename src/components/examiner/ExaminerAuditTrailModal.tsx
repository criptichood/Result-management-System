import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { History, Download, Filter, Search, CheckCircle2, XCircle, Edit3, ShieldAlert } from 'lucide-react';
import { ModerationLog } from '../../types';

interface ExaminerAuditTrailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  logs: ModerationLog[];
  departmentName?: string;
}

export const ExaminerAuditTrailModal: React.FC<ExaminerAuditTrailModalProps> = ({
  isOpen,
  onOpenChange,
  logs,
  departmentName = 'Computer Science',
}) => {
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    const matchesAction = filterAction === 'ALL' || log.action.toUpperCase().includes(filterAction);
    const matchesSearch =
      log.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.examinerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.notes && log.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesAction && matchesSearch;
  });

  const handleExportCsv = () => {
    const headers = ['Log ID', 'Timestamp', 'Course Code', 'Action', 'Examiner Name', 'Affected Students', 'Notes', 'Details'];
    const rows = filteredLogs.map((l) => [
      `"${l.id}"`,
      `"${new Date(l.timestamp).toLocaleString()}"`,
      `"${l.courseCode}"`,
      `"${l.action}"`,
      `"${l.examinerName}"`,
      l.affectedStudentCount || 1,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${departmentName.replace(/\s+/g, '_')}_Moderation_Audit_Trail.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'Approved':
      case 'Batch Approved':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold gap-1">
            <CheckCircle2 className="w-3 h-3" /> {action}
          </Badge>
        );
      case 'Rejected':
      case 'Batch Rejected':
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-bold gap-1">
            <XCircle className="w-3 h-3" /> Returned for Revision
          </Badge>
        );
      case 'Score Override':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800 text-xs font-bold gap-1">
            <Edit3 className="w-3 h-3" /> Score Override
          </Badge>
        );
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden"
        closeClassName="text-white/80 hover:text-white hover:bg-white/20 focus:ring-white/50 top-5 right-5"
      >
        {/* Header with reserved right padding for close button */}
        <div className="bg-[#064e3b] text-white p-5 pr-14 sm:pr-16">
          <DialogHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <History className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                <DialogTitle className="text-xl font-bold text-white truncate">
                  Chief Examiner Moderation Audit Trail
                </DialogTitle>
              </div>
              <Badge className="bg-white/20 text-emerald-100 text-xs px-2.5 py-1 whitespace-nowrap flex-shrink-0 font-semibold border border-white/20">
                Dept. of {departmentName}
              </Badge>
            </div>
            <DialogDescription className="text-emerald-100/90 text-xs mt-0.5">
              Immutable historical logs of result publication, batch approvals, score corrections, and return feedback.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search course code, examiner, candidate..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              {(['ALL', 'APPROVED', 'REJECTED', 'OVERRIDE'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterAction(mode)}
                  className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors ${
                    filterAction === mode
                      ? 'bg-[#064e3b] text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {mode === 'ALL' ? 'All Logs' : mode === 'OVERRIDE' ? 'Overrides' : mode === 'REJECTED' ? 'Returns' : 'Approvals'}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="text-xs gap-1.5 bg-white dark:bg-slate-800"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Logs Timeline List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-sm text-[#064e3b] dark:text-emerald-400">
                    {log.courseCode}
                  </span>
                  {getActionBadge(log.action)}
                  {log.affectedStudentCount && log.affectedStudentCount > 1 && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      ({log.affectedStudentCount} students affected)
                    </span>
                  )}
                </div>

                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>

              {log.notes && (
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {log.notes}
                </p>
              )}

              {log.details && (
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-md border border-slate-100 dark:border-slate-800">
                  {log.details}
                </p>
              )}

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                <span>Examiner: <strong>{log.examinerName}</strong></span>
                <span className="font-mono text-[10px]">ID: {log.id}</span>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <ShieldAlert className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-500" />
              <p className="text-sm font-semibold">No moderation log records found.</p>
              <p className="text-xs text-slate-400 mt-0.5">Logs are automatically created upon approving, returning, or modifying grades.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-xs">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
