import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Eye, 
  CheckCircle2, 
  User as UserIcon, 
  MoreVertical, 
  FileSpreadsheet, 
  Download,
  FileSearch,
  ChevronRight,
  ChevronDown,
  Building,
  GraduationCap,
  Check
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu';
import { CourseResultModal } from './CourseResultModal';
import { exportCourseRosterCSV } from './examinerUtils';
import { User } from '../../types';

interface PublishedResultsTableProps {
  publishedCourses: any[];
  lecturers?: User[];
}

export const PublishedResultsTable: React.FC<PublishedResultsTableProps> = ({ 
  publishedCourses,
  lecturers = [],
}) => {
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  const handleOpenModal = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const toggleExpand = (courseId: string) => {
    setExpandedCourseId(prev => prev === courseId ? null : courseId);
  };

  const getCourseLecturer = (course: any): User | null => {
    if (course.lecturerId) {
      const found = lecturers.find(l => l.id === course.lecturerId);
      if (found) return found;
    }
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
    <>
      <Card className="shadow-2xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-[#064e3b] dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Published Course Results
            </CardTitle>
            <CardDescription className="mt-1 text-slate-500 dark:text-slate-400">
              Officially approved course broadsheets visible on student grade slips and academic records.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-emerald-50 dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400 text-sm py-1 px-3 rounded-lg border border-emerald-100 dark:border-emerald-800">
            {publishedCourses.length} Courses Published
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile Card Feed */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {publishedCourses.map((course) => {
              const lecturer = getCourseLecturer(course);
              const isCore = course.department === 'Computer Science' || course.isCore;

              return (
                <div key={`mobile-${course.id}`} className="p-4 space-y-3 bg-white dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100 tracking-wider">
                        {course.code}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          isCore
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                        }`}
                      >
                        {isCore ? 'Core' : 'Borrowed'}
                      </span>
                    </div>
                    <Badge variant="success" className="text-xs py-0.5 px-2">
                      Published
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug">
                      {course.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {course.creditUnits} Units
                      </span>
                      <span>•</span>
                      <span>{course.level}L</span>
                      <span>•</span>
                      <span>{course.semester === 1 ? '1st Sem' : '2nd Sem'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 min-w-0">
                      {lecturer ? (
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                            {lecturer.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('')}
                          </div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                            {lecturer.name}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px] flex items-center gap-1">
                          <UserIcon className="w-3 h-3" />
                          {course.department}
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {course.totalEnrolled || 0} Candidates
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 gap-1.5"
                      onClick={() => handleOpenModal(course)}
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Audit Broadsheet
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 gap-1.5"
                      onClick={() => exportCourseRosterCSV(course)}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              );
            })}

            {publishedCourses.length === 0 && (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <FileSearch className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="font-medium text-slate-700 dark:text-slate-200">No published courses found yet.</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Approved course result submissions will appear in this published archive.</p>
              </div>
            )}
          </div>

          {/* Desktop Full Table View - Responsive Without Horizontal Squeeze */}
          <div className="hidden md:block overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-slate-50 dark:bg-slate-800/80">
                <TableRow className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs">
                  <TableHead className="w-40 font-bold text-slate-700 dark:text-slate-300 pl-3">Course Code</TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">Course Title</TableHead>
                  <TableHead className="w-44 font-bold text-slate-700 dark:text-slate-300">Lecturer / Host Dept</TableHead>
                  <TableHead className="w-36 text-center font-bold text-slate-700 dark:text-slate-300">Candidates & Status</TableHead>
                  <TableHead className="w-32 text-right pr-4 font-bold text-slate-700 dark:text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {publishedCourses.map((course) => {
                  const lecturer = getCourseLecturer(course);
                  const isCore = course.department === 'Computer Science' || course.isCore;
                  const isExpanded = expandedCourseId === course.id;

                  return (
                    <React.Fragment key={course.id}>
                      <TableRow className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 transition-colors">
                        {/* Course Code with Expand Toggle & Badge */}
                        <TableCell className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => toggleExpand(course.id)}
                              className="p-1 -ml-1 text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 rounded transition-colors focus:outline-none"
                              title={isExpanded ? 'Collapse details' : 'Expand details'}
                              aria-label={isExpanded ? `Collapse details for ${course.code}` : `Expand details for ${course.code}`}
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                            <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100 tracking-wider">
                              {course.code}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                isCore
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                              }`}
                            >
                              {isCore ? 'Core' : 'Borrowed'}
                            </span>
                          </div>
                        </TableCell>

                        {/* Title & Compact Meta */}
                        <TableCell className="py-3 px-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug">
                              {course.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              <span className="font-medium text-slate-700 dark:text-slate-300">{course.creditUnits} Units</span>
                              <span className="mx-1.5 text-slate-300 dark:text-slate-600">•</span>
                              <span>{course.level}L</span>
                              <span className="mx-1.5 text-slate-300 dark:text-slate-600">•</span>
                              <span>Sem {course.semester}</span>
                            </p>
                          </div>
                        </TableCell>

                        {/* Assigned Lecturer */}
                        <TableCell className="py-3 px-3">
                          {lecturer ? (
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                                {lecturer.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('')}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                                  {lecturer.name}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                  {lecturer.department || course.department}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs italic">
                              <UserIcon className="w-3.5 h-3.5" />
                              <span>{course.department}</span>
                            </div>
                          )}
                        </TableCell>

                        {/* Candidates & Status */}
                        <TableCell className="py-3 px-3 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 text-xs font-medium">
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                              {course.totalEnrolled || 0}
                            </span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
                              <Check className="w-3 h-3" />
                              Published
                            </span>
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 px-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                              onClick={() => handleOpenModal(course)}
                            >
                              <Eye className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
                              Audit
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem
                                  onClick={() => handleOpenModal(course)}
                                  className="cursor-pointer text-xs font-medium"
                                >
                                  <FileSpreadsheet className="w-3.5 h-3.5 mr-2 text-slate-500" />
                                  View Broadsheet
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => exportCourseRosterCSV(course)}
                                  className="cursor-pointer text-xs font-medium"
                                >
                                  <Download className="w-3.5 h-3.5 mr-2 text-slate-500" />
                                  Export CSV
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
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
                                  Academic Curriculum
                                </div>
                                <p className="text-slate-600 dark:text-slate-300">
                                  <span className="text-slate-400">Department:</span> {course.department}
                                </p>
                                <p className="text-slate-600 dark:text-slate-300">
                                  <span className="text-slate-400">Curriculum:</span> {isCore ? 'Core Requirement' : 'Borrowed / Elective'}
                                </p>
                                <p className="text-slate-600 dark:text-slate-300">
                                  <span className="text-slate-400">Credit Load:</span> {course.creditUnits} Units ({course.level} Level)
                                </p>
                              </div>

                              <div className="p-3 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                                  Publishing Records
                                </div>
                                <p className="text-slate-600 dark:text-slate-300">
                                  <span className="text-slate-400">Candidates Enrolled:</span> {course.totalEnrolled || 0}
                                </p>
                                <p className="text-slate-600 dark:text-slate-300">
                                  <span className="text-slate-400">Moderation Status:</span> 100% Published
                                </p>
                                <p className="text-slate-600 dark:text-slate-300">
                                  <span className="text-slate-400">Visibility:</span> Live on Student Portals
                                </p>
                              </div>

                              <div className="p-3 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                                  <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                                  Assigned Lecturer
                                </div>
                                {lecturer ? (
                                  <div className="space-y-0.5">
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{lecturer.name}</p>
                                    <p className="text-slate-500 dark:text-slate-400">{lecturer.email || lecturer.staffId || lecturer.department}</p>
                                  </div>
                                ) : (
                                  <p className="text-slate-400 italic">Department faculty</p>
                                )}
                                <div className="pt-1 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700/60">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenModal(course)}
                                    className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold text-[11px] inline-flex items-center gap-1"
                                  >
                                    <FileSpreadsheet className="w-3 h-3" /> Broadsheet
                                  </button>
                                  <span>•</span>
                                  <button
                                    type="button"
                                    onClick={() => exportCourseRosterCSV(course)}
                                    className="text-slate-600 dark:text-slate-300 hover:underline font-medium text-[11px] inline-flex items-center gap-1"
                                  >
                                    <Download className="w-3 h-3" /> Export CSV
                                  </button>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}

                {publishedCourses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 py-12">
                      <div className="flex flex-col items-center justify-center">
                        <FileSearch className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="font-medium text-slate-700 dark:text-slate-200">No published courses found yet.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Broadsheet Audit Modal */}
      {selectedCourse && (
        <CourseResultModal
          course={selectedCourse}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCourse(null);
          }}
          onApprove={() => {}}
        />
      )}
    </>
  );
};
