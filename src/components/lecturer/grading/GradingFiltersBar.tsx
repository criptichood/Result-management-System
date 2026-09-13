import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../ui/input';

interface GradingFiltersBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: 'all' | 'unscored' | 'borderline' | 'passed' | 'failing';
  setStatusFilter: (filter: 'all' | 'unscored' | 'borderline' | 'passed' | 'failing') => void;
  totalCount: number;
  unscoredCount: number;
  passCount: number;
}

export const GradingFiltersBar: React.FC<GradingFiltersBarProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  totalCount,
  unscoredCount,
  passCount,
}) => {
  return (
    <div className="px-6 pt-4 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="relative w-full sm:w-64">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
        <Input
          placeholder="Search by matric or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto text-xs">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          All ({totalCount})
        </button>
        <button
          onClick={() => setStatusFilter('unscored')}
          className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
            statusFilter === 'unscored'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          Unscored ({unscoredCount})
        </button>
        <button
          onClick={() => setStatusFilter('borderline')}
          className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
            statusFilter === 'borderline'
              ? 'bg-amber-600 text-white'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
          }`}
        >
          Borderline (39/49/69)
        </button>
        <button
          onClick={() => setStatusFilter('passed')}
          className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
            statusFilter === 'passed'
              ? 'bg-emerald-700 text-white'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
          }`}
        >
          Passed ({passCount})
        </button>
      </div>
    </div>
  );
};
