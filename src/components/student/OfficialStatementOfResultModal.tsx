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
import { Badge } from '../ui/badge';
import { User } from '../../types';
import { Printer, ShieldCheck, QrCode, X } from 'lucide-react';

interface OfficialStatementOfResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: User;
  coursesWithResults: any[];
  gpa: number;
  cgpa: number;
  session: string;
  semester: number;
}

export const OfficialStatementOfResultModal: React.FC<OfficialStatementOfResultModalProps> = ({
  isOpen,
  onClose,
  student,
  coursesWithResults,
  gpa,
  cgpa,
  session,
  semester,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const getDegreeClassification = (scoreCgpa: number) => {
    if (scoreCgpa >= 4.50) return { title: 'First Class Honours', color: 'bg-emerald-100 text-emerald-800' };
    if (scoreCgpa >= 3.50) return { title: 'Second Class Honours (Upper Division)', color: 'bg-blue-100 text-blue-800' };
    if (scoreCgpa >= 2.40) return { title: 'Second Class Honours (Lower Division)', color: 'bg-amber-100 text-amber-800' };
    if (scoreCgpa >= 1.50) return { title: 'Third Class Honours', color: 'bg-orange-100 text-orange-800' };
    if (scoreCgpa >= 1.00) return { title: 'Pass', color: 'bg-slate-100 text-slate-800' };
    return { title: 'Probation / Academic Warning', color: 'bg-red-100 text-red-800' };
  };

  const classification = getDegreeClassification(cgpa);

  // Compute Credits and points
  let tcr = 0;
  let tce = 0;
  let twp = 0;

  const getGradePoint = (grade: string | null) => {
    switch (grade) {
      case 'A': return 5;
      case 'B': return 4;
      case 'C': return 3;
      case 'D': return 2;
      case 'F': return 0;
      default: return 0;
    }
  };

  coursesWithResults.forEach((c) => {
    const units = c.course.creditUnits || 0;
    tcr += units;
    if (c.result && c.result.grade && c.result.grade !== 'F') {
      tce += units;
    }
    const gp = getGradePoint(c.result?.grade || null);
    twp += units * gp;
  });

  const verificationHash = `FUAZ-VER-${session.replace('/', '')}-${(student.matricNumber || '0000').slice(-4)}-${Math.abs(Math.round(cgpa * 1000))}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent hideCloseButton className="max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 print:hidden flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Official Statement of Academic Results & Transcript
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Verifiable electronic statement of examination performance and standing.
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 gap-1.5 text-xs shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" /> Print Statement
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
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-6 relative">
            <div className="w-14 h-14 rounded-full border-2 border-slate-900 mx-auto mb-2 flex items-center justify-center font-bold text-lg font-sans">
              FUAZ
            </div>
            <h2 className="text-lg font-black uppercase tracking-wider font-sans">
              FEDERAL UNIVERSITY OF AGRICULTURE & TECHNOLOGY
            </h2>
            <h3 className="text-xs font-bold uppercase tracking-wide font-sans text-slate-700 dark:text-slate-300">
              OFFICE OF THE REGISTRAR • ACADEMIC AFFAIRS DIVISION
            </h3>
            <p className="text-xs font-semibold mt-1 font-sans">
              OFFICIAL STATEMENT OF RESULTS ({session} ACADEMIC SESSION)
            </p>
          </div>

          {/* Student Profile Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-300 rounded mb-6 text-xs font-sans">
            <div>
              <span className="font-bold text-slate-600 dark:text-slate-400">Candidate Name:</span>
              <p className="font-bold uppercase text-slate-900 dark:text-slate-100">{student.name}</p>
            </div>
            <div>
              <span className="font-bold text-slate-600 dark:text-slate-400">Matriculation No:</span>
              <p className="font-mono font-bold text-slate-900 dark:text-slate-100">{student.matricNumber}</p>
            </div>
            <div>
              <span className="font-bold text-slate-600 dark:text-slate-400">Department & College:</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {student.department || 'Computer Science'} ({student.college || 'FCAS'})
              </p>
            </div>
            <div>
              <span className="font-bold text-slate-600 dark:text-slate-400">Level / Semester:</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{student.level || 400}L • Semester {semester}</p>
            </div>
          </div>

          {/* Course Grades Table */}
          <table className="w-full border-collapse border border-slate-400 text-xs font-sans mb-6">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                <th className="border border-slate-400 p-2 text-center w-12">S/N</th>
                <th className="border border-slate-400 p-2 text-left w-24">Course Code</th>
                <th className="border border-slate-400 p-2 text-left">Course Title</th>
                <th className="border border-slate-400 p-2 text-center w-16">Units</th>
                <th className="border border-slate-400 p-2 text-center w-16">CA (40)</th>
                <th className="border border-slate-400 p-2 text-center w-16">Exam (60)</th>
                <th className="border border-slate-400 p-2 text-center w-16">Total</th>
                <th className="border border-slate-400 p-2 text-center w-16">Grade</th>
                <th className="border border-slate-400 p-2 text-center w-16">Points</th>
              </tr>
            </thead>
            <tbody>
              {coursesWithResults.map((item, idx) => {
                const res = item.result;
                const hasScore = res && res.totalScore !== null && res.totalScore !== undefined;
                const units = item.course.creditUnits || 0;
                const gp = getGradePoint(res?.grade || null);
                const points = units * gp;

                return (
                  <tr key={item.course.id} className="even:bg-slate-50/50">
                    <td className="border border-slate-400 p-2 text-center">{idx + 1}</td>
                    <td className="border border-slate-400 p-2 font-mono font-bold">{item.course.code}</td>
                    <td className="border border-slate-400 p-2">{item.course.title}</td>
                    <td className="border border-slate-400 p-2 text-center font-mono">{units}</td>
                    <td className="border border-slate-400 p-2 text-center font-mono">{res?.caScore ?? '-'}</td>
                    <td className="border border-slate-400 p-2 text-center font-mono">{res?.examScore ?? '-'}</td>
                    <td className="border border-slate-400 p-2 text-center font-mono font-bold">
                      {hasScore ? res.totalScore : '-'}
                    </td>
                    <td className="border border-slate-400 p-2 text-center font-bold">
                      {res?.grade || '-'}
                    </td>
                    <td className="border border-slate-400 p-2 text-center font-mono font-semibold">
                      {hasScore ? points : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Academic Performance Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border-2 border-slate-900 rounded bg-slate-50 dark:bg-slate-800/40 mb-6 text-xs font-sans">
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Total Credits Reg. (TCR):</span>
              <p className="font-mono font-bold text-base text-slate-900 dark:text-slate-100">{tcr}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Total Credits Earned (TCE):</span>
              <p className="font-mono font-bold text-base text-slate-900 dark:text-slate-100">{tce}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Semester GPA:</span>
              <p className="font-mono font-bold text-base text-emerald-600 dark:text-emerald-400">{gpa.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Cumulative CGPA (5.00):</span>
              <p className="font-mono font-bold text-base text-[#064e3b] dark:text-emerald-300">{cgpa.toFixed(2)}</p>
            </div>
          </div>

          {/* Classification & Verification Box */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded mb-8 text-xs font-sans gap-4">
            <div>
              <span className="font-semibold text-slate-600 dark:text-slate-400">Class of Degree Standing:</span>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 uppercase">
                {classification.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Academic Standing: <strong>Good Academic Standing</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
              <QrCode className="w-10 h-10 text-slate-800 dark:text-slate-200" />
              <div className="text-[10px] font-mono">
                <span className="text-slate-400 font-sans block">Verification Checksum:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{verificationHash}</span>
                <span className="text-emerald-600 block text-[9px] font-sans font-semibold">Verified Electronic Copy</span>
              </div>
            </div>
          </div>

          {/* Official Endorsements */}
          <div className="grid grid-cols-2 gap-12 pt-6 border-t border-slate-300 text-xs font-sans">
            <div className="text-center">
              <div className="border-b border-slate-800 pb-12" />
              <p className="font-bold mt-2">Dr. (Mrs.) B. A. Registrar</p>
              <p className="text-slate-500 text-[10px]">Academic Affairs Registrar</p>
            </div>
            <div className="text-center">
              <div className="border-b border-slate-800 pb-12" />
              <p className="font-bold mt-2">Dean, Faculty of Computing & Applied Sciences</p>
              <p className="text-slate-500 text-[10px]">Faculty Senate Endorsement</p>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-slate-100 dark:border-slate-800 print:hidden flex items-center justify-between">
          <span className="text-xs text-slate-500">
            NUC 5.0 CGPA Standard Academic Benchmark.
          </span>
          <Button variant="outline" onClick={onClose} className="text-xs">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
