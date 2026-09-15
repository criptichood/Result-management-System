import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, RefreshCw, AlertCircle, CheckCircle2, 
  ArrowRight, FileEdit, History, MessageSquare, UserCheck
} from 'lucide-react';

export const ModerationLifecycleSlide: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2);

  const steps = [
    {
      id: 0,
      title: '1. Lecturer Scoring & Draft',
      owner: 'Course Lecturer',
      badge: 'Editable Phase',
      icon: FileEdit,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      borderColor: 'border-blue-300 dark:border-blue-800',
      description: 'The course lecturer inputs continuous assessment (0-40) and semester exam (0-60) marks directly or via standardized CSV batch upload.',
      safeguards: [
        'Client-side bounds validation: CA strictly <= 40, Exam <= 60.',
        'Total auto-computed in real time (0-100) with automatic letter grade.',
        'Data remains draft and completely invisible to students.',
      ],
    },
    {
      id: 1,
      title: '2. Batch Submission & Custody Lock',
      owner: 'Lecturer to HOD',
      badge: 'Lock Enforcement',
      icon: Lock,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-300 dark:border-amber-800',
      description: 'Lecturer formally submits the course broadsheet. Custody shifts to the Chief Examiner and the score inputs are immediately locked.',
      safeguards: [
        'Score sheet status shifts to "Pending Moderation".',
        'Lecturer can no longer modify scores unless formally returned by HOD.',
        'Prevents uncoordinated, unauthorized alterations post-submission.',
      ],
    },
    {
      id: 2,
      title: '3. Chief Examiner Broadsheet Audit & Overrides',
      owner: 'Chief Examiner / HOD',
      badge: 'Quality Control',
      icon: ShieldCheck,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40',
      borderColor: 'border-purple-300 dark:border-purple-800',
      description: 'Chief Examiner audits class grade distribution (bell curve, failure rates) and selects an action.',
      safeguards: [
        'Approve & Publish: Instantly makes grades visible on student portals.',
        'Return for Revision: Re-opens draft mode with specific moderation instructions.',
        'Score Override: Allows surgical adjustment of individual student scores, automatically generating an immutable Audit Trail entry.',
      ],
    },
    {
      id: 3,
      title: '4. Student Live Access & Formal Dispute Window',
      owner: 'Student Candidate',
      badge: 'Transparency',
      icon: MessageSquare,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-300 dark:border-emerald-800',
      description: 'Published results appear on the student portal. If a student detects an anomaly, they can file a formal dispute.',
      safeguards: [
        'Students specify Course Code, Expected Score, and Detailed Statement.',
        'Dispute status transitions to "Under Review" in the Examiner Queue.',
        'Prevents informal or unrecorded grade negotiation outside official channels.',
      ],
    },
    {
      id: 4,
      title: '5. Dispute Resolution & Re-Computation',
      owner: 'Moderation Board',
      badge: 'Final Resolution',
      icon: UserCheck,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/40',
      borderColor: 'border-cyan-300 dark:border-cyan-800',
      description: 'The Chief Examiner cross-references physical exam booklets and CA sheets to approve or dismiss the claim.',
      safeguards: [
        'Approved with Correction: Marks adjust, GPA/CGPA recalculates instantly.',
        'Rejected: Written explanation provided (e.g. script remarked, initial score verified).',
        'Resolution recorded permanently in student history and departmental logs.',
      ],
    },
  ];

  const currentStep = steps[activeStep];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-[#064e3b] to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-purple-800/40">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-bold tracking-wider uppercase border border-purple-500/30">
            Section 06 • Integrity & Governance
          </span>
          <span className="text-xs text-purple-200">5-Stage Academic Quality Control</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          Grade Moderation, Editing & Dispute Lifecycle
        </h2>
        <p className="text-sm sm:text-base text-purple-100 max-w-3xl leading-relaxed">
          How scores transition from initial lecturer assessment to Chief Examiner audit, immutable override logging, and bi-directional student dispute settlement.
        </p>
      </div>

      {/* Step Navigator */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {steps.map((step) => {
          const isSelected = activeStep === step.id;
          const StepIcon = step.icon;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <StepIcon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : step.color}`} />
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  Stage {step.id + 1}
                </span>
              </div>
              <h4 className="text-xs font-bold leading-tight line-clamp-1">{step.title}</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">{step.owner}</p>
            </button>
          );
        })}
      </div>

      {/* Current Step Detailed Card */}
      <div className={`p-6 sm:p-8 rounded-2xl border ${currentStep.borderColor} ${currentStep.bgColor} space-y-5 shadow-xs`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Actor: <strong className="text-slate-900 dark:text-white">{currentStep.owner}</strong>
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 font-semibold border border-slate-300 dark:border-slate-700">
                {currentStep.badge}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{currentStep.title}</h3>
          </div>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {currentStep.description}
        </p>

        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Integrity Safeguards & Technical Enforcement
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentStep.safeguards.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                  Rule {idx + 1}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Trail Mockup Visualization */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Sample Immutable Audit Log Entry
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-300 dark:border-emerald-800">
            Cryptographically Timestamped
          </span>
        </div>

        <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 space-y-1">
          <p className="text-emerald-400">// Examiner Score Override Record</p>
          <p><span className="text-purple-400">Timestamp:</span> 2026-09-14 09:42:15 WAT</p>
          <p><span className="text-purple-400">CourseCode:</span> CSC101 • Introduction to Computing</p>
          <p><span className="text-purple-400">Candidate:</span> FUAZ/2024/CSC/004 (Bello Aisha Ibrahim)</p>
          <p><span className="text-purple-400">PreviousScore:</span> CA: 18, Exam: 38 (Total: 56, Grade: C, GP: 3.0)</p>
          <p><span className="text-purple-400">AdjustedScore:</span> CA: 28, Exam: 44 (Total: 72, Grade: A, GP: 5.0)</p>
          <p><span className="text-purple-400">ExaminerID:</span> EXAM-002 (Dr. Usman Garba, HOD Computer Science)</p>
          <p><span className="text-purple-400">Justification:</span> "Continuous assessment test sheet was remarked post-departmental verification of submitted lab attendance."</p>
        </div>
      </div>
    </div>
  );
};
