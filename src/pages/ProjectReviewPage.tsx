import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { REVIEW_SECTIONS } from '../data/reviewData';
import { ReviewHeader } from '../components/review/ReviewHeader';
import { ReviewSidebar } from '../components/review/ReviewSidebar';
import { ReviewSlideNavigation } from '../components/review/ReviewSlideNavigation';

// Modular Slides
import { ProblemSolutionSlide } from '../components/review/slides/ProblemSolutionSlide';
import { TechStackArchitectureSlide } from '../components/review/slides/TechStackArchitectureSlide';
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
      case 2: return <UserRolesSlide />;
      case 3: return <GradingEngineSlide />;
      case 4: return <ModerationLifecycleSlide />;
      case 5: return <CourseManagementSlide />;
      case 6: return <DefenseScriptSlide />;
      case 7: return <SystemRoadmapSlide />;
      default: return <ProblemSolutionSlide />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Header with Progress and Portal Quick Link */}
      <ReviewHeader currentSectionIndex={currentIndex} />

      {/* Main Container with Sticky Sidebar and Dedicated Scrollable Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Sticky Sidebar */}
        <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-20 space-y-4">
            <ReviewSidebar
              currentSectionIndex={currentIndex}
              onSelectSection={setSection}
            />

            {/* Quick Helper / Keyboard shortcut tip */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2 hidden lg:block shadow-2xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Keyboard Navigation
              </span>
              <p className="leading-relaxed text-[11px]">
                Use <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">→</kbd> arrow keys to turn slides smoothly.
              </p>
            </div>
          </div>
        </aside>

        {/* Center Main Slide Content */}
        <main className="flex-1 min-w-0 pb-16">
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
