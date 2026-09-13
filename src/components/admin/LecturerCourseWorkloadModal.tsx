import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Course, User, CourseInstructor, InstructorRole, Enrollment } from '../../types';
import {
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Users,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface LecturerCourseWorkloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecturer: User | null;
  courses: Course[];
  enrollments: Enrollment[];
  onAssignCourseToLecturer: (courseId: string, lecturerId: string, role?: InstructorRole) => void;
  onRemoveCourseFromLecturer: (courseId: string, lecturerId: string) => void;
  onOpenAssignModalForCourse?: (course: Course) => void;
}

export const LecturerCourseWorkloadModal: React.FC<LecturerCourseWorkloadModalProps> = ({
  isOpen,
  onClose,
  lecturer,
  courses = [],
  enrollments = [],
  onAssignCourseToLecturer,
  onRemoveCourseFromLecturer,
  onOpenAssignModalForCourse,
}) => {
  const [selectedCourseToAdd, setSelectedCourseToAdd] = useState('');
  const [selectedRoleToAdd, setSelectedRoleToAdd] = useState<InstructorRole>('Lead Instructor');

  if (!lecturer) return null;

  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];

  // Find all courses taught by this lecturer
  const assignedCourses = safeCourses.filter((c) => {
    const isPrimary = c.lecturerId === lecturer.id;
    const isInList = c.lecturerIds?.includes(lecturer.id);
    const isInInstructors = c.instructors?.some((i) => i.lecturerId === lecturer.id);
    return isPrimary || isInList || isInInstructors;
  });

  const totalCreditUnits = assignedCourses.reduce((sum, c) => sum + (c.creditUnits || 0), 0);
  const assignedCourseIds = new Set(assignedCourses.map((c) => c.id));
  const totalEnrolledStudents = safeEnrollments.filter((e) =>
    assignedCourseIds.has(e.courseId)
  ).length;

  // Unassigned courses or courses not yet taught by this lecturer
  const availableCoursesToAssign = safeCourses.filter((c) => !assignedCourseIds.has(c.id));

  const getWorkloadPill = (units: number) => {
    if (units === 0) return { label: 'No Active Courses', color: 'bg-amber-50 text-amber-800 border-amber-200' };
    if (units <= 6) return { label: 'Light Load (Under-allocated)', color: 'bg-blue-50 text-blue-800 border-blue-200' };
    if (units <= 14) return { label: 'Optimal Load (Standard)', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    return { label: 'Heavy Load (Over-allocated)', color: 'bg-red-50 text-red-800 border-red-200' };
  };

  const workloadPill = getWorkloadPill(totalCreditUnits);

  const handleAddCourse = () => {
    if (!selectedCourseToAdd) return;
    onAssignCourseToLecturer(selectedCourseToAdd, lecturer.id, selectedRoleToAdd);
    setSelectedCourseToAdd('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        id="modal-lecturer-workload-profile"
        className="max-w-3xl max-h-[90vh] flex flex-col p-6 overflow-hidden"
      >
        <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#064e3b] text-white flex items-center justify-center font-bold text-base shadow-xs">
                {lecturer.name.charAt(0)}
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{lecturer.name}</span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {lecturer.role}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Staff ID: <span className="font-mono text-slate-700 dark:text-slate-300">{lecturer.staffId || 'N/A'}</span> • {lecturer.department || 'Faculty'} • {lecturer.email}
                </DialogDescription>
              </div>
            </div>

            <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${workloadPill.color}`}>
              {workloadPill.label}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Assigned Courses
              </span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1 block">
                {assignedCourses.length}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                Total Credit Units
              </span>
              <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1 block">
                {totalCreditUnits} <span className="text-xs font-normal text-slate-500">CUs</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Enrolled Students
              </span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1 block">
                {totalEnrolledStudents}
              </span>
            </div>
          </div>

          {/* Assigned Courses Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                Teaching Portfolio & Assigned Courses
              </h4>
              <span className="text-[11px] text-slate-400">
                Grades entered will sync with results processing
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-800/80">
                  <TableRow>
                    <TableHead className="w-24 font-bold text-xs">Code</TableHead>
                    <TableHead className="font-bold text-xs">Course Title</TableHead>
                    <TableHead className="text-center font-bold text-xs">Level/Sem</TableHead>
                    <TableHead className="text-center font-bold text-xs">Units</TableHead>
                    <TableHead className="font-bold text-xs">Assigned Role</TableHead>
                    <TableHead className="text-right font-bold text-xs pr-4">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedCourses.map((c) => {
                    const instructorEntry = c.instructors?.find((i) => i.lecturerId === lecturer.id);
                    const role = instructorEntry?.role || (c.lecturerId === lecturer.id ? 'Lead Instructor' : 'Co-Lecturer');
                    const studentCount = enrollments.filter((e) => e.courseId === c.id).length;

                    return (
                      <TableRow key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <TableCell className="font-mono font-bold text-xs text-[#064e3b] dark:text-emerald-400">
                          {c.code}
                        </TableCell>
                        <TableCell>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                            {c.title}
                          </p>
                          <p className="text-[10px] text-slate-500">{c.department} • {studentCount} enrolled</p>
                        </TableCell>
                        <TableCell className="text-center text-xs">
                          {c.level}L • S{c.semester}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-block px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-bold text-xs">
                            {c.creditUnits} CU
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-[10px] py-0.5 ${
                              role === 'Lead Instructor'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {role}
                          </Badge>
                          {instructorEntry?.notes && (
                            <p className="text-[10px] text-slate-400 italic mt-0.5">
                              {instructorEntry.notes}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-4 space-x-1">
                          {onOpenAssignModalForCourse && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                onOpenAssignModalForCourse(c);
                              }}
                              className="h-7 px-2 text-[11px] text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50"
                              title="Manage all instructors for this course"
                            >
                              Team
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveCourseFromLecturer(c.id, lecturer.id)}
                            className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="De-allocate this course from lecturer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {assignedCourses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-xs text-slate-400">
                        No courses currently assigned to {lecturer.name}.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Quick Add Course to this Lecturer */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              Assign New Course to {lecturer.name}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
              <div className="sm:col-span-6">
                <select
                  value={selectedCourseToAdd}
                  onChange={(e) => setSelectedCourseToAdd(e.target.value)}
                  className="w-full h-9 px-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Choose Course ({availableCoursesToAssign.length} available) --</option>
                  {availableCoursesToAssign.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.title} ({c.creditUnits} CU, {c.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4">
                <select
                  value={selectedRoleToAdd}
                  onChange={(e) => setSelectedRoleToAdd(e.target.value as InstructorRole)}
                  className="w-full h-9 px-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Lead Instructor">Lead Instructor</option>
                  <option value="Co-Lecturer">Co-Lecturer</option>
                  <option value="Practical / Lab Instructor">Practical / Lab Instructor</option>
                  <option value="Tutorial Assistant">Tutorial Assistant</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <Button
                  type="button"
                  onClick={handleAddCourse}
                  disabled={!selectedCourseToAdd}
                  className="w-full h-9 text-xs bg-[#059669] hover:bg-emerald-700 text-white font-medium"
                >
                  Assign
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-end">
          <Button type="button" onClick={onClose} className="text-xs bg-[#064e3b] text-white">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
