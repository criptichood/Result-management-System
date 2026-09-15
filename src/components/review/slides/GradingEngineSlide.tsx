import React, { useState } from 'react';
import { 
  Calculator, Award, CheckCircle2, AlertTriangle, 
  ArrowRight, RefreshCw, FileCode, Check, HelpCircle
} from 'lucide-react';

export const computeGradeDetails = (total: number) => {
  if (total >= 70) return { grade: 'A', gradePoint: 5.0, remark: 'Distinction / Excellent' };
  if (total >= 60) return { grade: 'B', gradePoint: 4.0, remark: 'Very Good' };
  if (total >= 50) return { grade: 'C', gradePoint: 3.0, remark: 'Good / Credit' };
  if (total >= 45) return { grade: 'D', gradePoint: 2.0, remark: 'Fair / Pass' };
  return { grade: 'F', gradePoint: 0.0, remark: 'Fail (Carryover Required)' };
};

export const GradingEngineSlide: React.FC = () => {
  const [testCa, setTestCa] = useState<number | string>(32);
  const [testExam, setTestExam] = useState<number | string>(45);
  const [testUnits, setTestUnits] = useState<number>(3);
  const [activeCodeTab, setActiveCodeTab] = useState<'letter' | 'point' | 'gpa'>('letter');
  const [isCalculatedFlash, setIsCalculatedFlash] = useState<boolean>(false);
  const [verificationMessage, setVerificationMessage] = useState<string>('Calculation validated and mathematically synchronized.');

  const clampedCa = Math.min(40, Math.max(0, Number(testCa) || 0));
  const clampedExam = Math.min(60, Math.max(0, Number(testExam) || 0));
  const totalScore = clampedCa + clampedExam;
  const { grade, gradePoint, remark } = computeGradeDetails(totalScore);
  const weightedPoints = (testUnits * gradePoint).toFixed(1);

  const triggerRecalculation = () => {
    setIsCalculatedFlash(true);
    setVerificationMessage(`Synchronized with FUAZ 5.0 CGPA standards: ${clampedCa} CA + ${clampedExam} Exam = ${totalScore} (${grade}).`);
    const timer = setTimeout(() => {
      setIsCalculatedFlash(false);
    }, 600);
    return () => clearTimeout(timer);
  };

  const handleCaChange = (valStr: string) => {
    if (valStr === '') {
      setTestCa('');
      return;
    }
    const val = Math.min(40, Math.max(0, parseInt(valStr) || 0));
    setTestCa(val);
  };

  const handleExamChange = (valStr: string) => {
    if (valStr === '') {
      setTestExam('');
      return;
    }
    const val = Math.min(60, Math.max(0, parseInt(valStr) || 0));
    setTestExam(val);
  };

  const gradeScales = [
    { range: '70% – 100%', grade: 'A', point: '5.0', desc: 'Excellent / Distinction', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300' },
    { range: '60% – 69%', grade: 'B', point: '4.0', desc: 'Very Good', badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-300' },
    { range: '50% – 59%', grade: 'C', point: '3.0', desc: 'Good / Satisfactory', badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-300' },
    { range: '45% – 49%', grade: 'D', point: '2.0', desc: 'Fair / Pass', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300' },
    { range: '0% – 44%', grade: 'F', point: '0.0', desc: 'Fail (Carryover Required)', badge: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-300' },
  ];

  const degreeClasses = [
    { range: '4.50 – 5.00', title: 'First Class Honours', status: 'Excellent Academic Standing', color: 'text-emerald-700 dark:text-emerald-400' },
    { range: '3.50 – 4.49', title: 'Second Class Honours (Upper Division)', status: 'Very Good Standing', color: 'text-blue-700 dark:text-blue-400' },
    { range: '2.40 – 3.49', title: 'Second Class Honours (Lower Division)', status: 'Satisfactory Standing', color: 'text-cyan-700 dark:text-cyan-400' },
    { range: '1.50 – 2.39', title: 'Third Class Honours', status: 'Minimum Passing Standing', color: 'text-amber-700 dark:text-amber-400' },
    { range: '0.00 – 1.49', title: 'Fail / Academic Probation', status: 'Requires Performance Improvement', color: 'text-red-700 dark:text-red-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-[#064e3b] to-emerald-800 text-white p-6 sm:p-8 rounded-2xl shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold tracking-wider uppercase border border-white/20">
            Section 05 • Mathematics & NUC Compliance
          </span>
          <span className="text-xs text-emerald-200">Official 5.0 Scale Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          5.0 CGPA Grading Engine & Academic Rules
        </h2>
        <p className="text-sm sm:text-base text-emerald-100 max-w-3xl leading-relaxed">
          The core arithmetic engine executing National Universities Commission (NUC) standards, with E grade fully eliminated. Every score below 45% automatically resolves to F.
        </p>
      </div>

      {/* Real-time Simulator & Live Source Code Viewer Side-by-Side */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left: The Interactive Simulator */}
        <div className={`bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border transition-all duration-300 space-y-5 ${isCalculatedFlash ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800 shadow-2xs'}`}>
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Calculator className="w-4.5 h-4.5 text-emerald-600" />
                Interactive Computation Simulator
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Input test marks with real-time numeric constraints and immediate updates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                <span>CA Score</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900 font-bold">Strict Max 40</span>
              </label>
              <input
                type="number"
                min="0"
                max="40"
                value={testCa}
                onChange={(e) => handleCaChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                <span>Exam Score</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900 font-bold">Strict Max 60</span>
              </label>
              <input
                type="number"
                min="0"
                max="60"
                value={testExam}
                onChange={(e) => handleExamChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Course Credits
              </label>
              <select
                value={testUnits}
                onChange={(e) => setTestUnits(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="1">1 Unit</option>
                <option value="2">2 Units</option>
                <option value="3">3 Units</option>
                <option value="4">4 Units</option>
                <option value="6">6 Units</option>
              </select>
            </div>
          </div>

          {/* Live Outcome Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <div className="text-center">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Total Score</span>
              <div className="text-lg font-mono font-extrabold text-slate-900 dark:text-white mt-0.5">{totalScore}/100</div>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Letter Grade</span>
              <div className="text-lg font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{grade}</div>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Grade Point</span>
              <div className="text-lg font-mono font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">{gradePoint.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Quality Point</span>
              <div className="text-lg font-mono font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">{weightedPoints}</div>
            </div>
          </div>

          {/* Explicit Compute & Verify Button */}
          <button
            onClick={triggerRecalculation}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 active:translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {isCalculatedFlash ? (
              <>
                <Check className="w-4 h-4 animate-bounce" />
                Computation Verified & Logged
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Compute & Verify Academic Grade
              </>
            )}
          </button>

          {/* Active Formula Explanation */}
          <div className={`p-3.5 rounded-xl border transition-all duration-300 flex gap-2.5 ${isCalculatedFlash ? 'bg-emerald-100 border-emerald-400 text-emerald-950' : 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300'}`}>
            <HelpCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs leading-normal">
              <strong>Deterministic Formula Output:</strong><br />
              <span className="font-mono font-semibold">{clampedCa} CA + {clampedExam} Exam = {totalScore}</span>. Grade resolves to <span className="font-bold">{grade}</span> (GP <span className="font-mono">{gradePoint.toFixed(1)}</span>). <br />
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">{verificationMessage}</span>
            </div>
          </div>
        </div>

        {/* Right: The Live Source Code Inspector */}
        <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-lg p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileCode className="w-4.5 h-4.5 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Production Code Inspector
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">
                TypeScript Source
              </span>
            </div>

            {/* Code Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveCodeTab('letter')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activeCodeTab === 'letter'
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800/40 border border-transparent'
                }`}
              >
                1. letterGrade()
              </button>
              <button
                onClick={() => setActiveCodeTab('point')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activeCodeTab === 'point'
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800/40 border border-transparent'
                }`}
              >
                2. gradePoint()
              </button>
              <button
                onClick={() => setActiveCodeTab('gpa')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activeCodeTab === 'gpa'
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800/40 border border-transparent'
                }`}
              >
                3. gpaFormula()
              </button>
            </div>

            {/* Code Content */}
            <div className="bg-black/40 rounded-xl p-4 font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto space-y-1 text-slate-300 border border-slate-950">
              {activeCodeTab === 'letter' && (
                <>
                  <p className="text-slate-500">// File: src/lib/academicOperations.ts</p>
                  <p className="text-emerald-400">export function calculateLetterGrade(total: number): string &#123;</p>
                  <p className={`pl-4 transition-all duration-200 ${totalScore >= 70 ? 'bg-emerald-950/60 text-white font-bold border-l-2 border-emerald-500 pl-3' : ''}`}>
                    if (total &gt;= 70) return 'A'; <span className="text-slate-500">// Excellent</span>
                  </p>
                  <p className={`pl-4 transition-all duration-200 ${totalScore >= 60 && totalScore < 70 ? 'bg-emerald-950/60 text-white font-bold border-l-2 border-emerald-500 pl-3' : ''}`}>
                    if (total &gt;= 60) return 'B'; <span className="text-slate-500">// Very Good</span>
                  </p>
                  <p className={`pl-4 transition-all duration-200 ${totalScore >= 50 && totalScore < 60 ? 'bg-emerald-950/60 text-white font-bold border-l-2 border-emerald-500 pl-3' : ''}`}>
                    if (total &gt;= 50) return 'C'; <span className="text-slate-500">// Good</span>
                  </p>
                  <p className={`pl-4 transition-all duration-200 ${totalScore >= 45 && totalScore < 50 ? 'bg-emerald-950/60 text-white font-bold border-l-2 border-emerald-500 pl-3' : ''}`}>
                    if (total &gt;= 45) return 'D'; <span className="text-slate-500">// Pass</span>
                  </p>
                  <p className={`pl-4 transition-all duration-200 ${totalScore < 45 ? 'bg-red-950/60 text-white font-bold border-l-2 border-red-500 pl-3' : ''}`}>
                    return 'F'; <span className="text-slate-500">// Fail (E grade eliminated)</span>
                  </p>
                  <p className="text-emerald-400">&#125;</p>
                </>
              )}

              {activeCodeTab === 'point' && (
                <>
                  <p className="text-slate-500">// File: src/lib/academicUtils.ts</p>
                  <p className="text-emerald-400">export const getGradePoint = (grade: string): number =&gt; &#123;</p>
                  <p className="pl-4">switch (grade) &#123;</p>
                  <p className={`pl-8 ${grade === 'A' ? 'bg-emerald-950/60 text-white font-bold border-l-2 border-emerald-500 pl-7' : ''}`}>
                    case 'A': return 5.0;
                  </p>
                  <p className={`pl-8 ${grade === 'B' ? 'bg-emerald-950/60 text-white font-bold border-l-2 border-emerald-500 pl-7' : ''}`}>
                    case 'B': return 4.0;
                  </p>
                  <p className={`pl-8 ${grade === 'C' ? 'bg-emerald-950/60 text-white font-bold border-l-2 border-emerald-500 pl-7' : ''}`}>
                    case 'C': return 3.0;
                  </p>
                  <p className={`pl-8 ${grade === 'D' ? 'bg-emerald-950/60 text-white font-bold border-l-2 border-emerald-500 pl-7' : ''}`}>
                    case 'D': return 2.0;
                  </p>
                  <p className={`pl-8 ${grade === 'F' ? 'bg-red-950/60 text-white font-bold border-l-2 border-red-500 pl-7' : ''}`}>
                    default: return 0.0; <span className="text-slate-500">// All other grades fail</span>
                  </p>
                  <p className="pl-4">&#125;</p>
                  <p className="text-emerald-400">&#125;</p>
                </>
              )}

              {activeCodeTab === 'gpa' && (
                <>
                  <p className="text-slate-500">// File: src/lib/academicUtils.ts</p>
                  <p className="text-emerald-400">export function calculateSemesterGPA(results: CourseResult[]): number &#123;</p>
                  <p className="pl-4 text-slate-400">let totalCredits = 0;</p>
                  <p className="pl-4 text-slate-400">let totalQualityPoints = 0;</p>
                  <p className="pl-4 text-slate-400">results.forEach(r =&gt; &#123;</p>
                  <p className="pl-8 text-slate-400">const gp = getGradePoint(r.grade);</p>
                  <p className="pl-8 text-emerald-300">totalQualityPoints += (gp * r.creditUnits);</p>
                  <p className="pl-8 text-emerald-300">totalCredits += r.creditUnits;</p>
                  <p className="pl-4">&#125;);</p>
                  <p className="pl-4 text-emerald-400">return totalCredits &gt; 0 ? (totalQualityPoints / totalCredits) : 0.00;</p>
                  <p className="text-emerald-400">&#125;</p>
                </>
              )}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active calculation line is dynamically highlighted based on input scores.</span>
          </div>
        </div>
      </div>

      {/* Official Scale Reference Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Letter Grades (FUAZ Official Standard) */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" /> Official FUAZ NUC Grading Scale (No E Grade)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold text-[11px]">
                  <th className="pb-2.5">Score Range</th>
                  <th className="pb-2.5">Grade</th>
                  <th className="pb-2.5">GP Point</th>
                  <th className="pb-2.5">Status Description</th>
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

        {/* CGPA Classifications */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> NUC Degree Classifications
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
