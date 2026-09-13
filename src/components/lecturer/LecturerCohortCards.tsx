import React from 'react';
import { Card, CardContent } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Award, TrendingUp, CheckCircle2 } from 'lucide-react';
import { LecturerAnalyticsData } from './LecturerAnalyticsTab';

interface LecturerCohortCardsProps {
  analytics: LecturerAnalyticsData;
}

export const LecturerCohortCards: React.FC<LecturerCohortCardsProps> = ({ analytics }) => {
  const gradeColors: Record<string, string> = {
    A: '#059669',
    B: '#0d9488',
    C: '#2563eb',
    D: '#d97706',
    E: '#ea580c',
    F: '#dc2626',
  };

  return (
    <div className="space-y-6">
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Enrolled Cohort
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {analytics.activeCount}
              </span>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Active student candidates
            </span>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Cohort Mean Score
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {analytics.avgScore.toFixed(1)}%
              </span>
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Out of 100 max score
            </span>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pass Rate (≥45%)
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {Math.round(analytics.passRate)}%
              </span>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Scored 45% or above
            </span>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Top Score
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {analytics.highestScore}%
              </span>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Lowest score: {analytics.lowestScore}%
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Grade Frequency Histogram */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Grade Distribution Histogram
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Distribution of candidate performance across standard Nigerian grade bands
              </p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                  cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                  formatter={(val: any) => [`${val} Candidates`, 'Count']}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {analytics.chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={gradeColors[entry.name] || '#059669'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
