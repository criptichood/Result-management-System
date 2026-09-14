import React, { useState } from 'react';
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
import { CheckCircle2, XCircle, AlertTriangle, Layers, MessageSquare } from 'lucide-react';
import { User } from '../../types';

interface BatchModerationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCourses: any[];
  actionType: 'approve' | 'reject';
  examiner: User;
  onConfirm: (action: 'approve' | 'reject', notes?: string) => void;
}

export const BatchModerationModal: React.FC<BatchModerationModalProps> = ({
  isOpen,
  onOpenChange,
  selectedCourses,
  actionType,
  examiner,
  onConfirm,
}) => {
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (selectedCourses.length === 0) return null;

  const totalGradesCount = selectedCourses.reduce((sum, c) => sum + (c.submittedCount || c.totalEnrolled || 0), 0);

  const handleExecute = () => {
    if (actionType === 'reject' && !feedbackNotes.trim()) {
      setError('Please provide return feedback remarks explaining what revisions the lecturers must make.');
      return;
    }
    setError(null);
    onConfirm(actionType, feedbackNotes.trim() || undefined);
    onOpenChange(false);
  };

  const isApprove = actionType === 'approve';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-lg p-0 overflow-hidden"
        closeClassName="text-white/80 hover:text-white hover:bg-white/20 top-5 right-5"
      >
        {/* Header */}
        <div className={`p-5 pr-14 sm:pr-16 text-white ${isApprove ? 'bg-gradient-to-r from-[#064e3b] to-[#047857]' : 'bg-gradient-to-r from-amber-700 to-amber-800'}`}>
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Badge className={isApprove ? 'bg-emerald-400 text-emerald-950 font-bold' : 'bg-amber-300 text-amber-950 font-bold'}>
                {isApprove ? 'Batch Senate Approval' : 'Batch Return for Revision'}
              </Badge>
              <span className="text-xs text-white/80">
                {selectedCourses.length} Course{selectedCourses.length > 1 ? 's' : ''} Selected
              </span>
            </div>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              {isApprove ? <CheckCircle2 className="w-5 h-5 text-emerald-300" /> : <XCircle className="w-5 h-5 text-amber-200" />}
              {isApprove ? 'Publish Selected Result Batches' : 'Return Selected Batches for Revision'}
            </DialogTitle>
            <DialogDescription className="text-white/90 text-xs mt-0.5">
              {isApprove
                ? `You are about to approve and publish grades for ${selectedCourses.length} courses (${totalGradesCount} student results) directly to student portals.`
                : `You are returning ${selectedCourses.length} courses back to course lecturers with moderation remarks.`}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-5 space-y-4 text-slate-800 dark:text-slate-200">
          {/* Selected Courses Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#064e3b] dark:text-emerald-400" /> Included Course Batches
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              {selectedCourses.map((c) => (
                <div
                  key={c.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs shadow-2xs"
                >
                  <span className="font-mono font-bold text-[#064e3b] dark:text-emerald-400">{c.code}</span>
                  <span className="text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{c.title}</span>
                  <Badge variant="outline" className="text-[10px] py-0 px-1">
                    {c.submittedCount || 0} scores
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback/Notes for Rejection or Approval */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              {isApprove ? 'Approval Memo / Remarks (Optional)' : 'Revision Instructions for Lecturers *'}
            </label>
            <textarea
              rows={3}
              value={feedbackNotes}
              onChange={(e) => setFeedbackNotes(e.target.value)}
              placeholder={
                isApprove
                  ? 'e.g., All CA 40 and Exam 60 distributions audited and verified in departmental meeting.'
                  : 'e.g., Please review continuous assessment scores exceeding 40% cap and reconcile 2 missing examination scripts for CSC101.'
              }
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
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
            onClick={handleExecute}
            className={
              isApprove
                ? 'bg-[#064e3b] hover:bg-[#053d2e] text-white text-xs gap-1.5 shadow-xs'
                : 'bg-amber-700 hover:bg-amber-800 text-white text-xs gap-1.5 shadow-xs'
            }
          >
            {isApprove ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {isApprove ? `Confirm & Publish ${selectedCourses.length} Batches` : `Return ${selectedCourses.length} Batches`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
