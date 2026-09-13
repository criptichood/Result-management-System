import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ShieldCheck, AlertTriangle, Check, UserCheck, Calculator } from 'lucide-react';
import { db } from '../../lib/db';
import { User } from '../../types';

interface ExaminerScoreOverrideModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  record: {
    enrollment: any;
    result: any;
    student: User;
    course: any;
  } | null;
  examiner: User;
  onSuccess: (message: string) => void;
}

export const ExaminerScoreOverrideModal: React.FC<ExaminerScoreOverrideModalProps> = ({
  isOpen,
  onOpenChange,
  record,
  examiner,
  onSuccess,
}) => {
  const [caScore, setCaScore] = useState<string>('');
  const [examScore, setExamScore] = useState<string>('');
  const [justification, setJustification] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (record) {
      setCaScore(record.result?.caScore !== null && record.result?.caScore !== undefined ? String(record.result.caScore) : '');
      setExamScore(record.result?.examScore !== null && record.result?.examScore !== undefined ? String(record.result.examScore) : '');
      setJustification('');
      setError(null);
    }
  }, [record, isOpen]);

  if (!record) return null;

  const caNum = caScore !== '' ? parseFloat(caScore) : null;
  const examNum = examScore !== '' ? parseFloat(examScore) : null;
  const hasScores = caNum !== null || examNum !== null;
  const calculatedTotal = hasScores ? ((caNum || 0) + (examNum || 0)) : null;
  const calculatedGrade = calculatedTotal !== null ? db.calculateGrade(calculatedTotal) : null;

  const prevTotal = record.result?.totalScore ?? 'None';
  const prevGrade = record.result?.grade ?? 'None';

  // Validation
  const validate = (): boolean => {
    if (caNum !== null && (isNaN(caNum) || caNum < 0 || caNum > 40)) {
      setError('CA Score must be a valid number between 0 and 40.');
      return false;
    }
    if (examNum !== null && (isNaN(examNum) || examNum < 0 || examNum > 60)) {
      setError('Exam Score must be a valid number between 0 and 60.');
      return false;
    }
    if (!justification.trim()) {
      setError('A formal justification reason is required for institutional audit compliance.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    db.overrideStudentScore(
      record.enrollment.id,
      caNum,
      examNum,
      examiner,
      justification.trim()
    );

    onSuccess(`Score updated for ${record.student.name} (${record.course.code}). Audit record logged.`);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-[#064e3b] text-white p-5">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs px-2 py-0.5 bg-white/20 rounded font-bold">
                {record.course.code}
              </span>
              <Badge className="bg-emerald-400 text-emerald-950 font-bold text-xs">
                Chief Examiner Score Override
              </Badge>
            </div>
            <DialogTitle className="text-xl font-bold text-white">
              Grade Moderation & Adjustment
            </DialogTitle>
            <DialogDescription className="text-emerald-100 text-xs mt-0.5">
              Modify candidate Continuous Assessment or Examination scores with mandatory audit log.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-5 space-y-4 text-slate-800 dark:text-slate-200">
          {/* Student & Course Info */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Candidate</p>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{record.student.name}</h4>
              <p className="text-xs font-mono text-slate-600 dark:text-slate-300">{record.student.matricNumber || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Original Recorded Grade</p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {prevTotal} <span className="font-mono text-xs text-slate-500">({prevGrade})</span>
              </p>
            </div>
          </div>

          {/* Score Inputs Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Continuous Assessment (Max 40)
              </label>
              <input
                type="number"
                min="0"
                max="40"
                step="0.5"
                value={caScore}
                onChange={(e) => setCaScore(e.target.value)}
                placeholder="e.g. 28.5"
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Examination (Max 60)
              </label>
              <input
                type="number"
                min="0"
                max="60"
                step="0.5"
                value={examScore}
                onChange={(e) => setExamScore(e.target.value)}
                placeholder="e.g. 45"
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Real-time Recalculated Grade Preview */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3.5 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Recalculated 5.0 Scale Outcome
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  CA ({caNum ?? 0}) + Exam ({examNum ?? 0}) = Total ({calculatedTotal ?? 0})
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold mr-2">New Grade:</span>
              <Badge className="bg-[#064e3b] text-white font-bold text-sm px-2.5 py-0.5">
                {calculatedGrade || '-'}
              </Badge>
            </div>
          </div>

          {/* Mandatory Justification */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Audit Justification & Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="e.g., Score verified against re-marked physical examination booklet following student discrepancy query."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Examiner Signature Info */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Authorized by: <strong>{examiner.name}</strong> (Chief Examiner)</span>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between sm:justify-between">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-xs">
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-[#064e3b] hover:bg-[#053d2e] text-white text-xs gap-1.5 shadow-xs"
          >
            <Check className="w-4 h-4" /> Commit & Sign Audit Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
