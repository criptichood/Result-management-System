import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Course, User, Enrollment } from '../../types';
import { FuazLogo } from '../ui/FuazLogo';
import {
  BookOpen,
  Download,
  Printer,
  Users,
  Search,
  Filter,
  ArrowUpDown,
  GraduationCap,
  Layers,
  Award,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface DepartmentLecturerAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentName?: string;
  courses: Course[];
  lecturers: User[];
  enrollments: Enrollment[];
  activeSession?: string;
}

export const DepartmentLecturerAllocationModal: React.FC<DepartmentLecturerAllocationModalProps> = ({
  isOpen,
  onClose,
  departmentName = 'Computer Science',
  courses = [],
  lecturers = [],
  enrollments = [],
  activeSession = '2024/2025',
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number | 'ALL'>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<number | 'ALL'>('ALL');
  const [selectedLecturerId, setSelectedLecturerId] = useState<string | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'lecturer' | 'code' | 'title' | 'units' | 'level' | 'candidates'>('lecturer');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter courses for this department
  const deptCourses = useMemo(() => {
    return courses.filter((c) => !departmentName || c.department === departmentName);
  }, [courses, departmentName]);

  // Build allocation records mapping each lecturer to their assigned courses
  const allocationRecords = useMemo(() => {
    const list: Array<{
      id: string;
      lecturer: User | null;
      course: Course;
      level: number;
      semester: number;
      creditUnits: number;
      roleTitle: string;
      enrolledCount: number;
    }> = [];

    deptCourses.forEach((course) => {
      // Primary lecturer
      const primaryLec = course.lecturerId
        ? lecturers.find((l) => l.id === course.lecturerId) || null
        : null;

      // Count enrolled students for active session
      const enrolledCount = enrollments.filter(
        (e) => e.courseId === course.id && (!e.academicYear || e.academicYear === activeSession)
      ).length;

      list.push({
        id: `${course.id}_primary`,
        lecturer: primaryLec,
        course,
        level: course.level,
        semester: course.semester,
        creditUnits: course.creditUnits,
        roleTitle: 'Course Coordinator / Lead Lecturer',
        enrolledCount,
      });

      // Additional instructors if any
      if (course.instructors && course.instructors.length > 0) {
        course.instructors.forEach((inst, idx) => {
          if (inst.lecturerId !== course.lecturerId) {
            const instLec = lecturers.find((l) => l.id === inst.lecturerId) || null;
            list.push({
              id: `${course.id}_inst_${idx}`,
              lecturer: instLec,
              course,
              level: course.level,
              semester: course.semester,
              creditUnits: course.creditUnits,
              roleTitle: inst.role || 'Co-Lecturer',
              enrolledCount,
            });
          }
        });
      }
    });

    return list;
  }, [deptCourses, lecturers, enrollments, activeSession]);

  // Apply filters
  const filteredAllocations = useMemo(() => {
    return allocationRecords.filter((rec) => {
      // Semester filter
      if (selectedSemester !== 'ALL' && rec.semester !== selectedSemester) return false;

      // Level filter
      if (selectedLevel !== 'ALL' && rec.level !== selectedLevel) return false;

      // Lecturer filter
      if (selectedLecturerId !== 'ALL' && rec.lecturer?.id !== selectedLecturerId) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const lecName = rec.lecturer?.name.toLowerCase() || 'unassigned';
        const staffId = rec.lecturer?.staffId?.toLowerCase() || '';
        const code = rec.course.code.toLowerCase();
        const title = rec.course.title.toLowerCase();
        if (!lecName.includes(q) && !staffId.includes(q) && !code.includes(q) && !title.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [allocationRecords, selectedSemester, selectedLevel, selectedLecturerId, searchQuery]);

  // Sorting
  const sortedAllocations = useMemo(() => {
    return [...filteredAllocations].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'lecturer') {
        const nameA = a.lecturer?.name || 'ZZZ';
        const nameB = b.lecturer?.name || 'ZZZ';
        comparison = nameA.localeCompare(nameB);
      } else if (sortField === 'code') {
        comparison = a.course.code.localeCompare(b.course.code);
      } else if (sortField === 'title') {
        comparison = a.course.title.localeCompare(b.course.title);
      } else if (sortField === 'units') {
        comparison = a.creditUnits - b.creditUnits;
      } else if (sortField === 'level') {
        comparison = a.level - b.level;
      } else if (sortField === 'candidates') {
        comparison = a.enrolledCount - b.enrolledCount;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredAllocations, sortField, sortDirection]);

  // Workload summary per lecturer
  const lecturerWorkloadSummary = useMemo(() => {
    const map = new Map<string, { lecturer: User; courses: Course[]; totalUnits: number; totalStudents: number }>();

    allocationRecords.forEach((rec) => {
      if (rec.lecturer) {
        const existing = map.get(rec.lecturer.id) || {
          lecturer: rec.lecturer,
          courses: [],
          totalUnits: 0,
          totalStudents: 0,
        };
        existing.courses.push(rec.course);
        existing.totalUnits += rec.creditUnits;
        existing.totalStudents += rec.enrolledCount;
        map.set(rec.lecturer.id, existing);
      }
    });

    return Array.from(map.values());
  }, [allocationRecords]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Export CSV function
  const handleExportCSV = () => {
    const headers = [
      'S/N',
      'Lecturer Name',
      'Staff ID',
      'Email',
      'Department',
      'Course Code',
      'Course Title',
      'Credit Units',
      'Level',
      'Semester',
      'Academic Session',
      'Assignment Role',
      'Enrolled Candidates',
    ];

    const rows = sortedAllocations.map((rec, idx) => [
      idx + 1,
      `"${rec.lecturer?.name || 'Unassigned'}"`,
      `"${rec.lecturer?.staffId || 'N/A'}"`,
      `"${rec.lecturer?.email || 'N/A'}"`,
      `"${departmentName}"`,
      `"${rec.course.code}"`,
      `"${rec.course.title.replace(/"/g, '""')}"`,
      rec.creditUnits,
      `${rec.level}L`,
      rec.semester === 1 ? '1st Semester' : '2nd Semester',
      activeSession,
      `"${rec.roleTitle}"`,
      rec.enrolledCount,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const semName = selectedSemester === 'ALL' ? 'Full_Session' : `Sem${selectedSemester}`;
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `FUAZ_${departmentName.replace(/\s+/g, '_')}_Lecturer_Course_Allocations_${semName}_${activeSession.replace(/\//g, '-')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-bold">
                  Departmental Board of Examiners
                </Badge>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Academic Session: {activeSession}
                </span>
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-black text-[#064e3b] dark:text-emerald-400 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Lecturer Course Allocation & Workload Schedule
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Official statutory schedule of course offerings, assigned academic staff, and credit workloads for Dept. of {departmentName}.
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto print:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-1.5 text-xs text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
              >
                <Printer className="w-4 h-4 text-emerald-600" /> Print Schedule
              </Button>
              <Button
                size="sm"
                onClick={handleExportCSV}
                className="gap-1.5 text-xs bg-[#064e3b] hover:bg-[#053d2e] text-white shadow-xs"
              >
                <Download className="w-4 h-4" /> Download CSV
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 print:hidden">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Total Department Courses</span>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{deptCourses.length}</p>
            <p className="text-[11px] text-slate-400">100L to 400L Catalog</p>
          </div>
          <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/80 dark:border-emerald-800">
            <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">Teaching Faculty</span>
            <p className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300 mt-1">{lecturerWorkloadSummary.length}</p>
            <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400">Active Instructors</p>
          </div>
          <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/80 dark:border-blue-800">
            <span className="text-[10px] font-bold uppercase text-blue-700 dark:text-blue-400">Allocated Credit Units</span>
            <p className="text-xl font-extrabold text-blue-800 dark:text-blue-300 mt-1">
              {deptCourses.reduce((sum, c) => sum + c.creditUnits, 0)} Units
            </p>
            <p className="text-[11px] text-blue-600/80 dark:text-blue-400">Across both semesters</p>
          </div>
          <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/80 dark:border-amber-800">
            <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400">Active Filter Count</span>
            <p className="text-xl font-extrabold text-amber-800 dark:text-amber-300 mt-1">{sortedAllocations.length}</p>
            <p className="text-[11px] text-amber-600/80 dark:text-amber-400">Matching records</p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col lg:flex-row lg:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Semester Tabs */}
            <div className="flex items-center bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setSelectedSemester('ALL')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  selectedSemester === 'ALL'
                    ? 'bg-[#064e3b] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Semesters
              </button>
              <button
                type="button"
                onClick={() => setSelectedSemester(1)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  selectedSemester === 1
                    ? 'bg-[#064e3b] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                1st Semester
              </button>
              <button
                type="button"
                onClick={() => setSelectedSemester(2)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  selectedSemester === 2
                    ? 'bg-[#064e3b] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                2nd Semester
              </button>
            </div>

            {/* Level Select */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              aria-label="Filter courses by academic level"
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Levels</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
            </select>

            {/* Lecturer Filter */}
            <select
              value={selectedLecturerId}
              onChange={(e) => setSelectedLecturerId(e.target.value)}
              aria-label="Filter courses by assigned lecturer"
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none max-w-xs truncate"
            >
              <option value="ALL">All Lecturers</option>
              {lecturers.map((lec) => (
                <option key={lec.id} value={lec.id}>
                  {lec.name} {lec.staffId ? `(${lec.staffId})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search course code, lecturer, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Printable Official Document Structure */}
        <div className="space-y-4">
          {/* Institutional Print Header */}
          <div className="hidden print:flex flex-col items-center justify-center text-center pb-4 border-b-2 border-slate-800 mb-4">
            <FuazLogo size={64} />
            <h1 className="text-lg font-black uppercase tracking-wider text-slate-900 mt-2">
              Federal University of Agriculture, Zuru
            </h1>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Department of {departmentName}
            </p>
            <p className="text-xs text-slate-700 font-semibold mt-1">
              Official Course Allocation Schedule & Teaching Staff Roster • {activeSession} Academic Session
            </p>
            <p className="text-[10px] text-slate-500">
              Generated via FUAZ Student Results Management System (SRMS) on {new Date().toLocaleDateString('en-GB')}
            </p>
          </div>

          {/* Interactive & Printable Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto shadow-2xs">
            <Table className="w-full text-xs">
              <TableHeader className="bg-slate-100 dark:bg-slate-800/80">
                <TableRow className="border-b border-slate-200 dark:border-slate-700">
                  <TableHead className="w-12 font-bold text-slate-700 dark:text-slate-300">S/N</TableHead>
                  <TableHead
                    className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:text-emerald-600 select-none"
                    onClick={() => handleSort('lecturer')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Lecturer / Instructor</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-28 font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:text-emerald-600 select-none"
                    onClick={() => handleSort('code')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Course Code</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:text-emerald-600 select-none"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Course Title</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-16 text-center font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:text-emerald-600 select-none"
                    onClick={() => handleSort('units')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Units</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-16 text-center font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:text-emerald-600 select-none"
                    onClick={() => handleSort('level')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Level</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </TableHead>
                  <TableHead className="w-20 text-center font-bold text-slate-700 dark:text-slate-300">
                    Semester
                  </TableHead>
                  <TableHead
                    className="w-24 text-center font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:text-emerald-600 select-none"
                    onClick={() => handleSort('candidates')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Students</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortedAllocations.map((rec, idx) => (
                  <TableRow
                    key={rec.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <TableCell className="font-mono font-medium text-slate-500 dark:text-slate-400 py-2.5">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="py-2.5">
                      {rec.lecturer ? (
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 leading-tight">
                            {rec.lecturer.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {rec.lecturer.staffId ? `ID: ${rec.lecturer.staffId}` : rec.lecturer.email} •{' '}
                            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                              {rec.roleTitle}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Unassigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono font-bold text-emerald-800 dark:text-emerald-400 py-2.5">
                      {rec.course.code}
                    </TableCell>
                    <TableCell className="py-2.5 font-medium text-slate-900 dark:text-slate-100">
                      {rec.course.title}
                    </TableCell>
                    <TableCell className="text-center font-bold font-mono py-2.5">
                      {rec.creditUnits}
                    </TableCell>
                    <TableCell className="text-center py-2.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {rec.level}L
                      </span>
                    </TableCell>
                    <TableCell className="text-center py-2.5 font-semibold text-slate-700 dark:text-slate-300">
                      Sem {rec.semester}
                    </TableCell>
                    <TableCell className="text-center font-bold font-mono text-slate-800 dark:text-slate-200 py-2.5">
                      {rec.enrolledCount}
                    </TableCell>
                  </TableRow>
                ))}

                {sortedAllocations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-slate-400">
                      No course allocations found matching the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Official Sign-Off Block for Printout */}
          <div className="hidden print:grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-300">
            <div>
              <p className="text-xs font-bold text-slate-800 uppercase">Head of Department / Chief Examiner:</p>
              <div className="h-12 border-b border-dashed border-slate-400 mt-4" />
              <p className="text-[11px] font-semibold text-slate-700 mt-1">Prof. Bello Ibrahim</p>
              <p className="text-[10px] text-slate-500">Sign & Date / Official Stamp</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 uppercase">Faculty Dean / Board Moderator:</p>
              <div className="h-12 border-b border-dashed border-slate-400 mt-4" />
              <p className="text-[11px] font-semibold text-slate-700 mt-1">Dean, Faculty of Physical Sciences</p>
              <p className="text-[10px] text-slate-500">Sign & Date / Official Stamp</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
