import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Course, User } from '../../types';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Filter, 
  Layers, 
  CheckCircle2, 
  GraduationCap
} from 'lucide-react';
import { CourseResultModal } from './CourseResultModal';
import { ExaminerCourseModal } from './ExaminerCourseModal';
import { DepartmentCourseRow } from './DepartmentCourseRow';
import { DepartmentCourseCard } from './DepartmentCourseCard';
import { ModerationFeedbackModal } from './ModerationFeedbackModal';
import { exportCourseRosterCSV } from './examinerUtils';

interface DepartmentCoursesTableProps {
  department: string;
  departmentCourses: any[];
  lecturers: User[];
  onSaveCourse: (courseData: Partial<Course>) => void;
  onApprove?: (courseId: string) => void;
  onReject?: (courseId: string, notes?: string) => void;
}

export const DepartmentCoursesTable: React.FC<DepartmentCoursesTableProps> = ({
  department,
  departmentCourses,
  lecturers,
  onSaveCourse,
  onApprove,
  onReject,
}) => {
  const [activeTypeTab, setActiveTypeTab] = useState<'all' | 'core' | 'borrowed'>('all');
  const [levelFilter, setLevelFilter] = useState<number | 'all'>('all');
  const [semesterFilter, setSemesterFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedCourseForView, setSelectedCourseForView] = useState<any | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [rejectingCourse, setRejectingCourse] = useState<any | null>(null);

  // Compute counts
  const coreCourses = departmentCourses.filter(c => c.department === department);
  const borrowedCourses = departmentCourses.filter(c => c.department !== department);

  const publishedCount = departmentCourses.filter(c => c.isFullyPublished).length;
  const pendingCount = departmentCourses.filter(c => c.hasPendingReview).length;

  // Filter list
  const filteredCourses = departmentCourses.filter(course => {
    // Type Filter
    if (activeTypeTab === 'core' && course.department !== department) return false;
    if (activeTypeTab === 'borrowed' && course.department === department) return false;

    // Level Filter
    if (levelFilter !== 'all' && course.level !== levelFilter) return false;

    // Semester Filter
    if (semesterFilter !== 'all' && course.semester !== semesterFilter) return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const lecturer = lecturers.find(l => l.id === course.lecturerId);
      const matchCode = course.code.toLowerCase().includes(q);
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchDept = course.department.toLowerCase().includes(q);
      const matchLecturer = lecturer?.name.toLowerCase().includes(q);
      if (!matchCode && !matchTitle && !matchDept && !matchLecturer) return false;
    }

    return true;
  });

  const handleOpenView = (course: any) => {
    setSelectedCourseForView(course);
    setIsViewModalOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    setIsEditModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setIsEditModalOpen(true);
  };

  const getCourseLecturer = (course: any): User | null => {
    if (course.lecturerId) {
      const found = lecturers.find(l => l.id === course.lecturerId);
      if (found) return found;
    }
    // Check if result has lecturer
    if (course.detailedResults && course.detailedResults.length > 0) {
      const firstWithLec = course.detailedResults.find((r: any) => r.result?.lecturerId);
      if (firstWithLec?.result?.lecturerId) {
        const found = lecturers.find(l => l.id === firstWithLec.result.lecturerId);
        if (found) return found;
      }
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Curriculum</span>
            <BookOpen className="w-4 h-4 text-[#064e3b] dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{departmentCourses.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Courses taken by students</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Department Core</span>
            <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-2">{coreCourses.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Offered by {department}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Borrowed Courses</span>
            <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400 mt-2">{borrowedCourses.length}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">External service courses</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Published Results</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-2">{publishedCount}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{pendingCount} pending review</p>
        </div>
      </div>

      {/* Main Card */}
      <Card className="shadow-2xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-[#064e3b] dark:text-emerald-400 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#059669] dark:text-emerald-400" /> Department Curriculum & Course Roster
              </CardTitle>
              <CardDescription className="mt-1 text-slate-500 dark:text-slate-400">
                Manage all departmental core courses, service/borrowed courses taken by {department} students, and assigned lecturers.
              </CardDescription>
            </div>
            
            <Button 
              onClick={handleOpenAdd}
              className="bg-[#064e3b] hover:bg-[#065f46] text-white shadow-xs gap-1.5 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" /> Add New Course
            </Button>
          </div>

          {/* Filtering Controls */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
              <button
                onClick={() => setActiveTypeTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTypeTab === 'all' 
                    ? 'bg-white dark:bg-slate-900 text-[#064e3b] dark:text-emerald-400 shadow-2xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Courses ({departmentCourses.length})
              </button>
              <button
                onClick={() => setActiveTypeTab('core')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTypeTab === 'core' 
                    ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-2xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Core {department} ({coreCourses.length})
              </button>
              <button
                onClick={() => setActiveTypeTab('borrowed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTypeTab === 'borrowed' 
                    ? 'bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-400 shadow-2xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Borrowed / Service ({borrowedCourses.length})
              </button>
            </div>

            {/* Dropdowns & Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="all">All Levels</option>
                  <option value={100}>100 Level</option>
                  <option value={200}>200 Level</option>
                  <option value={300}>300 Level</option>
                  <option value={400}>400 Level</option>
                  <option value={500}>500 Level</option>
                </select>

                <select
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="all">All Semesters</option>
                  <option value={1}>1st Semester</option>
                  <option value={2}>2nd Semester</option>
                </select>
              </div>

              <div className="relative flex-1 sm:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  placeholder="Search code, title, or lecturer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Mobile & Small Screen Optimized Card Feed */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredCourses.map((course) => {
              const lecturer = getCourseLecturer(course);
              return (
                <DepartmentCourseCard
                  key={`mobile-${course.id}`}
                  course={course}
                  department={department}
                  lecturer={lecturer}
                  onAudit={handleOpenView}
                  onEdit={handleOpenEdit}
                  onApprove={onApprove}
                  onReturn={onReject ? (c) => setRejectingCourse(c) : undefined}
                  onExport={exportCourseRosterCSV}
                />
              );
            })}

            {filteredCourses.length === 0 && (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <BookOpen className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="font-medium text-slate-700 dark:text-slate-200">No courses match your active filter.</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try resetting the level, semester, or search query.</p>
              </div>
            )}
          </div>

          {/* Desktop & Tablet Full Table Layout */}
          <div className="hidden md:block overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-slate-50 dark:bg-slate-800/80">
                <TableRow className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs">
                  <TableHead className="w-40 font-bold text-slate-700 dark:text-slate-300">Course Code</TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">Course Title</TableHead>
                  <TableHead className="w-44 font-bold text-slate-700 dark:text-slate-300">Assigned Lecturer</TableHead>
                  <TableHead className="w-36 text-center font-bold text-slate-700 dark:text-slate-300">Candidates & Status</TableHead>
                  <TableHead className="w-32 text-right pr-4 font-bold text-slate-700 dark:text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => {
                  const lecturer = getCourseLecturer(course);

                  return (
                    <DepartmentCourseRow
                      key={course.id}
                      course={course}
                      department={department}
                      lecturer={lecturer}
                      onAudit={handleOpenView}
                      onEdit={handleOpenEdit}
                      onApprove={onApprove}
                      onReturn={onReject ? (c) => setRejectingCourse(c) : undefined}
                      onExport={exportCourseRosterCSV}
                    />
                  );
                })}

                {filteredCourses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 dark:text-slate-400 py-12">
                      <div className="flex flex-col items-center justify-center">
                        <BookOpen className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="font-medium text-slate-700 dark:text-slate-200">No courses match your active filter.</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try resetting the level, semester, or search query.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Course Results Modal with Lecturer Banner */}
      <CourseResultModal
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        course={selectedCourseForView}
        lecturer={selectedCourseForView ? getCourseLecturer(selectedCourseForView) : null}
        onApprove={onApprove}
        onReject={onReject}
      />

      {/* Return to Lecturer Feedback Modal */}
      <ModerationFeedbackModal
        isOpen={!!rejectingCourse}
        onClose={() => setRejectingCourse(null)}
        course={rejectingCourse}
        onConfirmReject={(courseId, notes) => {
          if (onReject) onReject(courseId, notes);
          setRejectingCourse(null);
        }}
      />

      {/* Edit / Add Course Modal */}
      <ExaminerCourseModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        course={editingCourse}
        lecturers={lecturers}
        department={department}
        onSave={onSaveCourse}
      />
    </div>
  );
};
