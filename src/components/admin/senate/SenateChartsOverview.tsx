import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Award, Building2 } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { SenateInstitutionalAnalytics } from '../../../lib/senateAnalytics';

interface SenateChartsOverviewProps {
  analytics: SenateInstitutionalAnalytics;
}

export const SenateChartsOverview: React.FC<SenateChartsOverviewProps> = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Degree Classification Distribution Chart */}
      <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" /> Class of Degree Distribution
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cohort academic classification curve
              </p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.degreeDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="name"
                  angle={-15}
                  textAnchor="end"
                  tick={{ fontSize: 10 }}
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any, name: any, props: any) => [
                    `${value} Students (${props.payload.percentage}%)`,
                    'Count',
                  ]}
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
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Average CGPA per academic department
              </p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.departmentBenchmarks}
                margin={{ top: 10, right: 10, left: -15, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="department"
                  angle={-15}
                  textAnchor="end"
                  tick={{ fontSize: 10 }}
                  interval={0}
                />
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
  );
};
