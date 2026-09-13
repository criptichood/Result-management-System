import React from 'react';
import { DepartmentBenchmark } from '../../../lib/senateAnalytics';

interface SenateDepartmentTableProps {
  departmentBenchmarks: DepartmentBenchmark[];
}

export const SenateDepartmentTable: React.FC<SenateDepartmentTableProps> = ({
  departmentBenchmarks,
}) => {
  return (
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
          {departmentBenchmarks.map((d, idx) => (
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
              <td className="py-3 px-2 text-center font-mono text-emerald-700 font-bold">
                {d.firstClassCount}
              </td>
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
  );
};
