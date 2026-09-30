import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export interface ParsedRow {
  matricNumber: string;
  studentName?: string;
  department?: string;
  level?: number | string;
  enrollmentId?: string;
  caScore: string;
  examScore: string;
  totalScore?: number | null;
  grade?: string | null;
  isValid: boolean;
  errors: string[];
}

interface CsvPreviewTableProps {
  displayRows: ParsedRow[];
  parsedRows: ParsedRow[];
  onRowChange: (index: number, field: 'matricNumber' | 'caScore' | 'examScore', val: string) => void;
}

export const CsvPreviewTable: React.FC<CsvPreviewTableProps> = ({
  displayRows,
  parsedRows,
  onRowChange,
}) => {
  const getGradeBadgeClass = (grade?: string | null) => {
    switch (grade) {
      case 'A':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300';
      case 'B':
        return 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950 dark:text-teal-300';
      case 'C':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300';
      case 'D':
        return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300';
      case 'E':
        return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300';
      case 'F':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
      <div className="max-h-64 overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold sticky top-0 z-10">
            <tr>
              <th className="p-2.5">Matric No</th>
              <th className="p-2.5">Student / Dept</th>
              <th className="p-2.5 text-center w-20">CA (40)</th>
              <th className="p-2.5 text-center w-20">Exam (60)</th>
              <th className="p-2.5 text-center w-20">Total (100)</th>
              <th className="p-2.5 text-center w-16">Grade</th>
              <th className="p-2.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {displayRows.map((row, idx) => {
              const originalIdx = parsedRows.indexOf(row);
              return (
                <tr
                  key={`${row.matricNumber}-${idx}`}
                  className={
                    row.isValid
                      ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      : 'bg-red-50/50 dark:bg-red-950/20'
                  }
                >
                  <td className="p-2.5">
                    <input
                      type="text"
                      className="w-full font-mono font-bold text-slate-900 dark:text-slate-100 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none text-xs"
                      value={row.matricNumber}
                      onChange={(e) =>
                        onRowChange(originalIdx, 'matricNumber', e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2.5 text-xs">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {row.studentName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {row.department} • {row.level}L
                    </div>
                  </td>
                  <td className="p-2.5 text-center">
                    <input
                      type="text"
                      className="w-14 mx-auto text-center font-mono font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 focus:border-emerald-500 focus:outline-none text-xs"
                      value={row.caScore}
                      onChange={(e) =>
                        onRowChange(originalIdx, 'caScore', e.target.value)
                      }
                      placeholder="0-40"
                    />
                  </td>
                  <td className="p-2.5 text-center">
                    <input
                      type="text"
                      className="w-14 mx-auto text-center font-mono font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 focus:border-emerald-500 focus:outline-none text-xs"
                      value={row.examScore}
                      onChange={(e) =>
                        onRowChange(originalIdx, 'examScore', e.target.value)
                      }
                      placeholder="0-60"
                    />
                  </td>
                  <td className="p-2.5 text-center font-mono font-bold text-xs text-slate-900 dark:text-white">
                    {row.totalScore !== null && row.totalScore !== undefined
                      ? row.totalScore
                      : '-'}
                  </td>
                  <td className="p-2.5 text-center">
                    {row.grade ? (
                      <span
                        className={`px-2 py-0.5 rounded font-extrabold text-[11px] border ${getGradeBadgeClass(
                          row.grade
                        )}`}
                      >
                        {row.grade}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">-</span>
                    )}
                  </td>
                  <td className="p-2.5 text-right">
                    {row.isValid ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400"
                        title={row.errors.join(', ')}
                      >
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate max-w-[140px]">
                          {row.errors[0]}
                        </span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
