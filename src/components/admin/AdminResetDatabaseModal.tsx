import React from 'react';
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

interface AdminResetDatabaseModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmReset: () => void;
}

export const AdminResetDatabaseModal: React.FC<AdminResetDatabaseModalProps> = ({
  isOpen,
  onOpenChange,
  onConfirmReset,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 flex items-center justify-center mb-2">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <DialogTitle className="text-base text-slate-900 dark:text-slate-100 font-bold">
            Reset Database to Default Seed Data?
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            This will purge local modifications and restore the standard Federal University of Agriculture, Zuru initial state (all students, courses, faculty, and mock results).
          </DialogDescription>
        </DialogHeader>

        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg text-xs text-red-800 dark:text-red-300 space-y-1">
          <p className="font-semibold">Important Notes:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
            <li>Any custom-created courses or newly registered users will be cleared.</li>
            <li>All grading changes and status updates will return to initial seed states.</li>
            <li>The active session will reset to 2025/2026 (1st Semester).</li>
          </ul>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-xs text-slate-600 dark:text-slate-400"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              onConfirmReset();
              onOpenChange(false);
            }}
            className="text-xs bg-red-600 hover:bg-red-700 text-white gap-1.5 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Confirm Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
