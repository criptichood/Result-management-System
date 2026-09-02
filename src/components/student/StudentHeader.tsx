import React from 'react';
import { Button } from '../ui/button';
import { Download, Printer, Calculator, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';

interface StudentHeaderProps {
  user: User;
  hasPublishedResults: boolean;
  onExportCsv: () => void;
  onPrint: () => void;
  isExporting?: boolean;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  user,
  hasPublishedResults,
  onExportCsv,
  onPrint,
  isExporting = false,
}) => {
  const navigate = useNavigate();

  return (
    <div id="student-header" className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 gap-4 border-b border-slate-200 dark:border-slate-800">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{user.name}</h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Student Portal
          </span>
          <button
            onClick={() => navigate('/gpa-guide')}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <Calculator className="w-3.5 h-3.5" />
            GPA Calculation Guide
          </button>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
          Matric: <span className="font-bold text-slate-800 dark:text-slate-200">{user.matricNumber || 'N/A'}</span> • Department: <span className="font-semibold text-slate-700 dark:text-slate-300">{user.department}</span> • College of {user.college}
        </p>
      </div>

      {/* Global Export & Print Statement Actions */}
      <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
        <Button 
          id="btn-export-all-csv"
          variant="outline" 
          size="sm" 
          className="flex-1 sm:flex-none gap-2 bg-white dark:bg-slate-900 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold h-9 px-3.5 border-slate-300 dark:border-slate-700 dark:text-slate-200" 
          onClick={onExportCsv} 
          disabled={!hasPublishedResults || isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600 dark:text-emerald-400" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
              <span>Export CSV</span>
            </>
          )}
        </Button>
        <Button 
          id="btn-print-statement"
          size="sm" 
          className="flex-1 sm:flex-none gap-2 bg-[#064e3b] hover:bg-[#053d2e] dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white shadow-xs text-xs font-semibold h-9 px-3.5" 
          onClick={onPrint} 
          disabled={!hasPublishedResults}
        >
          <Printer className="h-3.5 w-3.5 text-emerald-200" />
          <span>Statement of Results</span>
        </Button>
      </div>
    </div>
  );
};


