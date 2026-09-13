import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Zap, 
  Calendar, 
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';

export interface SemesterTrajectoryPoint {
  semesterKey: string;
  academicYear: string;
  semester: 1 | 2;
  label: string;
  shortLabel: string;
  gpa: number;
  runningCgpa: number;
  credits: number;
  qualityPoints: number;
  coursesCount: number;
  delta: number;
  percentChange: number;
}

interface SemesterGrowthChartProps {
  trajectoryData: SemesterTrajectoryPoint[];
  cumulativeCgpa: number;
}

export const SemesterGrowthChart: React.FC<SemesterGrowthChartProps> = ({
  trajectoryData,
  cumulativeCgpa,
}) => {
  const [chartType, setChartType] = useState<'line' | 'area'>('line');

  if (trajectoryData.length === 0) {
    return (
      <Card id="card-growth-empty" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs p-8 text-center">
        <TrendingUp className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">No Semester History Yet</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Complete more than one semester to view your academic growth trajectory.</p>
      </Card>
    );
  }

  // Calculate highest GPA semester, lowest, and overall growth
  const highestPoint = [...trajectoryData].sort((a, b) => b.gpa - a.gpa)[0];
  const lowestPoint = [...trajectoryData].sort((a, b) => a.gpa - b.gpa)[0];
  const firstPoint = trajectoryData[0];
  const latestPoint = trajectoryData[trajectoryData.length - 1];
  const netGrowth = latestPoint.gpa - firstPoint.gpa;
  const netPercentage = firstPoint.gpa > 0 ? ((netGrowth / firstPoint.gpa) * 100) : 0;

  return (
    <div id="semester-growth-section" className="space-y-6">
      {/* Top Growth Key Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Latest Semester Velocity */}
        <Card id="card-metric-velocity" className="border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Growth Velocity</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {latestPoint.delta >= 0 ? `+${latestPoint.delta.toFixed(2)}` : latestPoint.delta.toFixed(2)}
                </span>
                <span className={`text-xs font-bold flex items-center ${latestPoint.delta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {latestPoint.delta >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {latestPoint.percentChange >= 0 ? `+${latestPoint.percentChange.toFixed(1)}%` : `${latestPoint.percentChange.toFixed(1)}%`}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">vs previous semester</p>
            </div>
            <div className={`p-2.5 rounded-xl ${latestPoint.delta >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400'}`}>
              <Zap className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Peak Semester */}
        <Card id="card-metric-peak" className="border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Peak Semester GPA</p>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                {highestPoint.gpa.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{highestPoint.shortLabel}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Cumulative Standing */}
        <Card id="card-metric-trajectory" className="border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cumulative CGPA</p>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {cumulativeCgpa.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Scale: 5.00 Maximum</p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
              <Target className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Net Academic Rise */}
        <Card id="card-metric-net-rise" className="border-slate-200 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-900">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Overall Trajectory</p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className={`text-2xl font-bold ${netGrowth >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {netGrowth >= 0 ? `+${netGrowth.toFixed(2)}` : netGrowth.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">GPA delta</span>
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Positive upward momentum
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interactive Growth Graph */}
      <Card id="card-growth-chart-container" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Semester GPA & CGPA Growth Trajectory
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Chronological progress tracking semester GPA alongside cumulative CGPA curve
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <button
                id="btn-chart-line"
                onClick={() => setChartType('line')}
                className={`px-3 py-1 font-semibold rounded-md transition-all ${
                  chartType === 'line' 
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Line Trend
              </button>
              <button
                id="btn-chart-area"
                onClick={() => setChartType('area')}
                className={`px-3 py-1 font-semibold rounded-md transition-all ${
                  chartType === 'area' 
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Area Fill
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={trajectoryData} margin={{ top: 20, right: 30, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
                  <XAxis 
                    dataKey="shortLabel" 
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                    axisLine={{ stroke: '#94a3b8', strokeOpacity: 0.3 }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 5]} 
                    ticks={[1.0, 2.0, 3.0, 4.0, 4.5, 5.0]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload as SemesterTrajectoryPoint;
                        return (
                          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 min-w-[190px]">
                            <p className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-1 flex items-center justify-between">
                              <span>{item.label}</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{item.academicYear}</span>
                            </p>
                            <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400 font-semibold">
                              <span>Semester GPA:</span>
                              <span className="text-sm font-bold">{item.gpa.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-blue-700 dark:text-blue-400 font-semibold">
                              <span>Cumulative CGPA:</span>
                              <span className="text-sm font-bold">{item.runningCgpa.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 text-[11px] pt-1 border-t border-slate-100 dark:border-slate-700">
                              <span>Total Units / Courses:</span>
                              <span>{item.credits} Units ({item.coursesCount} courses)</span>
                            </div>
                            {item.delta !== 0 && (
                              <div className="flex justify-between items-center text-[11px]">
                                <span>Semester Delta:</span>
                                <span className={`font-bold ${item.delta > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                  {item.delta > 0 ? `+${item.delta.toFixed(2)}` : item.delta.toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Institutional Target Reference Lines */}
                  <ReferenceLine y={4.50} stroke="#059669" strokeDasharray="4 4" label={{ value: '1st Class (4.50)', position: 'insideTopRight', fill: '#059669', fontSize: 10, fontWeight: 700 }} />
                  <ReferenceLine y={3.50} stroke="#0284c7" strokeDasharray="4 4" label={{ value: '2nd Class Upper (3.50)', position: 'insideTopRight', fill: '#0284c7', fontSize: 10, fontWeight: 700 }} />
                  
                  <Line 
                    type="monotone" 
                    dataKey="gpa" 
                    name="Semester GPA" 
                    stroke="#059669" 
                    strokeWidth={3} 
                    dot={{ fill: '#059669', r: 6, strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 8, fill: '#047857' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="runningCgpa" 
                    name="Cumulative CGPA" 
                    stroke="#2563eb" 
                    strokeWidth={2} 
                    strokeDasharray="5 5"
                    dot={{ fill: '#2563eb', r: 4, strokeWidth: 1.5, stroke: '#ffffff' }}
                  />
                </LineChart>
              ) : (
                <AreaChart data={trajectoryData} margin={{ top: 20, right: 30, left: -10, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorCgpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} vertical={false} />
                  <XAxis 
                    dataKey="shortLabel" 
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                    axisLine={{ stroke: '#94a3b8', strokeOpacity: 0.3 }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 5]} 
                    ticks={[1.0, 2.0, 3.0, 4.0, 4.5, 5.0]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload as SemesterTrajectoryPoint;
                        return (
                          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 min-w-[190px]">
                            <p className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-1">{item.label}</p>
                            <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400 font-semibold">
                              <span>Semester GPA:</span>
                              <span className="text-sm font-bold">{item.gpa.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-blue-700 dark:text-blue-400 font-semibold">
                              <span>Cumulative CGPA:</span>
                              <span className="text-sm font-bold">{item.runningCgpa.toFixed(2)}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={4.50} stroke="#059669" strokeDasharray="4 4" label={{ value: '1st Class (4.50)', position: 'insideTopRight', fill: '#059669', fontSize: 10, fontWeight: 700 }} />
                  <Area 
                    type="monotone" 
                    dataKey="gpa" 
                    stroke="#059669" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorGpa)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="runningCgpa" 
                    stroke="#2563eb" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorCgpa)" 
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Chart Legend & Benchmarks Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Semester GPA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-blue-600 rounded"></span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Cumulative CGPA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-500 border-dashed border-t"></span>
                <span className="text-slate-500 dark:text-slate-400">First Class Threshold (4.50)</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 dark:text-slate-500">
              *Calculated on standard Nigerian University 5-point scale
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Semester by Semester Progression Breakdown Table */}
      <Card id="card-growth-breakdown" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Semester Performance Audit & Progression Log
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Step-by-step credit units, quality points, and velocity across all recorded academic periods
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-2.5 px-4">Academic Session & Semester</th>
                <th className="py-2.5 px-3 text-center">Courses</th>
                <th className="py-2.5 px-3 text-center">Units (CR)</th>
                <th className="py-2.5 px-3 text-center">Quality Points (QP)</th>
                <th className="py-2.5 px-3 text-center">Semester GPA</th>
                <th className="py-2.5 px-3 text-center">Cumulative CGPA</th>
                <th className="py-2.5 px-4 text-right">Growth Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {trajectoryData.map((pt, idx) => (
                <tr key={pt.semesterKey} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>{pt.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 pl-4 font-normal block">{pt.academicYear}</span>
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-slate-700 dark:text-slate-300">{pt.coursesCount}</td>
                  <td className="py-3 px-3 text-center font-semibold text-slate-900 dark:text-white">{pt.credits}</td>
                  <td className="py-3 px-3 text-center font-semibold text-slate-700 dark:text-slate-300">{pt.qualityPoints}</td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                    {pt.gpa.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-blue-700 dark:text-blue-400 text-sm">
                    {pt.runningCgpa.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold">
                    {idx === 0 ? (
                      <span className="text-slate-400 dark:text-slate-500 text-[11px] font-normal">Baseline</span>
                    ) : (
                      <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] ${
                        pt.delta >= 0 
                          ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                          : 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}>
                        {pt.delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {pt.delta >= 0 ? `+${pt.delta.toFixed(2)}` : pt.delta.toFixed(2)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
