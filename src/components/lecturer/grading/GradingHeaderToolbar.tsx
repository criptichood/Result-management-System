import React from 'react';
import { CardTitle, CardDescription } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { 
  Wand2, 
  Upload, 
  Download, 
  Printer, 
  Save, 
  CheckCircle, 
  RotateCcw 
} from 'lucide-react';
import { Course } from '../../../types';

interface GradingHeaderToolbarProps {
  selectedCourse: Course;
  isAllPublished: boolean;
  isSubmitted: boolean;
  isRejected: boolean;
  isLocked: boolean;
  onOpenBatchFill: () => void;
  onOpenCsvModal: () => void;
  onDownloadCSV: () => void;
  onOpenPrintModal: () => void;
  onSaveDraft: () => void;
  onOpenSubmitModal: () => void;
  onUnlock: () => void;
}

export const GradingHeaderToolbar: React.FC<GradingHeaderToolbarProps> = ({
  selectedCourse,
  isAllPublished,
  isSubmitted,
  isRejected,
  isLocked,
  onOpenBatchFill,
  onOpenCsvModal,
  onDownloadCSV,
  onOpenPrintModal,
  onSaveDraft,
  onOpenSubmitModal,
  onUnlock,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-800 p-6 gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {selectedCourse.code}: {selectedCourse.title}
          </CardTitle>
          {isAllPublished ? (
            <Badge variant="success">Published to Students</Badge>
          ) : isSubmitted ? (
            <Badge variant="warning">Submitted — Awaiting Moderation</Badge>
          ) : isRejected ? (
            <Badge variant="destructive">Returned for Revision</Badge>
          ) : (
            <Badge variant="outline">Draft Scoring</Badge>
          )}
        </div>
        <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">
          Input Continuous Assessment (CA max 40) and Final Examination (Exam max 60) scores.
        </CardDescription>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          id="btn-lecturer-batch-fill"
          variant="outline"
          size="sm"
          onClick={onOpenBatchFill}
          disabled={isLocked}
          className="gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
          title="Batch fill default scores"
        >
          <Wand2 className="h-3.5 w-3.5" /> Batch Fill
        </Button>

        <Button
          id="btn-lecturer-import-csv"
          variant="outline"
          size="sm"
          onClick={onOpenCsvModal}
          disabled={isLocked}
          className="gap-1.5 text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
          title="Import scores from CSV"
        >
          <Upload className="h-3.5 w-3.5" /> Import CSV
        </Button>

        <Button
          id="btn-lecturer-export-csv"
          variant="outline"
          size="sm"
          onClick={onDownloadCSV}
          className="gap-1.5 text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
          title="Download CSV score sheet"
        >
          <Download className="h-3.5 w-3.5" /> Export CSV
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

        {!isLocked ? (
          <Button
            id="btn-lecturer-submit-results"
            size="sm"
            onClick={onOpenSubmitModal}
            className="gap-1.5 text-xs bg-[#059669] hover:bg-emerald-700 text-white shadow-xs"
          >
            <CheckCircle className="h-3.5 w-3.5" /> Submit to Chief Examiner
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onUnlock}
            className="gap-1.5 text-xs border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Unlock for Editing
          </Button>
        )}
      </div>
    </div>
  );
};
