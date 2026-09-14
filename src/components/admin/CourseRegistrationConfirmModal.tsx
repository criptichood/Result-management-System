import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { AlertTriangle, CheckCircle2, Lock, Unlock, Calendar, BookOpen } from 'lucide-react';
import { SystemSettings } from '../../types';

interface CourseRegistrationConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  settings?: SystemSettings;
  isCurrentlyOpen?: boolean;
  currentSession?: string;
  currentSemester?: number | string;
  enrolledCount?: number;
}

export const CourseRegistrationConfirmModal: React.FC<CourseRegistrationConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  settings,
  isCurrentlyOpen: propIsCurrentlyOpen,
  currentSession: propCurrentSession,
  currentSemester: propCurrentSemester,
  enrolledCount,
}) => {
  const isCurrentlyOpen = propIsCurrentlyOpen !== undefined 
    ? propIsCurrentlyOpen 
    : (settings?.courseRegistrationOpen ?? true);
    
  const session = propCurrentSession || settings?.currentSession || '2025/2026';
  
  const semValue = propCurrentSemester !== undefined 
    ? propCurrentSemester 
    : (settings?.currentSemester ?? 1);
  const semester = semValue === 1 || semValue === '1' || semValue === '1st' ? '1st' : '2nd';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent id="modal-confirm-course-registration" className="sm:max-w-md">
        <DialogHeader className="gap-2">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
              isCurrentlyOpen
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
            }`}
          >
            {isCurrentlyOpen ? (
              <Lock className="w-6 h-6" />
            ) : (
              <Unlock className="w-6 h-6" />
            )}
          </div>
          <DialogTitle className="text-center text-lg font-bold text-slate-900 dark:text-white">
            {isCurrentlyOpen
              ? 'Close Course Registration Portal?'
              : 'Open Course Registration Portal?'}
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-slate-500 dark:text-slate-400">
            Current Academic Session: <span className="font-semibold text-slate-700 dark:text-slate-200">{session}</span> • <span className="font-semibold text-slate-700 dark:text-slate-200">{semester} Semester</span>
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-300 space-y-2">
          {isCurrentlyOpen ? (
            <>
              <div className="flex items-start gap-2 text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">
                  Closing registration will lock student portals. Students will no longer be able to select, drop, or submit new course registration slips for this semester.
                </p>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6">
                • Existing approved enrollments and lecturer grade sheets will remain fully preserved and operational.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">
                  Opening registration allows all eligible matriculated students to select core, elective, and carryover courses up to their credit unit limit.
                </p>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6">
                • Course allocations and prerequisite validation rules will be active.
              </p>
            </>
          )}
        </div>

        <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-2">
          <Button
            id="btn-cancel-reg-toggle"
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            id="btn-confirm-reg-toggle"
            type="button"
            variant={isCurrentlyOpen ? 'destructive' : 'default'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`text-xs gap-1.5 ${
              !isCurrentlyOpen ? 'bg-[#059669] hover:bg-emerald-700 text-white' : ''
            }`}
          >
            {isCurrentlyOpen ? (
              <>
                <Lock className="w-3.5 h-3.5" /> Confirm Close Registration
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5" /> Confirm Open Registration
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
