import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Calculator, ChevronDown } from 'lucide-react';
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
      {/* Immersive Hero Section with Tablet & Mobile Optimized Flow */}
      <section 
        ref={heroRef}
        className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9]/70 to-[#e2e8f0]/40 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors"
      >
        {/* Dynamic Interactive Mouse-Tracking Grid & Ambient Atmosphere */}
        <HeroInteractiveBackground containerRef={heroRef} />

        {/* Hero Central Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14 relative z-10 flex-1 flex flex-col justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto w-full"
          >
            {/* Logo with clean responsive sizing across mobile, tablet, and desktop */}
            <motion.div 
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="flex justify-center mb-4 sm:mb-5"
            >
              <div className="p-2 sm:p-2.5 bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
                <div className="hidden md:block">
                  <FuazLogo size={96} />
                </div>
                <div className="hidden sm:block md:hidden">
                  <FuazLogo size={84} />
                </div>
                <div className="block sm:hidden">
                  <FuazLogo size={72} />
                </div>
              </div>
            </motion.div>

            {/* University Tagline */}
            <p className="text-[11px] sm:text-xs md:text-sm font-bold text-[#059669] dark:text-emerald-400 uppercase tracking-widest mb-2 sm:mb-2.5">
              Federal University of Agriculture, Zuru • Kebbi State
            </p>

            {/* Main Display Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#064e3b] dark:text-white tracking-tight mb-3 sm:mb-4 leading-[1.15]">
              Student Results Management System
            </h1>

            {/* Animated Description Section */}
            <AnimatedHeroDescription />
            
            {/* Primary Action Buttons - Always prominently visible and touch-accessible on mobile, tablet, and desktop */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6 w-full max-w-md sm:max-w-none mx-auto">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')} 
                className="w-full sm:w-auto gap-2.5 bg-[#064e3b] hover:bg-[#065f46] hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] text-white shadow-md text-sm sm:text-base px-8 py-4 sm:py-5 rounded-xl transition-all duration-200 font-bold min-h-[44px] sm:min-h-[48px] cursor-pointer"
              >
                Access Portal <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/gpa-guide')} 
                className="w-full sm:w-auto gap-2 text-[#064e3b] dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-800/80 bg-white/90 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:border-emerald-500 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] text-sm sm:text-base px-6 py-4 sm:py-5 rounded-xl shadow-xs font-semibold min-h-[44px] sm:min-h-[48px] cursor-pointer"
              >
                <Calculator className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                How GPA is Calculated
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Affordance pinned at bottom of hero view */}
        <div className="relative z-10 pb-4">
          <div className="flex justify-center">
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
        </div>
      </section>

      {/* Section 2: Academic Role Portals */}
      <InstitutionalGateways />

      {/* Section 3: Official University Footer */}
      <UniversityFooterHelpdesk />
    </div>
  );
};
