import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  Check,
  X,
  Download,
  Printer,
  Award,
  BookOpen,
  BarChart2,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { User } from '../../types';

interface CourseResultModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  course: any;
  lecturer?: User | null;
  examiner?: User;
  session?: string;
  onApprove?: (courseId: string) => void;
  onReject?: (courseId: string) => void;
  onRefresh?: () => void;
}

export const CourseResultModal: React.FC<CourseResultModalProps> = ({
  isOpen,
  onOpenChange,
  course,
  lecturer,
  examiner = { id: 'u2', name: 'Dr. Aliyu Mohammed', email: 'examiner@fuaz.edu.ng', role: 'Chief Examiner' },
  session = '2024/2025',
  onApprove,
  onReject,
  onRefresh,
}) => {
  const [rosterFilter, setRosterFilter] = useState<'all' | 'scored' | 'unscored'>('all');

  if (!course) return null;

  const detailedResults = course.detailedResults || [];

  // Calculate detailed distribution & statistics
  const validScores: number[] = detailedResults
    .filter((dr: any) => dr.result?.totalScore !== null && dr.result?.totalScore !== undefined)
    .map((dr: any) => Number(dr.result.totalScore));

  const count = validScores.length;
  const unscoredCount = detailedResults.length - count;
  const sum = validScores.reduce((acc, val) => acc + val, 0);
  const classAvg = count > 0 ? (sum / count).toFixed(1) : 'N/A';
  const highest = count > 0 ? Math.max(...validScores) : 'N/A';
  const lowest = count > 0 ? Math.min(...validScores) : 'N/A';

  // Standard deviation
  const variance =
    count > 1
      ? validScores.reduce((acc, val) => acc + Math.pow(val - Number(classAvg), 2), 0) / (count - 1)
      : 0;
  const stdDev = count > 1 ? Math.sqrt(variance).toFixed(1) : '0.0';

  // Grade Counts
  const gradeCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
  let discrepancyCount = 0;

  detailedResults.forEach((dr: any) => {
    const grade = dr.result?.grade;
    if (grade && gradeCounts[grade] !== undefined) {
      gradeCounts[grade]++;
    }
    const ca = dr.result?.caScore;
    const exam = dr.result?.examScore;
    if ((ca !== null && ca !== undefined && ca > 40) || (exam !== null && exam !== undefined && exam > 60)) {
      discrepancyCount++;
    }
  });

  const passCount = (gradeCounts.A || 0) + (gradeCounts.B || 0) + (gradeCounts.C || 0) + (gradeCounts.D || 0) + (gradeCounts.E || 0);
  const passRate = count > 0 ? `${Math.round((passCount / count) * 100)}%` : 'N/A';

  const displayedResults = detailedResults.filter((dr: any) => {
    const hasScore = dr.result?.totalScore !== null && dr.result?.totalScore !== undefined;
    if (rosterFilter === 'scored') return hasScore;
    if (rosterFilter === 'unscored') return !hasScore;
    return true;
  });

  const exportCSV = () => {
    const headers = ['Matric Number', 'Student Name', 'Course Code', 'Course Title', 'CA Score (40)', 'Exam Score (60)', 'Total Score (100)', 'Grade', 'Status', 'Lecturer'];
    const rows = detailedResults.map((dr: any) => [
      `"${dr.student?.matricNumber || ''}"`,
      `"${dr.student?.name || ''}"`,
      `"${course.code}"`,
      `"${course.title}"`,
      dr.result?.caScore ?? '',
      dr.result?.examScore ?? '',
      dr.result?.totalScore ?? '',
      `"${dr.result?.grade ?? ''}"`,
      `"${dr.result?.status ?? 'No Result'}"`,
      `"${lecturer?.name || 'Unassigned'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${course.code.replace(/\s+/g, '_')}_Results_Audit.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const isCore = course.department === 'Computer Science' || course.isCore;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent 
          className="max-w-4xl max-h-[88vh] flex flex-col p-0 overflow-hidden"
          closeClassName="text-white/80 hover:text-white hover:bg-white/20 top-5 right-5"
        >
          {/* Modal Top Header */}
          <div className="p-6 pr-14 sm:pr-16 bg-gradient-to-r from-[#064e3b] to-[#047857] text-white">
            <DialogHeader>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm px-2.5 py-1 bg-white/20 rounded-md font-bold tracking-wider">
                    {course.code}
                  </span>
                  <Badge className={isCore ? 'bg-emerald-400 text-emerald-950 font-bold' : 'bg-amber-300 text-amber-950 font-bold'}>
                    {isCore ? 'Department Core Course' : `Borrowed Course (${course.department})`}
                  </Badge>
                  {discrepancyCount > 0 && (
                    <Badge className="bg-red-400 text-red-950 font-bold gap-1">
                      <AlertCircle className="w-3 h-3" /> {discrepancyCount} Flagged Discrepanc{discrepancyCount > 1 ? 'ies' : 'y'}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-100">
                  <span className="font-semibold px-2 py-0.5 bg-white/20 rounded text-white">{session} Session</span>
                  <span>•</span>
                  <span>{course.creditUnits} Units</span>
                  <span>•</span>
                  <span>{course.level} Level</span>
                  <span>•</span>
                  <span>{course.semester === 1 ? '1st Semester' : '2nd Semester'}</span>
                </div>
              </div>
              <DialogTitle className="text-2xl font-bold text-white tracking-tight">
                {course.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                {course.hasPendingReview && (
                  <Badge className="bg-amber-400 text-amber-950 font-bold text-xs py-0.5">
                    ● Submitted by Lecturer — Awaiting Chief Examiner Sign-off
                  </Badge>
                )}
                {course.isFullyPublished && (
                  <Badge className="bg-emerald-400 text-emerald-950 font-bold text-xs py-0.5">
                    ✓ Approved & Published to Student Portals
                  </Badge>
                )}
                {!course.hasPendingReview && !course.isFullyPublished && (
                  <Badge className="bg-white/20 text-white font-medium text-xs py-0.5">
                    Lecturer Grade Entry In Progress (Scores Not Submitted Yet)
                  </Badge>
                )}
              </div>
              <DialogDescription className="text-emerald-100/90 text-xs mt-1">
                Official Course BroadSheet, Grade Distribution & Verification Audit for {session} Session
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Lecturer & Workload Overview */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#064e3b] text-white flex items-center justify-center font-bold text-base shadow-2xs flex-shrink-0">
                  {lecturer?.name ? (
                    lecturer.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('')
                  ) : (
                    <UserIcon className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Instructor / Grader
                    </span>
                    {lecturer?.staffId && (
                      <span className="text-[11px] font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 font-semibold">
                        {lecturer.staffId}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {lecturer?.name || 'Unassigned / Department Allocation'}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-slate-400" /> {lecturer?.department || course.department}
                    </span>
                    {lecturer?.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" /> {lecturer.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Statistics Strip */}
              <div className="grid grid-cols-4 gap-3 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700 pt-3 sm:pt-0 sm:pl-4 w-full sm:w-auto text-center">
                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Class Mean</p>
                  <p className="text-sm font-bold text-[#064e3b] dark:text-emerald-400">{count > 0 ? `${classAvg}%` : '-'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Std Dev</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{count > 1 ? `±${stdDev}` : '-'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Pass Rate</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{count > 0 ? passRate : '-'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Max / Min</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{count > 0 ? `${highest} / ${lowest}` : '- / -'}</p>
                </div>
              </div>
            </div>

            {/* Visual Grade Histogram Distribution */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-[#064e3b] dark:text-emerald-400" /> Grade Distribution Analysis ({session})
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Total Scored: {count} Candidates
                </span>
              </div>
              
              {count === 0 ? (
                <div className="p-4 text-center rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No scores submitted yet for the {session} session. Continuous assessment (40) and examination (60) score distributions will be computed once the course lecturer submits the grade sheet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-6 gap-2 pt-1">
                  {(['A', 'B', 'C', 'D', 'E', 'F'] as const).map((grade) => {
                    const gCount = gradeCounts[grade] || 0;
                    const pct = count > 0 ? Math.round((gCount / count) * 100) : 0;
                    let barColor = 'bg-slate-400';
                    if (grade === 'A') barColor = 'bg-emerald-500';
                    else if (grade === 'B') barColor = 'bg-teal-500';
                    else if (grade === 'C') barColor = 'bg-blue-500';
                    else if (grade === 'D') barColor = 'bg-amber-500';
                    else if (grade === 'E') barColor = 'bg-orange-500';
                    else if (grade === 'F') barColor = 'bg-red-500';

                    return (
                      <div key={grade} className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg text-center border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span>Grade {grade}</span>
                          <span className="font-mono text-slate-600 dark:text-slate-300">{gCount}</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{pct}%</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Submission Status & Audit Notice */}
            {unscoredCount > 0 ? (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold">Partial Submission Notice</p>
                  <p className="text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                    {count} of {detailedResults.length} registered candidates have scores submitted. {unscoredCount} candidate(s) are awaiting lecturer score entry. You can approve current scores or return the roster for complete entry.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold">Complete Grade Sheet</p>
                  <p className="text-emerald-800 dark:text-emerald-300 mt-0.5">
                    All {count} registered candidates have continuous assessment & exam scores recorded. Ready for official approval.
                  </p>
                </div>
              </div>
            )}

            {/* Student Scores Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-100/75 dark:bg-slate-800/75 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#064e3b] dark:text-emerald-400" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Candidate Score Roster ({session})
                  </span>
                </div>

                {/* Candidate Roster Filter Tabs */}
                <div className="flex items-center bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setRosterFilter('all')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                      rosterFilter === 'all'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    All ({detailedResults.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRosterFilter('scored')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                      rosterFilter === 'scored'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    Scored ({count})
                  </button>
                  {unscoredCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setRosterFilter('unscored')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                        rosterFilter === 'unscored'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                      }`}
                    >
                      Awaiting ({unscoredCount})
                    </button>
                  )}
                </div>
              </div>
              
              <div className="max-h-72 overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-slate-50 dark:bg-slate-800 z-10">
                    <TableRow className="border-b border-slate-200 dark:border-slate-700">
                      <TableHead className="w-10 text-center font-bold text-slate-700 dark:text-slate-300">#</TableHead>
                      <TableHead className="font-bold text-slate-700 dark:text-slate-300">Matric No.</TableHead>
                      <TableHead className="font-bold text-slate-700 dark:text-slate-300">Student Name</TableHead>
                      <TableHead className="text-center font-bold text-slate-700 dark:text-slate-300">CA (40)</TableHead>
                      <TableHead className="text-center font-bold text-slate-700 dark:text-slate-300">Exam (60)</TableHead>
                      <TableHead className="text-center font-bold text-slate-700 dark:text-slate-300">Total (100)</TableHead>
                      <TableHead className="text-center font-bold text-slate-700 dark:text-slate-300">Grade</TableHead>
                      <TableHead className="text-center font-bold text-slate-700 dark:text-slate-300">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedResults.map((dr: any, idx: number) => {
                      const grade = dr.result?.grade;
                      const ca = dr.result?.caScore;
                      const exam = dr.result?.examScore;
                      const isAnomalous = (ca !== null && ca !== undefined && ca > 40) || (exam !== null && exam !== undefined && exam > 60);

                      let gradeColor = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                      if (grade === 'A') gradeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300';
                      else if (grade === 'B') gradeColor = 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950 dark:text-teal-300';
                      else if (grade === 'C') gradeColor = 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300';
                      else if (grade === 'D') gradeColor = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300';
                      else if (grade === 'E') gradeColor = 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300';
                      else if (grade === 'F') gradeColor = 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300';

                      return (
                        <TableRow key={dr.enrollment?.id || idx} className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/60 ${isAnomalous ? 'bg-red-50/40 dark:bg-red-950/20' : ''}`}>
                          <TableCell className="text-center text-xs text-slate-400 font-mono">{idx + 1}</TableCell>
                          <TableCell className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {dr.student?.matricNumber || 'N/A'}
                          </TableCell>
                          <TableCell className="font-medium text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                            {dr.student?.name || 'Unknown Student'}
                          </TableCell>
                          <TableCell className="text-center font-mono text-xs text-slate-700 dark:text-slate-300">
                            {ca !== null && ca !== undefined ? ca : '-'}
                          </TableCell>
                          <TableCell className="text-center font-mono text-xs text-slate-700 dark:text-slate-300">
                            {exam !== null && exam !== undefined ? exam : '-'}
                          </TableCell>
                          <TableCell className="text-center font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                            {dr.result?.totalScore !== null && dr.result?.totalScore !== undefined ? dr.result.totalScore : '-'}
                          </TableCell>
                          <TableCell className="text-center">
                            {grade ? (
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-bold text-xs border ${gradeColor}`}>
                                {grade}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge 
                              variant={
                                dr.result?.status === 'Published' ? 'success' :
                                dr.result?.status === 'Submitted' ? 'warning' :
                                'secondary'
                              }
                              className="text-[10px] py-0 px-1.5"
                            >
                              {dr.result?.status === 'Submitted'
                                ? 'Submitted'
                                : dr.result?.status === 'Published'
                                ? 'Published'
                                : 'Pending Entry'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {displayedResults.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-slate-500 py-8">
                          No candidates found matching the selected filter.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportCSV} className="h-8 px-3 gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800">
                <Download className="w-3.5 h-3.5" /> Export
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 px-3 gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800">
                <Printer className="w-3.5 h-3.5" /> Print
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {course.hasPendingReview && onReject && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-3 gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 bg-white dark:bg-slate-800 border-red-200 dark:border-red-900" 
                  onClick={() => {
                    onReject(course.id);
                    onOpenChange(false);
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Return
                </Button>
              )}
              {course.hasPendingReview && onApprove && (
                <Button 
                  size="sm" 
                  className="h-8 px-3.5 gap-1.5 text-xs font-semibold bg-[#064e3b] hover:bg-[#065f46] text-white shadow-2xs" 
                  onClick={() => {
                    onApprove(course.id);
                    onOpenChange(false);
                  }}
                >
                  <Check className="w-3.5 h-3.5" /> Approve
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-8 px-3 text-xs font-medium">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
