import React, { useState, useMemo } from 'react';
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
import { Course, Department, User, CourseInstructor } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  SlidersHorizontal,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

interface AutoAssignPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses?: Course[];
  departments?: Department[];
  lecturers?: User[];
  workloads?: {
    lecturer: User;
    assignedCourses: Course[];
    totalCreditUnits: number;
    totalStudentsEnrolled: number;
  }[];
  onConfirmAutoAssign?: (
    allocations: {
      courseId: string;
      lecturerId?: string;
      instructors?: CourseInstructor[];
    }[]
  ) => void;
  onConfirmBatchAllocate?: (
    allocations: {
      courseId: string;
      lecturerId?: string;
      instructors?: CourseInstructor[];
    }[]
  ) => void;
}

export const AutoAssignPreviewModal: React.FC<AutoAssignPreviewModalProps> = ({
  isOpen,
  onClose,
  courses = [],
  departments = [],
  lecturers = [],
  workloads = [],
  onConfirmAutoAssign,
  onConfirmBatchAllocate,
}) => {
  const [maxUnitsPerLecturer, setMaxUnitsPerLecturer] = useState<number>(14);
  const [assignCoLecturerForHighUnits, setAssignCoLecturerForHighUnits] = useState<boolean>(true);

  // Compute unassigned courses
  const unassignedCourses = useMemo(() => {
    return (courses || []).filter((c) => {
      const hasInstructors = c.instructors && c.instructors.length > 0;
      const hasLecturerIds = c.lecturerIds && c.lecturerIds.length > 0;
      const hasPrimary = !!c.lecturerId;
      return !hasInstructors && !hasLecturerIds && !hasPrimary;
    });
  }, [courses]);

  // Compute proposed auto-allocations using intelligent heuristic
  const proposedAllocations = useMemo(() => {
    // Map existing simulated workloads so we can track load increase
    const simulatedWorkloadMap = new Map<string, number>();
    const safeWorkloads = Array.isArray(workloads) ? workloads : [];
    const safeLecturers = Array.isArray(lecturers) ? lecturers : [];

    safeWorkloads.forEach((w) => {
      if (w?.lecturer?.id) {
        simulatedWorkloadMap.set(w.lecturer.id, w.totalCreditUnits || 0);
      }
    });

    // Ensure all lecturers exist in simulated map
    safeLecturers.forEach((l) => {
      if (l?.id && !simulatedWorkloadMap.has(l.id)) {
        simulatedWorkloadMap.set(l.id, 0);
      }
    });

    // Map lecturers by department
    const deptsMap = new Map<string, User[]>();
    safeLecturers.forEach((l) => {
      const dept = l.department || 'Faculty';
      if (!deptsMap.has(dept)) deptsMap.set(dept, []);
      deptsMap.get(dept)!.push(l);
    });

    const results: {
      course: Course;
      leadLecturer: User;
      coLecturer?: User;
      instructors: CourseInstructor[];
      initialLoad: number;
      projectedLoad: number;
    }[] = [];

    unassignedCourses.forEach((course) => {
      // 1. Prioritize faculty from the exact same academic department
      let deptStaff = deptsMap.get(course.department) || [];
      if (deptStaff.length === 0) {
        // Fallback to all available lecturers
        deptStaff = safeLecturers;
      }

      if (deptStaff.length === 0) return;

      // 2. Select lecturer with lowest current simulated credit units
      const sortedStaff = [...deptStaff].sort((a, b) => {
        const loadA = simulatedWorkloadMap.get(a.id) || 0;
        const loadB = simulatedWorkloadMap.get(b.id) || 0;
        return loadA - loadB;
      });

      const chosenLead = sortedStaff[0];
      const initialLoad = simulatedWorkloadMap.get(chosenLead.id) || 0;
      const newLoad = initialLoad + (course.creditUnits || 0);
      simulatedWorkloadMap.set(chosenLead.id, newLoad);

      const instructorsList: CourseInstructor[] = [
        {
          lecturerId: chosenLead.id,
          role: 'Lead Instructor',
          notes: 'Auto-assigned primary lecturer',
          assignedAt: new Date().toISOString(),
        },
      ];

      // 3. Optional co-lecturer if course is heavy (>= 3 credit units) and department has multiple staff
      let chosenCo: User | undefined = undefined;
      if (assignCoLecturerForHighUnits && (course.creditUnits || 0) >= 3 && sortedStaff.length > 1) {
        chosenCo = sortedStaff[1];
        const coInitial = simulatedWorkloadMap.get(chosenCo.id) || 0;
        simulatedWorkloadMap.set(chosenCo.id, coInitial + Math.floor((course.creditUnits || 0) / 2));
        instructorsList.push({
          lecturerId: chosenCo.id,
          role: 'Co-Lecturer',
          notes: 'Assigned co-instructor for practicals/tutorials',
          assignedAt: new Date().toISOString(),
        });
      }

      results.push({
        course,
        leadLecturer: chosenLead,
        coLecturer: chosenCo,
        instructors: instructorsList,
        initialLoad,
        projectedLoad: newLoad,
      });
    });

    return results;
  }, [unassignedCourses, workloads, lecturers, assignCoLecturerForHighUnits]);

  const handleApply = () => {
    const payload = proposedAllocations.map((p) => ({
      courseId: p.course.id,
      lecturerId: p.leadLecturer.id,
      instructors: p.instructors,
    }));
    if (onConfirmAutoAssign) {
      onConfirmAutoAssign(payload);
    } else if (onConfirmBatchAllocate) {
      onConfirmBatchAllocate(payload);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        id="modal-auto-assign-preview"
        className="max-w-3xl max-h-[88vh] flex flex-col p-6 overflow-hidden"
      >
        <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Intelligent Course Allocation Engine
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Automatically matches unallocated courses to qualified departmental faculty while balancing teaching load.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Algorithm Strategy Banner & Controls */}
        <div className="p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs space-y-2.5 my-3">
          <div className="flex items-center justify-between font-semibold text-emerald-950 dark:text-emerald-300">
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              Allocation Strategy Settings
            </span>
            <Badge variant="outline" className="bg-white/80 dark:bg-slate-900 text-emerald-800 text-[10px]">
              {unassignedCourses.length} Unallocated Courses
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={assignCoLecturerForHighUnits}
                onChange={(e) => setAssignCoLecturerForHighUnits(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-700 dark:text-slate-300">
                Pair Co-Lecturers for 3+ credit courses (Theory + Practicals)
              </span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-600 dark:text-slate-400">Target Max Workload:</span>
              <select
                value={maxUnitsPerLecturer}
                onChange={(e) => setMaxUnitsPerLecturer(Number(e.target.value))}
                className="h-7 px-2 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold"
              >
                <option value={12}>12 Credit Units (Standard)</option>
                <option value={14}>14 Credit Units (Full Load)</option>
                <option value={18}>18 Credit Units (Extended)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Proposed Allocations Preview Table */}
        <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/80 sticky top-0">
              <TableRow>
                <TableHead className="w-24 font-bold text-xs">Course</TableHead>
                <TableHead className="font-bold text-xs">Title & Department</TableHead>
                <TableHead className="text-center font-bold text-xs">Units</TableHead>
                <TableHead className="font-bold text-xs">Proposed Instructor(s)</TableHead>
                <TableHead className="text-center font-bold text-xs">Workload Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposedAllocations.map((item) => (
                <TableRow key={item.course.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <TableCell className="font-mono font-bold text-xs text-[#064e3b] dark:text-emerald-400">
                    {item.course.code}
                  </TableCell>
                  <TableCell>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      {item.course.title}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.course.department}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-block px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-bold text-[11px]">
                      {item.course.creditUnits} CU
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {item.leadLecturer.name}
                        </span>
                        <Badge className="bg-emerald-600 text-white text-[9px] py-0 px-1">Lead</Badge>
                      </div>
                      {item.coLecturer && (
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                          <span className="text-[11px]">{item.coLecturer.name}</span>
                          <Badge variant="outline" className="text-[9px] py-0 px-1 text-slate-500">
                            Co-Lecturer
                          </Badge>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      <span>{item.initialLoad} CU</span>
                      <ArrowRight className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        {item.projectedLoad} CU
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {proposedAllocations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-xs text-slate-500">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                    All curriculum courses are already allocated to lecturers!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-row items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {proposedAllocations.length} course(s) will be allocated across departmental staff.
          </span>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              disabled={proposedAllocations.length === 0}
              className="text-xs bg-[#064e3b] hover:bg-[#065f46] text-white gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" /> Confirm & Apply Allocations
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
