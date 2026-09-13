import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  BarChart3, 
  Award, 
  Trophy, 
  TrendingUp, 
  AlertTriangle, 
  BookOpen, 
  Lightbulb, 
  Layers
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GradeDistribution, DegreeClassification } from '../../lib/academicUtils';
import { SemesterGrowthChart, SemesterTrajectoryPoint } from './SemesterGrowthChart';
import { SubjectDiagnosticsView } from './SubjectDiagnosticsView';

interface GradeAnalyticsViewProps {
  analyticsScope: string;
  semesterKeys: string[];
  onScopeChange: (scope: string) => void;
  activeAnalyticsData: {
    distribution: GradeDistribution;
    title: string;
    totalCourses: number;
    avgGpa: string;
    totalCredits: number;
  };
  cumulativeCgpa: number;
  currentClassification: DegreeClassification;
  trajectoryData: SemesterTrajectoryPoint[];
  allPublishedResults: any[];
}

export type AnalyticsTab = 'distribution' | 'growth' | 'diagnostics';

export const GradeAnalyticsView: React.FC<GradeAnalyticsViewProps> = ({
  analyticsScope,
  semesterKeys,
  onScopeChange,
  activeAnalyticsData,
  cumulativeCgpa,
  currentClassification,
  trajectoryData,
  allPublishedResults,
}) => {
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState<AnalyticsTab>('distribution');

  const chartData = [
    { name: 'A (70-100)', key: 'A', count: activeAnalyticsData.distribution.A, color: '#059669', desc: 'Excellent' },
    { name: 'B (60-69)', key: 'B', count: activeAnalyticsData.distribution.B, color: '#10b981', desc: 'Very Good' },
    { name: 'C (50-59)', key: 'C', count: activeAnalyticsData.distribution.C, color: '#3b82f6', desc: 'Good' },
    { name: 'D (45-49)', key: 'D', count: activeAnalyticsData.distribution.D, color: '#f59e0b', desc: 'Fair' },
    { name: 'F (0-44)', key: 'F', count: activeAnalyticsData.distribution.F, color: '#ef4444', desc: 'Fail' },
  ];

  // Count weak courses (C, D, F)
  const weakCount = allPublishedResults.filter(r => {
    const g = r.result?.grade;
    return g === 'C' || g === 'D' || g === 'F';
  }).length;

  return (
    <div id="grade-analytics-view" className="space-y-6">
      {/* Top Header & Analytics Module Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Academic Analytics & Intelligence
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Deep-dive performance insights, trajectory growth, and subject diagnostics
          </p>
        </div>

        {/* Analytics Sub-Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            id="tab-analytics-distribution"
            onClick={() => setActiveAnalyticsTab('distribution')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeAnalyticsTab === 'distribution'
                ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-xs border border-slate-200/60 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Grade Spread</span>
          </button>

          <button
            id="tab-analytics-growth"
            onClick={() => setActiveAnalyticsTab('growth')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeAnalyticsTab === 'growth'
                ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-xs border border-slate-200/60 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Semester Growth</span>
          </button>

          <button
            id="tab-analytics-diagnostics"
            onClick={() => setActiveAnalyticsTab('diagnostics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeAnalyticsTab === 'diagnostics'
                ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-xs border border-slate-200/60 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Key Focus Areas</span>
            {weakCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 rounded-full text-[10px] font-extrabold">
                {weakCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab 1: Grade Distribution */}
      {activeAnalyticsTab === 'distribution' && (
        <div className="space-y-6">
          {/* Scope Selector */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Currently analyzing: <strong className="text-slate-900 dark:text-white">{activeAnalyticsData.title}</strong>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">Filter Scope:</span>
              <select 
                id="select-analytics-scope"
                value={analyticsScope}
                onChange={(e) => onScopeChange(e.target.value)}
                className="border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1 bg-white dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer text-xs"
              >
                <option value="all">All Semesters (Cumulative)</option>
                {semesterKeys.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Bar Chart (2 columns) */}
            <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Grade Distribution Chart</CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Letter grade counts across assessed courses</CardDescription>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded">
                    Total Courses: {activeAnalyticsData.totalCourses}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-72 w-full">
                  {activeAnalyticsData.totalCourses > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <XAxis 
                          dataKey="name" 
                          axisLine={{ stroke: '#cbd5e1' }} 
                          tickLine={false} 
                          tick={{ fontSize: 11, fill: '#94a3b8' }} 
                        />
                        <YAxis 
                          allowDecimals={false} 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 11, fill: '#94a3b8' }} 
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                          contentStyle={{ 
                            borderRadius: '8px', 
                            border: '1px solid #334155', 
                            backgroundColor: '#0f172a',
                            color: '#f8fafc',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.2)',
                            fontSize: '12px'
                          }} 
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
                      <Trophy className="w-8 h-8 mb-2 opacity-20" />
                      No published grades in this scope.
                    </div>
                  )}
                </div>

                {/* Grade Metric Pills Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                  {chartData.map(item => (
                    <div key={item.key} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-300">{item.key} Grade</div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{item.count}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Degree Classification & Criteria Details (1 column) */}
            <div className="space-y-4">
              <Card className="border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/30 shadow-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Current Standing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-800 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Class of Degree</span>
                    <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">{currentClassification.label}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      CGPA: <strong className="text-slate-900 dark:text-white">{cumulativeCgpa.toFixed(2)}</strong> / 5.00
                    </p>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pt-2">
                    <div className="flex justify-between items-center py-1 border-b border-emerald-100/80 dark:border-emerald-900/60">
                      <span>4.50 - 5.00</span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">First Class</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-emerald-100/80 dark:border-emerald-900/60">
                      <span>3.50 - 4.49</span>
                      <span className="font-semibold text-teal-700 dark:text-teal-300">2nd Class Upper (2:1)</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-emerald-100/80 dark:border-emerald-900/60">
                      <span>2.40 - 3.49</span>
                      <span className="font-semibold text-blue-700 dark:text-blue-300">2nd Class Lower (2:2)</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-emerald-100/80 dark:border-emerald-900/60">
                      <span>1.50 - 2.39</span>
                      <span className="font-semibold text-amber-700 dark:text-amber-300">Third Class</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>1.00 - 1.49</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Pass</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">Grading Scale Reference</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                  <div className="flex justify-between"><span>A (70-100%)</span><span className="font-bold text-slate-800 dark:text-slate-200">5.0 Points</span></div>
                  <div className="flex justify-between"><span>B (60-69%)</span><span className="font-bold text-slate-800 dark:text-slate-200">4.0 Points</span></div>
                  <div className="flex justify-between"><span>C (50-59%)</span><span className="font-bold text-slate-800 dark:text-slate-200">3.0 Points</span></div>
                  <div className="flex justify-between"><span>D (45-49%)</span><span className="font-bold text-slate-800 dark:text-slate-200">2.0 Points</span></div>
                  <div className="flex justify-between"><span>E (40-44%)</span><span className="font-bold text-slate-800 dark:text-slate-200">1.0 Points</span></div>
                  <div className="flex justify-between"><span>F (0-39%)</span><span className="font-bold text-rose-600 dark:text-rose-400">0.0 Points</span></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Semester Performance Growth Chart */}
      {activeAnalyticsTab === 'growth' && (
        <SemesterGrowthChart
          trajectoryData={trajectoryData}
          cumulativeCgpa={cumulativeCgpa}
        />
      )}

      {/* Tab 3: Key Focus Areas & Subject Diagnostics */}
      {activeAnalyticsTab === 'diagnostics' && (
        <SubjectDiagnosticsView
          allPublishedResults={allPublishedResults}
          cumulativeCgpa={cumulativeCgpa}
        />
      )}
    </div>
  );
};
