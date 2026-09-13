import React from 'react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { AlertTriangle, CheckCircle2, Eye } from 'lucide-react';
import { StudentSenateSummary } from '../../../lib/senateAnalytics';

interface SenateBroadsheetTableProps {
  students: StudentSenateSummary[];
  onSelectStudent: (student: StudentSenateSummary) => void;
}

export const SenateBroadsheetTable: React.FC<SenateBroadsheetTableProps> = ({
  students,
  onSelectStudent,
}) => {
  return (
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
          {students.length === 0 ? (
            <tr>
              <td colSpan={10} className="py-8 text-center text-slate-500">
                No student records found for the active filter set.
              </td>
            </tr>
          ) : (
            students.map((s) => (
              <tr key={s.student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td className="py-2.5 px-3">
                  <div className="font-semibold text-slate-900 dark:text-white">{s.student.name}</div>
                  <div className="font-mono text-2xs text-slate-500">
                    {s.student.matricNumber || 'NO_MATRIC'}
                  </div>
                </td>
                <td className="py-2.5 px-2">
                  <div className="font-medium text-2xs">{s.student.department}</div>
                  <div className="text-2xs text-slate-500">{s.student.level || 100}L</div>
                </td>
                <td className="py-2.5 px-2 text-center font-mono text-slate-600 dark:text-slate-300">
                  {s.tcr}
                </td>
                <td className="py-2.5 px-2 text-center font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                  {s.tce}
                </td>
                <td className="py-2.5 px-2 text-center font-mono text-slate-600 dark:text-slate-300">
                  {s.twp}
                </td>
                <td className="py-2.5 px-2 text-center font-mono font-black text-sm text-slate-900 dark:text-white">
                  {s.cgpa.toFixed(2)}
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-2xs font-semibold border ${s.classBadgeColor}`}
                  >
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
                    <Badge variant="destructive" className="text-3xs py-0.5 px-1.5">
                      Probation
                    </Badge>
                  ) : s.standing === 'Academic Warning' ? (
                    <Badge variant="warning" className="text-3xs py-0.5 px-1.5">
                      Warning
                    </Badge>
                  ) : (
                    <span className="text-2xs text-slate-600 dark:text-slate-400">{s.standing}</span>
                  )}
                </td>
                <td className="py-2.5 px-2 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectStudent(s)}
                    className="h-7 px-2 text-xs gap-1 text-slate-600 dark:text-slate-300 hover:text-emerald-700 cursor-pointer"
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
  );
};
