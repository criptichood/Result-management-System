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

interface GradingRubricModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GradingRubricModal: React.FC<GradingRubricModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
            Nigerian 5.0 CGPA University Scale
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            National Universities Commission (NUC) benchmark academic grading criteria.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-4 font-bold p-2 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">
            <span>Score Range</span>
            <span className="text-center">Grade</span>
            <span className="text-center">Grade Point</span>
            <span className="text-right">Standing</span>
          </div>
          <div className="grid grid-cols-4 p-2 border-b border-slate-100 dark:border-slate-800">
            <span>70% – 100%</span>
            <span className="text-center font-bold text-emerald-600">A</span>
            <span className="text-center font-mono">5.0</span>
            <span className="text-right text-slate-600">Excellent</span>
          </div>
          <div className="grid grid-cols-4 p-2 border-b border-slate-100 dark:border-slate-800">
            <span>60% – 69%</span>
            <span className="text-center font-bold text-emerald-600">B</span>
            <span className="text-center font-mono">4.0</span>
            <span className="text-right text-slate-600">Very Good</span>
          </div>
          <div className="grid grid-cols-4 p-2 border-b border-slate-100 dark:border-slate-800">
            <span>50% – 59%</span>
            <span className="text-center font-bold text-emerald-600">C</span>
            <span className="text-center font-mono">3.0</span>
            <span className="text-right text-slate-600">Good</span>
          </div>
          <div className="grid grid-cols-4 p-2 border-b border-slate-100 dark:border-slate-800">
            <span>45% – 49%</span>
            <span className="text-center font-bold text-amber-600">D</span>
            <span className="text-center font-mono">2.0</span>
            <span className="text-right text-slate-600">Fair</span>
          </div>
          <div className="grid grid-cols-4 p-2 border-b border-slate-100 dark:border-slate-800">
            <span>40% – 44%</span>
            <span className="text-center font-bold text-amber-600">E</span>
            <span className="text-center font-mono">1.0</span>
            <span className="text-right text-slate-600">Pass</span>
          </div>
          <div className="grid grid-cols-4 p-2 bg-red-50/50 dark:bg-red-950/20 rounded">
            <span className="text-red-700">0% – 39%</span>
            <span className="text-center font-bold text-red-600">F</span>
            <span className="text-center font-mono text-red-600">0.0</span>
            <span className="text-right text-red-600 font-semibold">Fail (Carryover)</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="text-xs cursor-pointer">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
