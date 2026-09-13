import React, { useMemo, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { calculateSemesterStats, getGradePoint } from '../../lib/academicUtils';
import { Download, Printer, CheckCircle2, FileSpreadsheet } from 'lucide-react';

interface SemesterResultSlipProps {
  semesterKey: string;
  academicYear: string;
  items: any[];
  stats?: {
    gpa: number;
    credits: number;
    coursesCount: number;
    totalQualityPoints?: number;
    failedItems: any[];
  };
  cumulativeCgpa: number;
  onPrintSemester?: (semesterKey: string) => void;
  onExportSemesterCsv?: (semesterKey: string, items: any[]) => Promise<void> | void;
  onQueryGrade?: (item: any) => void;
}

export const SemesterResultSlip: React.FC<SemesterResultSlipProps> = ({
  semesterKey,
  academicYear,
  items,
  stats: propStats,
  cumulativeCgpa,
  onPrintSemester,
  onExportSemesterCsv,
  onQueryGrade,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const stats = useMemo(() => {
    return propStats || calculateSemesterStats(items);
  }, [propStats, items]);

  const handleExport = async () => {
    if (!onExportSemesterCsv) return;
    setIsExporting(true);
    await onExportSemesterCsv(semesterKey, items);
    setIsExporting(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden transition-colors">
      {/* Header with Semester Info and Quick Actions */}
      <div className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{semesterKey}</h2>
            <Badge variant="outline" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold text-xs border-slate-300 dark:border-slate-700">
              {academicYear} Session
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official Semester Result Record • Registered Units: <span className="font-bold text-slate-800 dark:text-slate-200">{stats.credits}</span> • Total Points: <span className="font-bold text-slate-800 dark:text-slate-200">{stats.totalQualityPoints ?? Math.round(stats.gpa * stats.credits)}</span>
          </p>
        </div>

        {/* Right Metric Badges & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 justify-between sm:justify-start">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-left sm:text-center">
              <div className="text-xl sm:text-2xl font-black text-[#064e3b] dark:text-emerald-400">{stats.gpa.toFixed(2)}</div>
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">GPA</div>
            </div>
            <div className="text-left sm:text-center">
              <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">{stats.credits}</div>
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Credits</div>
            </div>
            <div className="text-left sm:text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.coursesCount}</div>
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Courses</div>
            </div>
          </div>

          {/* Quick Single-Semester Actions */}
          <div className="flex items-center gap-2">
            {onExportSemesterCsv && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={isExporting}
                className="h-8 text-xs gap-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700 shadow-xs"
                title="Download this semester's results as CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
              </Button>
            )}
            {onPrintSemester && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPrintSemester(semesterKey)}
                className="h-8 text-xs gap-1.5 bg-white dark:bg-slate-800 text-[#064e3b] dark:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 shadow-xs font-semibold"
                title="Print or view official result slip for this semester"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Full-width Course Result Table */}
      <div className="overflow-x-auto">
        <Table className="w-full min-w-[640px]">
          <TableHeader className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
            <TableRow className="hover:bg-transparent border-slate-200 dark:border-slate-800">
              <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase py-3">Course Code</TableHead>
              <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase py-3">Course Title</TableHead>
              <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase text-center py-3">Units</TableHead>
              <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase text-center py-3">CA (30/40)</TableHead>
              <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase text-center py-3">Exam (70/60)</TableHead>
              <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase text-center py-3">Total (100)</TableHead>
              <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase text-center py-3">Grade</TableHead>
              <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase text-center py-3">GP (5.0)</TableHead>
              <TableHead className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase text-right py-3">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const isPassed = (item.result?.totalScore ?? 0) >= 40;
              const isPublished = item.result?.status === 'Published';
              const grade = item.result?.grade || '-';
              const gp = getGradePoint(grade);

              return (
                <TableRow key={item.enrollment.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/80 transition-colors">
                  <TableCell className="font-bold text-slate-900 dark:text-slate-100 py-3">
                    {item.course?.code}
                  </TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300 font-medium py-3 text-xs sm:text-sm">
                    {item.course?.title}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-slate-800 dark:text-slate-200 py-3">
                    {item.course?.creditUnits}
                  </TableCell>
                  
                  {isPublished ? (
                    <>
                      <TableCell className="text-center text-slate-700 dark:text-slate-300 py-3 font-medium">
                        {item.result.caScore ?? '-'}
                      </TableCell>
                      <TableCell className="text-center text-slate-700 dark:text-slate-300 py-3 font-medium">
                        {item.result.examScore ?? '-'}
                      </TableCell>
                      <TableCell className="text-center font-bold text-slate-900 dark:text-slate-100 py-3">
                        {item.result.totalScore ?? '-'}
                      </TableCell>
                      <TableCell className="text-center font-black text-slate-900 dark:text-slate-100 py-3">
                        {grade}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-slate-700 dark:text-slate-300 py-3">
                        {gp}
                      </TableCell>
                      <TableCell className="text-right py-3">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isPassed 
                              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                              : 'bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                          }`}>
                            {isPassed ? 'Passed' : 'Failed'}
                          </span>
                          {onQueryGrade && (
                            <button
                              type="button"
                              onClick={() => onQueryGrade(item)}
                              className="text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:underline px-1.5 py-0.5 rounded hover:bg-amber-50 dark:hover:bg-amber-950/40"
                              title="Lodge an academic query or remarking petition for this course"
                            >
                              Query
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="text-center text-slate-400 py-3">-</TableCell>
                      <TableCell className="text-center text-slate-400 py-3">-</TableCell>
                      <TableCell className="text-center text-slate-400 py-3">-</TableCell>
                      <TableCell className="text-center text-slate-400 py-3">-</TableCell>
                      <TableCell className="text-center text-slate-400 py-3">-</TableCell>
                      <TableCell className="text-right py-3">
                        <Badge variant="secondary">In Progress</Badge>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Summary Footer Bar */}
      <div className="p-4 bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <div>
            <span className="text-slate-500 dark:text-slate-400">Semester GPA: </span>
            <span className="text-emerald-700 dark:text-emerald-400 font-black text-sm">{stats.gpa.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Cumulative CGPA: </span>
            <span className="text-slate-900 dark:text-white font-bold text-sm">{cumulativeCgpa.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Registered Credits: </span>
            <span className="text-slate-900 dark:text-slate-100 font-bold">{stats.credits}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Quality Points: </span>
            <span className="text-slate-900 dark:text-slate-100 font-bold">{stats.totalQualityPoints ?? Math.round(stats.gpa * stats.credits)}</span>
          </div>
        </div>
      </div>

      {/* CUMULATIVE OUTSTANDING COURSES section */}
      <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          Cumulative Outstanding / Carryover Courses
        </h4>
        {stats.failedItems.length > 0 ? (
          <div className="bg-red-50/70 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg p-3 space-y-1.5">
            {stats.failedItems.map((fail: any) => (
              <div key={fail.enrollment.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-red-800 dark:text-red-300 gap-1">
                <span><strong>{fail.course?.code}</strong> - {fail.course?.title} ({fail.course?.creditUnits} Units)</span>
                <span className="font-bold">Score: {fail.result?.totalScore} ({fail.result?.grade}) • Carryover Required</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            NIL — All enrolled courses for this session were successfully cleared.
          </p>
        )}
      </div>
    </div>
  );
};


