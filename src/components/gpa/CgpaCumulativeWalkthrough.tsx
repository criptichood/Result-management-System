import { AlertTriangle, BookOpen, CheckCircle2, Layers, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

export const CgpaCumulativeWalkthrough = () => {
  // Static multi-semester dataset
  const semesterProgression = [
    {
      name: '100 Level 1st Semester',
      courses: 8,
      tcu: 20,
      tqp: 78,
      gpa: 3.90,
      cumulativeTcu: 20,
      cumulativeTqp: 78,
      cgpa: 3.90,
    },
    {
      name: '100 Level 2nd Semester',
      courses: 8,
      tcu: 22,
      tqp: 94,
      gpa: 4.27,
      cumulativeTcu: 42,
      cumulativeTqp: 172,
      cgpa: 4.10, // 172 / 42 = 4.095 -> 4.10
    },
    {
      name: '200 Level 1st Semester',
      courses: 8,
      tcu: 21,
      tqp: 77,
      gpa: 3.67,
      cumulativeTcu: 63,
      cumulativeTqp: 249,
      cgpa: 3.95, // 249 / 63 = 3.952 -> 3.95
    },
    {
      name: '200 Level 2nd Semester',
      courses: 8,
      tcu: 21,
      tqp: 75,
      gpa: 3.57,
      cumulativeTcu: 84,
      cumulativeTqp: 324,
      cgpa: 3.86, // 324 / 84 = 3.857 -> 3.86
    },
  ];

  return (
    <div className="space-y-6">
      {/* CGPA Formula Card */}
      <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base font-bold text-[#064e3b] dark:text-emerald-400 flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Cumulative Grade Point Average (CGPA) Across Multiple Semesters
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The Cumulative Grade Point Average (CGPA) measures your overall academic standing from your very first semester up to the current date. It represents the cumulative sum of all earned Quality Points divided by the cumulative sum of all Registered Credit Units.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Official Cumulative Formula</span>
            <div className="text-sm sm:text-base font-mono font-extrabold text-[#064e3b] dark:text-emerald-400">
              CGPA = (TQP₁ + TQP₂ + TQP₃ + ... + TQPₙ) ÷ (TCU₁ + TCU₂ + TCU₃ + ... + TCUₙ)
            </div>
            <p className="text-xs font-mono text-emerald-700 dark:text-emerald-400">
              CGPA = Total Cumulative Quality Points (CCQP) / Total Cumulative Credit Units (CCCU)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Critical Common Misconception Warning */}
      <div className="p-5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 flex items-start gap-4">
        <div className="p-2 rounded-lg bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
          <h4 className="font-extrabold text-amber-950 dark:text-amber-100">
            Crucial Note: Why you CANNOT simply average semester GPAs
          </h4>
          <p className="leading-relaxed">
            A very common student mistake is adding semester GPAs together and dividing by the number of semesters: <span className="font-mono line-through text-red-600 font-bold">(GPA₁ + GPA₂) / 2</span>.
          </p>
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            This simple average is mathematically <strong>incorrect</strong> whenever semesters have different credit loads (e.g., 22 credits vs 16 credits). Semesters with heavier credit loads carry more mathematical weight in your university degree broadsheet. The official registry always aggregates total points first.
          </p>
        </div>
      </div>

      {/* Multi-Semester Cumulative Progression Table */}
      <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Worked 4-Semester Cumulative Progression Example
            </CardTitle>
            <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-xs">
              4 Semesters • 84 Cumulative Credits
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Academic Session / Semester</th>
                  <th className="py-3 px-3 text-center">Sem. Credits (TCU)</th>
                  <th className="py-3 px-3 text-center">Sem. Points (TQP)</th>
                  <th className="py-3 px-3 text-center">Sem. GPA</th>
                  <th className="py-3 px-3 text-center text-teal-700 dark:text-teal-400">Cum. Credits (CCCU)</th>
                  <th className="py-3 px-3 text-center text-emerald-700 dark:text-emerald-400">Cum. Points (CCQP)</th>
                  <th className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    Progression CGPA
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {semesterProgression.map((s, idx) => (
                  <tr key={s.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {s.name}
                    </td>
                    <td className="py-3 px-3 text-center font-mono">{s.tcu}</td>
                    <td className="py-3 px-3 text-center font-mono">{s.tqp}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {s.gpa.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-teal-700 dark:text-teal-400 bg-teal-50/30 dark:bg-teal-950/20">
                      {s.cumulativeTcu}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20">
                      {s.cumulativeTqp}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-900 dark:text-white text-sm">
                      {s.cgpa.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50/90 dark:bg-slate-800/90 font-bold border-t-2 border-slate-200 dark:border-slate-700 text-xs sm:text-sm">
                <tr>
                  <td className="py-3.5 px-4 text-slate-900 dark:text-slate-100 uppercase tracking-wider font-extrabold">
                    Final Standing (After 4 Semesters)
                  </td>
                  <td colSpan={3} className="py-3.5 px-3 text-right text-slate-500 uppercase text-xs">
                    Overall Cumulative Totals:
                  </td>
                  <td className="py-3.5 px-3 text-center text-teal-700 dark:text-teal-400 font-extrabold">
                    84 Credits
                  </td>
                  <td className="py-3.5 px-3 text-center text-emerald-700 dark:text-emerald-400 font-extrabold">
                    324 Points
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">
                    3.86 CGPA
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Degree Standing Calculation Result */}
      <div className="p-5 rounded-xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            Degree Classification Determination
          </span>
          <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold">
            Second Class Honours (Upper Division)
          </span>
        </div>
        <div className="font-mono text-xs sm:text-sm text-slate-300 space-y-1">
          <p>• Final CGPA = 324 (Total Quality Points) ÷ 84 (Total Credit Units) = <strong className="text-white">3.85714... → 3.86</strong></p>
          <p>• Falls cleanly in the <strong className="text-emerald-400">3.50 – 4.49</strong> range.</p>
        </div>
      </div>
    </div>
  );
};
