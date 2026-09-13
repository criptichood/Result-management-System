import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Users, Mail, Phone, MapPin, AlertCircle, ChevronRight, Search, Printer, Download } from 'lucide-react';
import { Course } from '../../types';
import { LecturerAttendanceModal } from './LecturerAttendanceModal';

interface LecturerClassListTabProps {
  selectedCourse: Course | null;
  students: any[];
  settings: {
    lecturerViewEmail: boolean;
    lecturerViewPhone: boolean;
  };
}

export const LecturerClassListTab: React.FC<LecturerClassListTabProps> = ({
  selectedCourse,
  students,
  settings,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  const filteredStudents = students.filter((s) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const nameMatch = s.student?.name?.toLowerCase().includes(q) || false;
    const matricMatch = s.student?.matricNumber?.toLowerCase().includes(q) || false;
    return nameMatch || matricMatch;
  });

  const handleExportRosterCsv = () => {
    if (!selectedCourse) return;
    const headers = ['S/N', 'Matric Number', 'Student Name', 'Department', 'Level', 'Email', 'Phone'];
    const rows = filteredStudents.map((s, idx) => [
      idx + 1,
      `"${s.student?.matricNumber || ''}"`,
      `"${s.student?.name || ''}"`,
      `"${s.student?.department || ''}"`,
      s.student?.level || selectedCourse.level,
      `"${settings.lecturerViewEmail ? s.student?.email || '' : '[Confidential]'}"`,
      `"${settings.lecturerViewPhone ? s.student?.phoneNumber || '' : '[Confidential]'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedCourse.code}_Class_Roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card id="lecturer-class-list-tab" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-xl text-slate-900 dark:text-slate-100">
            Class Roster: {selectedCourse ? selectedCourse.code : 'Select a course'}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            {selectedCourse
              ? `${selectedCourse.title} • ${students.length} Enrolled Candidates`
              : 'View all students registered for this course.'}
          </CardDescription>
        </div>

        {selectedCourse && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportRosterCsv}
              className="text-xs gap-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
            >
              <Download className="w-3.5 h-3.5" /> Export Roster
            </Button>
            <Button
              size="sm"
              onClick={() => setIsAttendanceModalOpen(true)}
              className="text-xs gap-1.5 bg-[#064e3b] dark:bg-emerald-700 hover:bg-[#053d2e] text-white"
            >
              <Printer className="w-3.5 h-3.5" /> Official Attendance Register
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {selectedCourse ? (
          <div>
            {/* Search filter */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="relative max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <Input
                  placeholder="Filter by student name or matric number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead className="w-40">Matric No.</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-center w-20">Level</TableHead>
                  {settings.lecturerViewEmail && <TableHead>Email</TableHead>}
                  {settings.lecturerViewPhone && <TableHead>Phone</TableHead>}
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((s, idx) => (
                  <Dialog key={s.enrollmentId}>
                    <DialogTrigger asChild>
                      <TableRow className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <TableCell className="text-center text-slate-400 text-xs">{idx + 1}</TableCell>
                        <TableCell className="font-mono font-medium text-emerald-700 dark:text-emerald-400">
                          {s.student?.matricNumber}
                        </TableCell>
                        <TableCell className="font-medium text-slate-800 dark:text-slate-200">
                          {s.student?.name}
                        </TableCell>
                        <TableCell className="text-slate-500 dark:text-slate-400 text-xs">
                          {s.student?.department}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-xs text-slate-700 dark:text-slate-300">
                          {s.student?.level || selectedCourse.level}L
                        </TableCell>
                        {settings.lecturerViewEmail && (
                          <TableCell className="text-slate-500 dark:text-slate-400 text-xs">
                            {s.student?.email}
                          </TableCell>
                        )}
                        {settings.lecturerViewPhone && (
                          <TableCell className="text-slate-500 dark:text-slate-400 text-xs font-mono">
                            {s.student?.phoneNumber || '-'}
                          </TableCell>
                        )}
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            aria-label={`View profile for ${s.student?.name}`}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                      <DialogHeader>
                        <DialogTitle className="text-slate-900 dark:text-slate-100">Student Profile</DialogTitle>
                        <DialogDescription className="text-slate-500 dark:text-slate-400 font-mono text-xs">
                          {s.student?.matricNumber}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                          <div className="w-12 h-12 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-xl">
                            {s.student?.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">{s.student?.name}</h3>
                            <p className="text-xs text-[#059669] dark:text-emerald-400 font-medium">
                              {s.student?.department} • {s.student?.level || selectedCourse.level} Level
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3 text-xs">
                          {settings.lecturerViewEmail && (
                            <div className="flex items-center text-slate-700 dark:text-slate-300">
                              <Mail className="w-4 h-4 text-slate-400 mr-3" />
                              <span>{s.student?.email}</span>
                            </div>
                          )}
                          {settings.lecturerViewPhone && (
                            <div className="flex items-center text-slate-700 dark:text-slate-300">
                              <Phone className="w-4 h-4 text-slate-400 mr-3" />
                              <span>{s.student?.phoneNumber || 'Not provided'}</span>
                            </div>
                          )}
                          <div className="flex items-center text-slate-700 dark:text-slate-300">
                            <MapPin className="w-4 h-4 text-slate-400 mr-3" />
                            <span>{s.student?.address || 'Campus Residence'}</span>
                          </div>
                          <div className="flex items-center pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                            <AlertCircle className="w-4 h-4 text-amber-500 mr-3" />
                            <span className="text-slate-700 dark:text-slate-300 flex-1">
                              <span className="font-semibold block text-slate-900 dark:text-slate-100">
                                Emergency Contact
                              </span>
                              {s.student?.emergencyContact || 'Campus Security / Dean of Student Affairs'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-slate-500 py-10 text-xs">
                      No registered students found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <LecturerAttendanceModal
              isOpen={isAttendanceModalOpen}
              onClose={() => setIsAttendanceModalOpen(false)}
              selectedCourse={selectedCourse}
              students={students}
            />
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500">
            <Users className="h-10 w-10 mb-2 opacity-20" />
            <p>Select a course to view its class list and register.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
