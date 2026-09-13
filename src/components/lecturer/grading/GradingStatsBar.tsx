import React from 'react';
import { Button } from '../../ui/button';
import { AlertTriangle, HelpCircle } from 'lucide-react';

interface GradingStatsBarProps {
  filledCount: number;
  totalStudents: number;
  classMean: string;
  passRate: number;
  highestScore: number;
  isRejected: boolean;
  rejectionNote?: string;
  onOpenRubric: () => void;
}

export const GradingStatsBar: React.FC<GradingStatsBarProps> = ({
  filledCount,
  totalStudents,
  classMean,
  passRate,
  highestScore,
  isRejected,
  rejectionNote,
  onOpenRubric,
}) => {
  return (
    <div className="space-y-4">
      {/* Moderation Rejection Alert Banner */}
      {isRejected && rejectionNote && (
        <div className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-red-900 dark:text-red-200">
              Chief Examiner Moderation Feedback: Returned for Revision
            </h4>
            <p className="text-xs text-red-700 dark:text-red-300 mt-1">
              &quot;{rejectionNote}&quot;
            </p>
            <p className="text-[11px] text-red-600/80 dark:text-red-400/80 mt-1">
              Make the requested adjustments below and click &quot;Submit to Chief Examiner&quot; to re-submit for senate approval.
            </p>
          </div>
        </div>
      )}

      {/* Live Class Statistics Bar */}
      <div className="p-4 mx-6 mt-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="space-y-0.5">
          <span className="text-slate-500 dark:text-slate-400">Scoring Progress:</span>
          <p className="font-bold text-slate-800 dark:text-slate-200">
            {filledCount} / {totalStudents} ({totalStudents > 0 ? Math.round((filledCount / totalStudents) * 100) : 0}%)
          </p>
        </div>
        <div className="space-y-0.5">
          <span className="text-slate-500 dark:text-slate-400">Class Mean:</span>
          <p className="font-bold text-emerald-600 dark:text-emerald-400">{classMean} / 100</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-slate-500 dark:text-slate-400">Pass Rate:</span>
          <p className="font-bold text-slate-800 dark:text-slate-200">{passRate}%</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-slate-500 dark:text-slate-400">Highest Score:</span>
          <p className="font-bold text-slate-800 dark:text-slate-200">
            {filledCount > 0 ? `${highestScore}/100` : '-'}
          </p>
        </div>
        <div className="flex items-center justify-between sm:justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenRubric}
            className="text-[11px] text-slate-600 dark:text-slate-400 gap-1 h-7 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> 5.0 Rubric
          </Button>
        </div>
      </div>
    </div>
  );
};
