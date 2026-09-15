import React, { useState } from 'react';
import { 
  Presentation, Mic, Play, ChevronRight, CheckCircle2, 
  HelpCircle, Volume2, Sparkles, Clock, Copy, Check
} from 'lucide-react';

interface DefenseSlide {
  slideNumber: number;
  title: string;
  duration: string;
  mainPoints: string[];
  spokenScript: string;
  likelyQuestion: string;
  suggestedAnswer: string;
}

const DEFENSE_SLIDES: DefenseSlide[] = [
  {
    slideNumber: 1,
    title: 'Introduction & Institutional Background',
    duration: '1.5 Mins',
    mainPoints: [
      'Institution: Federal University of Agriculture, Zuru (FUAZ), Kebbi State.',
      'Core Goal: Modernize examination result processing with automated 5.0 CGPA verification.',
      'Key Distinction: Eliminating paper bottlenecks and unauthorized grade modifications.',
    ],
    spokenScript: 'Good day, distinguished panel members and examiners. I am proud to present my Student Results Management System for the Federal University of Agriculture, Zuru. Academic integrity is the bedrock of any tertiary institution. I developed this system to replace vulnerable paper sheets and manual spreadsheets with an automated, role-governed portal built strictly to NUC 5.0 CGPA benchmarks.',
    likelyQuestion: 'Why build a custom SRMS rather than using a generic spreadsheet or standard LMS?',
    suggestedAnswer: 'Generic spreadsheets lack role separation, custody locking, and immutable audit trails. In my system, a lecturer cannot alter scores after submitting to the HOD / Chief Examiner, and every override requires a permanent logged justification.',
  },
  {
    slideNumber: 2,
    title: '4-Tier Stakeholder Matrix & Access Control',
    duration: '2.0 Mins',
    mainPoints: [
      'Role Separation: Student, Course Lecturer, HOD / Chief Examiner, Senate Administrator.',
      'Custody Locking: Lecturer drafts lock automatically upon formal submission.',
      'Chief Examiner Authority: Exclusive power to moderate, publish, or return score sheets.',
    ],
    spokenScript: 'My architecture enforces a strict separation of duties across four tiers. Course lecturers can only access and grade courses explicitly assigned to them by their department. Once they submit Continuous Assessment and Exam scores, their sheet is locked immediately to prevent tampering. The Chief Examiner reviews the broadsheet and retains the sole authority to approve and publish live to student portals.',
    likelyQuestion: 'Can a student view unmoderated scores before the Chief Examiner approves them?',
    suggestedAnswer: 'No. Student portals only query results with the "Published" status flag. Draft and pending moderation scores are completely hidden from student candidate accounts.',
  },
  {
    slideNumber: 3,
    title: 'NUC 5.0 Grading Engine & Mathematical Precision',
    duration: '2.0 Mins',
    mainPoints: [
      'Assessment Breakdown: Continuous Assessment (Max 40) + Examination (Max 60).',
      'Formula: Weighted Points = CU × GP; GPA = TWP ÷ TCR; CGPA = Cumulative TWP ÷ Cumulative TCR.',
      'Automated Degree Classifications: First Class (4.50-5.00) down to Probation (< 1.00).',
    ],
    spokenScript: 'My grading engine strictly implements the National Universities Commission 5.0 scale, with the legacy E grade completely eliminated. Whether through single-entry form or bulk CSV upload, the system validates that CA never exceeds 40 and Exam never exceeds 60. When scores are adjusted, TCR, TCE, TWP, GPA, and CGPA recalculate instantaneously in real time without discrepancies.',
    likelyQuestion: 'How does the system treat carryover courses and their impact on CGPA?',
    suggestedAnswer: 'Failed courses carry a grade point of 0.0 with the credit units still counting in Total Credit Registered (TCR). When retaken, both attempts are recorded in the cumulative credits according to university academic regulations.',
  },
  {
    slideNumber: 4,
    title: 'Audit Trail & Bi-Directional Dispute Resolution',
    duration: '2.0 Mins',
    mainPoints: [
      'Immutable Audit Logging: Captures timestamp, examiner ID, old vs new score, and reasons.',
      'Student Dispute Portal: Candidates file formal disputes with expected scores and statements.',
      'Examiner Resolution Queue: Structured workflow to investigate, correct, or dismiss claims.',
    ],
    spokenScript: 'Academic transparency requires that no score modification remains anonymous. I engineered a Moderation Audit Trail that permanently logs any override executed by an examiner. Furthermore, students are empowered with a formal Dispute Portal where they can file claims that appear directly in the Chief Examiner investigation queue for audit clearance.',
    likelyQuestion: 'What happens if a lecturer makes a mistake in a batch CSV upload?',
    suggestedAnswer: 'The Chief Examiner can either use the "Return with Feedback" action to send the entire batch back to the lecturer with specific moderation notes, or selectively override the specific student mark with a logged remark.',
  },
  {
    slideNumber: 5,
    title: 'Official Document Generation & Conclusion',
    duration: '1.5 Mins',
    mainPoints: [
      'Senate Master Broadsheets: Horizontal tabular matrix with 300-DPI print optimization.',
      'Vector PDF Result Slips: University crest, cryptographic verification tracking hash.',
      'Live Operational Readiness: Ready for immediate institutional deployment.',
    ],
    spokenScript: 'Finally, the system bridges digital records with official institutional documents. Examination offices can generate print-ready horizontal Senate broadsheets with a single click, while students can generate vector PDF result slips bearing cryptographic tracking codes. Thank you for your attention, and I welcome your questions.',
    likelyQuestion: 'How does someone verify that a printed PDF result slip is authentic?',
    suggestedAnswer: 'Each generated PDF embeds a unique alphanumeric verification hash generated from the student matric number, session, and computed CGPA. The registry can match this hash against the database.',
  },
];

export const DefenseScriptSlide: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const slide = DEFENSE_SLIDES[currentSlideIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(slide.spokenScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 via-[#064e3b] to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-amber-800/40">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-bold tracking-wider uppercase border border-amber-500/30">
            Section 08 • Defense Presentation
          </span>
          <span className="text-xs text-amber-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Total Defense Time: ~8–10 Minutes
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          My Defense Presentation & Speaking Notes
        </h2>
        <p className="text-sm sm:text-base text-amber-100 max-w-3xl leading-relaxed">
          Slide-by-slide rehearsal outline and academic notes prepared for my official project defense, seminar presentations, and external examiner reviews.
        </p>
      </div>

      {/* Slide Index Strip */}
      <div className="flex flex-wrap items-center gap-2">
        {DEFENSE_SLIDES.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              currentSlideIndex === idx
                ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-500'
            }`}
          >
            <span>Slide {s.slideNumber}</span>
            <span className="text-[10px] opacity-80">({s.duration})</span>
          </button>
        ))}
      </div>

      {/* Active Presentation Slide Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                Slide {slide.slideNumber} of {DEFENSE_SLIDES.length}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                {slide.duration}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {slide.title}
            </h3>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedScript ? 'Copied Narrative!' : 'Copy Speaking Notes'}</span>
          </button>
        </div>

        {/* Slide Visual Bullet Points */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Visual Slide Bullets (What is Projected on Screen)
          </h4>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
            {slide.mainPoints.map((pt, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Presenter Speaking Script */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <Mic className="w-4 h-4" /> My Speaking Script & Presentation Narrative
          </h4>
          <div className="p-5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
            "{slide.spokenScript}"
          </div>
        </div>

        {/* Anticipated Question & Winning Defense Answer */}
        <div className="p-5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-purple-600" /> Likely Academic Question
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
            "{slide.likelyQuestion}"
          </p>
          <div className="pt-1">
            <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase block mb-1">
              My Technical Response:
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {slide.suggestedAnswer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
