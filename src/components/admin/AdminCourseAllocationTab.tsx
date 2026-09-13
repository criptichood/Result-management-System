import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Course, Department, User } from '../../types';
import { 
  UserCheck, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  RotateCcw,
  Sparkles,
  Users
} from 'lucide-react';

interface LecturerWorkloadItem {
  lecturer: User;
  assignedCourses: Course[];
  totalCreditUnits: number;
  totalStudentsEnrolled: number;
}

interface AdminCourseAllocationTabProps {
  courses: Course[];
  departments: Department[];
  lecturers: User[];
  workloads: LecturerWorkloadItem[];
  onAllocateCourse: (courseId: string, lecturerId?: string) => void;
  onBatchAllocate: (allocations: { courseId: string; lecturerId?: string }[]) => void;
}

export const AdminCourseAllocationTab: React.FC<AdminCourseAllocationTabProps> = ({
  courses,
  departments,
  lecturers,
  workloads,
  onAllocateCourse,
  onBatchAllocate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<number | 'all'>('all');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<number | 'all'>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [pendingAllocations, setPendingAllocations] = useState<Record<string, string>>({});
  const [showAutoAssignSuccess, setShowAutoAssignSuccess] = useState(false);

  // Compute metrics
  const totalCourses = courses.length;
  const allocatedCourses = courses.filter(c => !!c.lecturerId).length;
  const unallocatedCourses = totalCourses - allocatedCourses;
  const allocationRate = totalCourses > 0 ? Math.round((allocatedCourses / totalCourses) * 100) : 0;

  // Filter courses
  const filteredCourses = courses.filter(c => {
    const assignedId = pendingAllocations[c.id] !== undefined ? pendingAllocations[c.id] : (c.lecturerId || '');
    const isAssigned = !!assignedId;

    if (selectedStatusFilter === 'assigned' && !isAssigned) return false;
    if (selectedStatusFilter === 'unassigned' && isAssigned) return false;

    if (selectedDeptFilter !== 'all' && c.department !== selectedDeptFilter) return false;
    if (selectedLevelFilter !== 'all' && c.level !== selectedLevelFilter) return false;
    if (selectedSemesterFilter !== 'all' && c.semester !== selectedSemesterFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const currentLecturer = lecturers.find(l => l.id === assignedId);
      const matchCode = c.code.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDept = c.department.toLowerCase().includes(q);
      const matchLec = currentLecturer?.name.toLowerCase().includes(q);
      if (!matchCode && !matchTitle && !matchDept && !matchLec) return false;
    }

    return true;
  });

  const handleLecturerSelect = (courseId: string, lecturerId: string) => {
    setPendingAllocations(prev => ({
      ...prev,
      [courseId]: lecturerId
    }));
    onAllocateCourse(courseId, lecturerId || undefined);
  };

  const handleAutoAssignDepartmentals = () => {
    // Intelligent heuristic: match unassigned courses with primary departmental lecturers or HODs
    const newAllocations: { courseId: string; lecturerId?: string }[] = [];
    const deptsMap = new Map<string, User[]>();

    lecturers.forEach(l => {
      const dept = l.department || 'Computer Science';
      if (!deptsMap.has(dept)) deptsMap.set(dept, []);
      deptsMap.get(dept)!.push(l);
    });

    courses.forEach(c => {
      if (!c.lecturerId) {
        const deptStaff = deptsMap.get(c.department) || lecturers;
        if (deptStaff.length > 0) {
          // Choose the lecturer with the lowest workload in that department
          const chosen = deptStaff.reduce((prev, curr) => {
            const prevLoad = workloads.find(w => w.lecturer.id === prev.id)?.totalCreditUnits || 0;
            const currLoad = workloads.find(w => w.lecturer.id === curr.id)?.totalCreditUnits || 0;
            return currLoad < prevLoad ? curr : prev;
          }, deptStaff[0]);

          newAllocations.push({ courseId: c.id, lecturerId: chosen.id });
        }
      }
    });

    if (newAllocations.length > 0) {
      onBatchAllocate(newAllocations);
      setShowAutoAssignSuccess(true);
      setTimeout(() => setShowAutoAssignSuccess(false), 4000);
    }
  };

  const getWorkloadStatus = (units: number) => {
    if (units === 0) return { label: 'Unassigned', variant: 'warning' as const, color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (units <= 6) return { label: 'Light Load', variant: 'secondary' as const, color: 'text-slate-700 bg-slate-100 border-slate-200' };
    if (units <= 14) return { label: 'Optimal Load', variant: 'success' as const, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    return { label: 'Heavy Load', variant: 'destructive' as const, color: 'text-orange-700 bg-orange-50 border-orange-200' };
  };

  return (
    <div className="space-y-6" id="admin-course-allocation-matrix">
      {/* Top Level Allocation Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Curriculum</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalCourses}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Active course offerings</p>
            </div>
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
              <BookOpen className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Allocated Courses</p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1">{allocatedCourses}</h3>
              <p className="text-[11px] text-emerald-600/80 mt-0.5">{allocationRate}% assigned to staff</p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Unassigned Courses</p>
              <h3 className="text-2xl font-bold text-amber-700 mt-1">{unallocatedCourses}</h3>
              <p className="text-[11px] text-amber-600/80 mt-0.5">Require lecturer assignment</p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teaching Faculty</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{lecturers.length}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Active academic staff</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lecturer Teaching Workload Horizontal Bar */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" /> Faculty Teaching Workload Distribution
              </CardTitle>
              <CardDescription className="text-xs">
                Monitor assigned credit units and courses per lecturer to prevent overload and ensure equitable distribution.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {workloads.map((item) => {
              const status = getWorkloadStatus(item.totalCreditUnits);
              return (
                <div 
                  key={item.lecturer.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex items-center justify-between gap-3 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.lecturer.name}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.lecturer.staffId || 'Staff'} • {item.lecturer.department || 'Faculty'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                        {item.totalCreditUnits} CUs
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ({item.assignedCourses.length} course{item.assignedCourses.length === 1 ? '' : 's'})
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${status.color} flex-shrink-0`}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Course Allocation Matrix Table */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl text-[#064e3b] dark:text-emerald-400 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#059669]" /> Course Allocation Matrix
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Assign or reassign primary course lecturers. Changes immediately reflect in grading sheets and student portals.
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2 self-start md:self-auto">
              <Button
                id="btn-auto-assign-courses"
                onClick={handleAutoAssignDepartmentals}
                disabled={unallocatedCourses === 0}
                className="bg-[#064e3b] hover:bg-[#065f46] text-white text-xs gap-1.5 h-9"
              >
                <Sparkles className="w-3.5 h-3.5" /> Auto-Assign Unallocated
              </Button>
            </div>
          </div>

          {showAutoAssignSuccess && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Unassigned courses were successfully allocated to departmental faculty based on workload balance.</span>
            </div>
          )}

          {/* Filters Bar */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <Input
                placeholder="Search code, title, or lecturer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Allocation Status Filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                className="h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">All Statuses ({courses.length})</option>
                <option value="assigned">Assigned ({allocatedCourses})</option>
                <option value="unassigned">Unassigned ({unallocatedCourses})</option>
              </select>

              {/* Department Filter */}
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>

              {/* Level Filter */}
              <select
                value={selectedLevelFilter}
                onChange={(e) => setSelectedLevelFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">All Levels</option>
                <option value={100}>100 Level</option>
                <option value={200}>200 Level</option>
                <option value={300}>300 Level</option>
                <option value={400}>400 Level</option>
                <option value={500}>500 Level</option>
              </select>

              {/* Semester Filter */}
              <select
                value={selectedSemesterFilter}
                onChange={(e) => setSelectedSemesterFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">All Semesters</option>
                <option value={1}>1st Semester</option>
                <option value={2}>2nd Semester</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/60">
                  <TableHead className="w-28 font-bold">Course Code</TableHead>
                  <TableHead className="font-bold">Course Title & Department</TableHead>
                  <TableHead className="text-center font-bold">Level / Sem</TableHead>
                  <TableHead className="text-center font-bold">Units</TableHead>
                  <TableHead className="w-72 font-bold">Assigned Primary Lecturer</TableHead>
                  <TableHead className="text-center font-bold">Allocation Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => {
                  const currentLecId = pendingAllocations[course.id] !== undefined ? pendingAllocations[course.id] : (course.lecturerId || '');
                  const isAssigned = !!currentLecId;

                  return (
                    <TableRow key={course.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <TableCell className="font-mono font-bold text-sm text-[#064e3b] dark:text-emerald-400">
                        {course.code}
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-slate-900 dark:text-white text-xs">{course.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{course.department} • {course.college}</p>
                      </TableCell>
                      <TableCell className="text-center text-xs font-medium">
                        {course.level}L • Sem {course.semester}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-bold text-xs">
                          {course.creditUnits} CU
                        </span>
                      </TableCell>
                      <TableCell>
                        <select
                          value={currentLecId}
                          onChange={(e) => handleLecturerSelect(course.id, e.target.value)}
                          className="w-full h-8.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-2xs"
                        >
                          <option value="">-- Unassigned (Select Lecturer) --</option>
                          {lecturers.map((lec) => (
                            <option key={lec.id} value={lec.id}>
                              {lec.name} ({lec.department || 'Staff'})
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell className="text-center">
                        {isAssigned ? (
                          <Badge variant="success" className="text-[10px] py-0.5 px-2">
                            Allocated
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px] py-0.5 px-2">
                            Unallocated
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {filteredCourses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500 py-12">
                      No courses match your filter criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
