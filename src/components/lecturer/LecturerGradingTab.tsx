import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  CheckCircle,
  Edit,
  Save,
  Download,
  Upload,
  AlertTriangle,
  RotateCcw,
  Check,
  Search,
  Wand2,
  Printer,
  HelpCircle,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Course } from '../../types';
import { LecturerCsvUploadModal } from './LecturerCsvUploadModal';
import { LecturerBatchFillModal } from './LecturerBatchFillModal';
import { LecturerPrintableGradeSheet } from './LecturerPrintableGradeSheet';

interface LecturerGradingTabProps {
  selectedCourse: Course | null;
  students: any[];
  scores: Record<string, { ca: string; exam: string }>;
  onScoreChange: (enrollmentId: string, type: 'ca' | 'exam', value: string) => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
  onDownloadCSV: () => void;
  onApplyCsvScores: (importedScores: Record<string, { ca: string; exam: string }>) => void;
  calculateGrade: (total: number) => string;
  lecturerName?: string;
}

export const LecturerGradingTab: React.FC<LecturerGradingTabProps> = ({
  selectedCourse,
  students,
  scores,
  onScoreChange,
  onSaveDraft,
  onSubmit,
  onDownloadCSV,
  onApplyCsvScores,
  calculateGrade,
  lecturerName = 'Course Lecturer',
}) => {
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isBatchFillOpen, setIsBatchFillOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isRubricOpen, setIsRubricOpen] = useState(false);
  const [isForceUnlock, setIsForceUnlock] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unscored' | 'borderline' | 'passed' | 'failing'>('all');

  if (!selectedCourse) {
    return (
      <div
        id="lecturer-no-course"
        className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900"
      >
        <Edit className="h-10 w-10 mb-2 opacity-20" />
        <p className="font-medium">Select a course to start grading</p>
      </div>
    );
  }

  // Determine overall submission status from enrolled results
  const resultsWithStatus = students.map((s) => s.result?.status).filter(Boolean);
  const isAllPublished = resultsWithStatus.length > 0 && resultsWithStatus.every((st) => st === 'Published');
  const isSubmitted = resultsWithStatus.includes('Submitted');
  const isRejected = resultsWithStatus.includes('Rejected');

  // Check if any results have moderation notes
  const rejectionNote = students.find((s) => s.result?.moderationNotes)?.result?.moderationNotes;

  const isLocked = (isSubmitted || isAllPublished) && !isForceUnlock;

  // Validation & Live Stats calculation
  let hasInvalidCa = false;
  let hasInvalidExam = false;
  let filledCount = 0;
  let totalScoreSum = 0;
  let highestScore = 0;
  let lowestScore = 100;
  let passCount = 0;

  students.forEach((s) => {
    const caStr = scores[s.enrollmentId]?.ca;
    const examStr = scores[s.enrollmentId]?.exam;
    const ca = parseFloat(caStr);
    const exam = parseFloat(examStr);

    if (caStr !== '' && caStr !== undefined) {
      if (isNaN(ca) || ca < 0 || ca > 40) hasInvalidCa = true;
    }
    if (examStr !== '' && examStr !== undefined) {
      if (isNaN(exam) || exam < 0 || exam > 60) hasInvalidExam = true;
    }

    const hasAny = (caStr !== '' && caStr !== undefined) || (examStr !== '' && examStr !== undefined);
    if (hasAny) {
      filledCount++;
      const total = (isNaN(ca) ? 0 : ca) + (isNaN(exam) ? 0 : exam);
      totalScoreSum += total;
      if (total > highestScore) highestScore = total;
      if (total < lowestScore) lowestScore = total;
      if (total >= 40) passCount++;
    }
  });

  const classMean = filledCount > 0 ? (totalScoreSum / filledCount).toFixed(1) : '0.0';
  const passRate = filledCount > 0 ? Math.round((passCount / filledCount) * 100) : 0;

  // Filtered Students List
  const filteredStudents = students.filter((s) => {
    const matric = s.student?.matricNumber?.toLowerCase() || '';
    const name = s.student?.name?.toLowerCase() || '';
    const query = searchQuery.toLowerCase().trim();

    if (query && !matric.includes(query) && !name.includes(query)) {
      return false;
    }

    const caStr = scores[s.enrollmentId]?.ca || '';
    const examStr = scores[s.enrollmentId]?.exam || '';
    const hasScore = caStr !== '' || examStr !== '';
    const total = (parseFloat(caStr) || 0) + (parseFloat(examStr) || 0);

    if (statusFilter === 'unscored') return !hasScore;
    if (statusFilter === 'passed') return hasScore && total >= 40;
    if (statusFilter === 'failing') return hasScore && total < 40;
    if (statusFilter === 'borderline') {
      return hasScore && (total === 39 || total === 44 || total === 49 || total === 59 || total === 69);
    }

    return true;
  });

  const handleConfirmSubmit = () => {
    setIsSubmitModalOpen(false);
    setIsForceUnlock(false);
    onSubmit();
  };

  const handleBatchApply = (updates: Record<string, { ca: string; exam: string }>) => {
    onApplyCsvScores(updates);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, currentIdx: number, type: 'ca' | 'exam') => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextId = `score-input-${type}-${currentIdx + 1}`;
      const nextElem = document.getElementById(nextId) as HTMLInputElement;
      if (nextElem) nextElem.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevId = `score-input-${type}-${currentIdx - 1}`;
      const prevElem = document.getElementById(prevId) as HTMLInputElement;
      if (prevElem) prevElem.focus();
    }
  };

  return (
    <Card id="lecturer-grading-tab" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-800 p-6 gap-4">
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
            onClick={() => setIsBatchFillOpen(true)}
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
            onClick={() => setIsCsvModalOpen(true)}
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
            onClick={() => setIsPrintModalOpen(true)}
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
              onClick={() => setIsSubmitModalOpen(true)}
              className="gap-1.5 text-xs bg-[#059669] hover:bg-emerald-700 text-white shadow-xs"
            >
              <CheckCircle className="h-3.5 w-3.5" /> Submit to Chief Examiner
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsForceUnlock(true)}
              className="gap-1.5 text-xs border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Unlock for Editing
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Moderation Rejection Alert Banner */}
      {isRejected && rejectionNote && (
        <div className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-red-900 dark:text-red-200">
              Chief Examiner Moderation Feedback: Returned for Revision
            </h4>
            <p className="text-xs text-red-700 dark:text-red-300 mt-1">
              "{rejectionNote}"
            </p>
            <p className="text-[11px] text-red-600/80 dark:text-red-400/80 mt-1">
              Make the requested adjustments below and click "Submit to Chief Examiner" to re-submit for senate approval.
            </p>
          </div>
        </div>
      )}

      {/* Live Class Statistics Bar */}
      <div className="p-4 mx-6 mt-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="space-y-0.5">
          <span className="text-slate-500 dark:text-slate-400">Scoring Progress:</span>
          <p className="font-bold text-slate-800 dark:text-slate-200">
            {filledCount} / {students.length} ({students.length > 0 ? Math.round((filledCount / students.length) * 100) : 0}%)
          </p>
        </div>
        <div className="space-y-0.5">
          <span className="text-slate-500 dark:text-slate-400">Class Mean:</span>
          <p className="font-bold text-emerald-600 dark:text-emerald-400">{classMean} / 100</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-slate-500 dark:text-slate-400">Pass Rate:</span>
          <p className="font-bold text-slate-800 dark:text-slate-200">{passRate}%</p>
        </div>
        <div className="space-y-0.5">
          <span className="text-slate-500 dark:text-slate-400">Highest Score:</span>
          <p className="font-bold text-slate-800 dark:text-slate-200">{filledCount > 0 ? `${highestScore}/100` : '-'}</p>
        </div>
        <div className="flex items-center justify-between sm:justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRubricOpen(true)}
            className="text-[11px] text-slate-600 dark:text-slate-400 gap-1 h-7"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> 5.0 Rubric
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="px-6 pt-4 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Search by matric or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All ({students.length})
          </button>
          <button
            onClick={() => setStatusFilter('unscored')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              statusFilter === 'unscored'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Unscored ({students.length - filledCount})
          </button>
          <button
            onClick={() => setStatusFilter('borderline')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              statusFilter === 'borderline'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
            }`}
          >
            Borderline (39/49/69)
          </button>
          <button
            onClick={() => setStatusFilter('passed')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              statusFilter === 'passed'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
            }`}
          >
            Passed ({passCount})
          </button>
        </div>
      </div>

      {/* Score Entry Table */}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70 dark:bg-slate-800/50">
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead className="w-36">Matric No.</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="w-28 text-center">CA (Max 40)</TableHead>
                <TableHead className="w-28 text-center">Exam (Max 60)</TableHead>
                <TableHead className="w-24 text-center">Total (100)</TableHead>
                <TableHead className="w-20 text-center">Grade</TableHead>
                <TableHead className="text-right pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((s, idx) => {
                const caVal = scores[s.enrollmentId]?.ca;
                const examVal = scores[s.enrollmentId]?.exam;
                const caNum = parseFloat(caVal) || 0;
                const examNum = parseFloat(examVal) || 0;
                const hasScore = caVal !== '' || examVal !== '';
                const total = hasScore ? caNum + examNum : 0;

                const caOutOfRange = caVal !== '' && (isNaN(caNum) || caNum < 0 || caNum > 40);
                const examOutOfRange = examVal !== '' && (isNaN(examNum) || examNum < 0 || examNum > 60);

                return (
                  <TableRow key={s.enrollmentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <TableCell className="text-center text-slate-400 font-mono text-xs">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-mono font-medium text-slate-900 dark:text-slate-100">
                      {s.student?.matricNumber}
                    </TableCell>
                    <TableCell className="font-medium text-slate-800 dark:text-slate-200">
                      {s.student?.name}
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <Input
                          id={`score-input-ca-${idx}`}
                          type="number"
                          min="0"
                          max="40"
                          aria-label={`CA score for ${s.student?.matricNumber}`}
                          className={`text-center h-8 font-mono text-xs ${
                            caOutOfRange
                              ? 'border-red-500 focus:ring-red-500 bg-red-50/50 dark:bg-red-950/20'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                          }`}
                          value={scores[s.enrollmentId]?.ca ?? ''}
                          onChange={(e) => onScoreChange(s.enrollmentId, 'ca', e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, idx, 'ca')}
                          disabled={isLocked}
                          placeholder="0-40"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <Input
                          id={`score-input-exam-${idx}`}
                          type="number"
                          min="0"
                          max="60"
                          aria-label={`Exam score for ${s.student?.matricNumber}`}
                          className={`text-center h-8 font-mono text-xs ${
                            examOutOfRange
                              ? 'border-red-500 focus:ring-red-500 bg-red-50/50 dark:bg-red-950/20'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                          }`}
                          value={scores[s.enrollmentId]?.exam ?? ''}
                          onChange={(e) => onScoreChange(s.enrollmentId, 'exam', e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, idx, 'exam')}
                          disabled={isLocked}
                          placeholder="0-60"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono font-bold text-slate-900 dark:text-slate-100">
                      {hasScore ? total : '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      {hasScore ? (
                        <span
                          className={`font-black ${
                            total >= 70
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : total >= 40
                              ? 'text-slate-800 dark:text-slate-200'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {calculateGrade(total)}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {s.result?.status === 'Published' ? (
                        <Badge variant="success">Published</Badge>
                      ) : s.result?.status === 'Submitted' ? (
                        <Badge variant="warning">Submitted</Badge>
                      ) : s.result?.status === 'Rejected' ? (
                        <Badge variant="destructive">Revision</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-slate-500 py-12">
                    No candidates match the active search or filter criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* CSV Import Modal */}
      <LecturerCsvUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        selectedCourse={selectedCourse}
        students={students}
        onApplyScores={onApplyCsvScores}
      />

      {/* Batch Fill Modal */}
      <LecturerBatchFillModal
        isOpen={isBatchFillOpen}
        onClose={() => setIsBatchFillOpen(false)}
        selectedCourse={selectedCourse}
        students={students}
        scores={scores}
        onBatchApply={handleBatchApply}
      />

      {/* Printable Sheet Modal */}
      <LecturerPrintableGradeSheet
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        selectedCourse={selectedCourse}
        students={students}
        scores={scores}
        calculateGrade={calculateGrade}
        lecturerName={lecturerName}
      />

      {/* Grading Rubric Reference Modal */}
      <Dialog open={isRubricOpen} onOpenChange={setIsRubricOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Nigerian 5.0 CGPA University Scale
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              National Universities Commission (NUC) benchmark academic grading criteria.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-4 font-bold p-2 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">
              <span>Score Range</span>
              <span className="text-center">Grade</span>
              <span className="text-center">Grade Point</span>
              <span className="text-right">Standing</span>
            </div>
            <div className="grid grid-cols-4 p-2 border-b border-slate-100 dark:border-slate-800">
              <span>70% – 100%</span>
              <span className="text-center font-bold text-emerald-600">A</span>
              <span className="text-center font-mono">5.0</span>
              <span className="text-right text-slate-600">Excellent</span>
            </div>
            <div className="grid grid-cols-4 p-2 border-b border-slate-100 dark:border-slate-800">
              <span>60% – 69%</span>
              <span className="text-center font-bold text-emerald-600">B</span>
              <span className="text-center font-mono">4.0</span>
              <span className="text-right text-slate-600">Very Good</span>
            </div>
            <div className="grid grid-cols-4 p-2 border-b border-slate-100 dark:border-slate-800">
              <span>50% – 59%</span>
              <span className="text-center font-bold text-emerald-600">C</span>
              <span className="text-center font-mono">3.0</span>
              <span className="text-right text-slate-600">Good</span>
            </div>
            <div className="grid grid-cols-4 p-2 border-b border-slate-100 dark:border-slate-800">
              <span>45% – 49%</span>
              <span className="text-center font-bold text-amber-600">D</span>
              <span className="text-center font-mono">2.0</span>
              <span className="text-right text-slate-600">Fair</span>
            </div>
            <div className="grid grid-cols-4 p-2 border-b border-slate-100 dark:border-slate-800">
              <span>40% – 44%</span>
              <span className="text-center font-bold text-amber-600">E</span>
              <span className="text-center font-mono">1.0</span>
              <span className="text-right text-slate-600">Pass</span>
            </div>
            <div className="grid grid-cols-4 p-2 bg-red-50/50 dark:bg-red-950/20 rounded">
              <span className="text-red-700">0% – 39%</span>
              <span className="text-center font-bold text-red-600">F</span>
              <span className="text-center font-mono text-red-600">0.0</span>
              <span className="text-right text-red-600 font-semibold">Fail (Carryover)</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsRubricOpen(false)} className="text-xs">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submission Confirmation Dialog */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-2">
              <CheckCircle className="w-6 h-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Submit Course Results for Moderation
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              You are submitting grades for <strong>{selectedCourse.code} ({selectedCourse.title})</strong> to the Chief Examiner.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Total Enrolled Candidates:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{students.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Scores Entered:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{filledCount} of {students.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Estimated Pass Rate:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{passRate}%</span>
              </div>
            </div>

            {(hasInvalidCa || hasInvalidExam) && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>One or more scores exceed maximum permitted thresholds (CA: 40, Exam: 60). Please correct before submitting.</span>
              </div>
            )}

            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Once submitted, scores will be locked from direct modification while under review by the Chief Examiner and Head of Department.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsSubmitModalOpen(false)}
              className="text-slate-600 dark:text-slate-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              disabled={hasInvalidCa || hasInvalidExam}
              className="bg-[#059669] hover:bg-emerald-700 text-white gap-1.5"
            >
              <Check className="w-4 h-4" /> Confirm & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
