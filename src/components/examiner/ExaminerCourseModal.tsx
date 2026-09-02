import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Course, User } from '../../types';
import { BookOpen, UserCheck, Layers, Calendar } from 'lucide-react';

interface ExaminerCourseModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
  lecturers: User[];
  department: string;
  onSave: (courseData: Partial<Course>) => void;
}

export const ExaminerCourseModal: React.FC<ExaminerCourseModalProps> = ({
  isOpen,
  onOpenChange,
  course,
  lecturers,
  department,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    creditUnits: 2,
    department: department || 'Computer Science',
    college: 'Science',
    level: 100,
    semester: 1 as 1 | 2,
    lecturerId: '',
  });

  useEffect(() => {
    if (course) {
      setFormData({
        code: course.code,
        title: course.title,
        creditUnits: course.creditUnits,
        department: course.department,
        college: course.college,
        level: course.level,
        semester: course.semester,
        lecturerId: course.lecturerId || '',
      });
    } else {
      setFormData({
        code: '',
        title: '',
        creditUnits: 2,
        department: department || 'Computer Science',
        college: 'Science',
        level: 100,
        semester: 1,
        lecturerId: '',
      });
    }
  }, [course, department, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(course ? { id: course.id } : {}),
      code: formData.code.trim(),
      title: formData.title.trim(),
      creditUnits: Number(formData.creditUnits),
      department: formData.department,
      college: formData.college,
      level: Number(formData.level),
      semester: Number(formData.semester) as 1 | 2,
      lecturerId: formData.lecturerId || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs tracking-wider uppercase mb-1">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            {course ? 'Curriculum Modification' : 'New Course Registration'}
          </div>
          <DialogTitle className="text-xl text-slate-900">
            {course ? `Edit ${course.code}: ${course.title}` : 'Add Department / Borrowed Course'}
          </DialogTitle>
          <DialogDescription>
            {course 
              ? 'Update the course code, title, credit units, and assign the course lecturer.'
              : 'Add a new core departmental course or borrowed service course to the academic curriculum.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Course Code</label>
              <Input
                placeholder="e.g. CSC 111, MTH 111"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="mt-1 font-mono uppercase"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Credit Units</label>
              <Input
                type="number"
                min="1"
                max="6"
                value={formData.creditUnits}
                onChange={(e) => setFormData({ ...formData, creditUnits: parseInt(e.target.value) || 1 })}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Course Title</label>
            <Input
              placeholder="e.g. Introduction to Computer Science"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          {/* Assigned Lecturer Dropdown */}
          <div className="bg-emerald-50/60 border border-emerald-200/70 p-3.5 rounded-xl space-y-1.5">
            <label className="text-xs font-bold text-[#064e3b] uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#059669]" /> Assigned Course Lecturer / Instructor
            </label>
            <p className="text-xs text-slate-500">
              Select the lecturer responsible for teaching, continuous assessment, and exam grading.
            </p>
            <select
              className="w-full h-10 px-3 mt-1 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-2xs"
              value={formData.lecturerId}
              onChange={(e) => setFormData({ ...formData, lecturerId: e.target.value })}
            >
              <option value="">-- Unassigned / Department Head Allocation --</option>
              {lecturers.map((lec) => (
                <option key={lec.id} value={lec.id}>
                  {lec.name} {lec.staffId ? `(${lec.staffId})` : ''} - {lec.department || 'Staff'}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Offering Department</label>
              <select
                className="w-full h-10 px-3 mt-1 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Computer Science">Computer Science (Core)</option>
                <option value="Mathematics">Mathematics (Service)</option>
                <option value="Physics">Physics (Service)</option>
                <option value="Chemical Sciences">Chemical Sciences (Service)</option>
                <option value="General Studies">General Studies (GST)</option>
                <option value="Crop Science">Crop Science</option>
                <option value="Animal Science">Animal Science</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Host College</label>
              <select
                className="w-full h-10 px-3 mt-1 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              >
                <option value="Science">College of Science</option>
                <option value="Agriculture">College of Agriculture</option>
                <option value="Veterinary Medicine">College of Veterinary Medicine</option>
                <option value="Engineering">College of Engineering</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" /> Academic Level
              </label>
              <select
                className="w-full h-10 px-3 mt-1 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
              >
                <option value={100}>100 Level</option>
                <option value={200}>200 Level</option>
                <option value={300}>300 Level</option>
                <option value={400}>400 Level</option>
                <option value={500}>500 Level</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Semester
              </label>
              <select
                className="w-full h-10 px-3 mt-1 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) as 1 | 2 })}
              >
                <option value={1}>1st Semester</option>
                <option value={2}>2nd Semester</option>
              </select>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#064e3b] hover:bg-[#065f46] text-white">
              {course ? 'Save Course Changes' : 'Register Course'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
