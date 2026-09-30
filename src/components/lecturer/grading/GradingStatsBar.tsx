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
  const progressPct = totalStudents > 0 ? Math.round((filledCount / totalStudents) * 100) : 0;

  const stats = [
    {
      label: 'Scoring Progress',
      value: `${filledCount} / ${totalStudents}`,
      suffix: `(${progressPct}%)`,
    },
    { label: 'Class Mean', value: classMean, suffix: '/ 100', accent: true },
    { label: 'Pass Rate', value: `${passRate}%` },
    {
      label: 'Highest Score',
      value: filledCount > 0 ? `${highestScore}` : '—',
      suffix: filledCount > 0 ? '/ 100' : '',
    },
  ];

  return (
    <div>
      {/* Moderation Rejection Alert Banner */}
      {isRejected && rejectionNote && (
        <div className="m-4 sm:mx-5 p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-red-900 dark:text-red-200">
              Returned for Revision — Chief Examiner Feedback
            </h4>
            <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">
              &quot;{rejectionNote}&quot;
            </p>
            <p className="text-[11px] text-red-600/80 dark:text-red-400/80 mt-1">
              Make the requested adjustments below, then submit again.
            </p>
          </div>
        </div>
      )}

      {/* Slim stats strip instead of a boxed panel. This sits directly above the
          sheet, so every pixel here costs visible table rows. */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-4 sm:px-5 py-2.5 border-b border-slate-100 dark:border-slate-800 text-xs">
        {stats.map((s) => (
          <span key={s.label} className="flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400">{s.label}:</span>
            <span
              className={
                s.accent
                  ? 'font-bold text-emerald-600 dark:text-emerald-400'
                  : 'font-bold text-slate-800 dark:text-slate-200'
              }
            >
              {s.value}
            </span>
            {s.suffix && <span className="text-slate-400 dark:text-slate-500">{s.suffix}</span>}
          </span>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenRubric}
          className="text-[11px] text-slate-500 dark:text-slate-400 gap-1 h-6 px-1.5 ml-auto cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> 5.0 Rubric
        </Button>
      </div>
    </div>
  );
};
