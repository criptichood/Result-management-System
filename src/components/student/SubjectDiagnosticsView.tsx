import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  AlertTriangle, 
  BookOpen, 
  CheckCircle2, 
  Lightbulb, 
  Calculator, 
  TrendingUp, 
  Info, 
  ArrowRight,
  Layers,
  Search
} from 'lucide-react';

interface ResultItem {
  course: {
    id: string;
    code: string;
    title: string;
    creditUnits: number;
    department: string;
    level: number;
    semester: 1 | 2;
  };
  result?: {
    caScore: number | null;
    examScore: number | null;
    totalScore: number | null;
    grade: string | null;
    status: string;
  };
  enrollment: {
    academicYear: string;
    semester: 1 | 2;
  };
}

interface SubjectDiagnosticsViewProps {
  allPublishedResults: ResultItem[];
  cumulativeCgpa: number;
}

interface SubjectDomain {
  name: string;
  codePrefix: string;
  iconName: string;
  courses: ResultItem[];
  avgScore: number;
  avgGp: number;
  totalUnits: number;
  gradeCounts: { A: number; B: number; C: number; D: number; F: number };
  status: 'strength' | 'competent' | 'moderate' | 'critical';
  recommendation: string;
}

export const SubjectDiagnosticsView: React.FC<SubjectDiagnosticsViewProps> = ({
  allPublishedResults,
  cumulativeCgpa,
}) => {
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');
  const [simulationTargetGrade, setSimulationTargetGrade] = useState<'A' | 'B'>('A');

  // Identify all courses with C, D, F grades (most especially D, F)
  const weakCourses = allPublishedResults.filter(item => {
    const grade = item.result?.grade;
    return grade === 'C' || grade === 'D' || grade === 'F';
  }).sort((a, b) => {
    // Sort D, F first, then C
    const gradeOrder: Record<string, number> = { F: 1, D: 2, C: 3 };
    const orderA = gradeOrder[a.result?.grade || 'C'] || 4;
    const orderB = gradeOrder[b.result?.grade || 'C'] || 4;
    return orderA - orderB;
  });

  // Group all courses by academic domain (Mathematics, Computer Science, Physical Sciences, General Studies, Others)
  const domainMap: Record<string, ResultItem[]> = {
    'Mathematics & Quantitative': [],
    'Computer Science & Computing': [],
    'Physical & Chemical Sciences': [],
    'General Studies (GST)': [],
    'Other Electives': [],
  };

  allPublishedResults.forEach(item => {
    const code = item.course?.code?.toUpperCase() || '';
    if (code.startsWith('MTH') || code.startsWith('STA')) {
      domainMap['Mathematics & Quantitative'].push(item);
    } else if (code.startsWith('CSC') || code.startsWith('CPT') || code.startsWith('IFT')) {
      domainMap['Computer Science & Computing'].push(item);
    } else if (code.startsWith('PHY') || code.startsWith('CHM') || code.startsWith('BIO')) {
      domainMap['Physical & Chemical Sciences'].push(item);
    } else if (code.startsWith('GST')) {
      domainMap['General Studies (GST)'].push(item);
    } else {
      domainMap['Other Electives'].push(item);
    }
  });

  const domains: SubjectDomain[] = Object.entries(domainMap)
    .filter(([_, items]) => items.length > 0)
    .map(([name, items]) => {
      let scoreSum = 0;
      let pointsSum = 0;
      let totalUnits = 0;
      const gradeCounts = { A: 0, B: 0, C: 0, D: 0, F: 0 };

      items.forEach(it => {
        const score = it.result?.totalScore || 0;
        const units = it.course?.creditUnits || 0;
        const grade = it.result?.grade || '';
        scoreSum += score;
        totalUnits += units;

        let gp = 0;
        if (grade === 'A') { gp = 5; gradeCounts.A++; }
        else if (grade === 'B') { gp = 4; gradeCounts.B++; }
        else if (grade === 'C') { gp = 3; gradeCounts.C++; }
        else if (grade === 'D') { gp = 2; gradeCounts.D++; }
        else if (grade === 'F') { gp = 0; gradeCounts.F++; }

        pointsSum += gp * units;
      });

      const avgScore = items.length > 0 ? (scoreSum / items.length) : 0;
      const avgGp = totalUnits > 0 ? (pointsSum / totalUnits) : 0;

      let status: SubjectDomain['status'] = 'strength';
      let recommendation = '';

      if (avgScore >= 70) {
        status = 'strength';
        recommendation = 'Strong aptitude demonstrated. Continue maintaining deep engagement and explore advanced elective projects.';
      } else if (avgScore >= 60) {
        status = 'competent';
        recommendation = 'Solid foundational performance. Target minor continuous assessment gains to convert B grades into A distinctions.';
      } else if (avgScore >= 50) {
        status = 'moderate';
        recommendation = 'Moderate understanding. Dedicate dedicated weekly tutorial problem solving to reinforce core theorems and formulas.';
      } else {
        status = 'critical';
        recommendation = 'Priority intervention required. Attend departmental office hours and form peer study groups for rigorous review.';
      }

      return {
        name,
        codePrefix: name.split(' ')[0],
        iconName: name.includes('Math') ? 'calculator' : name.includes('Comp') ? 'laptop' : 'book',
        courses: items,
        avgScore,
        avgGp,
        totalUnits,
        gradeCounts,
        status,
        recommendation,
      };
    });

  // Calculate potential CGPA elevation if weak courses were scored as target grade
  const totalUnits = allPublishedResults.reduce((acc, curr) => acc + (curr.course?.creditUnits || 0), 0);
  const currentTotalPoints = allPublishedResults.reduce((acc, curr) => {
    const units = curr.course?.creditUnits || 0;
    const grade = curr.result?.grade;
    const gp = grade === 'A' ? 5 : grade === 'B' ? 4 : grade === 'C' ? 3 : grade === 'D' ? 2 : 0;
    return acc + (gp * units);
  }, 0);

  // If the student achieves A (5.0) or B (4.0) in the upcoming 20-unit semester:
  const upcomingUnits = 20;
  const projectedTargetPoints = simulationTargetGrade === 'A' ? 5 * upcomingUnits : 4 * upcomingUnits;
  const simulatedCgpa = (currentTotalPoints + projectedTargetPoints) / (totalUnits + upcomingUnits);

  return (
    <div id="subject-diagnostics-view" className="space-y-6">
      {/* Overview Diagnostic Banner */}
      <div className="p-4 bg-gradient-to-r from-amber-500/10 via-emerald-500/5 to-transparent border border-amber-200 dark:border-amber-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-lg flex-shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Academic Subject Diagnostics & Focus Pinpointer</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              Automated subject-domain analytics and pinpointed course evaluations to help you prioritize revision efforts in critical subjects (e.g. Mathematics and Computing).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
            {weakCourses.length} Key Area{weakCourses.length !== 1 ? 's' : ''} to Strengthen
          </span>
        </div>
      </div>

      {/* Disciplinary Domain Breakdown Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Disciplinary Subject Mastery Index
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{domains.length} Core Disciplines Assessed</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {domains.map(dom => (
            <Card key={dom.name} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">{dom.name}</CardTitle>
                      <CardDescription className="text-[11px] text-slate-500 dark:text-slate-400">
                        {dom.courses.length} courses • {dom.totalUnits} credit units
                      </CardDescription>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    dom.status === 'strength' ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
                    dom.status === 'competent' ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800' :
                    dom.status === 'moderate' ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' :
                    'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                  }`}>
                    {dom.status === 'strength' ? 'Strength (A Band)' :
                     dom.status === 'competent' ? 'Competent (B Band)' :
                     dom.status === 'moderate' ? 'Focus Area (C Band)' : 'Critical Attention (D/F)'}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-3.5 space-y-3">
                {/* Domain Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase">Domain Average Score</span>
                    <p className="text-base font-bold text-slate-900 dark:text-white">{dom.avgScore.toFixed(1)}%</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase">Discipline GPA</span>
                    <p className="text-base font-bold text-emerald-700 dark:text-emerald-400">{dom.avgGp.toFixed(2)} / 5.00</p>
                  </div>
                </div>

                {/* Grade Distribution in this domain */}
                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 px-1">
                  <span>Grade Breakdown:</span>
                  <div className="flex items-center gap-1.5 font-bold">
                    {dom.gradeCounts.A > 0 && <span className="text-emerald-700 dark:text-emerald-400">{dom.gradeCounts.A} A</span>}
                    {dom.gradeCounts.B > 0 && <span className="text-teal-700 dark:text-teal-400">{dom.gradeCounts.B} B</span>}
                    {dom.gradeCounts.C > 0 && <span className="text-blue-700 dark:text-blue-400">{dom.gradeCounts.C} C</span>}
                    {dom.gradeCounts.D > 0 && <span className="text-amber-700 dark:text-amber-400">{dom.gradeCounts.D} D</span>}
                    {dom.gradeCounts.F > 0 && <span className="text-rose-700 dark:text-rose-400">{dom.gradeCounts.F} F</span>}
                  </div>
                </div>

                {/* Recommendation Note */}
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 border-l-2 border-emerald-600 dark:border-emerald-500 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-200">Recommendation:</strong> {dom.recommendation}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Critical Focus Areas & Course Weakness Pinpointer */}
      <Card id="card-weak-courses-diagnostics" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" /> Key Areas & Weakness Pinpoint Analysis (C & D Grades)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                In-depth assessment of courses with C or D grades, detailing CA vs. Exam root causes and tailored remedies
              </CardDescription>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Showing {weakCourses.length} flagged course{weakCourses.length !== 1 ? 's' : ''}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {weakCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weakCourses.map(item => {
                const grade = item.result?.grade || 'C';
                const total = item.result?.totalScore || 0;
                const ca = item.result?.caScore || 0;
                const exam = item.result?.examScore || 0;
                const units = item.course?.creditUnits || 0;
                
                // Diagnostic reasoning
                let rootCause = '';
                let actionPlan = '';
                let priority: 'high' | 'medium' = grade === 'D' || grade === 'F' ? 'high' : 'medium';

                if (ca >= 28 && exam < 25) {
                  rootCause = `Exam Disparity: High Continuous Assessment (${ca}/40) but low Final Exam performance (${exam}/60).`;
                  actionPlan = 'Focus on timed examination problem sets, past question drill sessions, and memory retention techniques.';
                } else if (ca < 20 && exam >= 35) {
                  rootCause = `Continuous Assessment Deficit: Solid exam score (${exam}/60) undermined by low CA marks (${ca}/40).`;
                  actionPlan = 'Prioritize 100% attendance, early lab report submissions, and midterm test preparation in 200-level courses.';
                } else {
                  rootCause = `Balanced Moderate Performance: Both CA (${ca}/40) and Exam (${exam}/60) fall in the middle threshold.`;
                  actionPlan = 'Review core theoretical proofs and participate actively in departmental tutorial groups.';
                }

                return (
                  <div 
                    key={item.course.id}
                    className={`p-4 rounded-xl border transition-all ${
                      priority === 'high' 
                        ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs' 
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{item.course.code}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">({units} Units)</span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5 line-clamp-1">{item.course.title}</h4>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                          grade === 'D' ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800' :
                          grade === 'F' ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800' :
                          'bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
                        }`}>
                          Grade {grade} ({total}%)
                        </span>
                      </div>
                    </div>

                    {/* CA vs Exam breakdown chips */}
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-semibold">CA Score (40)</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{ca}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{((ca / 40) * 100).toFixed(0)}% yield</span>
                      </div>
                      <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-semibold">Exam Score (60)</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{exam}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{((exam / 60) * 100).toFixed(0)}% yield</span>
                      </div>
                    </div>

                    {/* Diagnostics & Guidance */}
                    <div className="mt-3 space-y-1.5 text-xs">
                      <p className="text-slate-700 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-slate-100">Diagnosis:</strong> {rootCause}
                      </p>
                      <div className="p-2 rounded bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-start gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-relaxed"><strong>Action:</strong> {actionPlan}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 dark:text-emerald-400 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Flawless Academic Standing</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">You have no C, D, or F grades recorded in your transcript.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Target Grade & CGPA Projection Simulator */}
      <Card id="card-cgpa-simulator" className="border-slate-200 shadow-xs bg-slate-900 text-white">
        <CardHeader className="pb-3 border-b border-slate-800">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
            <Calculator className="w-5 h-5 text-emerald-400" /> Target Grade & CGPA Projection Simulator
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Simulate how targeting higher grades (A / B) in your upcoming 200-level registered courses elevates your overall CGPA
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Current CGPA */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Current CGPA</span>
              <p className="text-2xl font-bold text-white mt-0.5">{cumulativeCgpa.toFixed(2)}</p>
              <span className="text-[10px] text-slate-400">Based on {totalUnits} Earned Units</span>
            </div>

            {/* Target Select */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Target Grade in Next 20 Units</span>
              <div className="flex justify-center gap-2 mt-2">
                <button
                  id="btn-target-a"
                  onClick={() => setSimulationTargetGrade('A')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    simulationTargetGrade === 'A' 
                      ? 'bg-emerald-500 text-slate-950 shadow-md' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Grade A (5.0 GP)
                </button>
                <button
                  id="btn-target-b"
                  onClick={() => setSimulationTargetGrade('B')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    simulationTargetGrade === 'B' 
                      ? 'bg-emerald-500 text-slate-950 shadow-md' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Grade B (4.0 GP)
                </button>
              </div>
            </div>

            {/* Projected CGPA */}
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-center">
              <span className="text-[11px] text-emerald-400 uppercase font-bold flex items-center justify-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Projected CGPA
              </span>
              <p className="text-2xl font-black text-emerald-300 mt-0.5">{simulatedCgpa.toFixed(2)}</p>
              <span className="text-[10px] text-emerald-400 font-semibold">
                {simulatedCgpa >= 4.50 ? 'First Class Honours Tier' : 'Second Class Upper Tier'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
