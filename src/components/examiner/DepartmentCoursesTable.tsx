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
  Edit3, 
  FileSearch, 
  User as UserIcon, 
  Filter, 
  Layers, 
  CheckCircle2, 
  Clock, 
  GraduationCap
} from 'lucide-react';
import { CourseResultModal } from './CourseResultModal';
import { ExaminerCourseModal } from './ExaminerCourseModal';

interface DepartmentCoursesTableProps {
  department: string;
  departmentCourses: any[];
  lecturers: User[];
  onSaveCourse: (courseData: Partial<Course>) => void;
  onApprove?: (courseId: string) => void;
  onReject?: (courseId: string) => void;
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
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Curriculum</span>
            <BookOpen className="w-4 h-4 text-[#064e3b]" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{departmentCourses.length}</p>
          <p className="text-xs text-slate-500 mt-1">Courses taken by students</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Department Core</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{coreCourses.length}</p>
          <p className="text-xs text-slate-500 mt-1">Offered by {department}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Borrowed Courses</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-2">{borrowedCourses.length}</p>
          <p className="text-xs text-slate-500 mt-1">External service courses</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Published Results</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-2">{publishedCount}</p>
          <p className="text-xs text-slate-500 mt-1">{pendingCount} pending review</p>
        </div>
      </div>

      {/* Main Card */}
      <Card className="shadow-2xs">
        <CardHeader className="border-b border-slate-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-[#064e3b] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#059669]" /> Department Curriculum & Course Roster
              </CardTitle>
              <CardDescription className="mt-1">
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
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
              <button
                onClick={() => setActiveTypeTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTypeTab === 'all' 
                    ? 'bg-white text-[#064e3b] shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Courses ({departmentCourses.length})
              </button>
              <button
                onClick={() => setActiveTypeTab('core')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTypeTab === 'core' 
                    ? 'bg-white text-emerald-800 shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Core {department} ({coreCourses.length})
              </button>
              <button
                onClick={() => setActiveTypeTab('borrowed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTypeTab === 'borrowed' 
                    ? 'bg-white text-amber-800 shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
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
                  className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                  className="h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                  className="h-9 pl-8 text-xs bg-slate-50 border-slate-200"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-28 font-bold">Course Code</TableHead>
                  <TableHead className="font-bold">Course Title</TableHead>
                  <TableHead className="text-center font-bold">Units / Level</TableHead>
                  <TableHead className="font-bold">Assigned Lecturer / Dept</TableHead>
                  <TableHead className="text-center font-bold">Enrollment & Status</TableHead>
                  <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => {
                  const isCore = course.department === department;
                  const lecturer = getCourseLecturer(course);
                  const enrolledCount = course.totalEnrolled || 0;
                  const hasPending = course.hasPendingReview;
                  const isPublished = course.isFullyPublished;

                  return (
                    <TableRow key={course.id} className="hover:bg-slate-50/70">
                      {/* Course Code & Type */}
                      <TableCell>
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-sm text-[#064e3b]">
                            {course.code}
                          </span>
                          <div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              isCore 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {isCore ? 'Core' : 'Borrowed'}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Course Title */}
                      <TableCell>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{course.title}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <span>Host: {course.department}</span>
                            <span>•</span>
                            <span>{course.college || 'College of Science'}</span>
                          </p>
                        </div>
                      </TableCell>

                      {/* Credit Units & Level */}
                      <TableCell className="text-center">
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-xs">
                            {course.creditUnits} Units
                          </span>
                          <p className="text-[11px] text-slate-500">
                            {course.level}L • Sem {course.semester}
                          </p>
                        </div>
                      </TableCell>

                      {/* Assigned Lecturer (Prominently displayed) */}
                      <TableCell>
                        {lecturer ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {lecturer.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('')}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 leading-tight">
                                {lecturer.name}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {lecturer.staffId || lecturer.department}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs italic">
                            <UserIcon className="w-3.5 h-3.5" />
                            <span>Unassigned / Dept Head</span>
                          </div>
                        )}
                      </TableCell>

                      {/* Enrollment & Status */}
                      <TableCell className="text-center">
                        <div className="space-y-1">
                          <span className="text-xs font-medium text-slate-700 block">
                            {enrolledCount} Student{enrolledCount === 1 ? '' : 's'}
                          </span>
                          {isPublished ? (
                            <Badge variant="success" className="text-[10px] py-0 px-2">
                              Published
                            </Badge>
                          ) : hasPending ? (
                            <Badge variant="warning" className="text-[10px] py-0 px-2">
                              Pending Review
                            </Badge>
                          ) : enrolledCount > 0 ? (
                            <Badge variant="secondary" className="text-[10px] py-0 px-2 text-slate-500">
                              In Progress
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] py-0 px-2 text-slate-400">
                              No Enrollee
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right pr-6 space-x-2">
                        {enrolledCount > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenView(course)}
                            className="h-8 gap-1 text-slate-700 bg-white hover:bg-slate-50 hover:text-[#064e3b]"
                          >
                            <FileSearch className="w-3.5 h-3.5" /> View Results
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(course)}
                          className="h-8 gap-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {filteredCourses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500 py-12">
                      <div className="flex flex-col items-center justify-center">
                        <BookOpen className="h-8 w-8 text-slate-300 mb-2" />
                        <p className="font-medium text-slate-700">No courses match your active filter.</p>
                        <p className="text-xs text-slate-400 mt-1">Try resetting the level, semester, or search query.</p>
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
