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
import {
  Upload,
  Download,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  X,
  FileText,
  Filter,
  RefreshCw,
} from 'lucide-react';

interface LecturerCsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: Course | null;
  students: any[];
  onApplyScores: (importedScores: Record<string, { ca: string; exam: string }>) => void;
}

interface ParsedRow {
  matricNumber: string;
  studentName?: string;
  enrollmentId?: string;
  caScore: string;
  examScore: string;
  isValid: boolean;
  errors: string[];
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
  ) => {
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

    return {
      matricNumber: normalizedMatric,
      studentName: studentMatch?.student?.name || 'Unmatched',
      enrollmentId: studentMatch?.enrollmentId,
      caScore: caStr,
      examScore: examStr,
      isValid: errors.length === 0 && !!studentMatch,
      errors,
    };
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        setParsedRows([]);
        setIsProcessing(false);
        return;
      }

      // Map matric numbers to students
      const matricMap = new Map<string, any>();
      students.forEach((s) => {
        if (s.student?.matricNumber) {
          matricMap.set(s.student.matricNumber.trim().toUpperCase(), s);
        }
      });

      // Flexible column header detection
      const rawHeaders = lines[0].split(',').map((h) => h.replace(/['"]/g, '').trim().toLowerCase());
      
      let matricIdx = rawHeaders.findIndex((h) =>
        h.includes('matric') || h.includes('reg') || h.includes('id') || h.includes('student no')
      );
      let nameIdx = rawHeaders.findIndex((h) => h.includes('name') || h.includes('candidate'));
      let caIdx = rawHeaders.findIndex((h) =>
        h.includes('ca') || h.includes('assessment') || h.includes('test') || h.includes('continuous')
      );
      let examIdx = rawHeaders.findIndex((h) =>
        h.includes('exam') || h.includes('examination') || h.includes('final') || h.includes('theory')
      );

      // Defaults if not specifically detected
      if (matricIdx === -1) matricIdx = 0;
      if (nameIdx === -1) nameIdx = 1;
      if (caIdx === -1) caIdx = 2;
      if (examIdx === -1) examIdx = 3;

      const results: ParsedRow[] = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.replace(/['"]/g, '').trim());
        if (cols.length === 0 || cols.every((c) => c === '')) continue;

        const matricNumber = cols[matricIdx] || '';
        const caStr = cols[caIdx] || '';
        const examStr = cols[examIdx] || '';

        const row = validateRow(matricNumber, caStr, examStr, matricMap);
        results.push(row);
      }

      setParsedRows(results);
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
    const headers = ['Matric No', 'Student Name', 'CA Score (Max 40)', 'Exam Score (Max 60)'];
    const rows = students.map((s) => [
      `"${s.student?.matricNumber || ''}"`,
      `"${s.student?.name || ''}"`,
      '',
      '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedCourse.code}_Grading_Template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCommit = () => {
    const validScores: Record<string, { ca: string; exam: string }> = {};
    parsedRows.forEach((row) => {
      if (row.isValid && row.enrollmentId) {
        validScores[row.enrollmentId] = {
          ca: row.caScore,
          exam: row.examScore,
        };
      }
    });

    onApplyScores(validScores);
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
                  Batch CSV Score Importer
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedCourse.code} • {selectedCourse.title} ({students.length} Enrolled)
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              <Download className="w-3.5 h-3.5" /> Download Blank Template
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Dropzone area */}
          {!fileName ? (
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
                Click to browse or drag and drop course CSV file here
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Supported columns: Matric No, Student Name, CA (0-40), Exam (0-60)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 gap-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{fileName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {parsedRows.length} total rows parsed from file
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

              {/* Table preview with editable cells */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold sticky top-0 z-10">
                      <tr>
                        <th className="p-2.5">Matric No</th>
                        <th className="p-2.5">Enrolled Student</th>
                        <th className="p-2.5 text-center w-24">CA (0-40)</th>
                        <th className="p-2.5 text-center w-24">Exam (0-60)</th>
                        <th className="p-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {displayRows.map((row, idx) => {
                        const originalIdx = parsedRows.indexOf(row);
                        return (
                          <tr
                            key={idx}
                            className={
                              row.isValid
                                ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                : 'bg-red-50/50 dark:bg-red-950/20'
                            }
                          >
                            <td className="p-2.5">
                              <input
                                type="text"
                                className="w-full font-mono font-medium text-slate-900 dark:text-slate-100 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none"
                                value={row.matricNumber}
                                onChange={(e) =>
                                  handleRowChange(originalIdx, 'matricNumber', e.target.value)
                                }
                              />
                            </td>
                            <td className="p-2.5 text-slate-700 dark:text-slate-300 font-medium">
                              {row.studentName}
                            </td>
                            <td className="p-2.5 text-center">
                              <input
                                type="text"
                                className="w-16 mx-auto text-center font-mono font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 focus:border-emerald-500 focus:outline-none"
                                value={row.caScore}
                                onChange={(e) =>
                                  handleRowChange(originalIdx, 'caScore', e.target.value)
                                }
                                placeholder="0-40"
                              />
                            </td>
                            <td className="p-2.5 text-center">
                              <input
                                type="text"
                                className="w-16 mx-auto text-center font-mono font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 focus:border-emerald-500 focus:outline-none"
                                value={row.examScore}
                                onChange={(e) =>
                                  handleRowChange(originalIdx, 'examScore', e.target.value)
                                }
                                placeholder="0-60"
                              />
                            </td>
                            <td className="p-2.5 text-right">
                              {row.isValid ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                                </span>
                              ) : (
                                <span
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400"
                                  title={row.errors.join(', ')}
                                >
                                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span className="truncate max-w-[140px]">{row.errors[0]}</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <Button variant="ghost" onClick={onClose} className="text-slate-600 dark:text-slate-400">
            Cancel
          </Button>
          <Button
            onClick={handleCommit}
            disabled={validCount === 0 || isProcessing}
            className="bg-[#059669] hover:bg-emerald-700 text-white gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" /> Apply {validCount} Valid Scores
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
