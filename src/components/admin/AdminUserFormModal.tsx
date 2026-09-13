import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { User, Role, Department } from '../../types';
import { UserPlus, UserCheck } from 'lucide-react';

interface AdminUserFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: User | null;
  departments: Department[];
  onSave: (userData: Partial<User>) => void;
}

export const AdminUserFormModal: React.FC<AdminUserFormModalProps> = ({
  isOpen,
  onOpenChange,
  editingUser,
  departments,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Student' as Role,
    department: 'Computer Science',
    college: 'Science',
    matricNumber: '',
    staffId: '',
    level: 100,
    phoneNumber: '',
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || '',
        email: editingUser.email || '',
        role: editingUser.role || 'Student',
        department: editingUser.department || 'Computer Science',
        college: editingUser.college || 'Science',
        matricNumber: editingUser.matricNumber || '',
        staffId: editingUser.staffId || '',
        level: editingUser.level || 100,
        phoneNumber: editingUser.phoneNumber || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'Student',
        department: departments[0]?.name || 'Computer Science',
        college: departments[0]?.college || 'Science',
        matricNumber: `UG/${new Date().getFullYear()}/02/03/${Math.floor(100 + Math.random() * 900)}`,
        staffId: `STF${Math.floor(100 + Math.random() * 900)}`,
        level: 100,
        phoneNumber: '',
      });
    }
  }, [editingUser, isOpen, departments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      return;
    }

    const payload: Partial<User> = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      department: formData.department,
      college: formData.college,
      phoneNumber: formData.phoneNumber.trim() || undefined,
    };

    if (formData.role === 'Student') {
      payload.matricNumber = formData.matricNumber.trim();
      payload.level = Number(formData.level);
    } else {
      payload.staffId = formData.staffId.trim();
    }

    onSave(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
              {editingUser ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <div>
              <DialogTitle className="text-base text-slate-900 dark:text-slate-100">
                {editingUser ? 'Edit User Record' : 'Register New University User'}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                Configure identity credentials, role permissions, and academic department
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-2 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Full Name *
            </label>
            <Input
              required
              placeholder="e.g. Dr. Amina Yusuf or Jeremiah Dantani"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-8 text-xs bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Institutional Email *
              </label>
              <Input
                required
                type="email"
                placeholder="user@fuaz.edu.ng"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-8 text-xs bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                System Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                className="w-full h-8 px-2.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Student">Student</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Chief Examiner">Chief Examiner</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => {
                  const dept = departments.find((d) => d.name === e.target.value);
                  setFormData({
                    ...formData,
                    department: e.target.value,
                    college: dept ? dept.college : formData.college,
                  });
                }}
                className="w-full h-8 px-2.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Phone Number
              </label>
              <Input
                placeholder="+234 800 000 0000"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="h-8 text-xs bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          {formData.role === 'Student' ? (
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Matric Number *
                </label>
                <Input
                  required
                  placeholder="UG/2024/02/03/001"
                  value={formData.matricNumber}
                  onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value })}
                  className="h-8 text-xs font-mono bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Academic Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                  className="w-full h-8 px-2.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value={100}>100 Level</option>
                  <option value={200}>200 Level</option>
                  <option value={300}>300 Level</option>
                  <option value={400}>400 Level</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Staff ID *
              </label>
              <Input
                required
                placeholder="LEC001 or ADM001"
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                className="h-8 text-xs font-mono bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
            </div>
          )}

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-xs text-slate-600 dark:text-slate-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-xs bg-[#059669] hover:bg-emerald-700 text-white gap-1"
            >
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
