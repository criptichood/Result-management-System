import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Check, Square, CheckSquare } from 'lucide-react';
import { CourseResultModal } from './CourseResultModal';
import { ModerationFeedbackModal } from './ModerationFeedbackModal';
import { BatchModerationModal } from './BatchModerationModal';
import { PendingTableHeader } from './PendingTableHeader';
import { PendingTableRow } from './PendingTableRow';
import { PendingCourseCard } from './PendingCourseCard';
import { exportCourseRosterCSV } from './examinerUtils';
import { User } from '../../types';

interface PendingResultsTableProps {
  pendingCourses: any[];
  allSessionCourses?: any[];
  lecturers?: User[];
  examiner?: User;
  selectedSession?: string;
  onSessionChange?: (session: string) => void;
  selectedSemester?: number | 'ALL';
  onSemesterChange?: (semester: number | 'ALL') => void;
  availableSessions?: string[];
  activeSystemSession?: string;
  onApprove: (courseId: string) => void;
  onReject: (courseId: string, notes?: string) => void;
  onBatchModerate?: (courseIds: string[], action: 'approve' | 'reject', notes?: string) => void;
  onOpenAuditTrail?: () => void;
  onRefresh?: () => void;
}

export const PendingResultsTable: React.FC<PendingResultsTableProps> = ({
  pendingCourses,
  allSessionCourses,
  lecturers = [],
  examiner = { id: 'u2', name: 'Dr. Aliyu Mohammed', email: 'examiner@fuaz.edu.ng', role: 'Chief Examiner' },
  selectedSession = '2024/2025',
  onSessionChange,
  selectedSemester = 'ALL',
  onSemesterChange,
  availableSessions = ['2024/2025', '2023/2024', '2022/2023'],
  activeSystemSession = '2024/2025',
  onApprove,
  onReject,
  onBatchModerate,
  onOpenAuditTrail,
  onRefresh,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectingCourse, setRejectingCourse] = useState<any | null>(null);

  // Workflow sub-tabs: 'pending' (ready for audit), 'awaiting' (lecturer entry in progress), 'published', 'all'
  const [workflowTab, setWorkflowTab] = useState<'pending' | 'awaiting' | 'published' | 'all'>('pending');

  // Filters & Batch Selection State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number | 'ALL'>('ALL');
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [batchActionType, setBatchActionType] = useState<'approve' | 'reject' | null>(null);

  const coursePool = allSessionCourses && allSessionCourses.length > 0 ? allSessionCourses : pendingCourses;

  const handleOpenModal = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const getCourseLecturer = (course: any): User | null => {
    if (course.lecturerId) {
      const found = lecturers.find((l) => l.id === course.lecturerId);
      if (found) return found;
    }
    if (course.detailedResults && course.detailedResults.length > 0) {
      const firstWithLec = course.detailedResults.find((r: any) => r.result?.lecturerId);
      if (firstWithLec?.result?.lecturerId) {
        const found = lecturers.find((l) => l.id === firstWithLec.result.lecturerId);
        if (found) return found;
      }
    }
    return null;
  };

  // Workflow tab counters
  const readyForAuditCount = coursePool.filter((c) => c.hasPendingReview).length;
  const awaitingLecturerCount = coursePool.filter((c) => c.isAwaitingLecturer).length;
  const publishedCount = coursePool.filter((c) => c.isFullyPublished).length;

  // Filter by semester if specified
  const semesterFiltered = coursePool.filter((c) => {
    if (selectedSemester === 'ALL') return true;
    return c.semester === selectedSemester;
  });

  // Filter courses based on active workflow tab, level, and search query
  const filteredCourses = semesterFiltered.filter((course) => {
    if (workflowTab === 'pending' && !course.hasPendingReview) return false;
    if (workflowTab === 'awaiting' && !course.isAwaitingLecturer) return false;
    if (workflowTab === 'published' && !course.isFullyPublished) return false;

    const matchesLevel = selectedLevel === 'ALL' || course.level === selectedLevel;
    const matchesSearch =
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.department && course.department.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesLevel && matchesSearch;
  });

  const reviewableFilteredCourses = filteredCourses.filter((c) => c.hasPendingReview);

  // Selection handlers
  const toggleSelectCourse = (courseId: string) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCourseIds.length === reviewableFilteredCourses.length && reviewableFilteredCourses.length > 0) {
      setSelectedCourseIds([]);
    } else {
      setSelectedCourseIds(reviewableFilteredCourses.map((c) => c.id));
    }
  };

  const selectedCoursesData = coursePool.filter((c) => selectedCourseIds.includes(c.id));

  const handleBatchConfirm = (action: 'approve' | 'reject', notes?: string) => {
    if (onBatchModerate) {
      onBatchModerate(selectedCourseIds, action, notes);
    } else {
      selectedCourseIds.forEach((id) => {
        if (action === 'approve') onApprove(id);
        else onReject(id, notes);
      });
    }
    setSelectedCourseIds([]);
  };

  const handleExportCSV = (course: any) => {
    exportCourseRosterCSV(course);
  };

  return (
    <>
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden">
        {/* Modular Header with Session, Semester, Tabs, Search & Level Filters */}
        <PendingTableHeader
          selectedSession={selectedSession}
          onSessionChange={onSessionChange}
          availableSessions={availableSessions}
          activeSystemSession={activeSystemSession}
          selectedSemester={selectedSemester}
          onSemesterChange={onSemesterChange}
          workflowTab={workflowTab}
          onWorkflowTabChange={setWorkflowTab}
          counts={{
            pending: readyForAuditCount,
            awaiting: awaitingLecturerCount,
            published: publishedCount,
            all: coursePool.length,
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
          selectedCount={selectedCourseIds.length}
          onBatchApprove={
            reviewableFilteredCourses.length > 0
              ? () => {
                  setSelectedCourseIds(reviewableFilteredCourses.map((c) => c.id));
                  setBatchActionType('approve');
                }
              : undefined
          }
        />

        {/* Courses Table */}
        <CardContent className="p-0">
          {/* Mobile & Tablet Card View */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredCourses.map((course) => (
              <PendingCourseCard
                key={`mobile-${course.id}`}
                course={course}
                lecturer={getCourseLecturer(course)}
                isSelected={selectedCourseIds.includes(course.id)}
                onToggleSelect={toggleSelectCourse}
                onAudit={handleOpenModal}
                onApprove={onApprove}
                onReturn={(c) => setRejectingCourse(c)}
                onExport={handleExportCSV}
              />
            ))}

            {filteredCourses.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                <Check className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                  {workflowTab === 'pending'
                    ? 'All pending scores moderated for this session!'
                    : workflowTab === 'awaiting'
                    ? 'No courses awaiting lecturer scores in this filter.'
                    : 'No courses match the selected filters.'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Viewing {selectedSession} session. Switch session or filter tabs to inspect other records.
                </p>
              </div>
            )}
          </div>

          {/* Desktop Full Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800 text-xs">
                  <TableHead className="w-48 font-bold text-slate-700 dark:text-slate-300 pl-3">
                    <div className="flex items-center gap-2">
                      {reviewableFilteredCourses.length > 0 && (
                        <button
                          type="button"
                          onClick={toggleSelectAll}
                          className="text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 focus:outline-none flex items-center justify-center"
                          title={selectedCourseIds.length === reviewableFilteredCourses.length ? 'Deselect all' : 'Select all ready'}
                        >
                          {selectedCourseIds.length === reviewableFilteredCourses.length && reviewableFilteredCourses.length > 0 ? (
                            <CheckSquare className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      <span>Course Code</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">Course Title</TableHead>
                  <TableHead className="w-44 font-bold text-slate-700 dark:text-slate-300">Lecturer / Grader</TableHead>
                  <TableHead className="w-36 text-center font-bold text-slate-700 dark:text-slate-300">Candidates & Status</TableHead>
                  <TableHead className="w-32 text-right pr-4 font-bold text-slate-700 dark:text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCourses.map((course) => (
                  <PendingTableRow
                    key={course.id}
                    course={course}
                    lecturer={getCourseLecturer(course)}
                    isSelected={selectedCourseIds.includes(course.id)}
                    onToggleSelect={toggleSelectCourse}
                    onAudit={handleOpenModal}
                    onApprove={onApprove}
                    onReturn={(c) => setRejectingCourse(c)}
                    onExport={handleExportCSV}
                  />
                ))}

                {filteredCourses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 py-12">
                      <div className="flex flex-col items-center justify-center">
                        <Check className="h-6 w-6 text-emerald-500 mb-2" />
                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                          {workflowTab === 'pending'
                            ? 'All pending scores moderated for this session!'
                            : workflowTab === 'awaiting'
                            ? 'No courses awaiting lecturer scores in this filter.'
                            : 'No courses match the selected filters.'}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Viewing {selectedSession} session. Switch session or filter tabs to inspect other records.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Course Broadsheet Audit Modal */}
      <CourseResultModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        course={selectedCourse}
        lecturer={selectedCourse ? getCourseLecturer(selectedCourse) : null}
        examiner={examiner}
        session={selectedSession}
        onApprove={onApprove}
        onReject={onReject}
        onRefresh={onRefresh}
      />

      {/* Single Course Return Revision Modal */}
      <ModerationFeedbackModal
        isOpen={!!rejectingCourse}
        onOpenChange={(open) => !open && setRejectingCourse(null)}
        course={rejectingCourse}
        lecturer={rejectingCourse ? getCourseLecturer(rejectingCourse) : null}
        onConfirm={(notes) => {
          if (rejectingCourse) {
            onReject(rejectingCourse.id, notes);
            setRejectingCourse(null);
          }
        }}
      />

      {/* Batch Moderation Modal */}
      <BatchModerationModal
        isOpen={!!batchActionType}
        onOpenChange={(open) => !open && setBatchActionType(null)}
        action={batchActionType || 'approve'}
        selectedCourses={selectedCoursesData}
        onConfirm={handleBatchConfirm}
      />
    </>
  );
};
