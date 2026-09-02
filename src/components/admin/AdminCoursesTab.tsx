import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Course } from '../../types';

interface AdminCoursesTabProps {
  courses: Course[];
  courseSearch: string;
  setCourseSearch: (search: string) => void;
  selectedSemesterFilter: number | 'all';
  setSelectedSemesterFilter: (sem: number | 'all') => void;
  selectedLevelFilter: number | 'all';
  setSelectedLevelFilter: (lvl: number | 'all') => void;
  onOpenAddCourse: () => void;
  onOpenEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

export const AdminCoursesTab: React.FC<AdminCoursesTabProps> = ({
  courses,
  courseSearch,
  setCourseSearch,
  selectedSemesterFilter,
  setSelectedSemesterFilter,
  selectedLevelFilter,
  setSelectedLevelFilter,
  onOpenAddCourse,
  onOpenEditCourse,
  onDeleteCourse,
}) => {
  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(courseSearch.toLowerCase()) || 
                          c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
                          c.department.toLowerCase().includes(courseSearch.toLowerCase());
    const matchesSemester = selectedSemesterFilter === 'all' || c.semester === selectedSemesterFilter;
    const matchesLevel = selectedLevelFilter === 'all' || c.level === selectedLevelFilter;
    return matchesSearch && matchesSemester && matchesLevel;
  });

  return (
    <Card id="admin-courses-tab">
      <CardHeader className="border-b border-slate-100 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-xl">Course Management & Curriculum</CardTitle>
          <CardDescription>Configure course codes, titles, credit units, and semester assignments.</CardDescription>
        </div>
        <Button id="btn-add-course" onClick={onOpenAddCourse} className="bg-[#059669] hover:bg-emerald-700 text-white gap-2">
          <Plus className="h-4 w-4" /> Add New Course
        </Button>
      </CardHeader>
      
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input 
            id="input-search-courses"
            placeholder="Search by course code, title, or department..." 
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Semester:</span>
          <div className="flex rounded-lg border border-slate-200 bg-white p-1">
            <button 
              id="filter-sem-all"
              onClick={() => setSelectedSemesterFilter('all')} 
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${selectedSemesterFilter === 'all' ? 'bg-emerald-100 text-[#064e3b]' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              All
            </button>
            <button 
              id="filter-sem-1"
              onClick={() => setSelectedSemesterFilter(1)} 
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${selectedSemesterFilter === 1 ? 'bg-emerald-100 text-[#064e3b]' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              1st Sem
            </button>
            <button 
              id="filter-sem-2"
              onClick={() => setSelectedSemesterFilter(2)} 
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${selectedSemesterFilter === 2 ? 'bg-emerald-100 text-[#064e3b]' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              2nd Sem
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Level:</span>
          <div className="flex rounded-lg border border-slate-200 bg-white p-1">
            <button 
              id="filter-lvl-all"
              onClick={() => setSelectedLevelFilter('all')} 
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${selectedLevelFilter === 'all' ? 'bg-emerald-100 text-[#064e3b]' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              All
            </button>
            <button 
              id="filter-lvl-100"
              onClick={() => setSelectedLevelFilter(100)} 
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${selectedLevelFilter === 100 ? 'bg-emerald-100 text-[#064e3b]' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              100L
            </button>
            <button 
              id="filter-lvl-200"
              onClick={() => setSelectedLevelFilter(200)} 
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${selectedLevelFilter === 200 ? 'bg-emerald-100 text-[#064e3b]' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              200L
            </button>
          </div>
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
                <TableCell className="font-medium text-slate-900">{course.title}</TableCell>
                <TableCell className="text-center font-semibold">{course.creditUnits}</TableCell>
                <TableCell className="text-slate-600">{course.department}</TableCell>
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
