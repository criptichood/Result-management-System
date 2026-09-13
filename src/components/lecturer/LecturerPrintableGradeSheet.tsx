import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Course } from '../../types';
import { Printer, X } from 'lucide-react';

interface LecturerPrintableGradeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: Course | null;
  students: any[];
  scores: Record<string, { ca: string; exam: string }>;
  calculateGrade: (total: number) => string;
  lecturerName: string;
}

export const LecturerPrintableGradeSheet: React.FC<LecturerPrintableGradeSheetProps> = ({
  isOpen,
  onClose,
  selectedCourse,
  students,
  scores,
  calculateGrade,
  lecturerName,
}) => {
  if (!selectedCourse) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 print:hidden flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Printable Official Grade Broadsheet
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Departmental continuous assessment and examination master broadsheet layout.
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 gap-1.5 text-xs shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" /> Print Score Sheet
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-slate-400"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-8 font-serif text-slate-900 dark:text-slate-100 print:p-0 print:m-0 print:text-black">
          {/* Official University Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
            <h2 className="text-lg font-black uppercase tracking-wider">
              FEDERAL UNIVERSITY OF TECHNOLOGY & SCIENCE
            </h2>
            <h3 className="text-sm font-bold uppercase tracking-wide mt-0.5">
              FACULTY OF COMPUTING & APPLIED SCIENCES • DEPT. OF {selectedCourse.department.toUpperCase()}
            </h3>
            <p className="text-xs font-semibold mt-1">
              OFFICIAL SEMESTER EXAMINATION & CONTINUOUS ASSESSMENT BROADSHEET
            </p>
          </div>

          {/* Course Meta Block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-300 rounded mb-6 text-xs font-sans">
            <div>
              <span className="font-bold text-slate-600 dark:text-slate-400">Course Code:</span>
              <p className="font-mono font-bold text-slate-900 dark:text-slate-100">{selectedCourse.code}</p>
            </div>
            <div>
              <span className="font-bold text-slate-600 dark:text-slate-400">Course Title:</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{selectedCourse.title}</p>
            </div>
            <div>
              <span className="font-bold text-slate-600 dark:text-slate-400">Credit Units / Level:</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{selectedCourse.creditUnits} Units • {selectedCourse.level}L</p>
            </div>
            <div>
              <span className="font-bold text-slate-600 dark:text-slate-400">Course Examiner:</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{lecturerName}</p>
            </div>
          </div>

          {/* Candidate Grade Table */}
          <table className="w-full border-collapse border border-slate-400 text-xs font-sans mb-8">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                <th className="border border-slate-400 p-2 text-center w-12">S/N</th>
                <th className="border border-slate-400 p-2 text-left w-36">Matriculation No.</th>
                <th className="border border-slate-400 p-2 text-left">Candidate Name</th>
                <th className="border border-slate-400 p-2 text-center w-20">CA (40)</th>
                <th className="border border-slate-400 p-2 text-center w-20">Exam (60)</th>
                <th className="border border-slate-400 p-2 text-center w-20">Total (100)</th>
                <th className="border border-slate-400 p-2 text-center w-16">Grade</th>
                <th className="border border-slate-400 p-2 text-center w-20">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => {
                const caStr = scores[s.enrollmentId]?.ca || '';
                const examStr = scores[s.enrollmentId]?.exam || '';
                const ca = parseFloat(caStr) || 0;
                const exam = parseFloat(examStr) || 0;
                const hasScore = caStr !== '' || examStr !== '';
                const total = hasScore ? ca + exam : 0;
                const grade = hasScore ? calculateGrade(total) : '-';
                const isPass = total >= 40;

                return (
                  <tr key={s.enrollmentId} className="even:bg-slate-50/50">
                    <td className="border border-slate-400 p-2 text-center">{idx + 1}</td>
                    <td className="border border-slate-400 p-2 font-mono font-medium">{s.student?.matricNumber}</td>
                    <td className="border border-slate-400 p-2 uppercase font-medium">{s.student?.name}</td>
                    <td className="border border-slate-400 p-2 text-center font-mono">{caStr !== '' ? ca : '-'}</td>
                    <td className="border border-slate-400 p-2 text-center font-mono">{examStr !== '' ? exam : '-'}</td>
                    <td className="border border-slate-400 p-2 text-center font-mono font-bold">{hasScore ? total : '-'}</td>
                    <td className="border border-slate-400 p-2 text-center font-bold">{grade}</td>
                    <td className="border border-slate-400 p-2 text-center text-[10px]">
                      {hasScore ? (isPass ? 'PASS' : 'REPEAT') : 'ABSENT'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Signature & Endorsement Block */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-300 text-xs font-sans">
            <div className="text-center">
              <div className="border-b border-slate-800 pb-12" />
              <p className="font-bold mt-2">{lecturerName}</p>
              <p className="text-slate-500 text-[10px]">Course Examiner Signature & Date</p>
            </div>
            <div className="text-center">
              <div className="border-b border-slate-800 pb-12" />
              <p className="font-bold mt-2">Dr. (Mrs.) A. N. Chief Examiner</p>
              <p className="text-slate-500 text-[10px]">Chief Examiner / Moderation Signature & Date</p>
            </div>
            <div className="text-center">
              <div className="border-b border-slate-800 pb-12" />
              <p className="font-bold mt-2">Head of Department</p>
              <p className="text-slate-500 text-[10px]">HOD Senate Endorsement Signature & Date</p>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-slate-100 dark:border-slate-800 print:hidden flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Complies with NUC 5.0 CGPA Grading Policy.
          </span>
          <Button variant="outline" onClick={onClose} className="text-xs">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
