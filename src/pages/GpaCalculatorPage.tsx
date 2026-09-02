import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  BookOpen, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  ArrowLeft, 
  Printer, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2, 
  Award,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { FuazLogo } from '../components/ui/FuazLogo';
import { GpaScaleReference } from '../components/gpa/GpaScaleReference';
import { SemesterGpaWalkthrough } from '../components/gpa/SemesterGpaWalkthrough';
import { CgpaCumulativeWalkthrough } from '../components/gpa/CgpaCumulativeWalkthrough';
import { InteractiveGpaSandbox } from '../components/gpa/InteractiveGpaSandbox';

export const GpaCalculatorPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'semester' | 'cumulative' | 'sandbox'>('overview');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 print:hidden">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="gap-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#059669]">
            <FuazLogo size={22} />
            <span>FUAZ Academic Regulations</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint} 
            className="gap-2 text-xs border-slate-200 dark:border-slate-700 dark:bg-slate-900"
          >
            <Printer className="w-4 h-4" /> Print Academic Guide
          </Button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#047857] text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3">
          <Badge className="bg-[#fbbf24] text-[#064e3b] font-bold text-xs px-3 py-1">
            Official NUC 5.0 CGPA System
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            How GPA & CGPA are Calculated
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
            A comprehensive, step-by-step academic guide explaining how semester Grade Point Average (GPA), cumulative records (CGPA), continuous assessments, and degree honours classifications are officially computed at the Federal University of Agriculture, Zuru.
          </p>
        </div>
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none hidden md:block">
          <GraduationCap className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 print:hidden">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-[#064e3b] text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          1. 5.0 Scale & Classification
        </button>

        <button
          onClick={() => setActiveTab('semester')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'semester'
              ? 'bg-[#064e3b] text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          2. Semester GPA Walkthrough
        </button>

        <button
          onClick={() => setActiveTab('cumulative')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'cumulative'
              ? 'bg-[#064e3b] text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          3. Multi-Semester CGPA Guide
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'sandbox'
              ? 'bg-[#064e3b] text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4" />
          4. Interactive GPA Sandbox
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                The Nigerian University Commission (NUC) 5.00 Grading Matrix
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                In line with National Universities Commission (NUC) Benchmark Minimum Academic Standards (BMAS) and Core Curriculum Minimum Academic Standards (CCMAS), student performance is evaluated across a 5.00 Grade Point scale.
              </p>
            </div>
            <GpaScaleReference />
          </div>
        )}

        {activeTab === 'semester' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                Calculating Single-Semester Grade Point Average (GPA)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Follow this step-by-step benchmark calculation illustrating how continuous assessment marks, final exams, credit units, and quality points combine to form a student's term GPA.
              </p>
            </div>
            <SemesterGpaWalkthrough />
          </div>
        )}

        {activeTab === 'cumulative' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                Calculating Cumulative Grade Point Average (CGPA) Across Multiple Sessions
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Understand how academic results accumulate across Year 1, Year 2, and subsequent sessions, and why credit-weighted cumulative aggregation is required for degree classification.
              </p>
            </div>
            <CgpaCumulativeWalkthrough />
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <InteractiveGpaSandbox />
          </div>
        )}
      </div>

      {/* Quick Navigation Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 border-t border-slate-200 dark:border-slate-800 print:hidden">
        <div 
          onClick={() => setActiveTab('semester')}
          className="relative p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30 border-2 border-emerald-500/40 dark:border-emerald-500/60 hover:border-[#059669] dark:hover:border-emerald-400 cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 group overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#064e3b] dark:text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider border border-emerald-300 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" /> Step 1 Guide
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
            Single Semester GPA
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Learn step-by-step how credit units (CU) × grade points (GP) = quality points.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#059669] dark:text-emerald-400">
            <span>Click to explore walkthrough</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('cumulative')}
          className="relative p-5 rounded-2xl bg-gradient-to-br from-teal-50/70 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/30 border-2 border-teal-500/40 dark:border-teal-500/60 hover:border-teal-600 dark:hover:border-teal-400 cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 group overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-[11px] font-extrabold uppercase tracking-wider border border-teal-300 dark:border-teal-800">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" /> Step 2 Guide
            </span>
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
            Multi-Semester CGPA
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            See why weighted sums govern overall honours and degree classifications.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-400">
            <span>Click to explore CGPA guide</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('sandbox')}
          className="relative p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30 border-2 border-blue-500/40 dark:border-blue-500/60 hover:border-blue-600 dark:hover:border-blue-400 cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 group overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 text-[11px] font-extrabold uppercase tracking-wider border border-blue-300 dark:border-blue-800">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" /> Step 3 Sandbox
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
            Interactive GPA Simulator
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Simulate custom marks and project target graduation classifications.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400">
            <span>Click to launch simulator</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
