import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, CornerDownRight, LogIn } from 'lucide-react';
import { Button } from '../ui/button';
import { REVIEW_SECTIONS } from '../../data/reviewData';

interface ReviewSlideNavigationProps {
  currentSectionIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onEnterApp: () => void;
}

export const ReviewSlideNavigation: React.FC<ReviewSlideNavigationProps> = ({
  currentSectionIndex,
  onPrev,
  onNext,
  onEnterApp,
}) => {
  const isFirst = currentSectionIndex === 0;
  const isLast = currentSectionIndex === REVIEW_SECTIONS.length - 1;
  const prevSection = !isFirst ? REVIEW_SECTIONS[currentSectionIndex - 1] : null;
  const nextSection = !isLast ? REVIEW_SECTIONS[currentSectionIndex + 1] : null;

  return (
    <div className="sticky bottom-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="default"
          onClick={onPrev}
          disabled={isFirst}
          className="w-full sm:w-auto gap-2 border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold rounded-xl disabled:opacity-40 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <div className="text-left">
            <span>Previous</span>
            {prevSection && (
              <span className="hidden md:inline text-[11px] text-slate-400 font-normal ml-1">
                ({prevSection.shortTitle})
              </span>
            )}
          </div>
        </Button>

        {/* Middle Indicators and Keyboard Tip */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {REVIEW_SECTIONS.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSectionIndex === idx
                    ? 'w-6 bg-[#064e3b] dark:bg-emerald-500'
                    : currentSectionIndex > idx
                    ? 'w-2 bg-emerald-300 dark:bg-emerald-800'
                    : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <span className="hidden lg:inline text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
            Use Left / Right arrow keys to navigate
          </span>
        </div>

        {/* Next or Finish Button */}
        {isLast ? (
          <Button
            size="default"
            onClick={onEnterApp}
            className="w-full sm:w-auto gap-2 bg-[#064e3b] hover:bg-[#065f46] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md cursor-pointer px-6"
          >
            <span>Launch Academic Portal</span>
            <LogIn className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            size="default"
            onClick={onNext}
            className="w-full sm:w-auto gap-2 bg-[#064e3b] hover:bg-[#065f46] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md cursor-pointer"
          >
            <div className="text-right">
              <span>Next</span>
              {nextSection && (
                <span className="hidden md:inline text-[11px] text-emerald-200 font-normal ml-1">
                  ({nextSection.shortTitle})
                </span>
              )}
            </div>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
