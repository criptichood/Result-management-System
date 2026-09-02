import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  FileBarChart, 
  Users, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Download, 
  TrendingUp,
  Filter,
  UserCheck,
  UserX,
  Sparkles
} from 'lucide-react';
import { Course, User } from '../../types';

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
  studentsCount: number;
  analytics: LecturerAnalyticsData | null;
}

export const LecturerAnalyticsTab: React.FC<LecturerAnalyticsTabProps> = ({
  selectedCourse,
  studentsCount,
  analytics,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'roster'>('overview');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!analytics || !selectedCourse) {
    return (
      <Card id="lecturer-no-analytics" className="border-slate-200">
        <CardContent className="p-12 text-center">
          <FileBarChart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Course Selected</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Select a course from your teaching load to view detailed academic analytics.</p>
        </CardContent>
      </Card>
    );
  }

  const categorizedStudents = analytics.categorizedStudents || [];

  // Filter students by grade category and search keyword
  const filteredStudents = categorizedStudents.filter(item => {
    // Grade category filter
    if (selectedGradeFilter !== 'all') {
      if (selectedGradeFilter === 'A' && item.grade !== 'A') return false;
      if (selectedGradeFilter === 'B' && item.grade !== 'B') return false;
      if (selectedGradeFilter === 'C' && item.grade !== 'C') return false;
      if (selectedGradeFilter === 'D' && item.grade !== 'D') return false;
      if (selectedGradeFilter === 'F' && item.grade !== 'F') return false;
      if (selectedGradeFilter === 'atRisk' && (item.grade !== 'D' && item.grade !== 'F')) return false;
      if (selectedGradeFilter === 'incomplete' && item.grade !== 'Incomplete') return false;
    }

    // Search filter
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const nameMatch = item.student?.name?.toLowerCase().includes(q) || false;
      const matricMatch = item.student?.matricNumber?.toLowerCase().includes(q) || false;
      return nameMatch || matricMatch;
    }

    return true;
  });

  const gradeColors: Record<string, string> = {
    A: '#059669',
    B: '#0d9488',
    C: '#2563eb',
    D: '#d97706',
    E: '#ea580c',
    F: '#dc2626',
  };

  const handleExportCohortCsv = () => {
    const headers = ['Matric Number', 'Student Name', 'CA Score (40)', 'Exam Score (60)', 'Total Score', 'Grade', 'Academic Diagnostic'];
    const rows = filteredStudents.map(s => [
      s.student?.matricNumber || 'N/A',
      `"${s.student?.name || 'N/A'}"`,
      s.caScore !== null ? s.caScore : 'N/A',
      s.examScore !== null ? s.examScore : 'N/A',
      s.totalScore !== null ? s.totalScore : 'N/A',
      s.grade,
      `"${s.insight}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedCourse.code}_${selectedGradeFilter}_Cohort_Analytics.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="lecturer-analytics-tab" className="space-y-6">
      {/* Analytics Overview Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card id="card-lecturer-enrolled" className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-slate-900">{studentsCount}</span>
              <span className="text-xs text-slate-500 font-medium">{analytics.activeCount} Graded</span>
            </div>
          </CardContent>
        </Card>

        <Card id="card-lecturer-avg-score" className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Class Average</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-slate-900">{analytics.avgScore.toFixed(1)}%</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                {analytics.avgScore >= 70 ? 'Grade A' : analytics.avgScore >= 60 ? 'Grade B' : 'Grade C'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card id="card-lecturer-highest-score" className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">High / Low Score</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-emerald-700">{analytics.highestScore}%</span>
              <span className="text-xs font-semibold text-slate-400">/ {analytics.lowestScore}%</span>
            </div>
          </CardContent>
        </Card>

        <Card id="card-lecturer-pass-rate" className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pass Rate (≥40%)</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-emerald-700">{analytics.passRate.toFixed(1)}%</span>
              <span className="text-xs text-slate-500 font-medium">
                {categorizedStudents.filter(s => (s.totalScore || 0) >= 40).length} of {analytics.activeCount}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Switcher: Distribution Chart vs Categorized Student Cohort Roster */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
            <FileBarChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{selectedCourse.code}: {selectedCourse.title}</h3>
            <p className="text-[11px] text-slate-500">Academic analytics & student grade cohort categorization</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            id="btn-subtab-overview"
            onClick={() => setActiveSubTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-bold rounded-md transition-all ${
              activeSubTab === 'overview'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileBarChart className="w-3.5 h-3.5" />
            <span>Grade Distribution</span>
          </button>

          <button
            id="btn-subtab-roster"
            onClick={() => setActiveSubTab('roster')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-bold rounded-md transition-all ${
              activeSubTab === 'roster'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Categorized Students ({categorizedStudents.length})</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Overview & Distribution */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <Card id="card-lecturer-grade-distribution" className="border-slate-200 shadow-xs">
            <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Grade Spread Distribution</CardTitle>
                <CardDescription className="text-xs">
                  Click any bar or category pill to inspect individual student records
                </CardDescription>
              </div>
              <button
                id="btn-switch-to-cohort"
                onClick={() => setActiveSubTab('roster')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1"
              >
                <span>View Student Roster</span>
                <Users className="w-3 h-3" />
              </button>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={analytics.chartData} 
                    margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                  >
                    <XAxis 
                      dataKey="name" 
                      axisLine={{ stroke: '#cbd5e1' }} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }}
                    />
                    <YAxis 
                      allowDecimals={false} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: '#64748b' }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }} 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid #e2e8f0', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                        fontSize: '12px'
                      }} 
                    />
                    <Bar 
                      dataKey="count" 
                      radius={[4, 4, 0, 0]}
                      onClick={(entry) => {
                        if (entry && entry.name) {
                          setSelectedGradeFilter(entry.name);
                          setActiveSubTab('roster');
                        }
                      }}
                      className="cursor-pointer"
                    >
                      {analytics.chartData.map(entry => (
                        <Cell key={`cell-${entry.name}`} fill={gradeColors[entry.name] || '#059669'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Clickable Grade Category Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mt-4 pt-4 border-t border-slate-100">
                {analytics.chartData.map(item => {
                  const studentList = categorizedStudents.filter(s => s.grade === item.name);
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setSelectedGradeFilter(item.name);
                        setActiveSubTab('roster');
                      }}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/40 text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-800">Grade {item.name}</span>
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: gradeColors[item.name] || '#059669' }}
                        ></span>
                      </div>
                      <div className="text-lg font-extrabold text-slate-900 mt-1">{item.count}</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-emerald-700">
                        {studentsCount > 0 ? `${((item.count / studentsCount) * 100).toFixed(0)}% of class` : '0%'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Performance Diagnostics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-emerald-100 bg-emerald-50/40 shadow-xs">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Distinction Cohort</h4>
                  <p className="text-xl font-extrabold text-emerald-800 mt-0.5">
                    {categorizedStudents.filter(s => s.grade === 'A').length} Students
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Achieved 70%+ score. Ready for advanced research and mentorship roles.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-100 bg-amber-50/40 shadow-xs">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">At-Risk Students (D & F)</h4>
                  <p className="text-xl font-extrabold text-amber-800 mt-0.5">
                    {categorizedStudents.filter(s => s.grade === 'D' || s.grade === 'F').length} Students
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Borderline 40-49% passes. Recommend targeted tutorials before final moderation.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-rose-100 bg-rose-50/40 shadow-xs">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-800">
                  <UserX className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Carryover Deficit (F)</h4>
                  <p className="text-xl font-extrabold text-rose-800 mt-0.5">
                    {categorizedStudents.filter(s => s.grade === 'F').length} Students
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Scored below 40%. Mandatory course re-registration in next session.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Categorized Student Performance Cohort Roster */}
      {activeSubTab === 'roster' && (
        <Card id="card-lecturer-student-roster" className="border-slate-200 shadow-xs">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" /> Categorized Student Performance Roster
                </CardTitle>
                <CardDescription className="text-xs">
                  Filter students by specific grade category to isolate top performers and students requiring remediation
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-export-cohort-csv"
                  onClick={handleExportCohortCsv}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 transition-all shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export Category CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Bar & Search */}
            <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Category Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  id="btn-filter-all"
                  onClick={() => setSelectedGradeFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedGradeFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All ({categorizedStudents.length})
                </button>
                <button
                  id="btn-filter-grade-a"
                  onClick={() => setSelectedGradeFilter('A')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedGradeFilter === 'A'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  Grade A ({categorizedStudents.filter(s => s.grade === 'A').length})
                </button>
                <button
                  id="btn-filter-grade-b"
                  onClick={() => setSelectedGradeFilter('B')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedGradeFilter === 'B'
                      ? 'bg-teal-600 text-white'
                      : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                  }`}
                >
                  Grade B ({categorizedStudents.filter(s => s.grade === 'B').length})
                </button>
                <button
                  id="btn-filter-grade-c"
                  onClick={() => setSelectedGradeFilter('C')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedGradeFilter === 'C'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  Grade C ({categorizedStudents.filter(s => s.grade === 'C').length})
                </button>
                <button
                  id="btn-filter-grade-d"
                  onClick={() => setSelectedGradeFilter('D')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedGradeFilter === 'D'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  Grade D ({categorizedStudents.filter(s => s.grade === 'D').length})
                </button>

                <button
                  id="btn-filter-grade-f"
                  onClick={() => setSelectedGradeFilter('F')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedGradeFilter === 'F'
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  Grade F ({categorizedStudents.filter(s => s.grade === 'F').length})
                </button>
              </div>

              {/* Search Box */}
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="input-search-student-roster"
                  type="text"
                  placeholder="Search name or matric..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-4">Student Details</th>
                  <th className="py-2.5 px-3 text-center">CA (40)</th>
                  <th className="py-2.5 px-3 text-center">Exam (60)</th>
                  <th className="py-2.5 px-3 text-center">Total (100)</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-4">Performance Diagnosis & Insight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(item => {
                  const grade = item.grade;
                  return (
                    <tr key={item.enrollmentId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.student?.name || 'Unknown Student'}</div>
                        <div className="text-[11px] font-mono text-slate-500">{item.student?.matricNumber || 'No Matric'}</div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`font-semibold ${item.isLowCa ? 'text-amber-600 font-bold' : 'text-slate-800'}`}>
                          {item.caScore !== null ? item.caScore : '—'}
                        </span>
                        {item.isLowCa && (
                          <span className="block text-[9px] text-amber-600 font-bold">Low CA</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`font-semibold ${item.isLowExam ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                          {item.examScore !== null ? item.examScore : '—'}
                        </span>
                        {item.isLowExam && (
                          <span className="block text-[9px] text-rose-600 font-bold">Low Exam</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="text-sm font-extrabold text-slate-900">
                          {item.totalScore !== null ? `${item.totalScore}%` : '—'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span 
                          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-black text-white"
                          style={{ backgroundColor: gradeColors[grade] || '#64748b' }}
                        >
                          {grade}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <p className="text-slate-700 text-[11px] leading-relaxed">
                          {item.insight}
                        </p>
                      </td>
                    </tr>
                  );
                })}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-sm">No students match the selected category filter.</p>
                      <button
                        onClick={() => { setSelectedGradeFilter('all'); setSearchTerm(''); }}
                        className="text-xs text-emerald-600 hover:underline mt-1 font-semibold"
                      >
                        Reset filters to view all students
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
