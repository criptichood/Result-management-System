import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { db } from '../../lib/db';
import { Printer, Download, X, Award, FileSpreadsheet } from 'lucide-react';

interface ExaminerBroadSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentName?: string;
}

export const ExaminerBroadSheetModal: React.FC<ExaminerBroadSheetModalProps> = ({
  isOpen,
  onClose,
  departmentName = 'Computer Science',
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number>(100);
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);

  // Grade points lookup
  const getGradePoint = (grade: string | null) => {
    switch (grade) {
      case 'A': return 5;
      case 'B': return 4;
      case 'C': return 3;
      case 'D': return 2;
      default: return 0;
    }
  };

  const enrollments = db.from('enrollments').select();
  const results = db.from('results').select();

  // Fetch departmental student IDs (e.g. Computer Science only)
  const deptStudents = db.from('users').select().filter(
    (u) => u.role === 'Student' && (!departmentName || u.department === departmentName)
  );
  const deptStudentIds = new Set(deptStudents.map((u) => u.id));

  // Fetch courses for this level and semester:
  // Include departmental courses OR borrowed/service courses taken by students of this department
  const courses = db.from('courses').select().filter((c) => {
    if (c.level !== selectedLevel || c.semester !== selectedSemester) return false;
    const isDeptCourse = !departmentName || c.department === departmentName;
    const isTakenByDeptStudent = enrollments.some(
      (e) => e.courseId === c.id && deptStudentIds.has(e.studentId)
    );
    return isDeptCourse || isTakenByDeptStudent;
  });

  // Fetch students in this level strictly within this department
  const allStudents = deptStudents.filter(
    (u) => (u.level === selectedLevel || (!u.level && selectedLevel === 100))
  );

  // Compute broad sheet row for each student
  const studentRows = allStudents.map((student, idx) => {
    let tcr = 0; // Total Credits Registered
    let tce = 0; // Total Credits Earned
    let tqp = 0; // Total Quality Points

    const courseGrades: Record<string, { grade: string; points: number; score: number | null }> = {};

    courses.forEach((course) => {
      const enrollment = enrollments.find(
        (e) => e.studentId === student.id && e.courseId === course.id
      );
      if (enrollment) {
        const result = results.find((r) => r.enrollmentId === enrollment.id);
        const grade = result?.grade || '-';
        const gp = getGradePoint(result?.grade || null);
        const qp = course.creditUnits * gp;

        tcr += course.creditUnits;
        if (grade !== 'F' && grade !== '-') {
          tce += course.creditUnits;
        }
        tqp += qp;

        courseGrades[course.id] = {
          grade,
          points: qp,
          score: result?.totalScore || null,
        };
      } else {
        courseGrades[course.id] = {
          grade: '-',
          points: 0,
          score: null,
        };
      }
    });

    const gpa = tcr > 0 ? (tqp / tcr).toFixed(2) : '0.00';
    const gpaNum = parseFloat(gpa);

    let standing = 'Clear Standing';
    let standingVariant: 'success' | 'warning' | 'destructive' | 'outline' = 'success';

    if (gpaNum >= 4.5) {
      standing = 'First Class (Clear)';
      standingVariant = 'success';
    } else if (gpaNum >= 3.5) {
      standing = '2nd Class Upper (Clear)';
      standingVariant = 'success';
    } else if (gpaNum >= 2.4) {
      standing = '2nd Class Lower (Clear)';
      standingVariant = 'success';
    } else if (gpaNum >= 1.5) {
      standing = '3rd Class (Clear)';
      standingVariant = 'outline';
    } else if (gpaNum >= 1.0) {
      standing = 'Academic Warning';
      standingVariant = 'warning';
    } else {
      standing = 'Probation';
      standingVariant = 'destructive';
    }

    return {
      sn: idx + 1,
      student,
      courseGrades,
      tcr,
      tce,
      tqp,
      gpa,
      standing,
      standingVariant,
    };
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const headers = [
      'S/N',
      'Matric No',
      'Student Name',
      ...courses.map((c) => `${c.code} (${c.creditUnits}U)`),
      'TCR',
      'TCE',
      'TQP',
      'GPA',
      'Senate Remarks',
    ];

    const rows = studentRows.map((r) => [
      r.sn,
      `"${r.student.matricNumber || ''}"`,
      `"${r.student.name}"`,
      ...courses.map((c) => `"${r.courseGrades[c.id]?.grade || '-'}"`),
      r.tcr,
      r.tce,
      r.tqp,
      r.gpa,
      `"${r.standing}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Senate_BroadSheet_${selectedLevel}L_Sem${selectedSemester}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent hideCloseButton className="max-w-6xl max-h-[95vh] flex flex-col p-0 overflow-hidden bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-800 print:bg-white print:border-none print:max-w-none print:w-full">
        {/* Modal Toolbar (hidden on print) */}
        <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                Departmental Senate Master Broad Sheet
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                Official Nigerian university broad sheet format with 5.0 CGPA scale grading
              </DialogDescription>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Level Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-semibold">
              {[100, 200, 300, 400].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    selectedLevel === lvl
                      ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {lvl}L
                </button>
              ))}
            </div>

            {/* Semester Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-semibold">
              {[1, 2].map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem as 1 | 2)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    selectedSemester === sem
                      ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {sem === 1 ? '1st Sem' : '2nd Sem'}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="text-xs gap-1.5 h-8 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
            <Button
              size="sm"
              onClick={handlePrint}
              className="text-xs gap-1.5 h-8 bg-[#064e3b] hover:bg-[#053d2e] text-white shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" /> Print Broad Sheet
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

        {/* Official Document Scroll Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 print:p-0 print:overflow-visible">
          <div className="bg-white border border-slate-300 print:border-none shadow-sm p-6 max-w-full rounded-xl print:rounded-none text-slate-900">
            {/* Senate Broad Sheet Header */}
            <div className="text-center pb-4 border-b-2 border-emerald-950">
              <div className="w-12 h-12 rounded-full bg-emerald-800 text-white font-serif font-black text-lg flex items-center justify-center mx-auto mb-1">
                FUAZ
              </div>
              <h1 className="text-base font-serif font-black tracking-tight text-[#064e3b] uppercase">
                Federal University of Agriculture, Zuru
              </h1>
              <p className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">
                Senate Examination Board • Master Result Broad Sheet
              </p>
              <div className="flex items-center justify-center gap-4 mt-2 text-xs font-semibold text-slate-700">
                <span><strong>Faculty:</strong> College of Science</span>
                <span>•</span>
                <span><strong>Department:</strong> {departmentName}</span>
                <span>•</span>
                <span><strong>Academic Level:</strong> {selectedLevel} Level</span>
                <span>•</span>
                <span><strong>Semester:</strong> {selectedSemester === 1 ? '1st Semester' : '2nd Semester'}</span>
              </div>
            </div>

            {/* Broad Sheet Table */}
            <div className="overflow-x-auto my-4">
              <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <th className="p-2 border-r border-slate-300 text-center w-8">S/N</th>
                    <th className="p-2 border-r border-slate-300 w-32">Matriculation No.</th>
                    <th className="p-2 border-r border-slate-300 w-48">Student Full Name</th>
                    {courses.map((c) => (
                      <th
                        key={c.id}
                        className="p-1.5 border-r border-slate-300 text-center font-mono w-16"
                        title={c.title}
                      >
                        <div>{c.code}</div>
                        <div className="text-[10px] font-normal text-slate-500">
                          {c.creditUnits}U
                        </div>
                      </th>
                    ))}
                    <th className="p-2 border-r border-slate-300 text-center w-12">TCR</th>
                    <th className="p-2 border-r border-slate-300 text-center w-12">TCE</th>
                    <th className="p-2 border-r border-slate-300 text-center w-12">TQP</th>
                    <th className="p-2 border-r border-slate-300 text-center w-16 font-bold bg-emerald-50">
                      GPA
                    </th>
                    <th className="p-2 text-center w-36">Senate Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {studentRows.map((row) => (
                    <tr key={row.student.id} className="hover:bg-slate-50">
                      <td className="p-2 text-center border-r border-slate-300 text-slate-500">
                        {row.sn}
                      </td>
                      <td className="p-2 font-mono font-bold border-r border-slate-300 text-slate-900">
                        {row.student.matricNumber}
                      </td>
                      <td className="p-2 font-medium border-r border-slate-300 text-slate-800 whitespace-nowrap">
                        {row.student.name}
                      </td>
                      {courses.map((c) => {
                        const cg = row.courseGrades[c.id];
                        const isFail = cg?.grade === 'F';
                        return (
                          <td
                            key={c.id}
                            className={`p-1.5 border-r border-slate-300 text-center font-mono font-semibold ${
                              isFail ? 'bg-red-50 text-red-600 font-bold' : 'text-slate-800'
                            }`}
                          >
                            {cg?.grade || '-'}
                          </td>
                        );
                      })}
                      <td className="p-2 text-center border-r border-slate-300 font-mono">
                        {row.tcr}
                      </td>
                      <td className="p-2 text-center border-r border-slate-300 font-mono">
                        {row.tce}
                      </td>
                      <td className="p-2 text-center border-r border-slate-300 font-mono">
                        {row.tqp}
                      </td>
                      <td className="p-2 text-center border-r border-slate-300 font-mono font-black text-emerald-800 bg-emerald-50/60">
                        {row.gpa}
                      </td>
                      <td className="p-2 text-center">
                        <Badge variant={row.standingVariant} className="text-[10px] py-0 px-2 font-semibold">
                          {row.standing}
                        </Badge>
                      </td>
                    </tr>
                  ))}

                  {studentRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={courses.length + 8}
                        className="p-8 text-center text-slate-400 text-xs"
                      >
                        No student candidate records registered for {selectedLevel} Level.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Official Signatures */}
            <div className="grid grid-cols-3 gap-6 pt-6 mt-6 border-t border-slate-200 text-xs">
              <div className="text-center">
                <div className="h-10 border-b border-dashed border-slate-400 mb-1"></div>
                <p className="font-bold text-slate-800">Chief Examiner / Head of Department</p>
                <p className="text-[10px] text-slate-500">Date: ____________________</p>
              </div>
              <div className="text-center">
                <div className="h-10 border-b border-dashed border-slate-400 mb-1"></div>
                <p className="font-bold text-slate-800">Faculty Examination Officer</p>
                <p className="text-[10px] text-slate-500">Date: ____________________</p>
              </div>
              <div className="text-center">
                <div className="h-10 border-b border-dashed border-slate-400 mb-1"></div>
                <p className="font-bold text-slate-800">Dean of Faculty / Senate Chair</p>
                <p className="text-[10px] text-slate-500">Date: ____________________</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
