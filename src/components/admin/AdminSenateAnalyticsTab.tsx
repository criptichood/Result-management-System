import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Users,
  Award,
  TrendingUp,
  AlertTriangle,
  GraduationCap,
  Download,
  Printer,
  Search,
  Filter,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  Eye,
  CheckCircle2,
  Building2,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  CartesianGrid
} from 'recharts';
import {
  computeSenateInstitutionalAnalytics,
  StudentSenateSummary,
  CourseAnomaly,
  DepartmentBenchmark,
  exportSenateBroadsheetToCsv
} from '../../lib/senateAnalytics';
import { User, Course, Enrollment, Result, Department } from '../../types';
import { SenateBroadsheetModal } from './SenateBroadsheetModal';
import { SenateStudentProfileModal } from './SenateStudentProfileModal';
import { AcademicAnomalyModal } from './AcademicAnomalyModal';

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
  session = '2024/2025',
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
    return analytics.studentSummaries.filter(s => {
      const matchesClass = selectedClass === 'all' || s.classOfDegree === selectedClass;
      const matchesSearch = searchQuery === '' ||
        s.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.student.matricNumber && s.student.matricNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.student.department && s.student.department.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesClass && matchesSearch;
    });
  }, [analytics.studentSummaries, selectedClass, searchQuery]);

  const handleExportCsv = () => {
    exportSenateBroadsheetToCsv(filteredStudents, `Senate_Broadsheet_${session.replace('/', '-')}_${selectedDept}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Executive Senate Academic Analytics & Degree Broadsheet
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Institutional performance metrics, 5.0 scale degree classifications, graduation clearance, and departmental benchmarks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            id="btn-export-senate-csv"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="text-xs h-9 gap-1.5 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Broadsheet (CSV)</span>
          </Button>

          <Button
            id="btn-open-senate-broadsheet-modal"
            size="sm"
            onClick={() => setIsBroadsheetModalOpen(true)}
            className="text-xs h-9 gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Official Broadsheet Slip</span>
          </Button>
        </div>
      </div>

      {/* Executive Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-4">
            <p className="text-2xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Evaluated</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">{analytics.totalStudents}</h3>
            <p className="text-2xs text-slate-400 mt-0.5">Students on roll</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-4">
            <p className="text-2xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Mean Inst. CGPA</p>
            <h3 className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-1 font-mono">{analytics.meanCgpa.toFixed(2)}</h3>
            <p className="text-2xs text-slate-400 mt-0.5">5.00 Maximum</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-4">
            <p className="text-2xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">Distinction Rate</p>
            <h3 className="text-xl font-black text-teal-700 dark:text-teal-300 mt-1">{analytics.distinctionRate}%</h3>
            <p className="text-2xs text-slate-400 mt-0.5">1st Class & 2:1</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-4">
            <p className="text-2xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">Overall Pass Rate</p>
            <h3 className="text-xl font-black text-blue-700 dark:text-blue-300 mt-1">{analytics.overallPassRate}%</h3>
            <p className="text-2xs text-slate-400 mt-0.5">CGPA &ge; 1.00</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-4">
            <p className="text-2xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">Graduating Cleared</p>
            <h3 className="text-xl font-black text-purple-700 dark:text-purple-300 mt-1">{analytics.graduatingEligibleCount}</h3>
            <p className="text-2xs text-slate-400 mt-0.5">{analytics.graduatingDeficientCount} Deficient</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-4">
            <p className="text-2xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">At-Risk / Warning</p>
            <h3 className="text-xl font-black text-red-700 dark:text-red-400 mt-1">{analytics.atRiskCount}</h3>
            <p className="text-2xs text-slate-400 mt-0.5">CGPA &lt; 1.50</p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Charts Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Degree Classification Distribution Chart */}
        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" /> Class of Degree Distribution
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Cohort academic classification curve</p>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.degreeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: any, name: any, props: any) => [`${value} Students (${props.payload.percentage}%)`, 'Count']}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {analytics.degreeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Departmental Performance League Chart */}
        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-teal-600" /> Departmental Mean CGPA Comparison
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Average CGPA per academic department</p>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.departmentBenchmarks} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="department" angle={-15} textAnchor="end" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: any) => [`${value} / 5.00`, 'Mean CGPA']}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="meanCgpa" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sub-view Navigation Bar & Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Subtabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveSubTab('broadsheet')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeSubTab === 'broadsheet'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Degree Broadsheet ({filteredStudents.length})
            </button>
            <button
              onClick={() => setActiveSubTab('departments')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeSubTab === 'departments'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Department Benchmarks ({analytics.departmentBenchmarks.length})
            </button>
            <button
              onClick={() => setActiveSubTab('anomalies')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeSubTab === 'anomalies'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Course Anomaly Radar ({analytics.courseAnomalies.filter(a => a.anomalySeverity !== 'Normal').length})
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
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
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

        {/* View Content 1: Broadsheet Table */}
        {activeSubTab === 'broadsheet' && (
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 uppercase text-2xs font-bold tracking-wider">
                  <th className="py-2.5 px-3">Student & Matric</th>
                  <th className="py-2.5 px-2">Dept / Level</th>
                  <th className="py-2.5 px-2 text-center">TCR</th>
                  <th className="py-2.5 px-2 text-center">TCE</th>
                  <th className="py-2.5 px-2 text-center">TWP</th>
                  <th className="py-2.5 px-2 text-center font-bold">CGPA</th>
                  <th className="py-2.5 px-3">Class of Degree</th>
                  <th className="py-2.5 px-2 text-center">Carryover</th>
                  <th className="py-2.5 px-3 text-center">Graduation / Standing</th>
                  <th className="py-2.5 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-500">
                      No student records found for the active filter set.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900 dark:text-white">{s.student.name}</div>
                        <div className="font-mono text-2xs text-slate-500">{s.student.matricNumber || 'NO_MATRIC'}</div>
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="font-medium text-2xs">{s.student.department}</div>
                        <div className="text-2xs text-slate-500">{s.student.level || 100}L</div>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-slate-600 dark:text-slate-300">{s.tcr}</td>
                      <td className="py-2.5 px-2 text-center font-mono font-semibold text-emerald-700 dark:text-emerald-400">{s.tce}</td>
                      <td className="py-2.5 px-2 text-center font-mono text-slate-600 dark:text-slate-300">{s.twp}</td>
                      <td className="py-2.5 px-2 text-center font-mono font-black text-sm text-slate-900 dark:text-white">
                        {s.cgpa.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-2xs font-semibold border ${s.classBadgeColor}`}>
                          {s.classOfDegree}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {s.carryoverCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold font-mono text-2xs bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            {s.carryoverCount}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-mono text-2xs">0</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {s.graduationStatus === 'Cleared for Graduation' ? (
                          <Badge variant="success" className="text-3xs py-0.5 px-1.5 gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Cleared
                          </Badge>
                        ) : s.standing === 'Academic Probation' ? (
                          <Badge variant="destructive" className="text-3xs py-0.5 px-1.5">Probation</Badge>
                        ) : s.standing === 'Academic Warning' ? (
                          <Badge variant="warning" className="text-3xs py-0.5 px-1.5">Warning</Badge>
                        ) : (
                          <span className="text-2xs text-slate-600 dark:text-slate-400">{s.standing}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedStudentSummary(s)}
                          className="h-7 px-2 text-xs gap-1 text-slate-600 dark:text-slate-300 hover:text-emerald-700"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Profile</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* View Content 2: Department Benchmarks */}
        {activeSubTab === 'departments' && (
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 uppercase text-2xs font-bold tracking-wider">
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-2 text-center">Cohort Size</th>
                  <th className="py-2.5 px-2 text-center">Mean CGPA</th>
                  <th className="py-2.5 px-2 text-center">Pass Rate</th>
                  <th className="py-2.5 px-2 text-center">Distinction (1st & 2:1)</th>
                  <th className="py-2.5 px-2 text-center">First Class</th>
                  <th className="py-2.5 px-2 text-center">2nd Upper</th>
                  <th className="py-2.5 px-2 text-center">2nd Lower</th>
                  <th className="py-2.5 px-2 text-center">At-Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {analytics.departmentBenchmarks.map((d, idx) => (
                  <tr key={d.department} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="text-2xs font-mono text-slate-400">#{idx + 1}</span>
                        <span>{d.department}</span>
                      </div>
                      <div className="text-2xs text-slate-500">{d.college}</div>
                    </td>
                    <td className="py-3 px-2 text-center font-mono">{d.totalStudents}</td>
                    <td className="py-3 px-2 text-center font-mono font-black text-sm text-emerald-700 dark:text-emerald-400">
                      {d.meanCgpa.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-center font-mono">{d.passRate}%</td>
                    <td className="py-3 px-2 text-center font-mono font-semibold text-teal-700 dark:text-teal-400">
                      {d.distinctionRate}%
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-emerald-700 font-bold">{d.firstClassCount}</td>
                    <td className="py-3 px-2 text-center font-mono text-teal-700">{d.secondUpperCount}</td>
                    <td className="py-3 px-2 text-center font-mono text-blue-700">{d.secondLowerCount}</td>
                    <td className="py-3 px-2 text-center font-mono text-red-600 font-bold">
                      {d.atRiskCount > 0 ? (
                        <span className="px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">
                          {d.atRiskCount}
                        </span>
                      ) : (
                        '0'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* View Content 3: Course Anomaly Radar */}
        {activeSubTab === 'anomalies' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Automated Course Performance Anomaly Detection</p>
                <p className="text-2xs text-amber-800 dark:text-amber-300 mt-0.5">
                  The system scans all submitted scores for statistical outliers (failure rate &gt; 20% or class mean &lt; 45%). Click any flagged course for comprehensive audit details.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 uppercase text-2xs font-bold tracking-wider">
                    <th className="py-2.5 px-3">Course</th>
                    <th className="py-2.5 px-2">Lecturer</th>
                    <th className="py-2.5 px-2 text-center">Evaluated</th>
                    <th className="py-2.5 px-2 text-center">Class Mean</th>
                    <th className="py-2.5 px-2 text-center">Failures</th>
                    <th className="py-2.5 px-2 text-center font-bold">Failure Rate</th>
                    <th className="py-2.5 px-3">Severity Flag</th>
                    <th className="py-2.5 px-2 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {analytics.courseAnomalies.map((a) => (
                    <tr key={a.courseId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">{a.courseCode}</div>
                        <div className="text-2xs text-slate-500 truncate max-w-xs">{a.courseTitle}</div>
                      </td>
                      <td className="py-2.5 px-2 text-xs text-slate-700 dark:text-slate-300">{a.lecturerName}</td>
                      <td className="py-2.5 px-2 text-center font-mono">{a.scoredCount} / {a.enrolledCount}</td>
                      <td className="py-2.5 px-2 text-center font-mono">{a.averageScore} / 100</td>
                      <td className="py-2.5 px-2 text-center font-mono text-red-600 font-semibold">{a.failedCount}</td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-red-700 dark:text-red-400">
                        {a.failureRate}%
                      </td>
                      <td className="py-2.5 px-3">
                        {a.anomalySeverity === 'Severe Anomaly' ? (
                          <Badge variant="destructive" className="text-3xs py-0.5 px-1.5 gap-1">
                            <AlertCircle className="w-2.5 h-2.5" /> High Risk Failure
                          </Badge>
                        ) : a.anomalySeverity === 'Moderate Concern' ? (
                          <Badge variant="warning" className="text-3xs py-0.5 px-1.5">
                            Moderate Concern
                          </Badge>
                        ) : (
                          <span className="text-2xs text-slate-500">Normal Range</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAnomaly(a)}
                          className="h-7 px-2 text-xs text-slate-600 hover:text-red-700"
                        >
                          Audit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Official Senate Broadsheet Modal */}
      <SenateBroadsheetModal
        isOpen={isBroadsheetModalOpen}
        onClose={() => setIsBroadsheetModalOpen(false)}
        students={filteredStudents}
        departmentFilter={selectedDept === 'all' ? 'All Departments' : selectedDept}
        levelFilter={selectedLevel}
        session={session}
        semester={semester}
      />

      {/* Individual Student Senate Profile & Transcript Modal */}
      <SenateStudentProfileModal
        isOpen={selectedStudentSummary !== null}
        onClose={() => setSelectedStudentSummary(null)}
        studentSummary={selectedStudentSummary}
      />

      {/* Academic Course Anomaly Audit Modal */}
      <AcademicAnomalyModal
        isOpen={selectedAnomaly !== null}
        onClose={() => setSelectedAnomaly(null)}
        anomaly={selectedAnomaly}
      />
    </div>
  );
};
