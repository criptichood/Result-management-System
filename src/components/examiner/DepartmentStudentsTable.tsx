import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { User, Course, Enrollment, Result } from '../../types';
import { StudentProfileModal } from './StudentProfileModal';
import {
  Search,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  Users,
  Award,
  ArrowUpDown,
  Filter,
  Building,
  Mail,
} from 'lucide-react';

interface DepartmentStudentsTableProps {
  department: string;
  students: User[];
  courses?: Course[];
  enrollments?: Enrollment[];
  results?: Result[];
}

export const DepartmentStudentsTable: React.FC<DepartmentStudentsTableProps> = ({
  department,
  students = [],
  courses = [],
  enrollments = [],
  results = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'graduated'>('all');
  const [levelFilter, setLevelFilter] = useState<number | 'all' | 'graduated'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'matric' | 'levelDesc' | 'levelAsc' | 'cgpa'>('levelDesc');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);

  // Filter departmental students
  const deptStudents = useMemo(() => {
    return students.filter((s) => !department || s.department === department);
  }, [students, department]);

  const activeCount = useMemo(
    () => deptStudents.filter((s) => !s.isGraduated).length,
    [deptStudents]
  );
  const graduatedCount = useMemo(
    () => deptStudents.filter((s) => s.isGraduated).length,
    [deptStudents]
  );

  const filteredStudents = useMemo(() => {
    return deptStudents
      .filter((student) => {
        // Status tab filter
        if (statusFilter === 'active' && student.isGraduated) return false;
        if (statusFilter === 'graduated' && !student.isGraduated) return false;

        // Level dropdown filter
        if (levelFilter === 'graduated') {
          if (!student.isGraduated) return false;
        } else if (typeof levelFilter === 'number') {
          if (student.isGraduated || student.level !== levelFilter) return false;
        }

        // Search query
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const matchesName = student.name?.toLowerCase().includes(q);
        const matchesMatric = student.matricNumber?.toLowerCase().includes(q);
        const matchesEmail = student.email?.toLowerCase().includes(q);
        return matchesName || matchesMatric || matchesEmail;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'matric') {
          return (a.matricNumber || '').localeCompare(b.matricNumber || '');
        }
        if (sortBy === 'levelDesc') {
          const aLevel = a.isGraduated ? 500 : a.level || 100;
          const bLevel = b.isGraduated ? 500 : b.level || 100;
          return bLevel - aLevel;
        }
        if (sortBy === 'levelAsc') {
          const aLevel = a.isGraduated ? 500 : a.level || 100;
          const bLevel = b.isGraduated ? 500 : b.level || 100;
          return aLevel - bLevel;
        }
        if (sortBy === 'cgpa') {
          const aCgpa = a.finalCgpa || 0;
          const bCgpa = b.finalCgpa || 0;
          return bCgpa - aCgpa;
        }
        return 0;
      });
  }, [deptStudents, statusFilter, levelFilter, searchQuery, sortBy]);

  return (
    <Card className="shadow-2xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-[#064e3b] dark:text-emerald-400 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Department Students Registry
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Active candidates and graduated alumni roster for Dept. of {department}.
            </CardDescription>
          </div>

          {/* Quick Count Badges */}
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs py-1 px-2.5 font-bold"
            >
              {activeCount} Undergraduates
            </Badge>
            <Badge
              variant="secondary"
              className="bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs py-1 px-2.5 font-bold"
            >
              <GraduationCap className="w-3.5 h-3.5 mr-1" />
              {graduatedCount} Alumni
            </Badge>
          </div>
        </div>

        {/* Filter Toolbar: Status Tabs, Search, Level & Sort */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2">
          {/* Cohort Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start">
            <button
              onClick={() => {
                setStatusFilter('all');
                setLevelFilter('all');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Students ({deptStudents.length})
            </button>
            <button
              onClick={() => {
                setStatusFilter('active');
                if (levelFilter === 'graduated') setLevelFilter('all');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'active'
                  ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => {
                setStatusFilter('graduated');
                setLevelFilter('graduated');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                statusFilter === 'graduated'
                  ? 'bg-white dark:bg-slate-700 text-purple-800 dark:text-purple-300 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Graduated Alumni ({graduatedCount})
            </button>
          </div>

          {/* Search, Level and Sort Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search name or matric..."
                className="pl-8 h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              value={levelFilter}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'all') setLevelFilter('all');
                else if (val === 'graduated') {
                  setLevelFilter('graduated');
                  setStatusFilter('graduated');
                } else {
                  setLevelFilter(Number(val));
                  setStatusFilter('active');
                }
              }}
              className="text-xs h-8 px-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="all">All Academic Levels</option>
              <option value={100}>100 Level</option>
              <option value={200}>200 Level</option>
              <option value={300}>300 Level</option>
              <option value={400}>400 Level (Final Year)</option>
              <option value="graduated">Graduated Alumni</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs h-8 px-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <option value="levelDesc">Level (High to Low)</option>
              <option value="levelAsc">Level (Low to High)</option>
              <option value="name">Name (A-Z)</option>
              <option value="matric">Matric Number</option>
              <option value="cgpa">Graduation Standing / CGPA</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Mobile Card Feed */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredStudents.map((student) => (
            <div
              key={`mobile-${student.id}`}
              onClick={() => setSelectedStudent(student)}
              className="p-4 space-y-3 bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  {student.matricNumber || 'Pending Matric'}
                </span>
                {student.isGraduated ? (
                  <Badge
                    variant="outline"
                    className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40"
                  >
                    Graduated ({student.graduationYear || 'Alumnus'})
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-[11px] font-bold text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  >
                    {student.level || 100} Level
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {student.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                    {student.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{student.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    {student.degreeClass || (student.isGraduated ? 'Graduated' : 'In Good Standing')}
                  </span>
                  {student.finalCgpa !== undefined && (
                    <span className="ml-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                      ({student.finalCgpa.toFixed(2)} CGPA)
                    </span>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs font-bold text-[#064e3b] dark:text-emerald-400 p-0 hover:bg-transparent"
                >
                  View Report <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Button>
              </div>
            </div>
          ))}

          {filteredStudents.length === 0 && (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              <Search className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="font-semibold text-slate-700 dark:text-slate-200">
                No students found matching your criteria.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try clearing filters or adjusting your search query.
              </p>
            </div>
          )}
        </div>

        {/* Desktop Full Table View - Responsive Without Forced Horizontal Scroll */}
        <div className="hidden md:block overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-slate-50 dark:bg-slate-800/80">
              <TableRow className="border-b border-slate-200 dark:border-slate-700 text-xs">
                <TableHead className="w-44 font-bold text-slate-700 dark:text-slate-300 py-3 pl-3">
                  Matric Number
                </TableHead>
                <TableHead className="font-bold text-slate-700 dark:text-slate-300">
                  Candidate Name
                </TableHead>
                <TableHead className="w-36 font-bold text-slate-700 dark:text-slate-300 text-center">
                  Level & Status
                </TableHead>
                <TableHead className="w-48 font-bold text-slate-700 dark:text-slate-300">
                  Academic Standing
                </TableHead>
                <TableHead className="w-28 text-right font-bold text-slate-700 dark:text-slate-300 pr-4">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const isExpanded = expandedStudentId === student.id;
                const studentEnrollments = enrollments.filter(e => e.studentId === student.id);

                return (
                  <React.Fragment key={student.id}>
                    <TableRow
                      className="group hover:bg-slate-50/70 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 transition-colors"
                    >
                      {/* Matric Number with Expand Toggle */}
                      <TableCell className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedStudentId(prev => prev === student.id ? null : student.id);
                            }}
                            className="p-1 -ml-1 text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 rounded transition-colors focus:outline-none"
                            title={isExpanded ? 'Collapse details' : 'Expand details'}
                            aria-label={isExpanded ? `Collapse details for ${student.name}` : `Expand details for ${student.name}`}
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                          <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                            {student.matricNumber || 'Pending'}
                          </span>
                        </div>
                      </TableCell>

                      {/* Candidate Name & Email */}
                      <TableCell className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {student.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p 
                              onClick={() => setSelectedStudent(student)}
                              className="font-bold text-xs text-slate-900 dark:text-slate-100 cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors leading-tight"
                            >
                              {student.name}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Level & Status Combined */}
                      <TableCell className="text-center py-3 px-3 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 text-xs">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {student.isGraduated ? 'Alumnus' : `${student.level || 100}L`}
                          </span>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          {student.isGraduated ? (
                            <span className="text-purple-700 dark:text-purple-400 font-bold text-[11px]">
                              Graduated
                            </span>
                          ) : (
                            <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-[11px] inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Academic Standing */}
                      <TableCell className="py-3 px-3">
                        <div className="text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {student.degreeClass || (student.isGraduated ? 'Graduated' : 'Good Standing')}
                          </span>
                          {student.finalCgpa !== undefined && (
                            <span className="ml-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                              ({student.finalCgpa.toFixed(2)})
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="text-right pr-4 py-3 px-3 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedStudent(student)}
                          className="h-7 px-2 text-xs font-bold text-[#064e3b] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                        >
                          Report <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Expandable Details Drawer */}
                    {isExpanded && (
                      <TableRow className="bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                        <TableCell colSpan={5} className="p-4 sm:p-5">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                            <div className="p-3 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                                <Building className="w-3.5 h-3.5 text-emerald-600" />
                                Student Details
                              </div>
                              <p className="text-slate-600 dark:text-slate-300">
                                <span className="text-slate-400">Department:</span> {student.department}
                              </p>
                              <p className="text-slate-600 dark:text-slate-300">
                                <span className="text-slate-400">Matric:</span> {student.matricNumber || 'Pending'}
                              </p>
                              <p className="text-slate-600 dark:text-slate-300">
                                <span className="text-slate-400">Email:</span> {student.email}
                              </p>
                            </div>

                            <div className="p-3 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                                Academic Progression
                              </div>
                              <p className="text-slate-600 dark:text-slate-300">
                                <span className="text-slate-400">Current Level:</span> {student.isGraduated ? 'Graduated Alumnus' : `${student.level || 100} Level`}
                              </p>
                              <p className="text-slate-600 dark:text-slate-300">
                                <span className="text-slate-400">Enrolled Courses:</span> {studentEnrollments.length} Courses
                              </p>
                              <p className="text-slate-600 dark:text-slate-300">
                                <span className="text-slate-400">Cumulative CGPA:</span> {student.finalCgpa ? `${student.finalCgpa.toFixed(2)} / 5.00` : 'In Progress'}
                              </p>
                            </div>

                            <div className="p-3 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                                <Award className="w-3.5 h-3.5 text-emerald-600" />
                                Classification & Actions
                              </div>
                              <p className="text-slate-600 dark:text-slate-300">
                                <span className="text-slate-400">Standing:</span> {student.degreeClass || 'Good Standing'}
                              </p>
                              <div className="pt-2">
                                <Button
                                  size="sm"
                                  onClick={() => setSelectedStudent(student)}
                                  className="h-7 px-3 text-xs font-semibold bg-[#064e3b] hover:bg-[#065f46] text-white"
                                >
                                  Open Comprehensive Dossier
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}

              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500 dark:text-slate-400 py-12">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-3" />
                      <p className="font-semibold text-slate-700 dark:text-slate-200">
                        No students found matching your criteria.
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Try clearing filters or adjusting your search query.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Comprehensive Student Profile & Results Report Modal */}
      <StudentProfileModal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        student={selectedStudent}
        courses={courses}
        enrollments={enrollments}
        results={results}
      />
    </Card>
  );
};
