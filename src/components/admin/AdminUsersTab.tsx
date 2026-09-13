import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { User, Role, Course } from '../../types';
import {
  UserPlus,
  Search,
  LogIn,
  Edit2,
  Trash2,
  Users,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

interface AdminUsersTabProps {
  users: User[];
  courses?: Course[];
  onOpenAddUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onImpersonate: (user: User) => void;
  onViewLecturerWorkload?: (user: User) => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  courses = [],
  onOpenAddUser,
  onEditUser,
  onDeleteUser,
  onImpersonate,
  onViewLecturerWorkload,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'All' && u.role !== roleFilter) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const nameMatch = u.name?.toLowerCase().includes(q);
      const emailMatch = u.email?.toLowerCase().includes(q);
      const matricMatch = u.matricNumber?.toLowerCase().includes(q);
      const staffMatch = u.staffId?.toLowerCase().includes(q);
      const deptMatch = u.department?.toLowerCase().includes(q);
      return nameMatch || emailMatch || matricMatch || staffMatch || deptMatch;
    }
    return true;
  });

  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case 'Admin': return 'destructive';
      case 'Chief Examiner': return 'default';
      case 'Lecturer': return 'warning';
      case 'Student': return 'outline';
      default: return 'outline';
    }
  };

  // Helper to compute assigned courses for a user
  const getAssignedCourses = (user: User) => {
    return courses.filter((c) => {
      const isPrimary = c.lecturerId === user.id;
      const isInList = c.lecturerIds?.includes(user.id);
      const isInInstructors = c.instructors?.some((i) => i.lecturerId === user.id);
      return isPrimary || isInList || isInInstructors;
    });
  };

  return (
    <Card id="admin-users-tab" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-xl text-slate-900 dark:text-slate-100">User Management Directory</CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Create, audit, modify, view teaching portfolios, and test role-based accounts across the institution
          </CardDescription>
        </div>
        <Button
          id="btn-admin-add-user"
          onClick={onOpenAddUser}
          className="bg-[#059669] hover:bg-emerald-700 text-white gap-1.5 text-xs shadow-xs self-start md:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" /> Add New User
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {/* Search & Filter bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <Input
              placeholder="Search by name, email, matric or staff ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            />
          </div>

          {/* Role Filter Pills */}
          <div className="flex flex-wrap items-center gap-1">
            {['All', 'Student', 'Lecturer', 'Chief Examiner', 'Admin'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  roleFilter === role
                    ? 'bg-[#064e3b] text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {role === 'All' ? 'All Roles' : role}
              </button>
            ))}
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                <TableHead>User Full Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department / Faculty</TableHead>
                <TableHead>Academic Load / Identifier</TableHead>
                <TableHead>Contact Email</TableHead>
                <TableHead className="text-right pr-6">Account & Teaching Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => {
                const isTeachingStaff = u.role === 'Lecturer' || u.role === 'Chief Examiner';
                const assignedCourses = isTeachingStaff ? getAssignedCourses(u) : [];
                const totalCUs = assignedCourses.reduce((sum, c) => sum + (c.creditUnits || 0), 0);

                return (
                  <TableRow key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-tight">{u.name}</p>
                          {u.level ? (
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                              {u.level} Level
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">
                              {u.staffId || 'Staff'}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(u.role)} className="text-[11px] font-semibold">
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                      {u.department || 'Institutional'}
                    </TableCell>
                    <TableCell className="text-xs">
                      {isTeachingStaff ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {assignedCourses.length} course{assignedCourses.length === 1 ? '' : 's'}
                            </span>
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                              ({totalCUs} CU)
                            </span>
                          </div>
                          {assignedCourses.length > 0 && (
                            <p className="text-[10px] text-slate-400 truncate max-w-[160px]">
                              {assignedCourses.map(c => c.code).join(', ')}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="font-mono text-xs text-slate-800 dark:text-slate-200">
                          {u.matricNumber || '—'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 dark:text-slate-400">
                      {u.email}
                    </TableCell>
                    <TableCell className="text-right pr-6 space-x-1.5">
                      {isTeachingStaff && onViewLecturerWorkload && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewLecturerWorkload(u)}
                          className="h-7 px-2 text-[11px] gap-1 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
                          title="View and manage courses assigned to this lecturer"
                        >
                          <BookOpen className="w-3 h-3 text-emerald-600" /> Teaching Load
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onImpersonate(u)}
                        className="h-7 px-2 text-[11px] gap-1 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                        title="Switch login session to this user"
                      >
                        <LogIn className="w-3 h-3" /> Sign In
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditUser(u)}
                        className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                        title="Edit user"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteUser(u.id)}
                        className="h-7 w-7 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                        title="Delete user"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-12 text-xs">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No university users matched your search and filter parameters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
