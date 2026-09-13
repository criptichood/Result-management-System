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
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ModerationFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
  onConfirmReject: (courseId: string, notes: string) => void;
}

export const ModerationFeedbackModal: React.FC<ModerationFeedbackModalProps> = ({
  isOpen,
  onClose,
  course,
  onConfirmReject,
}) => {
  const [feedbackNotes, setFeedbackNotes] = useState('');

  if (!course) return null;

  const quickTemplates = [
    'CA scores exceed the 40-mark maximum or show computation discrepancies.',
    'Significant grade clustering anomaly detected. Please re-verify examination papers.',
    'Continuous assessment marks missing for several registered candidates.',
    'Submitted score distribution does not match official attendance sign-in sheet.',
  ];

  const handleConfirm = () => {
    const finalNote = feedbackNotes.trim() || 'Returned by Chief Examiner for revision.';
    onConfirmReject(course.id, finalNote);
    setFeedbackNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 flex items-center justify-center mb-2">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Return Scores for Revision: {course.code}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Provide moderation audit feedback to the course lecturer explaining why this submission is being returned.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Chief Examiner Audit Observations & Required Corrections:
            </label>
            <textarea
              rows={4}
              value={feedbackNotes}
              onChange={(e) => setFeedbackNotes(e.target.value)}
              placeholder="e.g. CA scores for students with <15 attendance require re-evaluation; examination scripts need re-marking..."
              className="w-full text-xs p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
              Quick Feedback Presets:
            </span>
            <div className="flex flex-col gap-1.5">
              {quickTemplates.map((template, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFeedbackNotes(template)}
                  className="text-left text-[11px] p-2 rounded-md bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  "{template}"
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} className="text-slate-600 dark:text-slate-400">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white gap-1.5 shadow-xs"
          >
            <RotateCcw className="w-4 h-4" /> Return to Lecturer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
