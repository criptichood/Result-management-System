import { Award, BookOpen, CheckCircle, HelpCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

export const GpaScaleReference = () => {
  const gradingScale = [
    { grade: 'A', range: '70% – 100%', gp: 5, description: 'Excellent / Distinction', color: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' },
    { grade: 'B', range: '60% – 69%', gp: 4, description: 'Very Good', color: 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800' },
    { grade: 'C', range: '50% – 59%', gp: 3, description: 'Good', color: 'bg-cyan-50 text-cyan-800 border-cyan-300 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800' },
    { grade: 'D', range: '45% – 49%', gp: 2, description: 'Fair / Satisfactory', color: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' },
    { grade: 'F', range: '0% – 44%', gp: 0, description: 'Fail / Carry Over', color: 'bg-red-50 text-red-800 border-red-300 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800' },
  ];

  const classifications = [
    { class: 'First Class Honours', range: '4.50 – 5.00', badge: 'bg-emerald-600 text-white', note: 'Highest Academic Standing' },
    { class: 'Second Class Honours (Upper Division)', range: '3.50 – 4.49', badge: 'bg-teal-600 text-white', note: '2:1 Division' },
    { class: 'Second Class Honours (Lower Division)', range: '2.40 – 3.49', badge: 'bg-blue-600 text-white', note: '2:2 Division' },
    { class: 'Third Class Honours', range: '1.50 – 2.39', badge: 'bg-amber-600 text-white', note: '3rd Class Division' },
    { class: 'Pass Degree', range: '1.00 – 1.49', badge: 'bg-slate-600 text-white', note: 'Minimum Graduation Standard' },
    { class: 'Fail / Withdraw', range: '0.00 – 0.99', badge: 'bg-red-600 text-white', note: 'Probation / Academic Failure' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NUC 5.0 Scale Breakdown */}
        <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold text-[#064e3b] dark:text-emerald-400 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              NUC 5.0 Nigerian University Grading Scale
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Score Range</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4 text-center">Grade Point (GP)</th>
                    <th className="py-3 px-4">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {gradingScale.map((row) => (
                    <tr key={row.grade} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold">{row.range}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-md font-bold text-xs border ${row.color}`}>
                          {row.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-slate-100">
                        {row.gp}
                      </td>
                      <td className="py-3 px-4 font-medium">{row.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Degree Classification Tiers */}
        <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold text-[#064e3b] dark:text-emerald-400 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Degree Classification & CGPA Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Degree Standing</th>
                    <th className="py-3 px-4">CGPA Range</th>
                    <th className="py-3 px-4">Division Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {classifications.map((row) => (
                    <tr key={row.class} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                        {row.class}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {row.range}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Component Note */}
      <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 space-y-1">
          <p className="font-bold">Continuous Assessment (CA) + Examination Structure</p>
          <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
            At FUAZ, a student's total raw mark (out of 100) comprises Continuous Assessment (Test, Lab, Assignments typically 30 or 40 marks) + End of Semester Examination (60 or 70 marks). The combined mark is matched directly to the grading table above.
          </p>
        </div>
      </div>
    </div>
  );
};
