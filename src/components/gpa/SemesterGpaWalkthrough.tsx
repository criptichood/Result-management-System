import { ArrowRight, CheckCircle2, ChevronRight, HelpCircle, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

export const SemesterGpaWalkthrough = () => {
  // Static benchmark sample dataset
  const sampleSemester = [
    { code: 'CSC 211', title: 'Computer Programming I', cu: 3, ca: 29, exam: 31, total: 60, grade: 'B', gp: 4, qp: 12 },
    { code: 'MTH 211', title: 'Mathematical Methods I', cu: 3, ca: 40, exam: 37, total: 77, grade: 'A', gp: 5, qp: 15 },
    { code: 'CSC 212', title: 'Operating System I', cu: 3, ca: 32, exam: 42, total: 74, grade: 'A', gp: 5, qp: 15 },
    { code: 'CSC 214', title: 'Digital Logic Design', cu: 3, ca: 34, exam: 26, total: 60, grade: 'B', gp: 4, qp: 12 },
    { code: 'MTH 214', title: 'Linear Algebra I', cu: 2, ca: 30, exam: 38, total: 68, grade: 'B', gp: 4, qp: 8 },
    { code: 'GST 212', title: 'Peace Studies & Conflict', cu: 2, ca: 20, exam: 28, total: 48, grade: 'D', gp: 2, qp: 4 },
  ];

  const totalCredits = sampleSemester.reduce((acc, c) => acc + c.cu, 0); // 16
  const totalQualityPoints = sampleSemester.reduce((acc, c) => acc + c.qp, 0); // 66
  const calculatedGpa = (totalQualityPoints / totalCredits).toFixed(2); // 4.125 -> 4.13

  return (
    <div className="space-y-6">
      {/* Intro & High-Level Formula */}
      <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base font-bold text-[#064e3b] dark:text-emerald-400 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Semester Grade Point Average (GPA) Mathematical Formula
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            A semester GPA is the weighted average of all letter grades earned by a student in a specific semester. Courses with higher credit units exert a greater influence on the final result.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Standard Formula</span>
              <span className="text-lg sm:text-xl font-mono font-extrabold text-[#064e3b] dark:text-emerald-400">
                Semester GPA = <span className="underline decoration-emerald-500">Total Quality Points (TQP)</span> ÷ <span className="underline decoration-teal-500">Total Credit Units (TCU)</span>
              </span>
            </div>
            <div className="px-4 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-mono font-bold">
              GPA = ∑ (CU × GP) / ∑ CU
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Step-by-Step Walkthrough */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#064e3b] dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center">
            1
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Score Addition</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Combine CA score (out of 30/40) and Exam score (out of 70/60) to get Total Score (0–100).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-400 font-extrabold text-xs flex items-center justify-center">
            2
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Grade Point</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Convert the total score into its Letter Grade (A–F) and corresponding Grade Point (5, 4, 3, 2, 1, 0).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-400 font-extrabold text-xs flex items-center justify-center">
            3
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Quality Points</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Multiply the Course Credit Units (CU) by the Grade Point (GP) = Quality Points (QP).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 font-extrabold text-xs flex items-center justify-center">
            4
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Divide Totals</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Sum all Quality Points (∑QP) and divide by Total Registered Credit Units (∑CU).
          </p>
        </div>
      </div>

      {/* Static Worked Walkthrough Table */}
      <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
              Worked Static Example: 200 Level 1st Semester
            </CardTitle>
            <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-xs">
              6 Courses • 16 Registered Credits
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-3 text-center">Credit Units (CU)</th>
                  <th className="py-3 px-3 text-center">CA + Exam</th>
                  <th className="py-3 px-3 text-center">Total</th>
                  <th className="py-3 px-3 text-center">Grade</th>
                  <th className="py-3 px-3 text-center">Grade Point (GP)</th>
                  <th className="py-3 px-4 text-right font-mono text-emerald-800 dark:text-emerald-300">
                    Quality Points (CU × GP)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {sampleSemester.map((row) => (
                  <tr key={row.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">{row.code}</td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">{row.title}</td>
                    <td className="py-3 px-3 text-center font-semibold">{row.cu}</td>
                    <td className="py-3 px-3 text-center font-mono text-xs">{row.ca} + {row.exam}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-slate-100">{row.total}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${
                        row.grade === 'A' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        row.grade === 'B' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {row.grade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">{row.gp}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {row.cu} × {row.gp} = <span className="text-slate-900 dark:text-white font-extrabold">{row.qp}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50/90 dark:bg-slate-800/90 font-bold border-t-2 border-slate-200 dark:border-slate-700 text-xs sm:text-sm">
                <tr>
                  <td colSpan={2} className="py-3 px-4 text-slate-900 dark:text-slate-100 uppercase tracking-wider font-extrabold">
                    Semester Totals (∑)
                  </td>
                  <td className="py-3 px-3 text-center text-teal-700 dark:text-teal-400 font-extrabold">
                    {totalCredits} Units
                  </td>
                  <td colSpan={4} className="py-3 px-3 text-right text-slate-500 uppercase text-xs">
                    Total Quality Points (TQP):
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-700 dark:text-emerald-400 font-extrabold text-base">
                    {totalQualityPoints} Points
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step Calculation Breakdown Box */}
      <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-800/90 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
        <h4 className="text-sm font-extrabold text-[#064e3b] dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Final Semester GPA Computation
        </h4>
        <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm space-y-2 text-slate-800 dark:text-slate-200">
          <p>1. Total Quality Points (TQP) = 12 + 15 + 15 + 12 + 8 + 4 = <span className="font-bold text-emerald-600 dark:text-emerald-400">{totalQualityPoints}</span></p>
          <p>2. Total Credit Units (TCU) = 3 + 3 + 3 + 3 + 2 + 2 = <span className="font-bold text-teal-600 dark:text-teal-400">{totalCredits}</span></p>
          <p>3. Semester GPA = TQP / TCU = {totalQualityPoints} / {totalCredits} = <span className="font-bold text-slate-900 dark:text-white text-base underline decoration-emerald-500">{calculatedGpa}</span> (on 5.00 Scale)</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
            Standing: <span className="font-bold text-emerald-700 dark:text-emerald-400">Second Class Honours (Upper Division)</span> for this semester.
          </p>
        </div>
      </div>
    </div>
  );
};
