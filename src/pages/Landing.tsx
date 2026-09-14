import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, BookOpen, Calculator, ShieldCheck, Users, Award, ChevronDown, Presentation } from 'lucide-react';
import { FuazLogo } from '../components/ui/FuazLogo';
import { 
  InstitutionalGateways, 
  UniversityFooterHelpdesk, 
  HeroInteractiveBackground, 
  AnimatedHeroDescription 
} from '../components/landing';
import { motion } from 'motion/react';

export const Landing = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement | null>(null);

  const scrollToGateways = () => {
    const el = document.getElementById('institutional-gateways');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1 bg-[#fdfcf9] dark:bg-slate-950 transition-colors flex flex-col overflow-x-hidden">
      {/* Full-Screen Immersive Hero Section with Mouse Hover Spotlight & Animated Atmosphere */}
      <section 
        ref={heroRef}
        className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9]/70 to-[#e2e8f0]/40 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
      >
        {/* Dynamic Interactive Mouse-Tracking Grid & Ambient Atmosphere */}
        <HeroInteractiveBackground containerRef={heroRef} />

        {/* Hero Central Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-16 pb-6 relative z-10 flex-1 flex flex-col justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto w-full"
          >
            {/* Logo with gentle floating entrance */}
            <motion.div 
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="flex justify-center mb-5 sm:mb-6"
            >
              <div className="p-2.5 sm:p-3 bg-white/85 dark:bg-slate-900/90 rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
                <div className="hidden sm:block">
                  <FuazLogo size={120} />
                </div>
                <div className="block sm:hidden">
                  <FuazLogo size={96} />
                </div>
              </div>
            </motion.div>

            {/* University Tagline */}
            <p className="text-[11px] sm:text-xs md:text-sm font-bold text-[#059669] dark:text-emerald-400 uppercase tracking-widest mb-2.5 sm:mb-3">
              Federal University of Agriculture, Zuru • Kebbi State
            </p>

            {/* Main Display Title - Non-animated as requested */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#064e3b] dark:text-white tracking-tight mb-4 sm:mb-5 leading-[1.15]">
              Student Results Management System
            </h1>

            {/* Animated Description Section - Smooth Institutional Message Rotator */}
            <AnimatedHeroDescription />
            
            {/* Primary Action Buttons with clear hover states */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-6 w-full max-w-md sm:max-w-none mx-auto">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')} 
                className="w-full sm:w-auto gap-2.5 bg-[#064e3b] hover:bg-[#065f46] hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:scale-[0.98] text-white shadow-md text-sm sm:text-base px-8 py-5 sm:py-6 rounded-xl transition-all duration-200 font-bold min-h-[48px] cursor-pointer"
              >
                Access Portal <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/gpa-guide')} 
                className="w-full sm:w-auto gap-2.5 text-[#064e3b] dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800/80 bg-white/90 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:border-emerald-500 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:scale-[0.98] text-sm sm:text-base px-6 py-5 sm:py-6 rounded-xl shadow-xs font-semibold min-h-[48px] cursor-pointer"
              >
                <Calculator className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                How GPA is Calculated
              </Button>
            </div>

            {/* Quick Affordance to Project Architecture & Defense Deck */}
            <div className="flex items-center justify-center mb-6">
              <button
                onClick={() => navigate('/project-review')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
              >
                <Presentation className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Explore System Architecture & Defense Review</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-600 text-white font-semibold">
                  7 Slides
                </span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Affordance & Trust Badges Strip pinned at bottom of full hero view */}
        <div className="relative z-10">
          {/* Scroll Down Indicator */}
          <div className="flex justify-center pb-2 sm:pb-3">
            <button
              onClick={scrollToGateways}
              aria-label="Scroll down to explore academic portals"
              className="group flex flex-col items-center gap-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors focus:outline-none p-1 cursor-pointer"
            >
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                Explore Academic Portals
              </span>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
            </button>
          </div>

          {/* Institutional Highlights Strip */}
          <div className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xs">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-3.5 text-center">
              <div className="text-slate-600 dark:text-slate-400 font-medium text-xs sm:text-sm flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-6 gap-y-1.5 sm:gap-y-2">
                <span className="flex items-center gap-1.5 sm:gap-2 font-semibold text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs md:text-sm">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#059669] dark:text-emerald-400 flex-shrink-0" /> Role-Based Secure Access
                </span>
                <span className="text-slate-300 dark:text-slate-700 hidden md:inline">•</span>
                <span className="flex items-center gap-1.5 sm:gap-2 font-semibold text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs md:text-sm">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" /> Senate-Approved Moderation
                </span>
                <span className="text-slate-300 dark:text-slate-700 hidden md:inline">•</span>
                <span className="flex items-center gap-1.5 sm:gap-2 font-semibold text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs md:text-sm">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#059669] dark:text-emerald-400 flex-shrink-0" /> Instant Digitally Stamped Slips
                </span>
                <span className="text-slate-300 dark:text-slate-700 hidden md:inline">•</span>
                <span className="flex items-center gap-1.5 sm:gap-2 font-semibold text-slate-800 dark:text-slate-200 text-[11px] sm:text-xs md:text-sm">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> Verified 5.0 CGPA Computation
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Section 2: Academic Role Portals */}
      <InstitutionalGateways />

      {/* Section 3: Official University Footer & Helpdesk */}
      <UniversityFooterHelpdesk />
    </div>
  );
};


