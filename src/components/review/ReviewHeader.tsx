import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Layers, Sparkles, Home, LogIn } from 'lucide-react';
import { Button } from '../ui/button';
import { FuazLogo } from '../ui/FuazLogo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { REVIEW_SECTIONS } from '../../data/reviewData';

interface ReviewHeaderProps {
  currentSectionIndex: number;
}

export const ReviewHeader: React.FC<ReviewHeaderProps> = ({ currentSectionIndex }) => {
  const navigate = useNavigate();
  const currentSection = REVIEW_SECTIONS[currentSectionIndex];
  const progressPercent = Math.round(((currentSectionIndex + 1) / REVIEW_SECTIONS.length) * 100);

  return (
    <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand and Return Link */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="p-1 bg-white rounded-lg shadow-2xs hidden xs:block">
              <FuazLogo size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  System Architecture & Project Defense Review
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" /> NUC Standard
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Section {currentSection.number} of {String(REVIEW_SECTIONS.length).padStart(2, '0')} • {currentSection.shortTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate('/login')}
            className="gap-1.5 bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-bold rounded-xl px-3.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Enter Live Portal</span>
            <span className="sm:hidden">Login</span>
          </Button>

          <ThemeToggle />
        </div>
      </div>

      {/* Thin Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1">
        <div 
          className="bg-[#064e3b] dark:bg-emerald-500 h-1 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
