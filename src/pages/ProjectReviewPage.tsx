import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { REVIEW_SECTIONS } from '../data/reviewData';
import { ReviewHeader } from '../components/review/ReviewHeader';
import { ReviewSidebar } from '../components/review/ReviewSidebar';
import { ReviewSlideNavigation } from '../components/review/ReviewSlideNavigation';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';
import { ChevronDown, Check, Layers } from 'lucide-react';

// Modular Slides
import { ProblemSolutionSlide } from '../components/review/slides/ProblemSolutionSlide';
import { TechStackArchitectureSlide } from '../components/review/slides/TechStackArchitectureSlide';
import { DefinitionOfTermsSlide } from '../components/review/slides/DefinitionOfTermsSlide';
import { UserRolesSlide } from '../components/review/slides/UserRolesSlide';
import { GradingEngineSlide } from '../components/review/slides/GradingEngineSlide';
import { ModerationLifecycleSlide } from '../components/review/slides/ModerationLifecycleSlide';
import { CourseManagementSlide } from '../components/review/slides/CourseManagementSlide';
import { DefenseScriptSlide } from '../components/review/slides/DefenseScriptSlide';
import { SystemRoadmapSlide } from '../components/review/slides/SystemRoadmapSlide';

export const ProjectReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Sync with search parameter if provided (e.g. ?section=tech-stack)
  useEffect(() => {
    const sectionParam = searchParams.get('section');
    if (sectionParam) {
      const foundIdx = REVIEW_SECTIONS.findIndex(s => s.id === sectionParam);
      if (foundIdx !== -1) {
        setCurrentIndex(foundIdx);
      }
    }
  }, [searchParams]);

  const setSection = (idx: number) => {
    const safeIdx = Math.max(0, Math.min(REVIEW_SECTIONS.length - 1, idx));
    setCurrentIndex(safeIdx);
    setSearchParams({ section: REVIEW_SECTIONS[safeIdx].id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (currentIndex < REVIEW_SECTIONS.length - 1) {
          setSection(currentIndex + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          setSection(currentIndex - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const renderActiveSlide = () => {
    switch (currentIndex) {
      case 0: return <ProblemSolutionSlide />;
      case 1: return <TechStackArchitectureSlide />;
      case 2: return <DefinitionOfTermsSlide />;
      case 3: return <UserRolesSlide />;
      case 4: return <GradingEngineSlide />;
      case 5: return <ModerationLifecycleSlide />;
      case 6: return <CourseManagementSlide />;
      case 7: return <DefenseScriptSlide />;
      case 8: return <SystemRoadmapSlide />;
      default: return <ProblemSolutionSlide />;
    }
  };

  const currentSection = REVIEW_SECTIONS[currentIndex];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Header with Progress and Portal Quick Link */}
      <ReviewHeader currentSectionIndex={currentIndex} />

      {/* Main Container with Sticky Sidebar on Desktop and Dropdown Navigation on Mobile */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Sticky Sidebar (Visible strictly on Desktop lg+) */}
        <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-20 space-y-4">
            <ReviewSidebar
              currentSectionIndex={currentIndex}
              onSelectSection={setSection}
            />

            {/* Quick Keyboard shortcut tip */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1.5 shadow-2xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Keyboard Navigation
              </span>
              <p className="leading-relaxed text-[11px]">
                Use <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">→</kbd> arrow keys to turn slides.
              </p>
            </div>
          </div>
        </aside>

        {/* Center Main Slide Content Area */}
        <main className="flex-1 min-w-0 pb-16">
          {/* Mobile & Tablet Topic Selector Dropdown (Replaces huge top block) */}
          <div className="lg:hidden mb-4 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                Section {currentSection.number} of {REVIEW_SECTIONS.length}
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {currentSection.shortTitle}
              </h2>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl px-3 flex-shrink-0"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Topics</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 max-h-96 overflow-y-auto p-1">
                {REVIEW_SECTIONS.map((sec, idx) => (
                  <DropdownMenuItem
                    key={sec.id}
                    onClick={() => setSection(idx)}
                    className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer ${
                      currentIndex === idx ? 'bg-emerald-50 dark:bg-emerald-950/60 font-semibold' : ''
                    }`}
                  >
                    <div className="mt-0.5">
                      {currentIndex === idx ? (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      ) : (
                        <span className="w-4 h-4 inline-block font-mono text-[10px] text-slate-400 text-center">
                          {sec.number}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {sec.shortTitle}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {sec.subtitle}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <article key={currentIndex} className="w-full">
            {renderActiveSlide()}
          </article>
        </main>
      </div>

      {/* Bottom Sticky Slide Navigation Bar */}
      <ReviewSlideNavigation
        currentSectionIndex={currentIndex}
        onPrev={() => setSection(currentIndex - 1)}
        onNext={() => setSection(currentIndex + 1)}
        onEnterApp={() => navigate('/login')}
      />
    </div>
  );
};
