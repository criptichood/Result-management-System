import React, { useState } from 'react';
import { Calculator, Award, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';

export const computeGradeDetails = (total: number) => {
  if (total >= 70) return { grade: 'A', gradePoint: 5.0, remark: 'Distinction / Excellent' };
  if (total >= 60) return { grade: 'B', gradePoint: 4.0, remark: 'Very Good' };
  if (total >= 50) return { grade: 'C', gradePoint: 3.0, remark: 'Good / Credit' };
  if (total >= 45) return { grade: 'D', gradePoint: 2.0, remark: 'Fair / Pass' };
  if (total >= 40) return { grade: 'E', gradePoint: 1.0, remark: 'Marginal Pass' };
  return { grade: 'F', gradePoint: 0.0, remark: 'Fail (Carryover Required)' };
};

export const GradingEngineSlide: React.FC = () => {
  const [testCa, setTestCa] = useState<number>(32);
  const [testExam, setTestExam] = useState<number>(45);
  const [testUnits, setTestUnits] = useState<number>(3);

  const clampedCa = Math.min(40, Math.max(0, Number(testCa) || 0));
  const clampedExam = Math.min(60, Math.max(0, Number(testExam) || 0));
  const totalScore = clampedCa + clampedExam;
  const { grade, gradePoint, remark } = computeGradeDetails(totalScore);
  const weightedPoints = (testUnits * gradePoint).toFixed(1);

  const gradeScales = [
    { range: '70% – 100%', grade: 'A', point: '5.0', desc: 'Excellent / Distinction', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300' },
    { range: '60% – 69%', grade: 'B', point: '4.0', desc: 'Very Good', badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-300' },
    { range: '50% – 59%', grade: 'C', point: '3.0', desc: 'Good / Satisfactory', badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-300' },
    { range: '45% – 49%', grade: 'D', point: '2.0', desc: 'Fair / Pass', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300' },
    { range: '40% – 44%', grade: 'E', point: '1.0', desc: 'Marginal Pass', badge: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border-orange-300' },
    { range: '0% – 39%', grade: 'F', point: '0.0', desc: 'Fail (Carryover Required)', badge: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-300' },
  ];

  const degreeClasses = [
    { range: '4.50 – 5.00', title: 'First Class Honours', status: 'Excellent Standing', color: 'text-emerald-700 dark:text-emerald-400' },
    { range: '3.50 – 4.49', title: 'Second Class Honours (Upper Division)', status: 'Very Good Standing', color: 'text-blue-700 dark:text-blue-400' },
    { range: '2.40 – 3.49', title: 'Second Class Honours (Lower Division)', status: 'Good Standing', color: 'text-cyan-700 dark:text-cyan-400' },
    { range: '1.50 – 2.39', title: 'Third Class Honours', status: 'Fair Standing', color: 'text-amber-700 dark:text-amber-400' },
    { range: '1.00 – 1.49', title: 'Pass Degree', status: 'Marginal Standing', color: 'text-orange-700 dark:text-orange-400' },
    { range: '< 1.00', title: 'Academic Probation / Withdrawal', status: 'Warning', color: 'text-red-700 dark:text-red-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-[#064e3b] to-emerald-800 text-white p-6 sm:p-8 rounded-2xl shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold tracking-wider uppercase border border-white/20">
            Section 03 • Mathematics & NUC Compliance
          </span>
          <span className="text-xs text-emerald-200">Official 5.0 Scale Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          5.0 CGPA Grading Engine & Academic Rules
        </h2>
        <p className="text-sm sm:text-base text-emerald-100 max-w-3xl leading-relaxed">
          Standardized Nigerian university mathematical engine computing continuous assessment weights, credit weighted points, semester GPAs, and cumulative degree classifications.
        </p>
      </div>

      {/* Interactive Grade Calculator Tester */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Live Interactive Grading Engine Tester
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Adjust inputs below to test real-time computation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Continuous Assessment (Max 40)
            </label>
            <input
              type="number"
              min="0"
              max="40"
              value={testCa}
              onChange={(e) => setTestCa(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Semester Examination (Max 60)
            </label>
            <input
              type="number"
              min="0"
              max="60"
              value={testExam}
              onChange={(e) => setTestExam(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Course Credit Units (CU)
            </label>
            <select
              value={testUnits}
              onChange={(e) => setTestUnits(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-sm"
            >
              <option value="1">1 Unit</option>
              <option value="2">2 Units</option>
              <option value="3">3 Units</option>
              <option value="4">4 Units</option>
              <option value="6">6 Units (Final Year Project)</option>
            </select>
          </div>
        </div>

        {/* Live Result Display Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500">Total Score</span>
            <div className="text-xl font-mono font-extrabold text-slate-900 dark:text-white">{totalScore}/100</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Letter Grade</span>
            <div className="text-xl font-mono font-extrabold text-emerald-700 dark:text-emerald-300">{grade}</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
            <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400">Grade Point (GP)</span>
            <div className="text-xl font-mono font-extrabold text-blue-700 dark:text-blue-300">{gradePoint.toFixed(1)}</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-center">
            <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-400">Weighted Points</span>
            <div className="text-xl font-mono font-extrabold text-purple-700 dark:text-purple-300">{weightedPoints}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Remark</span>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate mt-1">{remark}</div>
          </div>
        </div>
      </div>

      {/* 5.0 Grading Benchmark Table & Degree Classifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scale Table */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" /> NUC 5.0 Letter Grade Benchmark
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold text-[11px]">
                  <th className="pb-2.5">Score Range</th>
                  <th className="pb-2.5">Grade</th>
                  <th className="pb-2.5">Point</th>
                  <th className="pb-2.5">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {gradeScales.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 font-mono text-slate-800 dark:text-slate-200">{item.range}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded font-bold border ${item.badge}`}>
                        {item.grade}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono font-bold text-slate-900 dark:text-white">{item.point}</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-400">{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Degree Classifications */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Degree Classifications (CGPA)
          </h3>
          <div className="space-y-2.5">
            {degreeClasses.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.status}</p>
                </div>
                <span className={`text-xs font-mono font-extrabold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 ${item.color}`}>
                  {item.range}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
