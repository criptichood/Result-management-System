import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { User, Course, Enrollment, Result } from '../../types';
import {
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  GraduationCap,
  Calendar,
  Building2,
  Printer,
  Award,
  BookOpen,
} from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: User | null;
  courses: Course[];
  enrollments: Enrollment[];
  results: Result[];
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  courses,
  enrollments,
  results,
}) => {
  if (!student) return null;

  // Grade point lookup on 5.0 Nigerian University scale
  const getGradePoint = (grade?: string | null): number => {
    switch (grade) {
      case 'A': return 5;
      case 'B': return 4;
      case 'C': return 3;
      case 'D': return 2;
      default: return 0;
    }
  };

  // Find all enrollments and associated courses/results for this student
  const studentEnrollments = enrollments.filter((e) => e.studentId === student.id);

  const academicRecords = studentEnrollments.map((enr) => {
    const course = courses.find((c) => c.id === enr.courseId);
    const result = results.find((r) => r.enrollmentId === enr.id);
    const grade = result?.grade || '-';
    const gradePoint = getGradePoint(result?.grade);
    const creditUnits = course?.creditUnits || 2;
    const qualityPoints = creditUnits * gradePoint;
    const isCore = course?.department === student.department;

    return {
      enrollment: enr,
      course,
      result,
      grade,
      gradePoint,
      creditUnits,
      qualityPoints,
      isCore,
    };
  });

  // Calculate cumulative summary statistics
  let totalRegisteredCredits = 0;
  let totalEarnedCredits = 0;
  let totalQualityPoints = 0;

  academicRecords.forEach((rec) => {
    totalRegisteredCredits += rec.creditUnits;
    if (rec.grade !== '-' && rec.grade !== 'F') {
      totalEarnedCredits += rec.creditUnits;
    }
    totalQualityPoints += rec.qualityPoints;
  });

  const computedCgpa =
    totalRegisteredCredits > 0
      ? (totalQualityPoints / totalRegisteredCredits).toFixed(2)
      : student.finalCgpa
      ? student.finalCgpa.toFixed(2)
      : '0.00';

  const cgpaNum = parseFloat(computedCgpa);

  // Determine Nigerian Degree Standing
  let degreeStanding = student.degreeClass || 'Clear Standing';
  let standingBadgeVariant: 'emerald' | 'blue' | 'amber' | 'purple' = 'emerald';

  if (student.degreeClass) {
    if (student.degreeClass.includes('First Class')) {
      standingBadgeVariant = 'emerald';
    } else if (student.degreeClass.includes('Upper')) {
      standingBadgeVariant = 'blue';
    } else if (student.degreeClass.includes('Lower')) {
      standingBadgeVariant = 'amber';
    } else {
      standingBadgeVariant = 'purple';
    }
  } else if (cgpaNum >= 4.5) {
    degreeStanding = 'First Class Honours';
    standingBadgeVariant = 'emerald';
  } else if (cgpaNum >= 3.5) {
    degreeStanding = 'Second Class Honours (Upper Division)';
    standingBadgeVariant = 'blue';
  } else if (cgpaNum >= 2.4) {
    degreeStanding = 'Second Class Honours (Lower Division)';
    standingBadgeVariant = 'amber';
  } else if (cgpaNum >= 1.5) {
    degreeStanding = 'Third Class Honours';
    standingBadgeVariant = 'amber';
  } else if (totalRegisteredCredits > 0) {
    degreeStanding = 'Probation';
    standingBadgeVariant = 'amber';
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 p-6">
        <DialogHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 pr-10 sm:pr-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-bold text-[#064e3b] dark:text-emerald-400 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                Student Academic Profile
              </DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                Institutional record, academic standing, and comprehensive grade report.
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs self-start sm:self-auto border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" /> Print Record
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Top Identity Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-emerald-50/80 to-teal-50/50 dark:from-emerald-950/40 dark:to-teal-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/60 shadow-2xs">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#064e3b] dark:bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-xs">
                {student.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{student.name}</h3>
                <p className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {student.matricNumber || 'Matriculation Pending'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {student.department} • {student.college}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 self-stretch sm:self-auto">
              {student.isGraduated ? (
                <Badge className="bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800 px-3 py-1 text-xs font-bold shadow-2xs">
                  Graduated Alumnus
                </Badge>
              ) : (
                <Badge className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-bold shadow-2xs">
                  Active Undergraduate
                </Badge>
              )}

              <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5 border-slate-300 dark:border-slate-700">
                {student.isGraduated
                  ? `Class of ${student.graduationYear || '2023/2024'}`
                  : `${student.level || 100} Level`}
              </Badge>
            </div>
          </div>

          {/* Academic Standing & Performance KPI Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Current Level
              </span>
              <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {student.isGraduated ? 'Graduated' : `${student.level || 100} Level`}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {student.isGraduated
                  ? student.graduationSession || 'Program Completed'
                  : student.level === 400
                  ? 'Final Year (UG4)'
                  : `Year ${((student.level || 100) / 100).toFixed(0)}`}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                CGPA (5.0 Scale)
              </span>
              <p className="text-base font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                {computedCgpa}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {degreeStanding}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Credits (TCR / TCE)
              </span>
              <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {totalEarnedCredits} / {totalRegisteredCredits}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {totalRegisteredCredits - totalEarnedCredits === 0
                  ? 'Zero Carryovers'
                  : `${totalRegisteredCredits - totalEarnedCredits} Cr Outstanding`}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Entry Cohort
              </span>
              <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {student.entryYear || '2021/2022'}
              </p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {student.isGraduated ? 'Alumnus' : 'Regular Admission'}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" /> Contact & Residence Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="text-slate-500 dark:text-slate-400">Email:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{student.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="text-slate-500 dark:text-slate-400">Phone:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {student.phoneNumber || 'Not provided'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="text-slate-500 dark:text-slate-400">Emergency:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {student.emergencyContact || 'Not provided'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="text-slate-500 dark:text-slate-400">Address:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                  {student.address || 'Not provided'}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Course Report (Core vs Borrowed Course Differentiation) */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Academic Grade Report ({academicRecords.length} Courses)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Includes departmental core and borrowed courses taken by this candidate.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Core Course
                </span>
                <span className="inline-flex items-center gap-1 text-indigo-700 dark:text-indigo-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Borrowed / Service
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Course</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-2 text-center">Units</th>
                      <th className="py-2.5 px-2 text-center">CA (40)</th>
                      <th className="py-2.5 px-2 text-center">Exam (60)</th>
                      <th className="py-2.5 px-2 text-center">Total</th>
                      <th className="py-2.5 px-2 text-center">Grade</th>
                      <th className="py-2.5 px-2 text-center">GP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {academicRecords.map((item) => (
                      <tr
                        key={item.enrollment.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                            {item.course?.code || 'CRS'}
                          </span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {item.course?.title || 'Course Title'}
                          </p>
                        </td>
                        <td className="py-2.5 px-3">
                          {item.isCore ? (
                            <Badge
                              variant="secondary"
                              className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] py-0 px-2 font-semibold"
                            >
                              Core
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-[10px] py-0 px-2 font-semibold"
                            >
                              Borrowed ({item.course?.department || 'Service'})
                            </Badge>
                          )}
                        </td>
                        <td className="py-2.5 px-2 text-center font-semibold">
                          {item.creditUnits}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono">
                          {item.result?.caScore !== undefined ? item.result.caScore : '-'}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono">
                          {item.result?.examScore !== undefined ? item.result.examScore : '-'}
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold font-mono text-slate-900 dark:text-slate-100">
                          {item.result?.totalScore !== undefined ? item.result.totalScore : '-'}
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold">
                          <span
                            className={
                              item.grade === 'A'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : item.grade === 'F'
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-slate-800 dark:text-slate-200'
                            }
                          >
                            {item.grade}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-slate-600 dark:text-slate-400">
                          {item.gradePoint}
                        </td>
                      </tr>
                    ))}
                    {academicRecords.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                          No course enrollment records registered for this candidate.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
