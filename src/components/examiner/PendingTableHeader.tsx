import React from 'react';
import { Search, ShieldAlert, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface PendingTableHeaderProps {
  selectedSession: string;
  onSessionChange?: (session: string) => void;
  availableSessions: string[];
  activeSystemSession: string;
  selectedSemester: number | 'ALL';
  onSemesterChange?: (semester: number | 'ALL') => void;
  workflowTab: 'pending' | 'awaiting' | 'published' | 'all';
  onWorkflowTabChange: (tab: 'pending' | 'awaiting' | 'published' | 'all') => void;
  counts: {
    pending: number;
    awaiting: number;
    published: number;
    all: number;
  };
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLevel: number | 'ALL';
  onLevelChange: (level: number | 'ALL') => void;
  selectedCount: number;
  onBatchApprove?: () => void;
}

export const PendingTableHeader: React.FC<PendingTableHeaderProps> = ({
  selectedSession,
  onSessionChange,
  availableSessions,
  activeSystemSession,
  selectedSemester,
  onSemesterChange,
  workflowTab,
  onWorkflowTabChange,
  counts,
  searchQuery,
  onSearchChange,
  selectedLevel,
  onLevelChange,
  selectedCount,
  onBatchApprove,
}) => {
  return (
    <div className="space-y-3">
      {/* Top Header Row: Title & Academic Session / Semester Controls */}
      <div className="px-5 pt-4 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-[#064e3b] dark:text-emerald-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Result Moderation Queue
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit lecturer score submissions and verify grades for official publishing.
          </p>
        </div>

        {/* Streamlined Session & Semester Controls */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {/* Academic Session */}
          {onSessionChange && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">Session:</span>
              <select
                value={selectedSession}
                onChange={(e) => onSessionChange(e.target.value)}
                aria-label="Select Academic Session"
                className="h-8 px-2.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
              >
                {availableSessions.map((s) => (
                  <option key={s} value={s}>
                    {s} {s === activeSystemSession ? '(Current)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Semester Selector */}
          {onSemesterChange && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              {(['ALL', 1, 2] as const).map((sem) => (
                <button
                  key={sem}
                  onClick={() => onSemesterChange(sem)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    selectedSemester === sem
                      ? 'bg-white dark:bg-slate-700 text-[#064e3b] dark:text-emerald-300 font-semibold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {sem === 'ALL' ? 'All' : sem === 1 ? '1st Sem' : '2nd Sem'}
                </button>
              ))}
            </div>
          )}

          {/* Batch Approve Quick Action */}
          {selectedCount > 0 && onBatchApprove && (
            <Button
              size="sm"
              onClick={onBatchApprove}
              className="h-8 px-3 bg-[#064e3b] hover:bg-[#065f46] text-white text-xs gap-1.5 shadow-2xs font-semibold"
            >
              <Check className="w-3.5 h-3.5" />
              Approve ({selectedCount})
            </Button>
          )}
        </div>
      </div>

      {/* Workflow Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 px-5 bg-slate-50/60 dark:bg-slate-900/60 overflow-x-auto">
        <button
          onClick={() => onWorkflowTabChange('pending')}
          className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            workflowTab === 'pending'
              ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400 dark:border-emerald-400 bg-white dark:bg-slate-800/80 rounded-t-md'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <span>Pending Moderation</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              workflowTab === 'pending'
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
            }`}
          >
            {counts.pending}
          </span>
        </button>

        <button
          onClick={() => onWorkflowTabChange('awaiting')}
          className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            workflowTab === 'awaiting'
              ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400 dark:border-emerald-400 bg-white dark:bg-slate-800/80 rounded-t-md'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <span>Awaiting Scores</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              workflowTab === 'awaiting'
                ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-200'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
            }`}
          >
            {counts.awaiting}
          </span>
        </button>

        <button
          onClick={() => onWorkflowTabChange('published')}
          className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            workflowTab === 'published'
              ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400 dark:border-emerald-400 bg-white dark:bg-slate-800/80 rounded-t-md'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <span>Published</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              workflowTab === 'published'
                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
            }`}
          >
            {counts.published}
          </span>
        </button>

        <button
          onClick={() => onWorkflowTabChange('all')}
          className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            workflowTab === 'all'
              ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400 dark:border-emerald-400 bg-white dark:bg-slate-800/80 rounded-t-md'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <span>All Courses</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
            {counts.all}
          </span>
        </button>
      </div>

      {/* Filter Toolbar: Search and Level Filter */}
      <div className="px-5 py-1 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input
            placeholder="Search code or title..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 100, 200, 300, 400, 500] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => onLevelChange(lvl)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                selectedLevel === lvl
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-[#064e3b] dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {lvl === 'ALL' ? 'All Levels' : `${lvl}L`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
