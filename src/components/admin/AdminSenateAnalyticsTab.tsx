import React, { useState, useMemo } from 'react';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import {
  computeSenateInstitutionalAnalytics,
  StudentSenateSummary,
  CourseAnomaly,
  exportSenateBroadsheetToCsv,
} from '../../lib/senateAnalytics';
import { User, Course, Enrollment, Result, Department } from '../../types';
import { SenateBroadsheetModal } from './SenateBroadsheetModal';
import { SenateStudentProfileModal } from './SenateStudentProfileModal';
import { AcademicAnomalyModal } from './AcademicAnomalyModal';
import {
  SenateMetricsHeader,
  SenateChartsOverview,
  SenateBroadsheetTable,
  SenateDepartmentTable,
  SenateAnomalyTable,
} from './senate';

interface AdminSenateAnalyticsTabProps {
  users: User[];
  courses: Course[];
  departments: Department[];
  enrollments?: Enrollment[];
  results?: Result[];
  session?: string;
  semester?: 1 | 2;
}

export const AdminSenateAnalyticsTab: React.FC<AdminSenateAnalyticsTabProps> = ({
  users,
  courses,
  departments,
  enrollments = [],
  results = [],
  session = '2025/2026',
  semester = 1,
}) => {
  // Filters
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'broadsheet' | 'departments' | 'anomalies'>('broadsheet');

  // Modals state
  const [isBroadsheetModalOpen, setIsBroadsheetModalOpen] = useState(false);
  const [selectedStudentSummary, setSelectedStudentSummary] = useState<StudentSenateSummary | null>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState<CourseAnomaly | null>(null);

  // Compute live analytics
  const analytics = useMemo(() => {
    return computeSenateInstitutionalAnalytics(users, courses, enrollments, results, {
      department: selectedDept,
      level: selectedLevel,
    });
  }, [users, courses, enrollments, results, selectedDept, selectedLevel]);

  // Filter student summaries for the table
  const filteredStudents = useMemo(() => {
    return analytics.studentSummaries.filter((s) => {
      const matchesClass = selectedClass === 'all' || s.classOfDegree === selectedClass;
      const matchesSearch =
        searchQuery === '' ||
        s.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.student.matricNumber &&
          s.student.matricNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.student.department &&
          s.student.department.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesClass && matchesSearch;
    });
  }, [analytics.studentSummaries, selectedClass, searchQuery]);

  const handleExportCsv = () => {
    exportSenateBroadsheetToCsv(
      filteredStudents,
      `Senate_Broadsheet_${session.replace('/', '-')}_${selectedDept}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner, Action Buttons & 6 Key Metric Cards */}
      <SenateMetricsHeader
        analytics={analytics}
        onExportCsv={handleExportCsv}
        onOpenBroadsheetModal={() => setIsBroadsheetModalOpen(true)}
      />

      {/* Visual Charts Overview */}
      <SenateChartsOverview analytics={analytics} />

      {/* Sub-view Navigation Bar & Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Subtabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveSubTab('broadsheet')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'broadsheet'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Degree Broadsheet ({filteredStudents.length})
            </button>
            <button
              onClick={() => setActiveSubTab('departments')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'departments'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Department Benchmarks ({analytics.departmentBenchmarks.length})
            </button>
            <button
              onClick={() => setActiveSubTab('anomalies')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeSubTab === 'anomalies'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Course Anomaly Radar (
              {analytics.courseAnomalies.filter((a) => a.anomalySeverity !== 'Normal').length})
            </button>
          </div>

          {/* Department & Level Selector Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs h-8 px-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(Number(e.target.value))}
              className="text-xs h-8 px-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value={0}>All Levels</option>
              <option value={100}>100 Level</option>
              <option value={200}>200 Level</option>
              <option value={300}>300 Level</option>
              <option value={400}>400 Level (Final Year)</option>
            </select>

            {activeSubTab === 'broadsheet' && (
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="text-xs h-8 px-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="all">All Degree Classes</option>
                <option value="First Class">First Class</option>
                <option value="Second Class Upper">2nd Class Upper</option>
                <option value="Second Class Lower">2nd Class Lower</option>
                <option value="Third Class">Third Class</option>
                <option value="Pass">Pass Degree</option>
                <option value="Probation / Warning">Probation / Warning</option>
              </select>
            )}

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search student or matric..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs h-8 pl-8 w-44 sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* Sub-view 1: Broadsheet Table */}
        {activeSubTab === 'broadsheet' && (
          <SenateBroadsheetTable
            students={filteredStudents}
            onSelectStudent={(s) => setSelectedStudentSummary(s)}
          />
        )}

        {/* Sub-view 2: Department Benchmarks */}
        {activeSubTab === 'departments' && (
          <SenateDepartmentTable departmentBenchmarks={analytics.departmentBenchmarks} />
        )}

        {/* Sub-view 3: Course Anomaly Radar */}
        {activeSubTab === 'anomalies' && (
          <SenateAnomalyTable
            courseAnomalies={analytics.courseAnomalies}
            onSelectAnomaly={(a) => setSelectedAnomaly(a)}
          />
        )}
      </div>

      {/* Modals */}
      <SenateBroadsheetModal
        isOpen={isBroadsheetModalOpen}
        onClose={() => setIsBroadsheetModalOpen(false)}
        students={filteredStudents}
        departmentFilter={selectedDept === 'all' ? 'All Departments' : selectedDept}
        levelFilter={selectedLevel}
        session={session}
        semester={semester}
      />

      <SenateStudentProfileModal
        isOpen={selectedStudentSummary !== null}
        onClose={() => setSelectedStudentSummary(null)}
        studentSummary={selectedStudentSummary}
      />

      <AcademicAnomalyModal
        isOpen={selectedAnomaly !== null}
        onClose={() => setSelectedAnomaly(null)}
        anomaly={selectedAnomaly}
      />
    </div>
  );
};
