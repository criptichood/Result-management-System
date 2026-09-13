import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Course, User, CourseInstructor, InstructorRole } from '../../types';
import {
  Users,
  UserPlus,
  Trash2,
  CheckCircle2,
  Search,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Star,
} from 'lucide-react';

interface CourseLecturerAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  lecturers: User[];
  onSaveInstructors: (courseId: string, instructors: CourseInstructor[]) => void;
}

const AVAILABLE_ROLES: InstructorRole[] = [
  'Lead Instructor',
  'Co-Lecturer',
  'Practical / Lab Instructor',
  'Tutorial Assistant',
];

export const CourseLecturerAssignmentModal: React.FC<CourseLecturerAssignmentModalProps> = ({
  isOpen,
  onClose,
  course,
  lecturers = [],
  onSaveInstructors,
}) => {
  const [assignedList, setAssignedList] = useState<CourseInstructor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [selectedLecToAdd, setSelectedLecToAdd] = useState<string>('');
  const [selectedRoleToAdd, setSelectedRoleToAdd] = useState<InstructorRole>('Co-Lecturer');
  const [notesToAdd, setNotesToAdd] = useState('');

  // Sync state when modal opens or course changes
  useEffect(() => {
    if (course) {
      if (course.instructors && course.instructors.length > 0) {
        setAssignedList([...course.instructors]);
      } else if (course.lecturerId) {
        setAssignedList([
          {
            lecturerId: course.lecturerId,
            role: 'Lead Instructor',
            assignedAt: new Date().toISOString(),
          },
        ]);
      } else if (course.lecturerIds && course.lecturerIds.length > 0) {
        setAssignedList(
          course.lecturerIds.map((id, index) => ({
            lecturerId: id,
            role: index === 0 ? 'Lead Instructor' : 'Co-Lecturer',
            assignedAt: new Date().toISOString(),
          }))
        );
      } else {
        setAssignedList([]);
      }
      setSearchTerm('');
      setSelectedDeptFilter('all');
      setSelectedLecToAdd('');
      setSelectedRoleToAdd('Co-Lecturer');
      setNotesToAdd('');
    }
  }, [course, isOpen]);

  if (!course) return null;

  const safeLecturers = Array.isArray(lecturers) ? lecturers : [];

  // Filter available lecturers to add
  const assignedIds = new Set(assignedList.map((a) => a.lecturerId));
  const availableLecturers = safeLecturers.filter((l) => {
    if (assignedIds.has(l.id)) return false;
    if (selectedDeptFilter !== 'all' && l.department !== selectedDeptFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = l.name.toLowerCase().includes(q);
      const matchStaff = (l.staffId || '').toLowerCase().includes(q);
      const matchDept = (l.department || '').toLowerCase().includes(q);
      return matchName || matchStaff || matchDept;
    }
    return true;
  });

  // Extract unique departments of lecturers
  const lecturerDepts = Array.from(
    new Set(safeLecturers.map((l) => l.department).filter(Boolean) as string[])
  );

  const handleAddInstructor = () => {
    if (!selectedLecToAdd) return;
    const newInstructor: CourseInstructor = {
      lecturerId: selectedLecToAdd,
      role: selectedRoleToAdd,
      notes: notesToAdd.trim() || undefined,
      assignedAt: new Date().toISOString(),
    };

    // If this is the first instructor, make it Lead Instructor by default
    if (assignedList.length === 0) {
      newInstructor.role = 'Lead Instructor';
    }

    setAssignedList((prev) => [...prev, newInstructor]);
    setSelectedLecToAdd('');
    setNotesToAdd('');
    setSelectedRoleToAdd('Co-Lecturer');
  };

  const handleRemoveInstructor = (lecturerId: string) => {
    setAssignedList((prev) => prev.filter((item) => item.lecturerId !== lecturerId));
  };

  const handleRoleChange = (lecturerId: string, newRole: InstructorRole) => {
    setAssignedList((prev) =>
      prev.map((item) => (item.lecturerId === lecturerId ? { ...item, role: newRole } : item))
    );
  };

  const handleNotesChange = (lecturerId: string, notes: string) => {
    setAssignedList((prev) =>
      prev.map((item) => (item.lecturerId === lecturerId ? { ...item, notes } : item))
    );
  };

  const handleSetAsLead = (lecturerId: string) => {
    setAssignedList((prev) =>
      prev.map((item) => {
        if (item.lecturerId === lecturerId) {
          return { ...item, role: 'Lead Instructor' };
        }
        if (item.role === 'Lead Instructor') {
          return { ...item, role: 'Co-Lecturer' };
        }
        return item;
      })
    );
  };

  const handleSave = () => {
    onSaveInstructors(course.id, assignedList);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        id="modal-assign-course-instructors"
        className="max-w-2xl max-h-[90vh] flex flex-col p-6 overflow-hidden"
      >
        <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-lg">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{course.code}: {course.title}</span>
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {course.department} • {course.creditUnits} Credit Units • Level {course.level}L • Sem {course.semester}
                </DialogDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              {assignedList.length} Assigned {assignedList.length === 1 ? 'Lecturer' : 'Lecturers'}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* Currently Assigned Lecturers List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                Assigned Course Instructors
              </h4>
              <span className="text-[11px] text-slate-400">
                Multiple lecturers can share grading & course delivery
              </span>
            </div>

            {assignedList.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 text-center">
                <Users className="w-8 h-8 text-slate-400 mx-auto mb-1.5 opacity-50" />
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  No lecturers currently assigned to this course.
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Use the form below to search and assign primary and co-lecturers.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {assignedList.map((assigned, idx) => {
                  const lec = lecturers.find((l) => l.id === assigned.lecturerId);
                  const isLead = assigned.role === 'Lead Instructor';

                  return (
                    <div
                      key={assigned.lecturerId}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isLead
                          ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              isLead
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {lec?.name.charAt(0) || 'L'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-slate-900 dark:text-white">
                                {lec?.name || 'Unknown Lecturer'}
                              </p>
                              {isLead && (
                                <Badge className="bg-emerald-600 text-white text-[10px] py-0 px-1.5 flex items-center gap-1">
                                  <Star className="w-2.5 h-2.5 fill-current" /> Lead
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {lec?.staffId || 'Staff'} • {lec?.department || 'Faculty'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={assigned.role}
                            onChange={(e) =>
                              handleRoleChange(assigned.lecturerId, e.target.value as InstructorRole)
                            }
                            className="h-8 px-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                          >
                            {AVAILABLE_ROLES.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>

                          {!isLead && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSetAsLead(assigned.lecturerId)}
                              className="h-8 text-[11px] px-2 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50"
                              title="Set as Lead Instructor"
                            >
                              Make Lead
                            </Button>
                          )}

                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveInstructor(assigned.lecturerId)}
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                            title="Remove Lecturer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Instructor Responsibilities Notes */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <Input
                          placeholder="Role scope or notes (e.g., Theory first 6 weeks, Practicals coordinator)..."
                          value={assigned.notes || ''}
                          onChange={(e) =>
                            handleNotesChange(assigned.lecturerId, e.target.value)
                          }
                          className="h-7 text-xs bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add New Lecturer Section */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
              Add Lecturer to this Course
            </h4>

            {/* Filter toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <Input
                  placeholder="Filter lecturers by name or staff ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-8 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>

              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="h-8 px-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
              >
                <option value="all">All Academic Departments</option>
                {lecturerDepts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Lecturer Picker and Role */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
              <div className="sm:col-span-6">
                <select
                  value={selectedLecToAdd}
                  onChange={(e) => setSelectedLecToAdd(e.target.value)}
                  className="w-full h-9 px-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Choose Lecturer to Add ({availableLecturers.length} available) --</option>
                  {availableLecturers.map((lec) => (
                    <option key={lec.id} value={lec.id}>
                      {lec.name} ({lec.department || 'Faculty'})
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
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <Button
                  type="button"
                  onClick={handleAddInstructor}
                  disabled={!selectedLecToAdd}
                  className="w-full h-9 text-xs bg-[#059669] hover:bg-emerald-700 text-white font-medium"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-row items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {assignedList.length === 0
              ? 'Course will remain unassigned'
              : `${assignedList.length} lecturer(s) will have grading access`}
          </span>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="text-xs bg-[#064e3b] hover:bg-[#065f46] text-white"
            >
              Save Course Allocations
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
