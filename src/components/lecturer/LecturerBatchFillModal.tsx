import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Course } from '../../types';
import { Wand2, AlertCircle, Check } from 'lucide-react';

interface LecturerBatchFillModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: Course | null;
  students: any[];
  scores: Record<string, { ca: string; exam: string }>;
  onBatchApply: (updates: Record<string, { ca: string; exam: string }>) => void;
}

export const LecturerBatchFillModal: React.FC<LecturerBatchFillModalProps> = ({
  isOpen,
  onClose,
  selectedCourse,
  students,
  scores,
  onBatchApply,
}) => {
  const [targetType, setTargetType] = useState<'ca' | 'exam' | 'both'>('ca');
  const [caValue, setCaValue] = useState('');
  const [examValue, setExamValue] = useState('');
  const [applyMode, setApplyMode] = useState<'unscored' | 'all'>('unscored');

  if (!selectedCourse) return null;

  const handleApply = () => {
    const updates: Record<string, { ca: string; exam: string }> = {};

    students.forEach((s) => {
      const current = scores[s.enrollmentId] || { ca: '', exam: '' };
      const newCa =
        targetType === 'ca' || targetType === 'both'
          ? applyMode === 'unscored' && current.ca !== ''
            ? current.ca
            : caValue
          : current.ca;

      const newExam =
        targetType === 'exam' || targetType === 'both'
          ? applyMode === 'unscored' && current.exam !== ''
            ? current.exam
            : examValue
          : current.exam;

      updates[s.enrollmentId] = {
        ca: newCa,
        exam: newExam,
      };
    });

    onBatchApply(updates);
    onClose();
  };

  const caNum = parseFloat(caValue);
  const examNum = parseFloat(examValue);
  const isCaInvalid = (targetType === 'ca' || targetType === 'both') && caValue !== '' && (isNaN(caNum) || caNum < 0 || caNum > 40);
  const isExamInvalid = (targetType === 'exam' || targetType === 'both') && examValue !== '' && (isNaN(examNum) || examNum < 0 || examNum > 60);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-2">
            <Wand2 className="w-5 h-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Batch Fill Student Scores
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Quickly assign default or participation scores across candidate enrollments for {selectedCourse.code}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Target field selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Score Component to Fill
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetType('ca')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                  targetType === 'ca'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                CA Score (0–40)
              </button>
              <button
                type="button"
                onClick={() => setTargetType('exam')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                  targetType === 'exam'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Exam Score (0–60)
              </button>
              <button
                type="button"
                onClick={() => setTargetType('both')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                  targetType === 'both'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Both CA & Exam
              </button>
            </div>
          </div>

          {/* Value Inputs */}
          <div className="grid grid-cols-2 gap-3">
            {(targetType === 'ca' || targetType === 'both') && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Continuous Assessment (Max 40)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="40"
                  placeholder="e.g. 28"
                  value={caValue}
                  onChange={(e) => setCaValue(e.target.value)}
                  className={`h-9 font-mono text-xs ${isCaInvalid ? 'border-red-500' : ''}`}
                />
              </div>
            )}

            {(targetType === 'exam' || targetType === 'both') && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Exam Score (Max 60)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="60"
                  placeholder="e.g. 45"
                  value={examValue}
                  onChange={(e) => setExamValue(e.target.value)}
                  className={`h-9 font-mono text-xs ${isExamInvalid ? 'border-red-500' : ''}`}
                />
              </div>
            )}
          </div>

          {/* Apply Mode */}
          <div className="space-y-1.5 pt-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Apply To
            </label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="radio"
                  name="applyMode"
                  checked={applyMode === 'unscored'}
                  onChange={() => setApplyMode('unscored')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>Only candidates with empty/unscored slots (Safe)</span>
              </label>
            </div>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="radio"
                  name="applyMode"
                  checked={applyMode === 'all'}
                  onChange={() => setApplyMode('all')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>All candidates (Overwrite existing)</span>
              </label>
            </div>
          </div>

          {(isCaInvalid || isExamInvalid) && (
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Please enter scores within valid ranges (CA: 0-40, Exam: 0-60).</span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="text-slate-600 dark:text-slate-400">
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={isCaInvalid || isExamInvalid || (caValue === '' && examValue === '')}
            className="bg-[#059669] hover:bg-emerald-700 text-white gap-1.5 shadow-xs"
          >
            <Check className="w-4 h-4" /> Apply Batch Scores
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
