import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Building2 } from 'lucide-react';

interface DepartmentFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (departmentData: {
    name: string;
    code: string;
    college: string;
    HOD: string;
    description: string;
  }) => void;
}

export const DepartmentFormModal: React.FC<DepartmentFormModalProps> = ({
  isOpen,
  onOpenChange,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    college: 'Science',
    HOD: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;
    onSave(formData);
    setFormData({
      name: '',
      code: '',
      college: 'Science',
      HOD: '',
      description: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Building2 className="w-5 h-5 text-emerald-600" /> Add New Academic Department
          </DialogTitle>
          <DialogDescription>
            Register a new university department to manage courses, faculties, and student enrollment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Department Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="input-dept-name"
              placeholder="e.g. Electrical and Electronics Engineering"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Department Code <span className="text-red-500">*</span>
              </label>
              <Input
                id="input-dept-code"
                placeholder="e.g. EEE"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="mt-1 font-mono uppercase"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                College / Faculty
              </label>
              <select
                id="select-dept-college"
                className="w-full h-10 px-3 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              >
                <option value="Science">Science</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Veterinary Medicine">Veterinary Medicine</option>
                <option value="Engineering">Engineering</option>
                <option value="Computing & Information Technology">Computing & IT</option>
                <option value="Environmental Sciences">Environmental Sciences</option>
                <option value="Management & Social Sciences">Management & Social Sciences</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Head of Department (H.O.D.)
            </label>
            <Input
              id="input-dept-hod"
              placeholder="e.g. Dr. Aliyu Tanko"
              value={formData.HOD}
              onChange={(e) => setFormData({ ...formData, HOD: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Description / Notes
            </label>
            <Input
              id="input-dept-desc"
              placeholder="e.g. Department of Electrical and Electronic Systems"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button id="btn-submit-new-department" type="submit" className="bg-[#059669] hover:bg-emerald-700 text-white">
              Create Department
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
