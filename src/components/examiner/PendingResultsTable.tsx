import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { FileSearch, Check, X, ShieldAlert, User as UserIcon } from 'lucide-react';
import { CourseResultModal } from './CourseResultModal';
import { User } from '../../types';

interface PendingResultsTableProps {
  pendingCourses: any[];
  lecturers?: User[];
  onApprove: (courseId: string) => void;
  onReject: (courseId: string) => void;
}

export const PendingResultsTable: React.FC<PendingResultsTableProps> = ({
  pendingCourses,
  lecturers = [],
  onApprove,
  onReject,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const getCourseLecturer = (course: any): User | null => {
    if (course.lecturerId) {
      const found = lecturers.find(l => l.id === course.lecturerId);
      if (found) return found;
    }
    if (course.detailedResults && course.detailedResults.length > 0) {
      const firstWithLec = course.detailedResults.find((r: any) => r.result?.lecturerId);
      if (firstWithLec?.result?.lecturerId) {
        const found = lecturers.find(l => l.id === firstWithLec.result.lecturerId);
        if (found) return found;
      }
    }
    return null;
  };

  return (
    <>
      <Card className="shadow-2xs">
        <CardHeader className="border-b border-slate-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-[#064e3b] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" /> Results Pending Chief Examiner Moderation
            </CardTitle>
            <CardDescription className="mt-1">
              Audit and verify continuous assessment and examination scores submitted by course lecturers.
            </CardDescription>
          </div>
          {pendingCourses.some(c => c.hasPendingReview) && (
            <Button 
              onClick={() => {
                pendingCourses.filter(c => c.hasPendingReview).forEach(c => onApprove(c.id));
              }}
              className="bg-[#064e3b] hover:bg-[#065f46] text-white shadow-xs"
            >
              Publish All Ready Batches
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-bold">Course Code</TableHead>
                  <TableHead className="font-bold">Title</TableHead>
                  <TableHead className="font-bold">Course Lecturer</TableHead>
                  <TableHead className="text-center font-bold">Submission Status</TableHead>
                  <TableHead className="text-right font-bold pr-6">Moderation Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingCourses.map((course) => {
                  const lecturer = getCourseLecturer(course);

                  return (
                    <TableRow key={course.id} className="hover:bg-slate-50/70">
                      <TableCell className="font-mono font-bold text-[#064e3b]">
                        {course.code}
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-slate-800 text-sm">{course.title}</p>
                        <p className="text-xs text-slate-500">
                          {course.creditUnits} Units • {course.level}L • {course.department}
                        </p>
                      </TableCell>
                      <TableCell>
                        {lecturer ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {lecturer.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('')}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 leading-tight">
                                {lecturer.name}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {lecturer.staffId || lecturer.department}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-400 text-xs italic">
                            <UserIcon className="w-3.5 h-3.5" />
                            <span>Unassigned / Dept Head</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {course.hasPendingReview ? (
                          <Badge variant="warning" className="font-semibold text-xs py-1 px-2.5">
                            {course.submittedCount} / {course.totalEnrolled} Scores Submitted
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-slate-400">
                            Awaiting Lecturer Entry
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-6 space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1 text-slate-700 bg-white hover:text-[#064e3b]" 
                          onClick={() => handleOpenModal(course)}
                        >
                          <FileSearch className="h-3.5 w-3.5" /> Audit Sheet
                        </Button>
                        {course.hasPendingReview && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 bg-white border-red-200" 
                              onClick={() => onReject(course.id)}
                            >
                              <X className="h-3.5 w-3.5" /> Return
                            </Button>
                            <Button 
                              size="sm" 
                              className="gap-1 bg-[#064e3b] hover:bg-[#065f46] text-white shadow-xs" 
                              onClick={() => onApprove(course.id)}
                            >
                              <Check className="h-3.5 w-3.5" /> Approve & Publish
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {pendingCourses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 py-12">
                      <div className="flex flex-col items-center justify-center">
                        <Check className="h-8 w-8 text-emerald-500 mb-2" />
                        <p className="font-medium text-slate-800">All submissions moderated!</p>
                        <p className="text-xs text-slate-400 mt-0.5">There are no course results currently awaiting examiner approval.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CourseResultModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        course={selectedCourse}
        lecturer={selectedCourse ? getCourseLecturer(selectedCourse) : null}
        onApprove={onApprove}
        onReject={onReject}
      />
    </>
  );
};
