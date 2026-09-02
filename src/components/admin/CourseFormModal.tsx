import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Course } from '../../types';

interface CourseFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCourse: Course | null;
  formData: {
    code: string;
    title: string;
    creditUnits: number;
    department: string;
    college: string;
    level: number;
    semester: 1 | 2;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    code: string;
    title: string;
    creditUnits: number;
    department: string;
    college: string;
    level: number;
    semester: 1 | 2;
  }>>;
  onSave: (e: React.FormEvent) => void;
}

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
  isOpen,
  onOpenChange,
  editingCourse,
  formData,
  setFormData,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingCourse ? 'Edit Course Details' : 'Add New Course to Curriculum'}</DialogTitle>
          <DialogDescription>
            {editingCourse ? 'Modify course parameters and unit allocation.' : 'Create a new course for student registration and departmental grading.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSave} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Course Code</label>
              <Input 
                placeholder="e.g. CSC 123" 
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Credit Units</label>
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
            <label className="text-xs font-bold text-slate-700 uppercase">Course Title</label>
            <Input 
              placeholder="e.g. ICT and Digital Skills Acquisition" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Department</label>
              <select 
                className="w-full h-10 px-3 mt-1 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemical Sciences">Chemical Sciences</option>
                <option value="General Studies">General Studies</option>
                <option value="Crop Science">Crop Science</option>
                <option value="Animal Science">Animal Science</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">College</label>
              <select 
                className="w-full h-10 px-3 mt-1 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              >
                <option value="Science">Science</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Veterinary Medicine">Veterinary Medicine</option>
                <option value="Engineering">Engineering</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Level</label>
              <select 
                className="w-full h-10 px-3 mt-1 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              <label className="text-xs font-bold text-slate-700 uppercase">Semester</label>
              <select 
                className="w-full h-10 px-3 mt-1 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) as 1 | 2 })}
              >
                <option value={1}>1st Semester</option>
                <option value={2}>2nd Semester</option>
              </select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#059669] hover:bg-emerald-700 text-white">
              {editingCourse ? 'Save Changes' : 'Create Course'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
