import React from 'react';
import { 
  FileText, BookOpen, Printer, CheckCircle2, QrCode, 
  Table, UserCheck, ShieldCheck, Download
} from 'lucide-react';

export const CourseManagementSlide: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#064e3b] via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-emerald-800/40">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-bold tracking-wider uppercase border border-teal-500/30">
            Section 07 • Institutional Reporting
          </span>
          <span className="text-xs text-teal-200">Curriculum & Senate Broadsheets</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          Course Catalog, Broadsheets & Official Documents
        </h2>
        <p className="text-sm sm:text-base text-teal-100 max-w-3xl leading-relaxed">
          How courses are configured and allocated, how horizontal Senate broadsheets are assembled, and how fraud-resistant official PDF slips are rendered client-side.
        </p>
      </div>

      {/* Grid: 3 Pillars of Reporting */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Course Catalog & Workload */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Curriculum & Workload Management</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            The administrator manages departmental course offerings with clear classifications:
          </p>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Core vs Borrowed:</strong> Distinguishes compulsory departmental courses from servicing electives.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Workload Thresholds:</strong> Prevents overallocating teaching credit units per semester.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Prerequisites:</strong> Automatically flags carryover requirements prior to higher-level registrations.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 2: Master Senate Broadsheet */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center">
            <Table className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Departmental Senate Broadsheet</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Senate-approved horizontal compilation for graduation clearance and semester deliberation:
          </p>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
              <span><strong>Matrix Presentation:</strong> Every student across all courses with CA, Exam, Total, and Grade.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
              <span><strong>NUC Standard Metrics:</strong> TCR (Registered), TCE (Earned), TWP (Weighted), GPA & CGPA.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
              <span><strong>Instant Print Styling:</strong> Dedicated 300-DPI CSS media queries clean all toolbars for physical paper output.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 3: Verifiable Result Slips */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Fraud-Resistant Result Slips</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Tamper-evident client-side vector PDF generation using jsPDF:
          </p>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span><strong>Institutional Crest:</strong> Official FUAZ green vector header with formal university motto.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span><strong>Unique Verification Code:</strong> Cryptographic tracking hash (e.g. <code>FUAZ-SRMS-STU-X9A2</code>).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span><strong>Zero Server Dependency:</strong> Renders directly in browser canvas without slow third-party printing APIs.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Broadsheet Anatomy Breakdown */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Printer className="w-4 h-4 text-emerald-600" /> Senate Broadsheet Column Specification
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3 border-r border-slate-200 dark:border-slate-800">S/N & Matric No</th>
                <th className="p-3 border-r border-slate-200 dark:border-slate-800">Full Name</th>
                <th className="p-3 border-r border-slate-200 dark:border-slate-800 text-center">Course Blocks (CA / Exam / Tot / Grd)</th>
                <th className="p-3 border-r border-slate-200 dark:border-slate-800 text-center">TCR</th>
                <th className="p-3 border-r border-slate-200 dark:border-slate-800 text-center">TCE</th>
                <th className="p-3 border-r border-slate-200 dark:border-slate-800 text-center">TWP</th>
                <th className="p-3 border-r border-slate-200 dark:border-slate-800 text-center font-mono">GPA</th>
                <th className="p-3 border-r border-slate-200 dark:border-slate-800 text-center font-mono">CGPA</th>
                <th className="p-3">Graduation Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              <tr className="bg-slate-50/50 dark:bg-slate-950/40">
                <td className="p-3 font-mono font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800">FUAZ/2024/CSC/001</td>
                <td className="p-3 text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800 font-semibold">Abubakar Fatima Zahra</td>
                <td className="p-3 text-center border-r border-slate-200 dark:border-slate-800 font-mono text-[11px]">CSC101: 88 (A) • MTH101: 76 (A)</td>
                <td className="p-3 text-center font-mono border-r border-slate-200 dark:border-slate-800">21</td>
                <td className="p-3 text-center font-mono border-r border-slate-200 dark:border-slate-800">21</td>
                <td className="p-3 text-center font-mono border-r border-slate-200 dark:border-slate-800">101.0</td>
                <td className="p-3 text-center font-mono font-bold text-emerald-700 dark:text-emerald-400 border-r border-slate-200 dark:border-slate-800">4.81</td>
                <td className="p-3 text-center font-mono font-bold text-emerald-700 dark:text-emerald-400 border-r border-slate-200 dark:border-slate-800">4.81</td>
                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400 text-xs">First Class Honours</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
