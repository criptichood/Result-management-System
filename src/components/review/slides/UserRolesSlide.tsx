import React, { useState } from 'react';
import { 
  Users, GraduationCap, BookOpen, ShieldCheck, Settings, 
  ArrowRight, Check, X, Lock, FileSpreadsheet, Eye
} from 'lucide-react';

interface RoleDetail {
  id: string;
  name: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  scope: string;
  responsibilities: string[];
  restrictedActions: string[];
  dataOutput: string;
}

const ROLES: RoleDetail[] = [
  {
    id: 'student',
    name: 'Student Candidate',
    badge: 'Result Consumer',
    icon: GraduationCap,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    borderColor: 'border-blue-200 dark:border-blue-900',
    scope: 'Single authenticated student account mapped to matriculation number.',
    responsibilities: [
      'Access semester-by-semester academic breakdown (Courses, Units, Grades, Points).',
      'View real-time calculated GPA and Cumulative CGPA with progression charts.',
      'Generate verifiable PDF Result Slips and Statements of Academic Result.',
      'Lodge formal grade disputes with supporting reason and expected scores.',
    ],
    restrictedActions: [
      'Cannot view unapproved or unmoderated draft marks.',
      'Cannot edit or alter any entered marks.',
      'Cannot access records or broadsheets of other candidates.',
    ],
    dataOutput: 'Official PDF Slips, Dispute Query Submissions.',
  },
  {
    id: 'lecturer',
    name: 'Course Lecturer',
    badge: 'Score Ingestion Lead',
    icon: BookOpen,
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-900',
    scope: 'Only courses formally allocated to the lecturer by the department.',
    responsibilities: [
      'Enter and update Continuous Assessment (CA: 0-40) and Exam (0-60) scores.',
      'Upload batch student scores via standardized CSV templates with instant validation.',
      'View automatic real-time total (0-100) and letter grade (A-F) computation.',
      'Formally submit the score sheet to the Chief Examiner, transferring custody.',
    ],
    restrictedActions: [
      'Scores lock upon submission; cannot edit unless returned by Examiner.',
      'Cannot publish results directly to students without moderation.',
      'Cannot alter courses outside assigned workload.',
    ],
    dataOutput: 'Submitted Course Broadsheet Sheets (Pending Moderation).',
  },
  {
    id: 'chief_examiner',
    name: 'Chief Examiner / HOD',
    badge: 'Moderation Authority',
    icon: ShieldCheck,
    color: 'text-purple-700 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/40',
    borderColor: 'border-purple-200 dark:border-purple-900',
    scope: 'All courses and candidates within the academic department.',
    responsibilities: [
      'Review submitted course rosters, grade bell curves, and pass/fail distributions.',
      'Approve & Publish courses to make marks live on student portals.',
      'Return score sheets to lecturers with moderation notes for recalculation.',
      'Execute granular score overrides with mandatory logged justification.',
      'Review and resolve student-filed grade disputes with investigation remarks.',
      'Generate Departmental Master Broadsheets for Senate graduation clearance.',
    ],
    restrictedActions: [
      'Cannot alter marks anonymously; every override writes to the Audit Trail.',
      'Cannot modify university-wide catalog or create system users.',
    ],
    dataOutput: 'Published Live Results, Moderation Audit Trail, Dispute Resolutions.',
  },
  {
    id: 'admin',
    name: 'Senate / Administrator',
    badge: 'System Governance',
    icon: Settings,
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-900',
    scope: 'Institutional-level access across all faculties, departments, and sessions.',
    responsibilities: [
      'Manage User Accounts (Students, Lecturers, Examiners, Academic Officers).',
      'Maintain Master Course Catalog (Course Codes, Credit Units, Core vs Borrowed).',
      'Allocate lecturer course workloads and assign course coordinators.',
      'Manage Academic Sessions and Semesters (e.g. 2025/2026 Alpha/Omega).',
      'Inspect system-wide database records and institutional broadsheets.',
    ],
    restrictedActions: [
      'Does not directly enter lecturer CA/Exam scores (delegated to faculty).',
    ],
    dataOutput: 'Curriculum Catalog, User Credentials, Academic Session State.',
  },
];

export const UserRolesSlide: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('chief_examiner');
  const currentRole = ROLES.find(r => r.id === selectedRole) || ROLES[0];
  const CurrentIcon = currentRole.icon;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wider uppercase border border-emerald-500/30">
            Section 02 • Access Control
          </span>
          <span className="text-xs text-slate-400">Strict NUC Separation of Concerns</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          User Roles & Interaction Matrix
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Four distinct stakeholder roles engineered with absolute separation of duties to eliminate grade tampering, uncoordinated releases, and unauthorized edits.
        </p>
      </div>

      {/* Visual Role Pipeline Flowchart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          End-to-End Academic Information Flow
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-center">
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase">Step 1: Setup</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Admin / Senate</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Allocates courses & creates student rosters</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-center">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Step 2: Scoring</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Course Lecturer</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Inputs CA (40) & Exam (60), submits batch</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 text-center">
            <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase">Step 3: Moderation</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Chief Examiner</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Audits broadsheet, overrides or publishes</p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-center">
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase">Step 4: Consumption</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Student Portal</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Views live result, prints PDF, files disputes</p>
          </div>
        </div>
      </div>

      {/* Role Deep-Dive Selector */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {ROLES.map(role => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                  isSelected 
                    ? 'bg-[#064e3b] text-white border-[#064e3b] shadow-md' 
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : role.color}`} />
                <span>{role.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {role.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Role Detailed Card */}
        <div className={`p-6 rounded-2xl border ${currentRole.borderColor} ${currentRole.bgColor} space-y-5 shadow-xs`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 shadow-2xs">
                <CurrentIcon className={`w-6 h-6 ${currentRole.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {currentRole.name}
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-900 font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                    {currentRole.badge}
                  </span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  <strong className="text-slate-700 dark:text-slate-300">Operational Boundary:</strong> {currentRole.scope}
                </p>
              </div>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
              Output: <span className="text-slate-800 dark:text-slate-200 font-semibold">{currentRole.dataOutput}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Responsibilities */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> Permitted & Automated Responsibilities
              </h4>
              <ul className="space-y-2">
                {currentRole.responsibilities.map((resp, i) => (
                  <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Restrictions */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-red-600" /> Enforced Security Restrictions
              </h4>
              <ul className="space-y-2">
                {currentRole.restrictedActions.map((restr, i) => (
                  <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
                    <X className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{restr}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
