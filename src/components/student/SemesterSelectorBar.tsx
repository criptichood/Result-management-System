import React from 'react';
import { FileText, BarChart3, ChevronDown, Calendar } from 'lucide-react';

interface SemesterSelectorBarProps {
  activeViewMode: 'results' | 'analytics';
  setActiveViewMode: (mode: 'results' | 'analytics') => void;
  selectedSemesterKey: string;
  setSelectedSemesterKey: (key: string) => void;
  setAnalyticsScope: (scope: string) => void;
  semesterKeys: string[];
}

export const SemesterSelectorBar: React.FC<SemesterSelectorBarProps> = ({
  activeViewMode,
  setActiveViewMode,
  selectedSemesterKey,
  setSelectedSemesterKey,
  setAnalyticsScope,
  semesterKeys,
}) => {
  const handleSemesterChange = (newKey: string) => {
    setSelectedSemesterKey(newKey);
    setAnalyticsScope(newKey);
  };

  return (
    <div 
      id="student-view-controls"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3 w-full max-w-full overflow-hidden"
    >
      {/* View Mode Switcher */}
      <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-950 p-1 w-full lg:w-auto">
        <button
          id="btn-view-results"
          onClick={() => setActiveViewMode('results')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
            activeViewMode === 'results' 
              ? 'bg-white dark:bg-slate-800 shadow-xs text-[#064e3b] dark:text-emerald-300' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Semester Slips</span>
        </button>
        <button
          id="btn-view-analytics"
          onClick={() => setActiveViewMode('analytics')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
            activeViewMode === 'analytics' 
              ? 'bg-white dark:bg-slate-800 shadow-xs text-[#064e3b] dark:text-emerald-300' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Grade Analytics</span>
        </button>
      </div>

      {/* Modern Semester Dropdown Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
        <label htmlFor="select-student-semester" className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
          <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>Filter Semester:</span>
        </label>
        
        <div className="relative w-full sm:min-w-[260px]">
          <select
            id="select-student-semester"
            value={selectedSemesterKey}
            onChange={(e) => handleSemesterChange(e.target.value)}
            className="w-full appearance-none bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-lg pl-3 pr-9 py-2.5 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#064e3b] dark:focus:ring-emerald-500 focus:border-transparent transition-colors cursor-pointer truncate"
          >
            <option value="all" className="font-bold text-slate-900 dark:text-slate-100 py-1">
              📚 All Semesters (Complete Record)
            </option>
            {semesterKeys.map((key, idx) => (
              <option key={key} value={key} className="text-slate-800 dark:text-slate-200 py-1">
                {idx === 0 ? `⭐ ${key} (Latest)` : `🗓️ ${key}`}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
