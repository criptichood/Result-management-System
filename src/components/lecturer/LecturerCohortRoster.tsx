import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Download, Filter } from 'lucide-react';
import { CategorizedStudent } from './LecturerAnalyticsTab';
import { Course } from '../../types';

interface LecturerCohortRosterProps {
  selectedCourse: Course;
  categorizedStudents: CategorizedStudent[];
  selectedGradeFilter: string;
  setSelectedGradeFilter: (filter: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onExportCsv: () => void;
}

export const LecturerCohortRoster: React.FC<LecturerCohortRosterProps> = ({
  selectedCourse,
  categorizedStudents,
  selectedGradeFilter,
  setSelectedGradeFilter,
  searchTerm,
  setSearchTerm,
  onExportCsv,
}) => {
  const filteredStudents = categorizedStudents.filter((item) => {
    if (selectedGradeFilter !== 'all') {
      if (selectedGradeFilter === 'A' && item.grade !== 'A') return false;
      if (selectedGradeFilter === 'B' && item.grade !== 'B') return false;
      if (selectedGradeFilter === 'C' && item.grade !== 'C') return false;
      if (selectedGradeFilter === 'D' && item.grade !== 'D') return false;
      if (selectedGradeFilter === 'F' && item.grade !== 'F') return false;
      if (selectedGradeFilter === 'atRisk' && item.grade !== 'D' && item.grade !== 'F') return false;
      if (selectedGradeFilter === 'incomplete' && item.grade !== 'Incomplete') return false;
    }

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const nameMatch = item.student?.name?.toLowerCase().includes(q) || false;
      const matricMatch = item.student?.matricNumber?.toLowerCase().includes(q) || false;
      return nameMatch || matricMatch;
    }

    return true;
  });

  return (
    <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <CardContent className="p-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <Input
              placeholder="Search candidate name or matric..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {['all', 'A', 'B', 'C', 'D', 'F', 'atRisk'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedGradeFilter(filter)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  selectedGradeFilter === filter
                    ? 'bg-[#064e3b] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {filter === 'all'
                  ? 'All Grades'
                  : filter === 'atRisk'
                  ? 'At Risk (D/F)'
                  : `Grade ${filter}`}
              </button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={onExportCsv}
              className="text-xs h-7 gap-1 ml-2 text-slate-700 dark:text-slate-300"
            >
              <Download className="w-3 h-3" /> Export
            </Button>
          </div>
        </div>

        {/* Roster Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Matric No</th>
                <th className="py-2.5 px-3">Student Full Name</th>
                <th className="py-2.5 px-3 text-center">CA (40)</th>
                <th className="py-2.5 px-3 text-center">Exam (60)</th>
                <th className="py-2.5 px-3 text-center">Total (100)</th>
                <th className="py-2.5 px-3 text-center">Grade</th>
                <th className="py-2.5 px-3">Academic Diagnostic Insight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((s) => (
                <tr key={s.enrollmentId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {s.student?.matricNumber}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                    {s.student?.name}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-700 dark:text-slate-300">
                    {s.caScore !== null ? s.caScore : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-700 dark:text-slate-300">
                    {s.examScore !== null ? s.examScore : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900 dark:text-slate-100">
                    {s.totalScore !== null ? s.totalScore : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Badge
                      variant={
                        s.grade === 'A' || s.grade === 'B'
                          ? 'success'
                          : s.grade === 'C'
                          ? 'default'
                          : s.grade === 'D'
                          ? 'warning'
                          : s.grade === 'F'
                          ? 'destructive'
                          : 'outline'
                      }
                      className="font-bold text-[11px]"
                    >
                      {s.grade}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-[11px] text-slate-600 dark:text-slate-400">
                    {s.insight}
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No students match the current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
