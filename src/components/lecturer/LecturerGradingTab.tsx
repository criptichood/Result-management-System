import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Edit } from 'lucide-react';
import { Course } from '../../types';
import { LecturerCsvUploadModal } from './LecturerCsvUploadModal';
import { LecturerBatchFillModal } from './LecturerBatchFillModal';
import { LecturerPrintableGradeSheet } from './LecturerPrintableGradeSheet';
import {
  GradingHeaderToolbar,
  GradingStatsBar,
  GradingFiltersBar,
  GradingScoreTable,
  GradingRubricModal,
  GradingSubmitModal,
} from './grading';

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

  return (
    <Card id="lecturer-grading-tab" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <GradingHeaderToolbar
        selectedCourse={selectedCourse}
        isAllPublished={isAllPublished}
        isSubmitted={isSubmitted}
        isRejected={isRejected}
        isLocked={isLocked}
        onOpenBatchFill={() => setIsBatchFillOpen(true)}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
        onDownloadCSV={onDownloadCSV}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onSaveDraft={onSaveDraft}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onUnlock={() => setIsForceUnlock(true)}
      />

      <GradingStatsBar
        filledCount={filledCount}
        totalStudents={students.length}
        classMean={classMean}
        passRate={passRate}
        highestScore={highestScore}
        isRejected={isRejected}
        rejectionNote={rejectionNote}
        onOpenRubric={() => setIsRubricOpen(true)}
      />

      <GradingFiltersBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        totalCount={students.length}
        unscoredCount={students.length - filledCount}
        passCount={passCount}
      />

      <CardContent className="p-0">
        <GradingScoreTable
          students={filteredStudents}
          scores={scores}
          isLocked={isLocked}
          onScoreChange={onScoreChange}
          calculateGrade={calculateGrade}
        />
      </CardContent>

      <LecturerCsvUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        selectedCourse={selectedCourse}
        students={students}
        onApplyScores={onApplyCsvScores}
      />

      <LecturerBatchFillModal
        isOpen={isBatchFillOpen}
        onClose={() => setIsBatchFillOpen(false)}
        selectedCourse={selectedCourse}
        students={students}
        scores={scores}
        onBatchApply={handleBatchApply}
      />

      <LecturerPrintableGradeSheet
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        selectedCourse={selectedCourse}
        students={students}
        scores={scores}
        calculateGrade={calculateGrade}
        lecturerName={lecturerName}
      />

      <GradingRubricModal
        isOpen={isRubricOpen}
        onClose={() => setIsRubricOpen(false)}
      />

      <GradingSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        selectedCourse={selectedCourse}
        totalStudents={students.length}
        filledCount={filledCount}
        passRate={passRate}
        hasInvalidScores={hasInvalidCa || hasInvalidExam}
        onConfirmSubmit={handleConfirmSubmit}
      />
    </Card>
  );
};
