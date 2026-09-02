import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { User as UserIcon, Mail, ShieldCheck, Check, X, Download, Printer, Award, BookOpen } from 'lucide-react';
import { User } from '../../types';

interface CourseResultModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  course: any;
  lecturer?: User | null;
  onApprove?: (courseId: string) => void;
  onReject?: (courseId: string) => void;
}

export const CourseResultModal: React.FC<CourseResultModalProps> = ({
  isOpen,
  onOpenChange,
  course,
  lecturer,
  onApprove,
  onReject,
}) => {
  if (!course) return null;

  const detailedResults = course.detailedResults || [];
  
  // Calculate quick stats
  const validScores = detailedResults
    .filter((dr: any) => dr.result?.totalScore !== null && dr.result?.totalScore !== undefined)
    .map((dr: any) => dr.result.totalScore);
  
  const classAvg = validScores.length > 0
    ? (validScores.reduce((acc: number, val: number) => acc + val, 0) / validScores.length).toFixed(1)
    : 'N/A';
  
  const passCount = detailedResults.filter((dr: any) => {
    const grade = dr.result?.grade;
    return grade && ['A', 'B', 'C', 'D'].includes(grade);
  }).length;

  const passRate = validScores.length > 0 
    ? `${Math.round((passCount / validScores.length) * 100)}%` 
    : 'N/A';

  const exportCSV = () => {
    const headers = ['Matric Number', 'Student Name', 'Course Code', 'Course Title', 'CA Score', 'Exam Score', 'Total Score', 'Grade', 'Status', 'Lecturer'];
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[88vh] flex flex-col p-0 overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-6 bg-gradient-to-r from-[#064e3b] to-[#047857] text-white">
          <DialogHeader>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm px-2.5 py-1 bg-white/20 rounded-md font-bold tracking-wider">
                  {course.code}
                </span>
                <Badge className={isCore ? 'bg-emerald-400 text-emerald-950 font-bold' : 'bg-amber-300 text-amber-950 font-bold'}>
                  {isCore ? 'Department Core Course' : `Borrowed Course (${course.department})`}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-100">
                <span>{course.creditUnits} Credit Units</span>
                <span>•</span>
                <span>{course.level} Level</span>
                <span>•</span>
                <span>{course.semester === 1 ? '1st Semester' : '2nd Semester'}</span>
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-white tracking-tight">
              {course.title}
            </DialogTitle>
            <DialogDescription className="text-emerald-100/90 text-sm mt-0.5">
              Official Course BroadSheet & Grade Verification Audit
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* LECTURER BANNER (Crucial User Requirement: prominent instructor info at top) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#064e3b] text-white flex items-center justify-center font-bold text-lg shadow-xs flex-shrink-0">
                {lecturer?.name ? (
                  lecturer.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('')
                ) : (
                  <UserIcon className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Course Instructor / Grader
                  </span>
                  {lecturer?.staffId && (
                    <span className="text-xs font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-semibold">
                      {lecturer.staffId}
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {lecturer?.name || 'Unassigned / Department Allocation'}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
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

            {/* Status & Quick Stats */}
            <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4 w-full sm:w-auto justify-between sm:justify-start">
              <div className="text-center sm:text-right">
                <p className="text-xs text-slate-500 font-medium">Class Average</p>
                <p className="text-lg font-bold text-[#064e3b]">{classAvg}{typeof classAvg === 'number' || !isNaN(Number(classAvg)) ? '%' : ''}</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-xs text-slate-500 font-medium">Pass Rate</p>
                <p className="text-lg font-bold text-[#059669]">{passRate}</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-xs text-slate-500 font-medium">Enrolled</p>
                <p className="text-lg font-bold text-slate-800">{detailedResults.length}</p>
              </div>
            </div>
          </div>

          {/* Student Scores Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="bg-slate-100/75 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#064e3b]" />
                <span className="text-sm font-bold text-slate-800">Student Performance Register</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {detailedResults.length} registered candidate{detailedResults.length === 1 ? '' : 's'}
              </span>
            </div>
            
            <div className="max-h-72 overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-slate-50 z-10">
                  <TableRow>
                    <TableHead className="w-12 text-center font-bold">#</TableHead>
                    <TableHead className="font-bold">Matric No.</TableHead>
                    <TableHead className="font-bold">Student Name</TableHead>
                    <TableHead className="text-center font-bold">CA (40)</TableHead>
                    <TableHead className="text-center font-bold">Exam (60)</TableHead>
                    <TableHead className="text-center font-bold">Total (100)</TableHead>
                    <TableHead className="text-center font-bold">Grade</TableHead>
                    <TableHead className="text-center font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailedResults.map((dr: any, idx: number) => {
                    const grade = dr.result?.grade;
                    let gradeColor = 'bg-slate-100 text-slate-700';
                    if (grade === 'A') gradeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                    else if (grade === 'B') gradeColor = 'bg-blue-100 text-blue-800 border-blue-300';
                    else if (grade === 'C') gradeColor = 'bg-amber-100 text-amber-800 border-amber-300';
                    else if (grade === 'D') gradeColor = 'bg-orange-100 text-orange-800 border-orange-300';
                    else if (grade === 'F') gradeColor = 'bg-red-100 text-red-800 border-red-300';

                    return (
                      <TableRow key={dr.enrollment?.id || idx} className="hover:bg-slate-50/80">
                        <TableCell className="text-center text-xs text-slate-400 font-mono">{idx + 1}</TableCell>
                        <TableCell className="font-mono text-xs font-semibold text-slate-800">
                          {dr.student?.matricNumber || 'N/A'}
                        </TableCell>
                        <TableCell className="font-medium text-slate-900 text-sm">
                          {dr.student?.name || 'Unknown Student'}
                        </TableCell>
                        <TableCell className="text-center font-mono text-slate-700">
                          {dr.result?.caScore !== null && dr.result?.caScore !== undefined ? dr.result.caScore : '-'}
                        </TableCell>
                        <TableCell className="text-center font-mono text-slate-700">
                          {dr.result?.examScore !== null && dr.result?.examScore !== undefined ? dr.result.examScore : '-'}
                        </TableCell>
                        <TableCell className="text-center font-mono font-bold text-slate-900">
                          {dr.result?.totalScore !== null && dr.result?.totalScore !== undefined ? dr.result.totalScore : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {grade ? (
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md font-bold text-xs border ${gradeColor}`}>
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
                            className="text-xs"
                          >
                            {dr.result?.status || 'No Score'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {detailedResults.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-slate-500 py-8">
                        No student enrollments found for this course.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV} className="gap-1.5 text-slate-700 bg-white">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 text-slate-700 bg-white">
              <Printer className="w-4 h-4" /> Print BroadSheet
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {course.hasPendingReview && onReject && (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 bg-white border-red-200" 
                onClick={() => {
                  onReject(course.id);
                  onOpenChange(false);
                }}
              >
                <X className="w-4 h-4" /> Return to Lecturer
              </Button>
            )}
            {course.hasPendingReview && onApprove && (
              <Button 
                size="sm" 
                className="gap-1.5 bg-[#064e3b] hover:bg-[#065f46] text-white shadow-sm" 
                onClick={() => {
                  onApprove(course.id);
                  onOpenChange(false);
                }}
              >
                <Check className="w-4 h-4" /> Approve & Publish
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
