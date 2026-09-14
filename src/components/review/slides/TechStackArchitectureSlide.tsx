import React from 'react';
import { 
  Cpu, Code2, ShieldCheck, Zap, Palette, Printer, 
  Layers, BarChart3, CheckCircle2, Box, Database, Sparkles
} from 'lucide-react';
import { TECH_STACK_ITEMS } from '../../../data/reviewData';

export const TechStackArchitectureSlide: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-[#064e3b] to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wider uppercase border border-emerald-500/30">
            Section 02 • Technical Core
          </span>
          <span className="text-xs text-slate-300">Enterprise Tech Stack Specifications</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          Technology Stack & System Infrastructure
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          The strict professional technology stack selected for the FUAZ Results Management System, providing deterministic calculations, robust browser caching, and zero external lag.
        </p>
      </div>

      {/* Structured Technologies Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Technology Stack Specifications & Core Packages
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Production-ready tools ensuring zero formula drift and accessible, responsive presentation.
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-mono font-bold border border-emerald-200 dark:border-emerald-800">
            Strict TypeScript • Offline First
          </span>
        </div>

        {/* Dense Professional Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TECH_STACK_ITEMS.map((item, idx) => {
            const getTechIcon = (iconName: string) => {
              switch (iconName) {
                case 'Code2': return Code2;
                case 'ShieldCheck': return ShieldCheck;
                case 'Zap': return Zap;
                case 'Palette': return Palette;
                case 'Printer': return Printer;
                case 'Layers': return Layers;
                default: return BarChart3;
              }
            };
            const TechIcon = getTechIcon(item.icon);

            return (
              <div key={idx} className="p-4.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
                      <TechIcon className="w-4 h-4" />
                    </div>
                    {item.version && (
                      <span className="text-[10px] font-mono bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 font-bold">
                        {item.version}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
                      {item.layer}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">{item.technology}</h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">{item.justification}</p>
                </div>
              </div>
            );
          })}

          {/* Seeded Offline-First Storage Item */}
          <div className="p-4.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
                  <Database className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 font-bold">
                  v3.0.x
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
                  Data Persistence Layer
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">sql.js (SQLite WASM)</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Enables a local relational database running directly inside browser memory. Keeps session data cached securely without server infrastructure dependency.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Coding Standards & Modular Guidelines */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Clean Architectural Standards Implemented
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800 flex gap-3">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Strict Modularity (Rule of 500 lines)</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                Zero monolithic file layout. Files are structured dynamically, exporting isolated views, mathematical formulas, and contexts from dedicated feature directories.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800 flex gap-3">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Deterministic Computation Principle</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                Computations rely on standardized numeric scale models rather than mock approximations. Handlers throw strict type contract errors on missing scores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
