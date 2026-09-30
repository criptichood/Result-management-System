import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Users, Mail, Phone, MapPin, ChevronRight, Search, Printer, Download, Upload } from 'lucide-react';
import { Course } from '../../types';
import { calculateLetterGrade } from '../../lib/academicOperations';
import { buildGradingRosterCsv, downloadRosterCsv } from '../../lib/gradingRosterCsv';
import { LecturerAttendanceModal } from './LecturerAttendanceModal';

interface LecturerClassListTabProps {
  selectedCourse: Course | null;
  /** Course picker, rendered in this sheet's header rather than above it. */
  courseSelector?: React.ReactNode;
  students: any[];
  settings: {
    lecturerViewEmail: boolean;
    lecturerViewPhone: boolean;
  };
  scores?: Record<string, { ca: string; exam: string }>;
  calculateGrade?: (total: number) => string;
  onOpenCsvModal?: () => void;
}

export const LecturerClassListTab: React.FC<LecturerClassListTabProps> = ({
  selectedCourse,
  courseSelector,
  students,
  settings,
  scores,
  calculateGrade = calculateLetterGrade,
  onOpenCsvModal,
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
    // Shared builder, so this export is byte-identical to the grading tab's
    // (formulas + NUC key included) except that it covers the filtered subset.
    const csv = buildGradingRosterCsv({
      course: selectedCourse,
      students: filteredStudents,
      getScores: (enrollmentId: string) => {
        const draft = scores?.[enrollmentId];
        if (draft) return { ca: draft.ca, exam: draft.exam };
        const result = filteredStudents.find((s: any) => s.enrollmentId === enrollmentId)?.result;
        return {
          ca: result?.caScore !== null && result?.caScore !== undefined ? String(result.caScore) : '',
          exam:
            result?.examScore !== null && result?.examScore !== undefined
              ? String(result.examScore)
              : '',
        };
      },
    });
    downloadRosterCsv(`${selectedCourse.code}_Class_Grading_Roster.csv`, csv);
  };

  return (
    <Card id="lecturer-class-list-tab" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="min-w-0">
          {courseSelector ?? (
            <CardTitle className="text-xl text-slate-900 dark:text-slate-100">
              Class Roster: {selectedCourse ? selectedCourse.code : 'Select a course'}
            </CardTitle>
          )}
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {selectedCourse
              ? `${students.length} Enrolled Candidates`
              : 'View all students registered for this course.'}
          </CardDescription>
        </div>

        {selectedCourse && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportRosterCsv}
              className="text-xs gap-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
              title="Download pre-populated class roster CSV for offline grading"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Export Grading Roster
            </Button>
            {onOpenCsvModal && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenCsvModal}
                className="text-xs gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
                title="Import completed scores from CSV"
              >
                <Upload className="w-3.5 h-3.5" /> Import Results CSV
              </Button>
            )}
            <span className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
            <Button
              size="sm"
              onClick={() => setIsAttendanceModalOpen(true)}
              className="text-xs gap-1.5 bg-[#064e3b] dark:bg-emerald-700 hover:bg-[#053d2e] text-white"
            >
              <Printer className="w-3.5 h-3.5" /> Attendance Register
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
                  <TableHead className="w-36">Matric No.</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-center w-16">Level</TableHead>
                  <TableHead className="text-center w-20">CA (40)</TableHead>
                  <TableHead className="text-center w-20">Exam (60)</TableHead>
                  <TableHead className="text-center w-20">Total (100)</TableHead>
                  <TableHead className="text-center w-16">Grade</TableHead>
                  <TableHead className="w-[50px] text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((s, idx) => {
                  const caVal = scores ? scores[s.enrollmentId]?.ca : (s.result?.caScore !== null && s.result?.caScore !== undefined ? s.result.caScore.toString() : '');
                  const examVal = scores ? scores[s.enrollmentId]?.exam : (s.result?.examScore !== null && s.result?.examScore !== undefined ? s.result.examScore.toString() : '');
                  const hasScore = (caVal !== '' && caVal !== undefined) || (examVal !== '' && examVal !== undefined);
                  const total = hasScore ? (parseFloat(caVal || '0') || 0) + (parseFloat(examVal || '0') || 0) : null;
                  const grade = total !== null ? calculateGrade(total) : null;

                  return (
                    <Dialog key={s.enrollmentId}>
                      <DialogTrigger asChild>
                        <TableRow className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <TableCell className="text-center text-slate-400 text-xs">{idx + 1}</TableCell>
                          <TableCell className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs">
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
                          <TableCell className="text-center font-mono text-slate-700 dark:text-slate-300 text-xs">
                            {caVal !== '' && caVal !== undefined ? caVal : '-'}
                          </TableCell>
                          <TableCell className="text-center font-mono text-slate-700 dark:text-slate-300 text-xs">
                            {examVal !== '' && examVal !== undefined ? examVal : '-'}
                          </TableCell>
                          <TableCell className="text-center font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
                            {total !== null ? total : '-'}
                          </TableCell>
                          <TableCell className="text-center">
                            {grade ? (
                              <Badge
                                variant={
                                  grade === 'A' || grade === 'B'
                                    ? 'success'
                                    : grade === 'C'
                                    ? 'default'
                                    : grade === 'D' || grade === 'E'
                                    ? 'warning'
                                    : 'destructive'
                                }
                                className="font-extrabold text-[10px]"
                              >
                                {grade}
                              </Badge>
                            ) : (
                              <span className="text-slate-400 text-xs font-mono">-</span>
                            )}
                          </TableCell>
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
                          <DialogTitle className="text-slate-900 dark:text-slate-100">Student Profile & Score Record</DialogTitle>
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

                          {/* Academic Score Summary Box */}
                          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60 grid grid-cols-4 gap-2 text-center">
                            <div>
                              <div className="text-[10px] text-slate-500 uppercase font-semibold">CA (40)</div>
                              <div className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                                {caVal !== '' && caVal !== undefined ? caVal : '-'}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-500 uppercase font-semibold">Exam (60)</div>
                              <div className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                                {examVal !== '' && examVal !== undefined ? examVal : '-'}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-500 uppercase font-semibold">Total (100)</div>
                              <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                                {total !== null ? total : '-'}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-500 uppercase font-semibold">Grade</div>
                              <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
                                {grade || '-'}
                              </div>
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
                            {/*
                              Emergency contact is deliberately absent. It names
                              and numbers a student's parent or guardian, recorded
                              for campus welfare and shown to the Dean of Student
                              Affairs — not teaching staff. Unlike email/phone
                              there is no admin toggle for it on purpose; do not
                              add one back without a policy decision.
                            */}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-slate-500 py-10 text-xs">
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

