import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Course } from '../../types';
import { Printer, Download, X, Users, Calendar } from 'lucide-react';

interface LecturerAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: Course | null;
  students: any[];
}

export const LecturerAttendanceModal: React.FC<LecturerAttendanceModalProps> = ({
  isOpen,
  onClose,
  selectedCourse,
  students,
}) => {
  if (!selectedCourse) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const headers = ['S/N', 'Matric Number', 'Student Name', 'Department', 'Level', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Signature'];
    const rows = students.map((s, idx) => [
      idx + 1,
      `"${s.student?.matricNumber || ''}"`,
      `"${s.student?.name || ''}"`,
      `"${s.student?.department || ''}"`,
      s.student?.level || 100,
      '',
      '',
      '',
      '',
      '',
      ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedCourse.code}_Attendance_Sheet.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-800 print:bg-white print:border-none print:max-w-none print:w-full">
        {/* Top Control Bar (Hidden on print) */}
        <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Official Attendance Register
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedCourse.code} • {students.length} Enrolled Candidates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="text-xs gap-1.5 h-8 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
            <Button
              size="sm"
              onClick={handlePrint}
              className="text-xs gap-1.5 h-8 bg-[#064e3b] dark:bg-emerald-700 hover:bg-[#053d2e] text-white"
            >
              <Printer className="w-3.5 h-3.5" /> Print Sheet
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Printable Official Document */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 print:p-0 print:overflow-visible">
          <div className="bg-white border border-slate-300 print:border-none shadow-sm p-8 max-w-3xl mx-auto rounded-xl print:rounded-none text-slate-900">
            {/* Header with University Details */}
            <div className="text-center pb-5 border-b-2 border-emerald-900">
              <div className="w-14 h-14 rounded-full bg-emerald-800 text-white font-serif font-black text-xl flex items-center justify-center mx-auto mb-2 shadow-xs">
                FUAZ
              </div>
              <h2 className="text-lg font-serif font-black tracking-tight text-[#064e3b] uppercase">
                Federal University of Agriculture, Zuru
              </h2>
              <p className="text-xs text-slate-600 font-semibold tracking-wide uppercase">
                Kebbi State, Nigeria • Directorate of Academic Planning & Examinations
              </p>
              <div className="inline-block mt-2 px-4 py-1 bg-emerald-50 border border-emerald-300 rounded-md">
                <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Course Attendance & Examination Verification Register
                </p>
              </div>
            </div>

            {/* Course Meta Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs border-b border-slate-200 bg-slate-50/70 px-4 rounded-lg my-4">
              <div>
                <span className="text-slate-500 font-medium block">Course Code</span>
                <span className="font-bold text-emerald-800 font-mono text-sm">{selectedCourse.code}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Credit Units</span>
                <span className="font-bold text-slate-800">{selectedCourse.creditUnits} Units</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Department</span>
                <span className="font-bold text-slate-800">{selectedCourse.department}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Academic Level</span>
                <span className="font-bold text-slate-800">{selectedCourse.level} Level</span>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <span className="text-slate-500 font-medium block">Course Title</span>
                <span className="font-bold text-slate-800">{selectedCourse.title}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Total Enrolled</span>
                <span className="font-bold text-slate-800">{students.length} Candidates</span>
              </div>
            </div>

            {/* Attendance Table */}
            <table className="w-full text-left text-xs border-collapse border border-slate-300 my-4">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300 text-center w-8">S/N</th>
                  <th className="p-2 border-r border-slate-300 w-36">Matriculation No.</th>
                  <th className="p-2 border-r border-slate-300">Student Full Name</th>
                  <th className="p-2 border-r border-slate-300 text-center w-12">Lvl</th>
                  <th className="p-2 border-r border-slate-300 text-center w-24">Date 1</th>
                  <th className="p-2 border-r border-slate-300 text-center w-24">Date 2</th>
                  <th className="p-2 text-center w-28">Signature / Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.map((s, idx) => (
                  <tr key={s.enrollmentId} className="h-9">
                    <td className="p-2 text-center border-r border-slate-300 text-slate-500">{idx + 1}</td>
                    <td className="p-2 font-mono font-bold border-r border-slate-300 text-slate-900">
                      {s.student?.matricNumber}
                    </td>
                    <td className="p-2 font-medium border-r border-slate-300 text-slate-800">
                      {s.student?.name}
                    </td>
                    <td className="p-2 text-center border-r border-slate-300 text-slate-600">
                      {s.student?.level || selectedCourse.level}
                    </td>
                    <td className="p-2 border-r border-slate-300"></td>
                    <td className="p-2 border-r border-slate-300"></td>
                    <td className="p-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-200 text-xs">
              <div className="text-center">
                <div className="h-10 border-b border-dashed border-slate-400 mb-1"></div>
                <p className="font-bold text-slate-800">Course Lecturer's Signature</p>
                <p className="text-[11px] text-slate-500">Date: ____________________</p>
              </div>
              <div className="text-center">
                <div className="h-10 border-b border-dashed border-slate-400 mb-1"></div>
                <p className="font-bold text-slate-800">Head of Department (HOD) Endorsement</p>
                <p className="text-[11px] text-slate-500">Date: ____________________</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
