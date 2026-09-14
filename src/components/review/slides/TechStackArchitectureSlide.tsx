import React, { useState } from 'react';
import { 
  Cpu, Code2, ShieldCheck, Zap, Palette, Printer, 
  Layers, BarChart3, CheckCircle2, Box, ArrowRight, Database
} from 'lucide-react';
import { TECH_STACK_ITEMS } from '../../../data/reviewData';

export const TechStackArchitectureSlide: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<number>(0);

  const architecturalLayers = [
    {
      id: 0,
      name: 'Presentation & Interaction Layer',
      tech: 'React 18.3+ • Tailwind CSS v4 • Radix UI • Lucide',
      purpose: 'Declarative component rendering with high-contrast institutional theming and responsive accessibility.',
      highlights: [
        'Component modularity enforcing strict single-responsibility structure.',
        'Institutional FUAZ green palette (#064e3b, emerald) with seamless dark/light mode.',
        'Accessible modal dialogs and dropdown menus using WAI-ARIA standards.',
        'Responsive layout adapting smoothly from mobile to high-resolution desktop broadsheets.',
      ],
    },
    {
      id: 1,
      name: 'Deterministic Calculation & Academic Engine',
      tech: 'Pure TypeScript 5.x • Strict Type Contracts',
      purpose: 'Mathematical precision engine executing NUC 5-point scale calculations with zero rounding error.',
      highlights: [
        'Strict Continuous Assessment (40) and Examination (60) score validation.',
        'Deterministic Total Credit Registered (TCR) and Quality Points (QP) arithmetic.',
        'Instantaneous recalculation of GPA and CGPA on every score update or dispute adjustment.',
        'Graduation degree class classification (First Class through Probation) computed in memory.',
      ],
    },
    {
      id: 2,
      name: 'Custody Locking & State Management Layer',
      tech: 'Typed State Models • CSV Stream Ingestion • Role Guards',
      purpose: 'Enforces the lifecycle state machine from draft scoring to submission locking and examiner publication.',
      highlights: [
        'Draft State: Lecturer modifies scores in private workspace.',
        'Locked State: Batch submission transfers custody to Chief Examiner and prevents lecturer edits.',
        'Moderation State: Granular score overrides with cryptographically logged audit remarks.',
        'Live State: Flags results as published for student portal queries and formal dispute creation.',
      ],
    },
    {
      id: 3,
      name: 'Document Synthesis & Print Rendering Engine',
      tech: 'jsPDF 2.5+ • HTML5 Canvas • 300-DPI Print Styles',
      purpose: 'Client-side generation of fraud-resistant official university documents without server latency.',
      highlights: [
        'Official Student Result Slips with FUAZ vector crest and verification tracking hashes.',
        'Statements of Academic Result ready for institutional registry clearance.',
        'Departmental Senate Master Broadsheets formatted in horizontal matrix with dedicated print CSS.',
        'Zero external API latency; documents compile in under 300 milliseconds in browser memory.',
      ],
    },
  ];

  const currentLayer = architecturalLayers[activeLayer];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#064e3b] to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wider uppercase border border-emerald-500/30">
            Section 02 • Technical Architecture
          </span>
          <span className="text-xs text-slate-300">Clean Layered Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          Technology Stack & System Architecture
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          The technical foundation, modular package choices, and 4-tier architectural pipeline engineered for high availability, zero calculation drift, and enterprise security.
        </p>
      </div>

      {/* Interactive 4-Tier Architectural Pipeline Diagram */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              4-Tier System Architectural Pipeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click any layer below to inspect its responsibilities, modules, and operational guarantees.
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-300 dark:border-emerald-800">
            Interactive Architecture
          </span>
        </div>

        {/* Layer Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {architecturalLayers.map((layer) => {
            const isSelected = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#064e3b] text-white border-[#064e3b] shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono font-bold uppercase ${
                    isSelected ? 'text-emerald-200' : 'text-slate-500'
                  }`}>
                    Tier 0{layer.id + 1}
                  </span>
                  <Box className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`} />
                </div>
                <h4 className="text-xs font-bold leading-tight">{layer.name}</h4>
              </button>
            );
          })}
        </div>

        {/* Selected Layer Deep-Dive Card */}
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                Active Architectural Inspector • Tier 0{currentLayer.id + 1}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {currentLayer.name}
              </h4>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              {currentLayer.tech}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {currentLayer.purpose}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {currentLayer.highlights.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Technology Stack Specifications & Architectural Rationale
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Strictly selected for zero calculation bugs, responsive accessibility, and lightning-fast client execution.
            </p>
          </div>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-mono font-semibold">
            Strict TypeScript • Zero Bloat
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TECH_STACK_ITEMS.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-emerald-500/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  {item.layer}
                </span>
                {item.version && (
                  <span className="text-[10px] font-mono bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500">
                    {item.version}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">{item.technology}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.justification}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
