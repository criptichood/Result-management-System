import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AlertTriangle, TrendingDown, BookOpen, Users, UserCheck } from 'lucide-react';
import { CourseAnomaly } from '../../lib/senateAnalytics';

interface AcademicAnomalyModalProps {
  isOpen: boolean;
  onClose: () => void;
  anomaly: CourseAnomaly | null;
}

export const AcademicAnomalyModal: React.FC<AcademicAnomalyModalProps> = ({
  isOpen,
  onClose,
  anomaly,
}) => {
  if (!anomaly) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl w-[94vw] p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader className="p-5 border-b border-slate-200 dark:border-slate-800 bg-red-50/40 dark:bg-red-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                Course Academic Performance Audit & Anomaly Review
              </DialogTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {anomaly.courseCode} • {anomaly.courseTitle} ({anomaly.creditUnits} Units)
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Anomaly Highlight Notice */}
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-xs text-red-900 dark:text-red-200">
            <p className="font-bold flex items-center gap-1.5 text-red-800 dark:text-red-300">
              <TrendingDown className="w-4 h-4" /> Detected Anomaly Flag:
            </p>
            <p className="mt-1 leading-relaxed">
              {anomaly.anomalyReason || `Elevated failure rate of ${anomaly.failureRate}% observed across ${anomaly.scoredCount} evaluated scripts.`}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-2xs font-bold uppercase text-slate-500">Enrolled</p>
              <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{anomaly.enrolledCount}</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800/60 text-center">
              <p className="text-2xs font-bold uppercase text-emerald-800 dark:text-emerald-400">Passed</p>
              <p className="text-lg font-black text-emerald-700 dark:text-emerald-300 mt-0.5">{anomaly.passedCount}</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-lg border border-red-200 dark:border-red-800/60 text-center">
              <p className="text-2xs font-bold uppercase text-red-800 dark:text-red-400">Failed</p>
              <p className="text-lg font-black text-red-700 dark:text-red-300 mt-0.5">{anomaly.failedCount}</p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800/60 text-center">
              <p className="text-2xs font-bold uppercase text-amber-800 dark:text-amber-400">Failure Rate</p>
              <p className="text-lg font-black text-amber-700 dark:text-amber-300 mt-0.5">{anomaly.failureRate}%</p>
            </div>
          </div>

          {/* Class Score Range */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Course Department:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{anomaly.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Course Lecturer:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{anomaly.lecturerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Class Average Score:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{anomaly.averageScore} / 100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Score Range (Min / Max):</span>
              <span className="font-mono text-slate-900 dark:text-white">{anomaly.lowestScore} - {anomaly.highestScore}</span>
            </div>
          </div>

          {/* Senate Recommendation */}
          <div className="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-bold text-slate-800 dark:text-slate-200">Recommended Senate Action:</p>
            <p className="text-2xs leading-normal">
              Direct the Chief Examiner of {anomaly.department} to conduct a moderation re-check of CA vs. Exam score distribution and script sampling before final Senate graduation confirmation.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex justify-end">
          <Button onClick={onClose} variant="outline" size="sm" className="text-xs">
            Close Anomaly Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
