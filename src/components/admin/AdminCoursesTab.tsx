import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Search, Edit2, Trash2, BookPlus, UserCheck } from 'lucide-react';
import { Course, Department } from '../../types';

interface AdminCoursesTabProps {
  courses: Course[];
  departments?: Department[];
  courseSearch: string;
  setCourseSearch: (search: string) => void;
  selectedSemesterFilter: number | 'all';
  setSelectedSemesterFilter: (sem: number | 'all') => void;
  selectedLevelFilter: number | 'all';
  setSelectedLevelFilter: (lvl: number | 'all') => void;
  selectedDeptFilter?: string | 'all';
  setSelectedDeptFilter?: (dept: string | 'all') => void;
  onOpenAddCourse: () => void;
  onOpenImportCourse?: () => void;
  onOpenEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onNavigateToAllocations?: () => void;
}

export const AdminCoursesTab: React.FC<AdminCoursesTabProps> = ({
  courses,
  departments = [],
  courseSearch,
  setCourseSearch,
  selectedSemesterFilter,
  setSelectedSemesterFilter,
  selectedLevelFilter,
  setSelectedLevelFilter,
  selectedDeptFilter = 'all',
  setSelectedDeptFilter,
  onOpenAddCourse,
  onOpenImportCourse,
  onOpenEditCourse,
  onDeleteCourse,
  onNavigateToAllocations,
}) => {
  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(courseSearch.toLowerCase()) || 
                          c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
                          c.department.toLowerCase().includes(courseSearch.toLowerCase());
    const matchesSemester = selectedSemesterFilter === 'all' || c.semester === selectedSemesterFilter;
    const matchesLevel = selectedLevelFilter === 'all' || c.level === selectedLevelFilter;
    const matchesDept = !selectedDeptFilter || selectedDeptFilter === 'all' || c.department === selectedDeptFilter;
    return matchesSearch && matchesSemester && matchesLevel && matchesDept;
  });

  return (
    <Card id="admin-courses-tab">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-xl">Course Management & Curriculum</CardTitle>
          <CardDescription>Configure course codes, titles, credit units, and semester assignments.</CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {onNavigateToAllocations && (
            <Button
              id="btn-goto-allocations"
              variant="outline"
              onClick={onNavigateToAllocations}
              className="gap-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <UserCheck className="h-4 w-4 text-emerald-600" /> Allocation Matrix
            </Button>
          )}
          {onOpenImportCourse && (
            <Button 
              id="btn-import-preexisting-courses" 
              variant="outline"
              onClick={onOpenImportCourse} 
              className="gap-2 border-emerald-600/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
            >
              <BookPlus className="h-4 w-4 text-emerald-600" /> Add from Pre-existing
            </Button>
          )}
          <Button id="btn-add-course" onClick={onOpenAddCourse} className="bg-[#059669] hover:bg-emerald-700 text-white gap-2">
            <Plus className="h-4 w-4" /> Add New Course
          </Button>
        </div>
      </CardHeader>
      
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[220px] relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input 
            id="input-search-courses"
            placeholder="Search by code, title, or department..." 
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
            className="pl-9 bg-white dark:bg-slate-900 text-sm h-10 border-slate-200 dark:border-slate-700"
          />
        </div>

        {/* Scalable Department Dropdown Filter */}
        {setSelectedDeptFilter && departments.length > 0 && (
          <div className="flex items-center gap-2">
            <label htmlFor="filter-select-dept" className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Dept:
            </label>
            <select
              id="filter-select-dept"
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>{dept.name} ({dept.code})</option>
              ))}
            </select>
          </div>
        )}

        {/* Scalable Level Dropdown Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="filter-select-level" className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            Level:
          </label>
          <select
            id="filter-select-level"
            value={selectedLevelFilter}
            onChange={(e) => setSelectedLevelFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">All Levels</option>
            <option value={100}>100 Level</option>
            <option value={200}>200 Level</option>
            <option value={300}>300 Level</option>
            <option value={400}>400 Level</option>
            <option value={500}>500 Level</option>
          </select>
        </div>

        {/* Scalable Semester Dropdown Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="filter-select-semester" className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            Semester:
          </label>
          <select
            id="filter-select-semester"
            value={selectedSemesterFilter}
            onChange={(e) => setSelectedSemesterFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">All Semesters</option>
            <option value={1}>1st Semester</option>
            <option value={2}>2nd Semester</option>
          </select>
        </div>
      </div>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Code</TableHead>
              <TableHead>Course Title</TableHead>
              <TableHead className="text-center">Credits</TableHead>
              <TableHead>Department / Unit</TableHead>
              <TableHead className="text-center">Level</TableHead>
              <TableHead className="text-center">Semester</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-mono font-bold text-[#059669]">{course.code}</TableCell>
                <TableCell className="font-medium text-slate-900 dark:text-white">{course.title}</TableCell>
                <TableCell className="text-center font-semibold">{course.creditUnits}</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400">{course.department}</TableCell>
                <TableCell className="text-center"><Badge variant="outline">{course.level}L</Badge></TableCell>
                <TableCell className="text-center">
                  <Badge variant={course.semester === 1 ? "secondary" : "default"}>
                    {course.semester === 1 ? '1st Sem' : '2nd Sem'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onOpenEditCourse(course)} 
                    className="text-slate-600 hover:text-emerald-700"
                    aria-label={`Edit ${course.code}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDeleteCourse(course.id)} 
                    className="text-slate-400 hover:text-red-600"
                    aria-label={`Delete ${course.code}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredCourses.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-slate-500 py-12">
                  No courses found matching your search and filter criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

