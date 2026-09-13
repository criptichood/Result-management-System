import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  FileSearch,
  Check,
  RotateCcw,
  ShieldAlert,
  User as UserIcon,
  Search,
  Layers,
  History,
  CheckSquare,
  Square
} from 'lucide-react';
import { CourseResultModal } from './CourseResultModal';
import { ModerationFeedbackModal } from './ModerationFeedbackModal';
import { BatchModerationModal } from './BatchModerationModal';
import { User } from '../../types';

interface PendingResultsTableProps {
  pendingCourses: any[];
  lecturers?: User[];
  examiner?: User;
  onApprove: (courseId: string) => void;
  onReject: (courseId: string, notes?: string) => void;
  onBatchModerate?: (courseIds: string[], action: 'approve' | 'reject', notes?: string) => void;
  onOpenAuditTrail?: () => void;
  onRefresh?: () => void;
}

export const PendingResultsTable: React.FC<PendingResultsTableProps> = ({
  pendingCourses,
  lecturers = [],
  examiner = { id: 'u2', name: 'Dr. Aliyu Mohammed', email: 'examiner@fuaz.edu.ng', role: 'Chief Examiner' },
  onApprove,
  onReject,
  onBatchModerate,
  onOpenAuditTrail,
  onRefresh,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectingCourse, setRejectingCourse] = useState<any | null>(null);

  // Filters & Batch State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number | 'ALL'>('ALL');
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [batchActionType, setBatchActionType] = useState<'approve' | 'reject' | null>(null);

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

  // Filter pending courses
  const filteredCourses = pendingCourses.filter((course) => {
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

  const selectedCoursesData = pendingCourses.filter((c) => selectedCourseIds.includes(c.id));

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

  return (
    <>
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-[#064e3b] dark:text-emerald-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Results Pending Chief Examiner Moderation
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Audit continuous assessment (40) and examination (60) scores submitted by lecturers before official publishing.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenAuditTrail && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenAuditTrail}
                className="text-xs gap-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                <History className="w-3.5 h-3.5 text-emerald-600" /> Audit Trail Logs
              </Button>
            )}

            {reviewableFilteredCourses.length > 0 && (
              <Button
                onClick={() => {
                  setSelectedCourseIds(reviewableFilteredCourses.map((c) => c.id));
                  setBatchActionType('approve');
                }}
                className="bg-[#064e3b] hover:bg-[#065f46] text-white shadow-2xs text-xs gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Publish All Ready ({reviewableFilteredCourses.length})
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Filter and Selection Control Toolbar */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search course code or title..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Level Selector */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              {(['ALL', 100, 200, 300, 400] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    selectedLevel === lvl
                      ? 'bg-[#064e3b] text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {lvl === 'ALL' ? 'All Levels' : `${lvl}L`}
                </button>
              ))}
            </div>
          </div>

          {/* Batch Actions Bar (when courses are selected) */}
          {selectedCourseIds.length > 0 && (
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end animate-in fade-in duration-150">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                {selectedCourseIds.length} Selected
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setBatchActionType('reject')}
                className="text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 bg-white dark:bg-slate-800"
              >
                <RotateCcw className="w-3 h-3" /> Batch Return
              </Button>
              <Button
                size="sm"
                onClick={() => setBatchActionType('approve')}
                className="text-xs gap-1 bg-[#064e3b] hover:bg-[#065f46] text-white"
              >
                <Check className="w-3 h-3" /> Batch Approve
              </Button>
            </div>
          )}
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                  <TableHead className="w-10 text-center">
                    <button
                      onClick={toggleSelectAll}
                      disabled={reviewableFilteredCourses.length === 0}
                      className="p-1 rounded text-slate-500 hover:text-slate-700 dark:text-slate-400"
                    >
                      {selectedCourseIds.length === reviewableFilteredCourses.length && reviewableFilteredCourses.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-[#064e3b] dark:text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead className="font-bold">Course Code</TableHead>
                  <TableHead className="font-bold">Title</TableHead>
                  <TableHead className="font-bold">Course Lecturer</TableHead>
                  <TableHead className="text-center font-bold">Submission Status</TableHead>
                  <TableHead className="text-right font-bold pr-6">Moderation Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => {
                  const lecturer = getCourseLecturer(course);
                  const isSelected = selectedCourseIds.includes(course.id);

                  return (
                    <TableRow
                      key={course.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${
                        isSelected ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                      }`}
                    >
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={!course.hasPendingReview}
                          onChange={() => toggleSelectCourse(course.id)}
                          className="w-4 h-4 text-[#064e3b] rounded border-slate-300 focus:ring-emerald-500"
                        />
                      </TableCell>
                      <TableCell className="font-mono font-bold text-[#064e3b] dark:text-emerald-400">
                        {course.code}
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{course.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {course.creditUnits} Units • {course.level}L • {course.department}
                        </p>
                      </TableCell>
                      <TableCell>
                        {lecturer ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {lecturer.name
                                .split(' ')
                                .map((n) => n[0])
                                .filter(Boolean)
                                .slice(0, 2)
                                .join('')}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                {lecturer.name}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {lecturer.staffId || lecturer.department}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-400 text-xs italic">
                            <UserIcon className="w-3.5 h-3.5" />
                            <span>Unassigned / Dept Head</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {course.hasPendingReview ? (
                          <Badge variant="warning" className="font-semibold text-xs py-1 px-2.5">
                            {course.submittedCount} / {course.totalEnrolled} Scores Submitted
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-slate-400">
                            Awaiting Lecturer Entry
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-6 space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:text-[#064e3b]"
                          onClick={() => handleOpenModal(course)}
                        >
                          <FileSearch className="h-3.5 w-3.5" /> Audit Sheet
                        </Button>
                        {course.hasPendingReview && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 bg-white dark:bg-slate-800 border-red-200 dark:border-red-800"
                              onClick={() => setRejectingCourse(course)}
                            >
                              <RotateCcw className="h-3.5 w-3.5" /> Return
                            </Button>
                            <Button
                              size="sm"
                              className="gap-1 bg-[#064e3b] hover:bg-[#065f46] text-white shadow-2xs"
                              onClick={() => onApprove(course.id)}
                            >
                              <Check className="h-3.5 w-3.5" /> Approve & Publish
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredCourses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500 py-12">
                      <div className="flex flex-col items-center justify-center">
                        <Check className="h-8 w-8 text-emerald-500 mb-2" />
                        <p className="font-medium text-slate-800 dark:text-slate-200">All submissions moderated!</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          There are no course results currently awaiting examiner approval in this filter.
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

      <CourseResultModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        course={selectedCourse}
        lecturer={selectedCourse ? getCourseLecturer(selectedCourse) : null}
        examiner={examiner}
        onApprove={onApprove}
        onReject={(courseId) => {
          setIsModalOpen(false);
          setRejectingCourse(selectedCourse);
        }}
        onRefresh={onRefresh}
      />

      {/* Single Course Return Modal */}
      <ModerationFeedbackModal
        isOpen={!!rejectingCourse}
        onClose={() => setRejectingCourse(null)}
        course={rejectingCourse}
        onConfirmReject={onReject}
      />

      {/* Batch Moderation Modal */}
      {batchActionType && (
        <BatchModerationModal
          isOpen={!!batchActionType}
          onOpenChange={(open) => {
            if (!open) setBatchActionType(null);
          }}
          selectedCourses={selectedCoursesData}
          actionType={batchActionType}
          examiner={examiner}
          onConfirm={handleBatchConfirm}
        />
      )}
    </>
  );
};
