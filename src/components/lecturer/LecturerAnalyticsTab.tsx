import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { FileBarChart } from 'lucide-react';
import { Course, User } from '../../types';
import { LecturerCohortCards } from './LecturerCohortCards';
import { LecturerCohortRoster } from './LecturerCohortRoster';

export interface CategorizedStudent {
  enrollmentId: string;
  student?: User;
  caScore: number | null;
  examScore: number | null;
  totalScore: number | null;
  grade: string;
  category: 'distinction' | 'good' | 'atRisk' | 'failing' | 'incomplete';
  isLowCa: boolean;
  isLowExam: boolean;
  insight: string;
  status: string;
}

export interface LecturerAnalyticsData {
  avgScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  chartData: { name: string; count: number; color?: string }[];
  activeCount: number;
  categorizedStudents?: CategorizedStudent[];
  distinctionCount?: number;
  goodCount?: number;
  atRiskCount?: number;
  failingCount?: number;
  incompleteCount?: number;
}

interface LecturerAnalyticsTabProps {
  selectedCourse: Course | null;
  totalEnrolled?: number;
  analytics: LecturerAnalyticsData | null;
}

export const LecturerAnalyticsTab: React.FC<LecturerAnalyticsTabProps> = ({
  selectedCourse,
  analytics,
}) => {
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!analytics || !selectedCourse) {
    return (
      <Card id="lecturer-no-analytics" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardContent className="p-12 text-center">
          <FileBarChart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">No Course Selected</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">
            Select a course from your assigned teaching load to view detailed academic cohort analytics.
          </p>
        </CardContent>
      </Card>
    );
  }

  const categorizedStudents = analytics.categorizedStudents || [];

  const handleExportCohortCsv = () => {
    const headers = ['Matric Number', 'Student Name', 'CA Score (40)', 'Exam Score (60)', 'Total Score', 'Grade', 'Diagnostic Insight'];
    const rows = categorizedStudents.map((s) => [
      s.student?.matricNumber || 'N/A',
      `"${s.student?.name || 'N/A'}"`,
      s.caScore !== null ? s.caScore : 'N/A',
      s.examScore !== null ? s.examScore : 'N/A',
      s.totalScore !== null ? s.totalScore : 'N/A',
      s.grade,
      `"${s.insight}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedCourse.code}_Cohort_Analytics.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="lecturer-analytics-tab" className="space-y-6">
      {/* Overview Stat Cards & Bar Chart */}
      <LecturerCohortCards analytics={analytics} />

      {/* Cohort Diagnostic Table with Filter & Search */}
      <LecturerCohortRoster
        selectedCourse={selectedCourse}
        categorizedStudents={categorizedStudents}
        selectedGradeFilter={selectedGradeFilter}
        setSelectedGradeFilter={setSelectedGradeFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onExportCsv={handleExportCohortCsv}
      />
    </div>
  );
};
