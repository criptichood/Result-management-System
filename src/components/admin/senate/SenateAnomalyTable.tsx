import React from 'react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { CourseAnomaly } from '../../../lib/senateAnalytics';

interface SenateAnomalyTableProps {
  courseAnomalies: CourseAnomaly[];
  onSelectAnomaly: (anomaly: CourseAnomaly) => void;
}

export const SenateAnomalyTable: React.FC<SenateAnomalyTableProps> = ({
  courseAnomalies,
  onSelectAnomaly,
}) => {
  return (
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
            {courseAnomalies.map((a) => (
              <tr key={a.courseId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td className="py-2.5 px-3">
                  <div className="font-mono font-bold text-slate-900 dark:text-white">
                    {a.courseCode}
                  </div>
                  <div className="text-2xs text-slate-500 truncate max-w-xs">{a.courseTitle}</div>
                </td>
                <td className="py-2.5 px-2 text-xs text-slate-700 dark:text-slate-300">
                  {a.lecturerName}
                </td>
                <td className="py-2.5 px-2 text-center font-mono">
                  {a.scoredCount} / {a.enrolledCount}
                </td>
                <td className="py-2.5 px-2 text-center font-mono">{a.averageScore} / 100</td>
                <td className="py-2.5 px-2 text-center font-mono text-red-600 font-semibold">
                  {a.failedCount}
                </td>
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
                    onClick={() => onSelectAnomaly(a)}
                    className="h-7 px-2 text-xs text-slate-600 hover:text-red-700 cursor-pointer"
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
  );
};
