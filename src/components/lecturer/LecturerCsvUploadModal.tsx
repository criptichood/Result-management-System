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
import { calculateLetterGrade } from '../../lib/academicOperations';
import { CsvPreviewTable, ParsedRow } from './CsvPreviewTable';
import {
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  RefreshCw,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

interface LecturerCsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: Course | null;
  students: any[];
  onApplyScores: (importedScores: Record<string, { ca: string; exam: string }>, autoSubmit?: boolean) => void;
}

export const LecturerCsvUploadModal: React.FC<LecturerCsvUploadModalProps> = ({
  isOpen,
  onClose,
  selectedCourse,
  students,
  onApplyScores,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!selectedCourse) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateRow = (
    matric: string,
    caStr: string,
    examStr: string,
    matricMap: Map<string, any>
  ): ParsedRow => {
    const errors: string[] = [];
    const normalizedMatric = matric.trim().toUpperCase();
    const studentMatch = matricMap.get(normalizedMatric);

    if (!studentMatch) {
      errors.push(`Matric No "${normalizedMatric}" is not enrolled in this course`);
    }

    const caNum = parseFloat(caStr);
    if (caStr !== '' && caStr !== undefined) {
      if (isNaN(caNum)) {
        errors.push('CA score must be a number');
      } else if (caNum < 0 || caNum > 40) {
        errors.push(`CA score (${caNum}) exceeds 0-40 range`);
      }
    }

    const examNum = parseFloat(examStr);
    if (examStr !== '' && examStr !== undefined) {
      if (isNaN(examNum)) {
        errors.push('Exam score must be a number');
      } else if (examNum < 0 || examNum > 60) {
        errors.push(`Exam score (${examNum}) exceeds 0-60 range`);
      }
    }

    const hasCa = caStr !== '' && caStr !== undefined && !isNaN(caNum);
    const hasExam = examStr !== '' && examStr !== undefined && !isNaN(examNum);
    const totalScore = hasCa || hasExam ? (hasCa ? caNum : 0) + (hasExam ? examNum : 0) : null;
    const grade = totalScore !== null ? calculateLetterGrade(totalScore) : null;

    return {
      matricNumber: normalizedMatric,
      studentName: studentMatch?.student?.name || 'Unmatched',
      department: studentMatch?.student?.department || selectedCourse.department,
      level: studentMatch?.student?.level || selectedCourse.level,
      enrollmentId: studentMatch?.enrollmentId,
      caScore: caStr,
      examScore: examStr,
      totalScore,
      grade,
      isValid: errors.length === 0 && !!studentMatch,
      errors,
    };
  };

  const parseCsvText = (text: string) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length <= 1) {
      setParsedRows([]);
      return;
    }

    const matricMap = new Map<string, any>();
    students.forEach((s) => {
      if (s.student?.matricNumber) {
        matricMap.set(s.student.matricNumber.trim().toUpperCase(), s);
      }
    });

    const rawHeaders = lines[0].split(',').map((h) => h.replace(/['"]/g, '').trim().toLowerCase());

    let matricIdx = rawHeaders.findIndex((h) =>
      h.includes('matric') || h.includes('reg') || h.includes('id') || h.includes('student no')
    );
    if (matricIdx === -1) {
      matricIdx = rawHeaders[0].includes('s/n') || rawHeaders[0].includes('sn') || rawHeaders[0] === '#' ? 1 : 0;
    }

    let caIdx = rawHeaders.findIndex(
      (h) => (h.includes('ca') && !h.includes('candidate')) || h.includes('assessment') || h.includes('test') || h.includes('(40)')
    );
    let examIdx = rawHeaders.findIndex(
      (h) => h.includes('exam') || h.includes('examination') || h.includes('final') || h.includes('(60)')
    );

    if (caIdx === -1) caIdx = rawHeaders.length >= 7 ? 5 : 2;
    if (examIdx === -1) examIdx = rawHeaders.length >= 7 ? 6 : 3;

    const results: ParsedRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.replace(/['"]/g, '').trim());
      if (cols.length === 0 || cols.every((c) => c === '')) continue;

      const matricNumber = cols[matricIdx] || '';
      const caStr = cols[caIdx] || '';
      const examStr = cols[examIdx] || '';

      results.push(validateRow(matricNumber, caStr, examStr, matricMap));
    }

    setParsedRows(results);
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCsvText(text);
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleRowChange = (index: number, field: 'matricNumber' | 'caScore' | 'examScore', val: string) => {
    const matricMap = new Map<string, any>();
    students.forEach((s) => {
      if (s.student?.matricNumber) {
        matricMap.set(s.student.matricNumber.trim().toUpperCase(), s);
      }
    });

    setParsedRows((prev) => {
      const updated = [...prev];
      const target = { ...updated[index], [field]: val };
      updated[index] = validateRow(target.matricNumber, target.caScore, target.examScore, matricMap);
      return updated;
    });
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
    // Official standard format omitting confidential phone and email:
    // S/N, Matric Number, Student Name, Department, Level, CA Score (40), Exam Score (60), Total (100), Grade
    const headers = [
      'S/N',
      'Matric Number',
      'Student Name',
      'Department',
      'Level',
      'CA Score (40)',
      'Exam Score (60)',
      'Total (100)',
      'Grade',
    ];
    const rows = students.map((s, idx) => {
      const ca = s.result?.caScore !== null && s.result?.caScore !== undefined ? s.result.caScore.toString() : '';
      const exam = s.result?.examScore !== null && s.result?.examScore !== undefined ? s.result.examScore.toString() : '';
      const hasScores = ca !== '' || exam !== '';
      const total = hasScores ? (parseFloat(ca) || 0) + (parseFloat(exam) || 0) : '';
      const grade = hasScores ? calculateLetterGrade(Number(total)) : '';
      return [
        idx + 1,
        `"${s.student?.matricNumber || ''}"`,
        `"${s.student?.name || ''}"`,
        `"${s.student?.department || selectedCourse.department}"`,
        s.student?.level || selectedCourse.level,
        ca,
        exam,
        total,
        grade,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedCourse.code}_Class_Grading_Roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick helper to populate sample scores directly for demo/testing
  const handleLoadSampleScores = () => {
    setFileName(`${selectedCourse.code}_Filled_Sample_Scores.csv`);
    const matricMap = new Map<string, any>();
    students.forEach((s) => {
      if (s.student?.matricNumber) {
        matricMap.set(s.student.matricNumber.trim().toUpperCase(), s);
      }
    });

    const sampleRows: ParsedRow[] = students.map((s, idx) => {
      // Deterministic realistic scores spanning A down to E & F
      const sampleCA = [32, 28, 25, 20, 18, 35, 22, 16][idx % 8];
      const sampleExam = [52, 44, 38, 28, 23, 56, 32, 21][idx % 8];
      return validateRow(
        s.student?.matricNumber || `FUAZ/SAMPLE/${idx + 1}`,
        sampleCA.toString(),
        sampleExam.toString(),
        matricMap
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
