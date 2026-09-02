import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Search, ChevronRight, Mail, Phone, MapPin, AlertCircle, BookOpen } from 'lucide-react';

interface DepartmentStudentsTableProps {
  department: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredStudents: any[];
}

export const DepartmentStudentsTable: React.FC<DepartmentStudentsTableProps> = ({
  department,
  searchQuery,
  setSearchQuery,
  filteredStudents,
}) => {
  return (
    <Card>
      <CardHeader className="border-b border-slate-100 p-6 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Department Students</CardTitle>
          <CardDescription>View all students registered in the {department} department.</CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search name or matric..." 
              className="pl-9 w-64 bg-slate-50 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Badge variant="secondary" className="bg-emerald-50 text-[#059669] text-sm py-1.5 px-3 rounded-lg border-none shadow-sm h-10 flex items-center">
            {filteredStudents.length} Enrolled
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matric Number</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <Dialog key={student.id}>
                <DialogTrigger asChild>
                  <TableRow className="cursor-pointer group">
                    <TableCell className="font-mono font-medium text-[#059669]">{student.matricNumber}</TableCell>
                    <TableCell className="font-bold text-slate-800 group-hover:text-[#064e3b] transition-colors">{student.name}</TableCell>
                    <TableCell className="text-slate-500">{student.email}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center text-xs font-bold text-[#064e3b] group-hover:underline">
                        View Profile <ChevronRight className="w-3 h-3 ml-1" />
                      </span>
                    </TableCell>
                  </TableRow>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-xl text-[#064e3b]">Student Profile</DialogTitle>
                    <DialogDescription>Comprehensive details for {student.name}</DialogDescription>
                  </DialogHeader>
                  
                  <div className="mt-4 space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="w-16 h-16 bg-[#064e3b] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {student.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
                        <p className="font-mono text-[#059669] font-medium">{student.matricNumber}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider"><Mail className="w-3 h-3 mr-1" /> Email</span>
                        <p className="text-sm font-medium text-slate-900">{student.email}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider"><Phone className="w-3 h-3 mr-1" /> Phone</span>
                        <p className="text-sm font-medium text-slate-900">{student.phoneNumber || 'Not provided'}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider"><AlertCircle className="w-3 h-3 mr-1" /> Emergency Contact</span>
                        <p className="text-sm font-medium text-slate-900">{student.emergencyContact || 'Not provided'}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider"><MapPin className="w-3 h-3 mr-1" /> Address</span>
                        <p className="text-sm font-medium text-slate-900">{student.address || 'Not provided'}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider"><BookOpen className="w-3 h-3 mr-1" /> College & Dept</span>
                        <p className="text-sm font-medium text-slate-900">{student.college} • {student.department}</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-slate-500 py-12">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-8 w-8 text-slate-300 mb-3" />
                    <p>No students found matching your search.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
