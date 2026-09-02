import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { FileSearch, CheckCircle2, User as UserIcon } from 'lucide-react';
import { CourseResultModal } from './CourseResultModal';
import { User } from '../../types';

interface PublishedResultsTableProps {
  publishedCourses: any[];
  lecturers?: User[];
}

export const PublishedResultsTable: React.FC<PublishedResultsTableProps> = ({ 
  publishedCourses,
  lecturers = [],
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
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Published Course Results
            </CardTitle>
            <CardDescription className="mt-1">
              Officially approved course broadsheets visible on student grade slips and academic records.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-emerald-50 text-[#059669] text-sm py-1 px-3 rounded-lg border-emerald-100">
            {publishedCourses.length} Courses Published
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-bold">Course Code</TableHead>
                  <TableHead className="font-bold">Course Title</TableHead>
                  <TableHead className="font-bold">Lecturer / Host Dept</TableHead>
                  <TableHead className="text-center font-bold">Enrolled Students</TableHead>
                  <TableHead className="text-center font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold pr-6">BroadSheet Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {publishedCourses.map((course) => {
                  const lecturer = getCourseLecturer(course);

                  return (
                    <TableRow key={course.id} className="hover:bg-slate-50/70">
                      <TableCell className="font-mono font-bold text-[#059669]">
                        {course.code}
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-slate-800 text-sm">{course.title}</p>
                        <p className="text-xs text-slate-500">{course.creditUnits} Units • {course.level}L • Sem {course.semester}</p>
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
                                {lecturer.department || course.department}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-400 text-xs italic">
                            <UserIcon className="w-3.5 h-3.5" />
                            <span>{course.department}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-mono text-sm font-semibold text-slate-700">
                          {course.totalEnrolled} Candidates
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="success" className="text-xs py-1 px-2.5">
                          Published
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1.5 text-slate-700 bg-white hover:text-[#064e3b] hover:bg-slate-50"
                          onClick={() => handleOpenModal(course)}
                        >
                          <FileSearch className="h-3.5 w-3.5" /> View Official BroadSheet
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {publishedCourses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500 py-12">
                      <div className="flex flex-col items-center justify-center">
                        <FileSearch className="h-8 w-8 text-slate-300 mb-2" />
                        <p className="font-medium text-slate-700">No published courses found yet.</p>
                        <p className="text-xs text-slate-400 mt-0.5">Approved course result submissions will appear in this published archive.</p>
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
      />
    </>
  );
};
