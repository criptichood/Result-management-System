import React, { useState, useRef, ChangeEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Course } from '../../types';
import { CsvPreviewTable } from './CsvPreviewTable';
import type { ParsedRow } from '../../lib/gradingRosterCsv';
import {
  buildGradingRosterCsv,
  downloadRosterCsv,
  parseGradingRosterCsv,
  validateRosterRow,
} from '../../lib/gradingRosterCsv';
import {
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  RefreshCw,
  Sparkles,
  CheckCircle,
  Info,
} from 'lucide-react';

interface LecturerCsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: Course | null;
  students: any[];
  /**
   * Live sheet state. When supplied, the exported roster reflects what is on
   * screen, including unsaved edits — keep this in step with the toolbar
   * export so the two never disagree.
   */
  draftScores?: Record<string, { ca: string; exam: string }>;
  onApplyScores: (importedScores: Record<string, { ca: string; exam: string }>, autoSubmit?: boolean) => void;
}

export const LecturerCsvUploadModal: React.FC<LecturerCsvUploadModalProps> = ({
  isOpen,
  onClose,
  selectedCourse,
  students,
  draftScores,
  onApplyScores,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [ignoredLines, setIgnoredLines] = useState(0);
  const [parseError, setParseError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!selectedCourse) return null;

  const matricMap = new Map<string, any>();
  students.forEach((s) => {
    if (s.student?.matricNumber) {
      matricMap.set(s.student.matricNumber.trim().toUpperCase(), s);
    }
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const rebuildFromRows = (rows: ParsedRow[]): ParsedRow[] =>
    rows.map((row) => validateRosterRow(row.matricNumber, row.caScore, row.examScore, matricMap, selectedCourse));

  const handleRowChange = (index: number, field: 'matricNumber' | 'caScore' | 'examScore', val: string) => {
    // Re-validate through the same rules the file path uses, so the preview
    // and an import can never disagree about what is valid.
    const next = parsedRows.map((r, i) => (i === index ? { ...r, [field]: val } : r));
    setParsedRows(rebuildFromRows(next));
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const result = parseGradingRosterCsv(text, { course: selectedCourse, students });
      setParsedRows(result.rows);
      setIgnoredLines(result.ignoredLines);
      setParseError(result.error || null);
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    // Same builder and same score source as the toolbar export, so both buttons
    // produce byte-identical files. Unsaved edits on the sheet are included,
    // because the sheet is what the lecturer is looking at.
    const csv = buildGradingRosterCsv({
      course: selectedCourse,
      students,
      getScores: (enrollmentId: string) => {
        const draft = draftScores?.[enrollmentId];
        if (draft) return { ca: draft.ca, exam: draft.exam };
        const result = students.find((s: any) => s.enrollmentId === enrollmentId)?.result;
        return {
          ca: result?.caScore !== null && result?.caScore !== undefined ? String(result.caScore) : '',
          exam:
            result?.examScore !== null && result?.examScore !== undefined
              ? String(result.examScore)
              : '',
        };
      },
    });
    downloadRosterCsv(`${selectedCourse.code}_Class_Grading_Roster.csv`, csv);
  };

  // Quick helper to populate sample scores directly for demo/testing
  const handleLoadSampleScores = () => {
    setFileName(`${selectedCourse.code}_Filled_Sample_Scores.csv`);
    setIgnoredLines(0);
    setParseError(null);

    const sampleRows: ParsedRow[] = students.map((s, idx) => {
      // Deterministic realistic scores spanning A down to E & F
      const sampleCA = [32, 28, 25, 20, 18, 35, 22, 16][idx % 8];
      const sampleExam = [52, 44, 38, 28, 23, 56, 32, 21][idx % 8];
      return validateRosterRow(
        s.student?.matricNumber || `FUAZ/SAMPLE/${idx + 1}`,
        sampleCA.toString(),
        sampleExam.toString(),
        matricMap,
        selectedCourse
      );
    });

    setParsedRows(sampleRows);
  };

  const handleCommit = (autoSubmit: boolean = false) => {
    const validScores: Record<string, { ca: string; exam: string }> = {};
    parsedRows.forEach((row) => {
      if (row.isValid && row.enrollmentId) {
        validScores[row.enrollmentId] = {
          ca: row.caScore,
          exam: row.examScore,
        };
      }
    });

    onApplyScores(validScores, autoSubmit);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFileName(null);
    setParsedRows([]);
    setShowErrorsOnly(false);
    setIgnoredLines(0);
    setParseError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.length - validCount;
  const displayRows = showErrorsOnly ? parsedRows.filter((r) => !r.isValid) : parsedRows;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Import Class Results Roster
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedCourse.code} • {selectedCourse.title} ({students.length} Enrolled Candidates)
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadTemplate}
                className="gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              >
                <Download className="w-3.5 h-3.5" /> Export Class Roster (CSV)
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {!fileName ? (
            <div className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-slate-300 dark:border-slate-700 hover:border-emerald-400 bg-slate-50/50 dark:bg-slate-800/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                  Click to browse or drag and drop completed roster CSV
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Format: Matric Number, Student Name, CA (0-40), Exam (0-60)
                </p>
              </div>

              {/* Instant Sample Helper */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-emerald-900 dark:text-emerald-200">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Want to test the automated grading workflow without editing a file?</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLoadSampleScores}
                  className="text-xs gap-1.5 bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Load Sample Filled Roster
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {parseError && (
                <div className="flex items-center gap-2 p-3 text-xs bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-red-800 dark:text-red-200">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  {parseError}
                </div>
              )}

              {ignoredLines > 0 && !parseError && (
                <div className="flex items-start gap-2 p-3 text-xs bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl text-blue-800 dark:text-blue-200">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Skipped {ignoredLines} non-roster {ignoredLines === 1 ? 'line' : 'lines'}{' '}
                    (the NUC grading key travels in the same file). Totals and grades are
                    recalculated from CA and Exam, so formula text in the file is ignored.
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 gap-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{fileName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {parsedRows.length} total student scores parsed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={invalidCount === 0 ? 'success' : 'warning'}>
                    {validCount} Valid / {invalidCount} Invalid
                  </Badge>
                  {ignoredLines > 0 && (
                    <span
                      className="text-[10px] text-slate-500 dark:text-slate-400"
                      title="The NUC grading key exported alongside the roster is not student data."
                    >
                      {ignoredLines} non-roster {ignoredLines === 1 ? 'line' : 'lines'} skipped
                    </span>
                  )}
                  {invalidCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowErrorsOnly(!showErrorsOnly)}
                      className={`text-xs gap-1.5 ${
                        showErrorsOnly
                          ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-300'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Filter className="w-3 h-3" />
                      {showErrorsOnly ? 'Show All' : 'Errors Only'}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    title="Clear and upload another file"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Roster Preview Table */}
              <CsvPreviewTable
                displayRows={displayRows}
                parsedRows={parsedRows}
                onRowChange={handleRowChange}
              />
            </div>
          )}
        </div>

        <DialogFooter className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button variant="ghost" onClick={onClose} className="text-slate-600 dark:text-slate-400 text-xs">
            Cancel
          </Button>

          {parsedRows.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                onClick={() => handleCommit(false)}
                disabled={validCount === 0 || isProcessing}
                className="text-xs border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              >
                Save as Draft ({validCount})
              </Button>
              <Button
                onClick={() => handleCommit(true)}
                disabled={validCount === 0 || isProcessing}
                className="bg-[#059669] hover:bg-emerald-700 text-white gap-1.5 shadow-xs text-xs font-bold"
              >
                <CheckCircle className="w-4 h-4" /> Apply & Submit to Chief Examiner
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
