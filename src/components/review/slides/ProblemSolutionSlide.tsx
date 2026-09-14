import React from 'react';
import { 
  Building2, AlertTriangle, CheckCircle2, ShieldCheck, 
  Layers, Award, FileSpreadsheet, Lock, ArrowRight
} from 'lucide-react';

export const ProblemSolutionSlide: React.FC = () => {
  const problems = [
    {
      title: 'Manual Calculation Discrepancies',
      desc: 'Errors in manual summing of Continuous Assessment (40) and Examination (60) marks, leading to inconsistent semester GPAs and cumulative CGPAs.',
      icon: AlertTriangle,
      badge: 'Academic Risk',
      impact: 'Unfair student probations or delayed graduations',
    },
    {
      title: 'Vulnerability to Score Tampering',
      desc: 'Physical score sheets and unmonitored local spreadsheets lack tamper-evident custody, allowing unauthorized alterations before Senate approval.',
      icon: Lock,
      badge: 'Integrity Hazard',
      impact: 'Institutional reputational damage and compromised trust',
    },
    {
      title: 'Protracted Broadsheet Deliberations',
      desc: 'Manual broadsheet assembly requires weeks of departmental meetings reconciling mismatched student rosters and course unit allocations.',
      icon: Layers,
      badge: 'Bottleneck',
      impact: 'Months of backlog before students receive statements of result',
    },
    {
      title: 'Opaque & Unrecorded Student Disputes',
      desc: 'Students submitting score complaints face lost scripts or informal verbal reviews with zero verifiable audit logs of who reviewed or altered marks.',
      icon: FileSpreadsheet,
      badge: 'Transparency Gap',
      impact: 'Frustrated candidates and prolonged student grievances',
    },
  ];

  const solutions = [
    {
      title: 'Deterministic 5.0 CGPA Computation Engine',
      desc: 'Mathematical algorithms automatically compute Total Credit Registered (TCR), Total Credit Earned (TCE), Weighted Points, GPA, and CGPA in real time with zero rounding bias.',
      pillar: 'Accuracy & NUC Conformity',
    },
    {
      title: 'Role-Governed Separation of Duties & Custody Locking',
      desc: 'Course lecturers enter marks; custody automatically locks upon batch submission. Only the Chief Examiner has moderation authority, preventing unauthorized edits.',
      pillar: 'Security & Custody Control',
    },
    {
      title: 'Instant Horizontal Broadsheets & Print Styling',
      desc: 'Automated compilation of departmental master broadsheets with 300-DPI print CSS for physical Senate graduation clearance in seconds.',
      pillar: 'Operational Velocity',
    },
    {
      title: 'Cryptographic Audit Trail & Formal Dispute Queue',
      desc: 'Every examiner score adjustment writes an immutable record with examiner ID, timestamp, and justification. Students lodge formal claims with online tracking.',
      pillar: 'Integrity & Accountability',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Badge & Title */}
      <div className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#065f46] text-white p-6 sm:p-8 rounded-2xl shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold tracking-wider uppercase border border-white/20">
            Section 01 • Institutional Context & Motivation
          </span>
          <span className="text-xs text-emerald-200 font-medium flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Federal University of Agriculture, Zuru (FUAZ)
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          Institutional Problem Statement & Engineered Solutions
        </h2>
        <p className="text-sm sm:text-base text-emerald-100 max-w-3xl leading-relaxed">
          Modernizing tertiary examination processing by directly replacing manual, paper-heavy workflows with a tamper-resistant, NUC-compliant digital architecture.
        </p>
      </div>

      {/* Comparison Grid: Problems vs Solutions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* The Problem Space */}
        <div className="bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-red-200/80 dark:border-red-900/50 pb-3">
            <div className="flex items-center gap-2.5 text-red-700 dark:text-red-400 font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <h3>Identified Institutional Vulnerabilities</h3>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-red-600 dark:text-red-400 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded border border-red-200 dark:border-red-800">
              Legacy Systems
            </span>
          </div>

          <div className="space-y-3.5">
            {problems.map((prob, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900/90 p-4 rounded-xl border border-red-100 dark:border-red-950 shadow-2xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    {prob.title}
                  </h4>
                  <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-900 flex-shrink-0">
                    {prob.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-7">{prob.desc}</p>
                <div className="pl-7 text-[11px] text-red-700 dark:text-red-400 font-medium">
                  <strong>Risk:</strong> {prob.impact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The System Solution */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-200/80 dark:border-emerald-900/50 pb-3">
            <div className="flex items-center gap-2.5 text-[#064e3b] dark:text-emerald-400 font-bold text-base">
              <Award className="w-5 h-5" />
              <h3>Engineered Digital Safeguards</h3>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              FUAZ SRMS Core
            </span>
          </div>

          <div className="space-y-3.5">
            {solutions.map((sol, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900/90 p-4 rounded-xl border border-emerald-100 dark:border-emerald-950 shadow-2xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    {sol.title}
                  </h4>
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900 flex-shrink-0">
                    {sol.pillar}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-6">{sol.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Institutional Measurable Outcomes Strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Key Institutional Outcomes Achieved
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-2xl font-mono font-extrabold text-[#064e3b] dark:text-emerald-400">100%</div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">NUC 5.0 Precision</p>
            <p className="text-[10px] text-slate-500">Zero rounding or formula drift</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-2xl font-mono font-extrabold text-[#064e3b] dark:text-emerald-400">0s</div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Slip Generation Delay</p>
            <p className="text-[10px] text-slate-500">Instant client-side vector PDF</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-2xl font-mono font-extrabold text-[#064e3b] dark:text-emerald-400">4-Tier</div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Role Custody Lock</p>
            <p className="text-[10px] text-slate-500">Separation of academic duties</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-2xl font-mono font-extrabold text-[#064e3b] dark:text-emerald-400">Complete</div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Dispute Auditability</p>
            <p className="text-[10px] text-slate-500">Cryptographically logged overrides</p>
          </div>
        </div>
      </div>
    </div>
  );
};
