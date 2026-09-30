import React from 'react';
import { CardDescription } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Upload, Download, Printer, Save, CheckCircle, RotateCcw } from 'lucide-react';
import { Course } from '../../../types';

interface GradingHeaderToolbarProps {
  selectedCourse: Course;
  /**
   * The course picker, rendered in place of a plain course title so the
   * lecturer changes course from the same row as the actions.
   */
  courseSelector?: React.ReactNode;
  isAllPublished: boolean;
  isSubmitted: boolean;
  isRejected: boolean;
  isLocked: boolean;
  canSubmit: boolean;
  submitBlockReason: string | null;
  onOpenCsvModal: () => void;
  onDownloadCSV: () => void;
  onOpenPrintModal: () => void;
  onSaveDraft: () => void;
  onOpenSubmitModal: () => void;
  onUnlock: () => void;
}

/**
 * Actions are grouped in workflow order — bring scores in, save, take a copy
 * out, then the primary submission — with dividers, rather than a flat wrap
 * that reads as scattered.
 */
export const GradingHeaderToolbar: React.FC<GradingHeaderToolbarProps> = ({
  selectedCourse,
  courseSelector,
  isAllPublished,
  isSubmitted,
  isRejected,
  isLocked,
  canSubmit,
  submitBlockReason,
  onOpenCsvModal,
  onDownloadCSV,
  onOpenPrintModal,
  onSaveDraft,
  onOpenSubmitModal,
  onUnlock,
}) => {
  const statusBadge = isAllPublished ? (
    <Badge variant="success">Published</Badge>
  ) : isSubmitted ? (
    <Badge variant="warning">Awaiting Moderation</Badge>
  ) : isRejected ? (
    <Badge variant="destructive">Returned</Badge>
  ) : (
    <Badge variant="outline">Draft</Badge>
  );

  return (
    <div className="border-b border-slate-100 dark:border-slate-800 px-4 sm:px-5 py-3.5 space-y-2.5">
      {/* One row: course on the left, actions on the right. Wraps as a unit on
          narrow screens rather than squeezing the course into a tall column. */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {courseSelector ?? (
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
              {selectedCourse.code}: {selectedCourse.title}
            </h2>
          )}
          {statusBadge}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Data in */}
          <Button
            id="btn-lecturer-import-csv"
            variant="outline"
            size="sm"
            onClick={onOpenCsvModal}
            disabled={isLocked}
            className="gap-1.5 text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
            title="Import completed scores from roster CSV"
          >
            <Upload className="h-3.5 w-3.5" /> Import Results
          </Button>

          {!isLocked && (
            <Button
              id="btn-lecturer-save-draft"
              variant="outline"
              size="sm"
              onClick={onSaveDraft}
              className="gap-1.5 text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
            >
              <Save className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> Save Draft
            </Button>
          )}

          <span className="hidden sm:block w-px h-5 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />

          {/* Data out */}
          <Button
            id="btn-lecturer-export-csv"
            variant="outline"
            size="sm"
            onClick={onDownloadCSV}
            className="gap-1.5 text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
            title="Download official pre-populated class roster CSV (CA & Exam)"
          >
            <Download className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> Export Roster
          </Button>

          <Button
            id="btn-lecturer-print-sheet"
            variant="outline"
            size="sm"
            onClick={onOpenPrintModal}
            className="gap-1.5 text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
            title="Print official broadsheet"
          >
            <Printer className="h-3.5 w-3.5" /> Print Sheet
          </Button>

          <span className="hidden sm:block w-px h-5 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />

          {/* Primary action, last and rightmost */}
          {!isLocked ? (
            <Button
              id="btn-lecturer-submit-results"
              size="sm"
              onClick={onOpenSubmitModal}
              disabled={!canSubmit}
              className="gap-1.5 text-xs bg-[#059669] hover:bg-emerald-700 text-white shadow-xs disabled:opacity-50"
              title={submitBlockReason || 'Send this sheet to the Chief Examiner for moderation'}
            >
              <CheckCircle className="h-3.5 w-3.5" /> Submit
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onUnlock}
              className="gap-1.5 text-xs border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Unlock
            </Button>
          )}
        </div>
      </div>

      {!isLocked && !canSubmit && submitBlockReason && (
        <p className="text-[11px] text-amber-700 dark:text-amber-400">{submitBlockReason}</p>
      )}
    </div>
  );
};
