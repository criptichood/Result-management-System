import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';

interface GradingScoreTableProps {
  students: any[];
  scores: Record<string, { ca: string; exam: string }>;
  isLocked: boolean;
  onScoreChange: (enrollmentId: string, type: 'ca' | 'exam', value: string) => void;
  calculateGrade: (total: number) => string;
}

export const GradingScoreTable: React.FC<GradingScoreTableProps> = ({
  students,
  scores,
  isLocked,
  onScoreChange,
  calculateGrade,
}) => {
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentIdx: number,
    type: 'ca' | 'exam'
  ) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextId = `score-input-${type}-${currentIdx + 1}`;
      const nextElem = document.getElementById(nextId) as HTMLInputElement;
      if (nextElem) nextElem.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevId = `score-input-${type}-${currentIdx - 1}`;
      const prevElem = document.getElementById(prevId) as HTMLInputElement;
      if (prevElem) prevElem.focus();
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/70 dark:bg-slate-800/50">
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead className="w-36">Matric No.</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead className="w-28 text-center">CA (Max 40)</TableHead>
            <TableHead className="w-28 text-center">Exam (Max 60)</TableHead>
            <TableHead className="w-24 text-center">Total (100)</TableHead>
            <TableHead className="w-20 text-center">Grade</TableHead>
            <TableHead className="text-right pr-6">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((s, idx) => {
            const caVal = scores[s.enrollmentId]?.ca;
            const examVal = scores[s.enrollmentId]?.exam;
            const caNum = parseFloat(caVal) || 0;
            const examNum = parseFloat(examVal) || 0;
            const hasScore = caVal !== '' || examVal !== '';
            const total = hasScore ? caNum + examNum : 0;

            const caOutOfRange = caVal !== '' && (isNaN(caNum) || caNum < 0 || caNum > 40);
            const examOutOfRange =
              examVal !== '' && (isNaN(examNum) || examNum < 0 || examNum > 60);

            return (
              <TableRow key={s.enrollmentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <TableCell className="text-center text-slate-400 font-mono text-xs">
                  {idx + 1}
                </TableCell>
                <TableCell className="font-mono font-medium text-slate-900 dark:text-slate-100">
                  {s.student?.matricNumber}
                </TableCell>
                <TableCell className="font-medium text-slate-800 dark:text-slate-200">
                  {s.student?.name}
                </TableCell>
                <TableCell>
                  <div className="relative">
                    <Input
                      id={`score-input-ca-${idx}`}
                      type="number"
                      min="0"
                      max="40"
                      aria-label={`CA score for ${s.student?.matricNumber}`}
                      className={`text-center h-8 font-mono text-xs ${
                        caOutOfRange
                          ? 'border-red-500 focus:ring-red-500 bg-red-50/50 dark:bg-red-950/20'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                      }`}
                      value={scores[s.enrollmentId]?.ca ?? ''}
                      onChange={(e) => onScoreChange(s.enrollmentId, 'ca', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, idx, 'ca')}
                      disabled={isLocked}
                      placeholder="0-40"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="relative">
                    <Input
                      id={`score-input-exam-${idx}`}
                      type="number"
                      min="0"
                      max="60"
                      aria-label={`Exam score for ${s.student?.matricNumber}`}
                      className={`text-center h-8 font-mono text-xs ${
                        examOutOfRange
                          ? 'border-red-500 focus:ring-red-500 bg-red-50/50 dark:bg-red-950/20'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                      }`}
                      value={scores[s.enrollmentId]?.exam ?? ''}
                      onChange={(e) => onScoreChange(s.enrollmentId, 'exam', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, idx, 'exam')}
                      disabled={isLocked}
                      placeholder="0-60"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center font-mono font-bold text-slate-900 dark:text-slate-100">
                  {hasScore ? total : '-'}
                </TableCell>
                <TableCell className="text-center">
                  {hasScore ? (
                    <span
                      className={`font-black ${
                        total >= 70
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : total >= 40
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {calculateGrade(total)}
                    </span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right pr-6">
                  {s.result?.status === 'Published' ? (
                    <Badge variant="success">Published</Badge>
                  ) : s.result?.status === 'Submitted' ? (
                    <Badge variant="warning">Submitted</Badge>
                  ) : s.result?.status === 'Rejected' ? (
                    <Badge variant="destructive">Revision</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })}

          {students.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-slate-500 py-12">
                No candidates match the active search or filter criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
