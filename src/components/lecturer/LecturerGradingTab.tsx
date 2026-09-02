import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { CheckCircle, Edit, Save, Download, Upload } from 'lucide-react';
import { Course } from '../../types';

interface LecturerGradingTabProps {
  selectedCourse: Course | null;
  students: any[];
  scores: Record<string, { ca: string; exam: string }>;
  onScoreChange: (enrollmentId: string, type: 'ca' | 'exam', value: string) => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
  onDownloadCSV: () => void;
  onUploadCSV: (e: React.ChangeEvent<HTMLInputElement>) => void;
  calculateGrade: (total: number) => string;
}

export const LecturerGradingTab: React.FC<LecturerGradingTabProps> = ({
  selectedCourse,
  students,
  scores,
  onScoreChange,
  onSaveDraft,
  onSubmit,
  onDownloadCSV,
  onUploadCSV,
  calculateGrade,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!selectedCourse) {
    return (
      <div id="lecturer-no-course" className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-slate-500">
        <Edit className="h-10 w-10 mb-2 opacity-20" />
        <p>Select a course to start grading</p>
      </div>
    );
  }

  return (
    <Card id="lecturer-grading-tab">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 p-6">
        <div>
          <CardTitle>{selectedCourse.code}: {selectedCourse.title}</CardTitle>
          <CardDescription>Input Continuous Assessment (CA) and Exam scores.</CardDescription>
        </div>
        <div className="flex space-x-3">
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={onUploadCSV} 
          />
          <Button 
            id="btn-lecturer-import-csv"
            variant="outline" 
            onClick={() => fileInputRef.current?.click()} 
            className="gap-2 bg-white" 
            title="Import from CSV"
          >
            <Upload className="h-4 w-4" /> Import CSV
          </Button>
          <Button 
            id="btn-lecturer-export-csv"
            variant="outline" 
            onClick={onDownloadCSV} 
            className="gap-2 bg-white" 
            title="Download Template/Report"
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button 
            id="btn-lecturer-save-draft"
            variant="outline" 
            onClick={onSaveDraft} 
            className="gap-2 bg-white"
          >
            <Save className="h-4 w-4" /> Save Draft
          </Button>
          <Button 
            id="btn-lecturer-submit-results"
            onClick={onSubmit} 
            className="gap-2 bg-[#059669] hover:bg-emerald-700 text-white"
          >
            <CheckCircle className="h-4 w-4" /> Submit Results
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matric No.</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead className="w-24 text-center">CA (40)</TableHead>
              <TableHead className="w-24 text-center">Exam (60)</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Grade</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((s) => {
              const ca = parseFloat(scores[s.enrollmentId]?.ca) || 0;
              const exam = parseFloat(scores[s.enrollmentId]?.exam) || 0;
              const total = ca + exam;
              const isSubmitted = s.result?.status === 'Submitted' || s.result?.status === 'Published';
              
              return (
                <TableRow key={s.enrollmentId}>
                  <TableCell className="font-medium">{s.student?.matricNumber}</TableCell>
                  <TableCell>{s.student?.name}</TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      min="0" 
                      max="40" 
                      aria-label={`CA score for ${s.student?.matricNumber}`}
                      className="text-center h-8"
                      value={scores[s.enrollmentId]?.ca}
                      onChange={(e) => onScoreChange(s.enrollmentId, 'ca', e.target.value)}
                      disabled={isSubmitted}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      min="0" 
                      max="60" 
                      aria-label={`Exam score for ${s.student?.matricNumber}`}
                      className="text-center h-8"
                      value={scores[s.enrollmentId]?.exam}
                      onChange={(e) => onScoreChange(s.enrollmentId, 'exam', e.target.value)}
                      disabled={isSubmitted}
                    />
                  </TableCell>
                  <TableCell className="text-center font-semibold text-slate-900">
                    {total > 0 ? total : '-'}
                  </TableCell>
                  <TableCell className="text-center font-bold text-[#064e3b]">
                    {total > 0 ? calculateGrade(total) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {isSubmitted ? (
                      <Badge variant="success">Submitted</Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {students.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                  No students enrolled in this course yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
