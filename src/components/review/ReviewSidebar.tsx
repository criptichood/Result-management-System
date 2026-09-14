import React from 'react';
import { 
  Building2, Cpu, Users, Calculator, ShieldCheck, FileText, 
  Presentation, GitMerge, Check, Clock, Sparkles
} from 'lucide-react';
import { REVIEW_SECTIONS } from '../../data/reviewData';

interface ReviewSidebarProps {
  currentSectionIndex: number;
  onSelectSection: (index: number) => void;
}

export const ReviewSidebar: React.FC<ReviewSidebarProps> = ({
  currentSectionIndex,
  onSelectSection,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return Building2;
      case 'Cpu': return Cpu;
      case 'Users': return Users;
      case 'Calculator': return Calculator;
      case 'ShieldCheck': return ShieldCheck;
      case 'FileText': return FileText;
      case 'Presentation': return Presentation;
      case 'GitMerge': return GitMerge;
      default: return FileText;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3">
      {/* Sidebar Header */}
      <div className="px-2 py-1 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            App Features & Architecture
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded font-semibold border border-emerald-200 dark:border-emerald-900">
          {REVIEW_SECTIONS.length} Sections
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5" aria-label="System review sections">
        {REVIEW_SECTIONS.map((section, idx) => {
          const Icon = getIcon(section.iconName);
          const isCurrent = currentSectionIndex === idx;
          const isPassed = currentSectionIndex > idx;

          return (
            <button
              key={section.id}
              onClick={() => onSelectSection(idx)}
              className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer border ${
                isCurrent
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-700 text-slate-900 dark:text-white shadow-2xs ring-1 ring-emerald-500/20'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 transition-colors ${
                isCurrent
                  ? 'bg-[#064e3b] text-white shadow-xs'
                  : isPassed
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {isPassed ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isCurrent ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'
                  }`}>
                    Section {section.number}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" /> {section.estimatedMinutes}m
                  </span>
                </div>
                <h4 className={`text-xs font-bold leading-snug truncate mt-0.5 ${
                  isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {section.shortTitle}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {section.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
