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
  filledCount: number;
  passRate: number;
  hasInvalidScores: boolean;
  onConfirmSubmit: () => void;
}

export const GradingSubmitModal: React.FC<GradingSubmitModalProps> = ({
  isOpen,
  onClose,
  selectedCourse,
  totalStudents,
  filledCount,
  passRate,
  hasInvalidScores,
  onConfirmSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-2">
            <CheckCircle className="w-6 h-6" />
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
              <span className="text-slate-500 dark:text-slate-400">Scores Entered:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {filledCount} of {totalStudents}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Estimated Pass Rate:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{passRate}%</span>
            </div>
          </div>

          {hasInvalidScores && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>
                One or more scores exceed maximum permitted thresholds (CA: 40, Exam: 60). Please correct before submitting.
              </span>
            </div>
          )}

          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Once submitted, scores will be locked from direct modification while under review by the Chief Examiner and Head of Department.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-600 dark:text-slate-400"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirmSubmit}
            disabled={hasInvalidScores}
            className="bg-[#059669] hover:bg-emerald-700 text-white gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" /> Confirm & Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
