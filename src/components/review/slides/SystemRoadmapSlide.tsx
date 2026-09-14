import React from 'react';
import { 
  GitMerge, CheckCircle2, AlertCircle, Sparkles, 
  Layers, Database, Smartphone, ShieldCheck, ArrowRight
} from 'lucide-react';

export const SystemRoadmapSlide: React.FC = () => {
  const accomplishments = [
    {
      title: 'Real-Time 5.0 NUC CGPA Engine',
      desc: 'Deterministic credit-weighted GPA calculation eliminating transcription and rounding errors.',
    },
    {
      title: 'Strict 4-Role Custody Architecture',
      desc: 'Lecturers draft & submit; custody locks automatically; Chief Examiners moderate; Students consume.',
    },
    {
      title: 'Tamper-Evident Audit Logging',
      desc: 'Every mark adjustment records timestamp, examiner ID, affected student matric, and required justification note.',
    },
    {
      title: 'Verifiable Vector PDF & Print Broadsheets',
      desc: 'Client-side generation of institutional result slips with QR tracking codes and 300-DPI Senate broadsheets.',
    },
  ];

  const architecturalEvaluations = [
    {
      area: 'Backend Persistence & Database Decoupling',
      currentStatus: 'Client-side reactive storage with in-memory state models for instant responsiveness.',
      recommendation: 'Decouple into an independent enterprise REST/GraphQL backend (Node.js/Spring Boot + PostgreSQL/Cloud SQL) with database-level row-level security (RLS) and strict transactional acid locks for broadsheet submission.',
      tag: 'Architecture'
    },
    {
      area: 'Institutional SSO & Identity Federation',
      currentStatus: 'Role-based credentials with email/matriculation authentication in auth context.',
      recommendation: 'Integrate university LDAP / Active Directory / Google Workspace SSO with multi-factor authentication (MFA) required for all Chief Examiner score overrides.',
      tag: 'Security'
    },
    {
      area: 'Asynchronous SMS & Notification Gateway',
      currentStatus: 'In-app real-time alerts and dispute status tracking badges.',
      recommendation: 'Deploy a decoupled message queue (RabbitMQ / Redis) triggering instant GSM SMS broadcasts to students when their semester broadsheet is ratified by Senate.',
      tag: 'Notifications'
    },
    {
      area: 'Biometric Exam Hall Attendance Validation',
      currentStatus: 'Continuous assessment and exam scores validated against 0-40 and 0-60 thresholds.',
      recommendation: 'Pair the scoring module with biometric fingerprint or QR wristband scanners at exam hall entry to verify student physical presence before exam script grading.',
      tag: 'Integrity'
    },
  ];

  const roadmapPhases = [
    {
      phase: 'Phase 1: Production Hardening',
      timeline: 'Months 1–2',
      items: [
        'PostgreSQL relational schema migration with foreign keys and strict constraints',
        'Multi-Factor Authentication (TOTP) for Examiner score alteration authorization',
        'Comprehensive unit tests for carryover and probation corner cases',
      ],
    },
    {
      phase: 'Phase 2: Campus Ecosystem Integration',
      timeline: 'Months 3–4',
      items: [
        'Direct synchronization with University Bursary (school fees clearance check before result access)',
        'Biometric exam entry attendance scanner API',
        'Automated National Youth Service Corps (NYSC) graduation senate mobilization list export',
      ],
    },
    {
      phase: 'Phase 3: High-Availability & Cryptographic Verification',
      timeline: 'Months 5–6',
      items: [
        'Decentralized cryptographic verification hash registry for digital employer transcript verification',
        'Progressive Web App (PWA) offline cache for students with intermittent campus Wi-Fi',
        'Automated AI anomaly detection flagging abnormal grade distributions before examiner sign-off',
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-[#064e3b] to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-blue-800/40">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold tracking-wider uppercase border border-blue-500/30">
            Section 07 • Evaluation & Future Scope
          </span>
          <span className="text-xs text-blue-200">Defensive Self-Critique & Roadmap</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          Critical Evaluation, System Gaps & Future Roadmap
        </h2>
        <p className="text-sm sm:text-base text-blue-100 max-w-3xl leading-relaxed">
          An honest, scholarly appraisal of accomplishments, architectural trade-offs, and what should be decoupled or expanded in enterprise production.
        </p>
      </div>

      {/* Accomplishments Summary */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Verified Project Accomplishments
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {accomplishments.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-300">{item.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Appraisal: What is missing / What should be done separately */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Critical Academic Appraisal: Gaps & Separate Architecture
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Identified areas that should be decoupled into standalone microservices in full university deployment.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            Defense Discussion Topic
          </span>
        </div>

        <div className="space-y-3">
          {architecturalEvaluations.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  {item.area}
                </h4>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                  {item.tag}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                    Current Implementation:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">{item.currentStatus}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase block mb-1">
                    Enterprise Decoupled Target:
                  </span>
                  <p className="text-slate-800 dark:text-slate-200">{item.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phased Roadmap Grid */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Phased Production Deployment Roadmap
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roadmapPhases.map((phase, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  {phase.timeline}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{phase.phase}</h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                {phase.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <ArrowRight className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
