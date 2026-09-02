import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Users, Mail, Phone, MapPin, AlertCircle, ChevronRight } from 'lucide-react';
import { Course } from '../../types';

interface LecturerClassListTabProps {
  selectedCourse: Course | null;
  students: any[];
  settings: {
    lecturerViewEmail: boolean;
    lecturerViewPhone: boolean;
  };
}

export const LecturerClassListTab: React.FC<LecturerClassListTabProps> = ({
  selectedCourse,
  students,
  settings,
}) => {
  return (
    <Card id="lecturer-class-list-tab">
      <CardHeader className="border-b border-slate-100 p-6">
        <CardTitle>Class List: {selectedCourse ? selectedCourse.code : 'Select a course'}</CardTitle>
        <CardDescription>View all students registered for this course.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {selectedCourse ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matric No.</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Department</TableHead>
                {settings.lecturerViewEmail && <TableHead>Email</TableHead>}
                {settings.lecturerViewPhone && <TableHead>Phone</TableHead>}
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <Dialog key={s.enrollmentId}>
                  <DialogTrigger asChild>
                    <TableRow className="cursor-pointer hover:bg-slate-50 transition-colors">
                      <TableCell className="font-medium text-[#059669]">{s.student?.matricNumber}</TableCell>
                      <TableCell>{s.student?.name}</TableCell>
                      <TableCell className="text-slate-500">{s.student?.department}</TableCell>
                      {settings.lecturerViewEmail && <TableCell className="text-slate-500">{s.student?.email}</TableCell>}
                      {settings.lecturerViewPhone && <TableCell className="text-slate-500">{s.student?.phoneNumber}</TableCell>}
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400" aria-label={`View profile for ${s.student?.name}`}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Student Profile</DialogTitle>
                      <DialogDescription>Details for {s.student?.matricNumber}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-xl">
                          {s.student?.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{s.student?.name}</h3>
                          <p className="text-sm text-[#059669] font-medium">{s.student?.department}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {settings.lecturerViewEmail && (
                          <div className="flex items-center text-sm">
                            <Mail className="w-4 h-4 text-slate-400 mr-3" />
                            <span className="text-slate-700">{s.student?.email}</span>
                          </div>
                        )}
                        {settings.lecturerViewPhone && (
                          <div className="flex items-center text-sm">
                            <Phone className="w-4 h-4 text-slate-400 mr-3" />
                            <span className="text-slate-700">{s.student?.phoneNumber}</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 text-slate-400 mr-3" />
                          <span className="text-slate-700">{s.student?.address || 'No address on file'}</span>
                        </div>
                        <div className="flex items-center text-sm pt-2 mt-2 border-t border-slate-100">
                          <AlertCircle className="w-4 h-4 text-amber-500 mr-3" />
                          <span className="text-slate-700 text-xs flex-1">
                            <span className="font-semibold block text-slate-900">Emergency Contact</span>
                            {s.student?.emergencyContact || 'Not provided'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                    No students enrolled in this course yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500">
            <Users className="h-10 w-10 mb-2 opacity-20" />
            <p>Select a course from the sidebar to view its class list.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
