import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, CheckSquare, Square, Layers, BookPlus } from 'lucide-react';
import { Course, Department } from '../../types';

interface PreExistingCoursesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  targetDepartment: string;
  targetCollege: string;
  availableCourses: Course[];
  departments: Department[];
  onImportCourses: (selectedCourses: Course[], targetDepartment: string, targetCollege: string) => void;
}

export const PreExistingCoursesModal: React.FC<PreExistingCoursesModalProps> = ({
  isOpen,
  onOpenChange,
  targetDepartment,
  targetCollege,
  availableCourses,
  departments,
  onImportCourses,
}) => {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<number | 'all'>('all');
  const [semesterFilter, setSemesterFilter] = useState<number | 'all'>('all');
  const [deptSourceFilter, setDeptSourceFilter] = useState<string>('all');
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [currentDept, setCurrentDept] = useState(targetDepartment);
  const [currentCollege, setCurrentCollege] = useState(targetCollege);

  // Sync state if targetDepartment changes
  React.useEffect(() => {
    setCurrentDept(targetDepartment);
    setCurrentCollege(targetCollege);
    setSelectedCourseIds([]);
  }, [targetDepartment, targetCollege, isOpen]);

  // Handle department change in modal
  const handleDepartmentChange = (deptName: string) => {
    setCurrentDept(deptName);
    const found = departments.find(d => d.name === deptName);
    if (found) {
      setCurrentCollege(found.college);
    }
  };

  // Filter available courses
  const filteredCourses = availableCourses.filter(course => {
    const matchesSearch = 
      course.code.toLowerCase().includes(search.toLowerCase()) ||
      course.title.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    const matchesSemester = semesterFilter === 'all' || course.semester === semesterFilter;
    const matchesSourceDept = deptSourceFilter === 'all' || course.department === deptSourceFilter;
    return matchesSearch && matchesLevel && matchesSemester && matchesSourceDept;
  });

  const toggleSelectCourse = (courseId: string) => {
    setSelectedCourseIds(prev => 
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const toggleSelectAllFiltered = () => {
    const filteredIds = filteredCourses.map(c => c.id);
    const allSelected = filteredIds.length > 0 && filteredIds.every(id => selectedCourseIds.includes(id));
    if (allSelected) {
      setSelectedCourseIds(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      const merged = new Set([...selectedCourseIds, ...filteredIds]);
      setSelectedCourseIds(Array.from(merged));
    }
  };

  const handleConfirmImport = () => {
    const selected = availableCourses.filter(c => selectedCourseIds.includes(c.id));
    if (selected.length === 0) return;
    onImportCourses(selected, currentDept, currentCollege);
    onOpenChange(false);
  };

  const selectedCoursesList = availableCourses.filter(c => selectedCourseIds.includes(c.id));
  const totalSelectedCredits = selectedCoursesList.reduce((acc, c) => acc + c.creditUnits, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <BookPlus className="w-5 h-5 text-emerald-600" /> Add Courses from Pre-Existing Catalog
            </DialogTitle>
            <Badge variant="success" className="text-xs">
              {selectedCourseIds.length} Courses Selected ({totalSelectedCredits} Units)
            </Badge>
          </div>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, and multi-select existing university courses to duplicate or adopt into a department's curriculum.
          </DialogDescription>
        </DialogHeader>

        {/* Configuration Bar: Destination Department & Filters */}
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
                Target Department Curriculum
              </label>
              <select
                id="select-import-target-department"
                value={currentDept}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name} ({dept.code}) - {dept.college}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
                Source Department Filter
              </label>
              <select
                value={deptSourceFilter}
                onChange={(e) => setDeptSourceFilter(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="all">All Source Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search and Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <Input
                id="input-preexisting-search"
                placeholder="Search course code or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-xs h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Level Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Level:</span>
              <select
                id="select-preexisting-level"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="all">All Levels</option>
                <option value={100}>100 Level</option>
                <option value={200}>200 Level</option>
                <option value={300}>300 Level</option>
                <option value={400}>400 Level</option>
                <option value={500}>500 Level</option>
              </select>
            </div>

            {/* Semester Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Sem:</span>
              <select
                id="select-preexisting-semester"
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="all">All Semesters</option>
                <option value={1}>1st Semester</option>
                <option value={2}>2nd Semester</option>
              </select>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleSelectAllFiltered}
              className="h-9 text-xs gap-1.5 ml-auto border-slate-200 dark:border-slate-700"
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
              {filteredCourses.length > 0 && filteredCourses.every(c => selectedCourseIds.includes(c.id)) 
                ? 'Deselect Filtered' 
                : 'Select Filtered'}
            </Button>
          </div>
        </div>

        {/* Courses Table */}
        <div className="flex-1 overflow-y-auto max-h-[380px] p-0">
          <Table>
            <TableHeader className="bg-slate-100/60 dark:bg-slate-800/80 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-12 text-center">
                  <span className="sr-only">Select</span>
                </TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Course Title</TableHead>
                <TableHead className="text-center">Units</TableHead>
                <TableHead className="text-center">Level</TableHead>
                <TableHead className="text-center">Sem</TableHead>
                <TableHead>Current Dept</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => {
                const isSelected = selectedCourseIds.includes(course.id);
                return (
                  <TableRow
                    key={course.id}
                    onClick={() => toggleSelectCourse(course.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/60' 
                        : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => toggleSelectCourse(course.id)}
                        className="p-1 text-slate-400 hover:text-emerald-600 focus:outline-none"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                      {course.code}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900 dark:text-white text-xs">
                      {course.title}
                    </TableCell>
                    <TableCell className="text-center font-bold text-xs">{course.creditUnits}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-[10px]">{course.level}L</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={course.semester === 1 ? 'secondary' : 'default'} className="text-[10px]">
                        {course.semester === 1 ? '1st' : '2nd'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                      {course.department}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredCourses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                    No courses match the specified search or filter criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Selected verification preview */}
        {selectedCoursesList.length > 0 && (
          <div className="px-6 py-2.5 bg-emerald-50/60 dark:bg-emerald-950/30 border-t border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
            <span className="flex items-center gap-1.5 font-medium">
              <Layers className="w-4 h-4 text-emerald-600" />
              Adding {selectedCoursesList.length} courses ({totalSelectedCredits} units) into <strong>{currentDept}</strong> ({currentCollege})
            </span>
            <button
              type="button"
              onClick={() => setSelectedCourseIds([])}
              className="text-xs underline text-emerald-700 dark:text-emerald-400 hover:text-emerald-900"
            >
              Clear selection
            </button>
          </div>
        )}

        <DialogFooter className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-xs">
            Cancel
          </Button>
          <Button
            id="btn-confirm-import-courses"
            type="button"
            onClick={handleConfirmImport}
            disabled={selectedCourseIds.length === 0}
            className="bg-[#059669] hover:bg-emerald-700 text-white text-xs gap-2"
          >
            <BookPlus className="w-4 h-4" />
            Add {selectedCourseIds.length} {selectedCourseIds.length === 1 ? 'Course' : 'Courses'} to Curriculum
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
