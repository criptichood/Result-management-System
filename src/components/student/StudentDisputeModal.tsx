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
import { Textarea } from '../ui/textarea';
import { DisputeCategory, GradeDispute, User } from '../../types';
import { AlertCircle, FileQuestion, Send, CheckCircle } from 'lucide-react';
import { db } from '../../lib/db';

interface StudentDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: User;
  courseResult: {
    courseId: string;
    courseCode: string;
    courseTitle: string;
    lecturerId?: string;
    caScore: number | null;
    examScore: number | null;
    totalScore: number | null;
    grade: string | null;
  } | null;
  onDisputeSubmitted: (newDispute: GradeDispute) => void;
}

export const StudentDisputeModal: React.FC<StudentDisputeModalProps> = ({
  isOpen,
  onClose,
  student,
  courseResult,
  onDisputeSubmitted,
}) => {
  const [category, setCategory] = useState<DisputeCategory>('Missing CA Score');
  const [requestedType, setRequestedType] = useState<'CA' | 'Exam' | 'Both'>('CA');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!courseResult) return null;

  const handleSubmit = () => {
    if (!description.trim()) return;

    setIsSubmitting(true);

    const dispute = db.createDispute({
      studentId: student.id,
      studentName: student.name,
      matricNumber: student.matricNumber || 'N/A',
      courseId: courseResult.courseId,
      courseCode: courseResult.courseCode,
      courseTitle: courseResult.courseTitle,
      lecturerId: courseResult.lecturerId,
      category,
      description: description.trim(),
      requestedScoreType: requestedType,
      originalCa: courseResult.caScore,
      originalExam: courseResult.examScore,
      originalTotal: courseResult.totalScore,
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    onDisputeSubmitted(dispute);

    setTimeout(() => {
      setIsSuccess(false);
      setDescription('');
      onClose();
    }, 1200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-2">
            <FileQuestion className="w-5 h-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Submit Grade Dispute / Query
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Lodge a formal academic query for investigation by the Course Lecturer & Chief Examiner.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Dispute Submitted Successfully</h4>
            <p className="text-xs text-slate-500">
              Your petition for {courseResult.courseCode} has been logged and queued for departmental review.
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-2 text-xs">
            {/* Target Course Summary */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Course:</span>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {courseResult.courseCode} — {courseResult.courseTitle}
                </p>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Recorded Scores:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  CA: {courseResult.caScore ?? '-'}/40 | Exam: {courseResult.examScore ?? '-'}/60 | Total: {courseResult.totalScore ?? '-'}/100 ({courseResult.grade || '-'})
                </p>
              </div>
            </div>

            {/* Category of Query */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Nature of Academic Query
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DisputeCategory)}
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Missing CA Score">Missing / Incomplete CA Continuous Assessment</option>
                <option value="Exam Script Remarking">Examination Script Remarking Petition</option>
                <option value="Transcription Error">Score Transcription / Typo Error</option>
                <option value="Missing Total Score">Missing Examination Total Score</option>
                <option value="Other">Other Evaluation Discrepancy</option>
              </select>
            </div>

            {/* Targeted Component */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Component in Dispute
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRequestedType('CA')}
                  className={`py-1.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
                    requestedType === 'CA'
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  CA Score Only
                </button>
                <button
                  type="button"
                  onClick={() => setRequestedType('Exam')}
                  className={`py-1.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
                    requestedType === 'Exam'
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Exam Score Only
                </button>
                <button
                  type="button"
                  onClick={() => setRequestedType('Both')}
                  className={`py-1.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
                    requestedType === 'Both'
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Both CA & Exam
                </button>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Detailed Statement & Justification <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="State clearly why you believe your grade is incorrect. Include test dates, project titles, or exam seat details if relevant..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="text-xs bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Policy Note */}
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 flex items-start gap-2 text-[11px]">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
              <span>
                Academic queries are investigated under university senate exam regulations. Frivolous petitions are discouraged.
              </span>
            </div>
          </div>
        )}

        {!isSuccess && (
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={onClose} className="text-slate-600 dark:text-slate-400 text-xs">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !description.trim()}
              className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5 text-xs shadow-xs"
            >
              <Send className="w-3.5 h-3.5" /> Submit Formal Query
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
