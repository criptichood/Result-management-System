import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { CheckCircle, AlertTriangle, Check } from 'lucide-react';
import { Course } from '../../../types';

interface GradingSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: Course;
  totalStudents: number;
  /** Candidates with at least one component entered. */
  filledCount: number;
  /** Candidates with both CA and Exam entered — the bar for submission. */
  completeCount: number;
  passRate: number;
  hasInvalidScores: boolean;
  /** Mirrors the data-layer rule; non-null blocks submission. */
  blockReason: string | null;
  onConfirmSubmit: () => void;
}

export const GradingSubmitModal: React.FC<GradingSubmitModalProps> = ({
  isOpen,
  onClose,
  selectedCourse,
  totalStudents,
  filledCount,
  completeCount,
  passRate,
  hasInvalidScores,
  blockReason,
  onConfirmSubmit,
}) => {
  const isComplete = completeCount === totalStudents && totalStudents > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              isComplete
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
            }`}
          >
            {isComplete ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Submit Course Results for Moderation
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            You are submitting grades for <strong>{selectedCourse.code} ({selectedCourse.title})</strong> to the Chief Examiner.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Total Enrolled Candidates:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{totalStudents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Scores Started:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {filledCount} of {totalStudents}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Fully Scored (CA + Exam):</span>
              <span
                className={`font-bold ${
                  isComplete
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {completeCount} of {totalStudents}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Estimated Pass Rate:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{passRate}%</span>
            </div>
          </div>

          {blockReason && (
            <div
              className={`p-3 rounded-lg border flex items-start gap-2 ${
                hasInvalidScores
                  ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{blockReason}</span>
            </div>
          )}

          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Once submitted, scores will be locked from direct modification while under review by the Chief Examiner and Head of Department.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="text-slate-600 dark:text-slate-400">
            {blockReason ? 'Close' : 'Cancel'}
          </Button>
          <Button
            onClick={onConfirmSubmit}
            disabled={!isComplete || hasInvalidScores}
            className="bg-[#059669] hover:bg-emerald-700 text-white gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" /> Confirm &amp; Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
