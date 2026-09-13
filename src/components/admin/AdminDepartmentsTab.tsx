import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Building2, BookOpen, Plus, Search, Layers, ChevronRight } from 'lucide-react';
import { Course, Department } from '../../types';

interface AdminDepartmentsTabProps {
  courses: Course[];
  users: any[];
  departments: Department[];
  onOpenAddDepartment: () => void;
}

export const AdminDepartmentsTab: React.FC<AdminDepartmentsTabProps> = ({
  courses,
  users: _users,
  departments,
  onOpenAddDepartment,
}) => {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDepts = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.college.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeDepartmentCourses = selectedDept 
    ? courses.filter(c => c.department.toLowerCase() === selectedDept.toLowerCase() || c.code.toUpperCase().startsWith(selectedDept.toUpperCase()))
    : [];

  return (
    <div id="admin-departments-tab" className="space-y-6">
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" /> Departmental Management & Curriculum Mapping
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Manage academic departments, inspect departmental course pools linked from central course management, and register new departments.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative min-w-[200px] sm:min-w-[240px]">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <Input
                id="input-search-departments"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-xs bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
            <Button
              id="btn-add-department"
              onClick={onOpenAddDepartment}
              className="bg-[#059669] hover:bg-emerald-700 text-white text-xs gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add Department
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDepts.map((dept) => {
              const deptCourses = courses.filter(
                c => c.department.toLowerCase() === dept.name.toLowerCase() || c.code.toUpperCase().startsWith(dept.code.toUpperCase())
              );
              const totalUnits = deptCourses.reduce((acc, c) => acc + c.creditUnits, 0);
              const isSelected = selectedDept === dept.name;

              return (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDept(isSelected ? null : dept.name)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                    isSelected
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="success" className="font-mono">{dept.code}</Badge>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{dept.college}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{dept.name}</h3>
                    {dept.HOD && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        HOD: <strong className="text-slate-700 dark:text-slate-300">{dept.HOD}</strong>
                      </p>
                    )}
                    {dept.description && (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2">
                        {dept.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1 font-semibold">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> {deptCourses.length} Courses
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Layers className="w-3.5 h-3.5 text-teal-600" /> {totalUnits} Units
                      </span>
                    </div>
                    <span className={`font-bold flex items-center gap-1 ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'}`}>
                      {isSelected ? 'Viewing' : 'Inspect'} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
            {filteredDepts.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400 text-sm">
                No departments found matching "{searchTerm}". Click "Add Department" above to create one.
              </div>
            )}
          </div>

          {/* Selected Department Curriculum & Course Pool Breakdown */}
          {selectedDept && (
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" /> {selectedDept} Departmental Course Pool
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Courses dynamically linked from central course management for {selectedDept}.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDept(null)}
                  className="text-xs"
                >
                  Close Department View
                </Button>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Code</TableHead>
                      <TableHead>Course Title</TableHead>
                      <TableHead className="text-center">Credit Units</TableHead>
                      <TableHead className="text-center">Level</TableHead>
                      <TableHead className="text-center">Semester</TableHead>
                      <TableHead className="text-right">Offering Department</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeDepartmentCourses.length > 0 ? (
                      activeDepartmentCourses.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{c.code}</TableCell>
                          <TableCell className="font-medium text-slate-900 dark:text-white">{c.title}</TableCell>
                          <TableCell className="text-center font-bold">{c.creditUnits}</TableCell>
                          <TableCell className="text-center"><Badge variant="outline">{c.level}L</Badge></TableCell>
                          <TableCell className="text-center">
                            <Badge variant={c.semester === 1 ? 'secondary' : 'default'}>
                              {c.semester === 1 ? '1st Sem' : '2nd Sem'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs font-semibold text-slate-600 dark:text-slate-300">{c.department}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                          No courses currently mapped to {selectedDept}. Add courses in Course Management or use "Add from Pre-existing" targeting "{selectedDept}".
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
