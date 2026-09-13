import React, { useState } from 'react';
import { Calculator, Plus, Trash2, RefreshCw, CheckCircle2, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { getGradePoint, getDegreeClassification } from '../../lib/academicUtils';

interface CourseRow {
  id: string;
  code: string;
  title: string;
  cu: number;
  score: number;
}

export const InteractiveGpaSandbox = () => {
  const [courses, setCourses] = useState<CourseRow[]>([
    { id: '1', code: 'CSC 211', title: 'Computer Programming I', cu: 3, score: 60 },
    { id: '2', code: 'MTH 211', title: 'Mathematical Methods I', cu: 3, score: 77 },
    { id: '3', code: 'CSC 212', title: 'Operating System I', cu: 3, score: 74 },
    { id: '4', code: 'CSC 214', title: 'Digital Logic Design', cu: 3, score: 60 },
    { id: '5', code: 'MTH 214', title: 'Linear Algebra I', cu: 2, score: 68 },
    { id: '6', code: 'GST 212', title: 'Peace Studies & Conflict', cu: 2, score: 48 },
  ]);

  const [priorCredits, setPriorCredits] = useState<number>(45);
  const [priorQualityPoints, setPriorQualityPoints] = useState<number>(188);

  const getLetterAndGP = (score: number) => {
    if (score >= 70) return { grade: 'A', gp: 5 };
    if (score >= 60) return { grade: 'B', gp: 4 };
    if (score >= 50) return { grade: 'C', gp: 3 };
    if (score >= 45) return { grade: 'D', gp: 2 };
    return { grade: 'F', gp: 0 };
  };

  const handleAddCourse = () => {
    const nextNum = courses.length + 1;
    setCourses([
      ...courses,
      { id: Date.now().toString(), code: `CRS 20${nextNum}`, title: `Elective Course ${nextNum}`, cu: 3, score: 70 }
    ]);
  };

  const handleRemoveCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter(c => c.id !== id));
  };

  const handleUpdateCourse = (id: string, field: keyof CourseRow, value: any) => {
    setCourses(courses.map(c => {
      if (c.id === id) {
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  const loadJeremiah2023 = () => {
    setCourses([
      { id: '1', code: 'GST 212', title: 'Peace Studies and Conflict Resolution', cu: 2, score: 48 },
      { id: '2', code: 'CSC 211', title: 'Computer Programming I', cu: 3, score: 60 },
      { id: '3', code: 'MTH 211', title: 'Mathematical Methods I', cu: 3, score: 77 },
      { id: '4', code: 'CSC 213', title: 'Discrete Structure', cu: 3, score: 50 },
      { id: '5', code: 'CSC 214', title: 'Digital Logic Design', cu: 3, score: 60 },
      { id: '6', code: 'MTH 214', title: 'Linear Algebra I', cu: 2, score: 68 },
      { id: '7', code: 'GST 211', title: 'History and Philosophy of Science', cu: 2, score: 44 },
      { id: '8', code: 'CSC 212', title: 'Operating System I', cu: 3, score: 74 },
    ]);
    setPriorCredits(45);
    setPriorQualityPoints(189);
  };

  const loadJeremiah2024Sem2 = () => {
    setCourses([
      { id: '1', code: 'MTH 222', title: 'Elementary Differential Equations I', cu: 3, score: 51 },
      { id: '2', code: 'PHY 221', title: 'Electric Circuits and Electronics', cu: 3, score: 64 },
      { id: '3', code: 'CSC 221', title: 'Computer Programming II', cu: 3, score: 53 },
      { id: '4', code: 'CSC 222', title: 'Computer Hardware', cu: 3, score: 72 },
      { id: '5', code: 'CSC 223', title: 'Fundamentals of Data Structures', cu: 3, score: 47 },
      { id: '6', code: 'CSC 224', title: 'Introduction to Web Development', cu: 2, score: 71 },
      { id: '7', code: 'MTH 225', title: 'Linear Algebra II', cu: 2, score: 45 },
      { id: '8', code: 'GST 223', title: 'Entrepreneurship Studies I', cu: 2, score: 81 },
    ]);
    setPriorCredits(66);
    setPriorQualityPoints(266);
  };

  const handleReset = () => {
    setCourses([
      { id: '1', code: 'CSC 201', title: 'Introduction to Algorithms', cu: 3, score: 75 },
      { id: '2', code: 'MTH 201', title: 'Calculus & Analytics', cu: 3, score: 68 },
      { id: '3', code: 'PHY 201', title: 'General Physics III', cu: 3, score: 62 },
      { id: '4', code: 'GST 201', title: 'Nigerian Peoples & Culture', cu: 2, score: 80 },
    ]);
    setPriorCredits(0);
    setPriorQualityPoints(0);
  };

  // Calculations
  let semCredits = 0;
  let semQualityPoints = 0;

  const rowsWithStats = courses.map(c => {
    const { grade, gp } = getLetterAndGP(c.score || 0);
    const qp = (c.cu || 0) * gp;
    semCredits += (c.cu || 0);
    semQualityPoints += qp;
    return { ...c, grade, gp, qp };
  });

  const semGpa = semCredits > 0 ? (semQualityPoints / semCredits).toFixed(2) : '0.00';
  const totalCumCredits = priorCredits + semCredits;
  const totalCumQP = priorQualityPoints + semQualityPoints;
  const cumCgpa = totalCumCredits > 0 ? (totalCumQP / totalCumCredits).toFixed(2) : '0.00';

  const classification = getDegreeClassification(parseFloat(cumCgpa));

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            Interactive GPA & CGPA Simulator Sandbox
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Edit courses, credit units, and scores in real-time to observe dynamic formula calculations.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={loadJeremiah2023}
            className="text-xs gap-1.5 border-emerald-300 dark:border-emerald-800 text-[#064e3b] dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Load 2023/2024 1st Sem Data
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={loadJeremiah2024Sem2}
            className="text-xs gap-1.5 border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-300 bg-teal-50/60 dark:bg-teal-950/40 hover:bg-teal-100"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Load 2023/2024 2nd Sem Data
          </Button>
          <Button size="sm" variant="ghost" onClick={handleReset} className="text-xs text-slate-500 hover:text-slate-900 gap-1">
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </Button>
        </div>
      </div>

      {/* Course Input Table */}
      <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
            Current Semester Courses & Score Inputs
          </CardTitle>
          <Button size="sm" onClick={handleAddCourse} className="gap-1.5 bg-[#064e3b] hover:bg-[#065f46] text-white text-xs">
            <Plus className="w-4 h-4" /> Add Course
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase font-bold text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-3">Code</th>
                  <th className="py-3 px-3">Title</th>
                  <th className="py-3 px-2 text-center w-24">Credits (CU)</th>
                  <th className="py-3 px-2 text-center w-28">Score (0-100)</th>
                  <th className="py-3 px-2 text-center">Grade</th>
                  <th className="py-3 px-2 text-center">GP</th>
                  <th className="py-3 px-3 text-right font-mono">Quality Points (QP)</th>
                  <th className="py-3 px-2 text-center w-12">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {rowsWithStats.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2 px-3">
                      <Input
                        value={row.code}
                        onChange={(e) => handleUpdateCourse(row.id, 'code', e.target.value)}
                        className="h-8 text-xs font-bold uppercase w-24 bg-white dark:bg-slate-950"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <Input
                        value={row.title}
                        onChange={(e) => handleUpdateCourse(row.id, 'title', e.target.value)}
                        className="h-8 text-xs bg-white dark:bg-slate-950 min-w-[160px]"
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <select
                        value={row.cu}
                        onChange={(e) => handleUpdateCourse(row.id, 'cu', parseInt(e.target.value, 10))}
                        className="h-8 text-xs font-bold text-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2"
                      >
                        {[1, 2, 3, 4, 6].map(n => (
                          <option key={n} value={n}>{n} CU</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={row.score}
                        onChange={(e) => handleUpdateCourse(row.id, 'score', Math.min(100, Math.max(0, parseInt(e.target.value || '0', 10))))}
                        className="h-8 text-xs font-mono font-bold text-center w-20 mx-auto bg-white dark:bg-slate-950"
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded font-bold text-xs ${
                        row.grade === 'A' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        row.grade === 'B' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' :
                        row.grade === 'C' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300' :
                        row.grade === 'D' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                        'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                      }`}>
                        {row.grade}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                      {row.gp}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {row.cu} × {row.gp} = <span className="font-extrabold text-slate-900 dark:text-white">{row.qp}</span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveCourse(row.id)}
                        disabled={courses.length <= 1}
                        className="h-7 w-7 text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Prior Cumulative Record (Optional for CGPA Simulation) */}
      <Card className="border border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Prior Academic History (For Multi-Semester CGPA Simulation)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Prior Registered Credits (Before Current Semester):
              </label>
              <Input
                type="number"
                min={0}
                value={priorCredits}
                onChange={(e) => setPriorCredits(Math.max(0, parseInt(e.target.value || '0', 10)))}
                className="bg-white dark:bg-slate-950 font-mono font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Prior Cumulative Quality Points (Before Current Semester):
              </label>
              <Input
                type="number"
                min={0}
                value={priorQualityPoints}
                onChange={(e) => setPriorQualityPoints(Math.max(0, parseInt(e.target.value || '0', 10)))}
                className="bg-white dark:bg-slate-950 font-mono font-semibold"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Calculation Results Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Semester GPA Calculation Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900 to-[#064e3b] text-white shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-emerald-200 font-bold">
              Current Semester GPA
            </span>
            <Badge className="bg-emerald-400/20 text-emerald-200 border-emerald-400/30 text-[11px]">
              {semCredits} Units Registered
            </Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
              {semGpa}
            </span>
            <span className="text-sm font-semibold text-emerald-200">/ 5.00 GPA</span>
          </div>
          <div className="text-xs text-emerald-100 font-mono border-t border-emerald-700/60 pt-2 space-y-1">
            <p>• Total Quality Points: <strong>{semQualityPoints}</strong></p>
            <p>• Formula: <strong>{semQualityPoints} ÷ {semCredits} = {semGpa}</strong></p>
          </div>
        </div>

        {/* Cumulative CGPA Calculation Card */}
        <div className="p-5 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-teal-400 font-bold">
              Cumulative CGPA (All Sessions)
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${classification.badgeClass}`}>
              {classification.label}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-teal-400 tracking-tight">
              {cumCgpa}
            </span>
            <span className="text-sm font-semibold text-slate-400">/ 5.00 CGPA</span>
          </div>
          <div className="text-xs text-slate-300 font-mono border-t border-slate-800 pt-2 space-y-1">
            <p>• Total Cumulative Credits: <strong>{totalCumCredits}</strong> ({priorCredits} + {semCredits})</p>
            <p>• Total Cumulative Points: <strong>{totalCumQP}</strong> ({priorQualityPoints} + {semQualityPoints})</p>
            <p>• Formula: <strong>{totalCumQP} ÷ {totalCumCredits} = {cumCgpa}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};
