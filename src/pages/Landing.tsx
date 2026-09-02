import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, BookOpen, Calculator, ShieldCheck, Users, Award } from 'lucide-react';
import { FuazLogo } from '../components/ui/FuazLogo';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-[#fdfcf9] dark:bg-slate-950 transition-colors">
      {/* Hero Section */}
      <div className="relative bg-[#f8fafc] dark:bg-slate-900/60 overflow-hidden border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="absolute top-0 right-0 w-2 h-full bg-[#fbbf24]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-28 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <FuazLogo size={130} />
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#059669] dark:text-emerald-400 uppercase tracking-widest mb-2">
              Federal University of Agriculture, Zuru • Kebbi State
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#064e3b] dark:text-white tracking-tight mb-4">
              Student Results Management System
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              A secure, efficient, and centralized portal for computing continuous assessments, moderating university broadsheets, and publishing official transcripts and grade slips.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')} 
                className="w-full sm:w-auto gap-2 bg-[#064e3b] hover:bg-[#065f46] text-white shadow-md text-base px-8 py-6 rounded-xl"
              >
                Access Portal <ArrowRight className="h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/gpa-guide')} 
                className="w-full sm:w-auto gap-2 text-[#064e3b] dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-800 text-base px-6 py-6 rounded-xl"
              >
                <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                How GPA is Calculated
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center mt-4">
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base leading-relaxed flex flex-wrap justify-center gap-x-6 gap-y-3">
          <span className="flex items-center gap-2"><Users className="w-4 h-4 text-[#059669] dark:text-emerald-400" /> Role-Based Access</span>
          <span className="text-slate-300 dark:text-slate-700 hidden md:inline">•</span>
          <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Secure Processing</span>
          <span className="text-slate-300 dark:text-slate-700 hidden md:inline">•</span>
          <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#059669] dark:text-emerald-400" /> Instant Result Slip</span>
          <span className="text-slate-300 dark:text-slate-700 hidden md:inline">•</span>
          <span className="flex items-center gap-2"><Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Verified 5.0 CGPA Computation</span>
        </p>
      </div>
    </div>
  );
};

