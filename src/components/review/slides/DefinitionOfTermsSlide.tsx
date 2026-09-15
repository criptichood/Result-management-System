import React, { useState } from 'react';
import { 
  BookOpen, Code2, Database, Layers, Sparkles, HelpCircle, Search, 
  Terminal, ShieldCheck, Zap, Palette, FileDown, GraduationCap, ChevronRight 
} from 'lucide-react';

interface TermDefinition {
  term: string;
  acronym?: string;
  category: 'Infrastructure' | 'Framework' | 'Language' | 'Academic Rules';
  definition: string;
  roleInProject: string;
  technicalDepth: string;
  icon: any;
}

export const DefinitionOfTermsSlide: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Infrastructure' | 'Framework' | 'Language' | 'Academic Rules'>('All');

  const terms: TermDefinition[] = [
    {
      term: 'SQLite WASM (sql.js)',
      acronym: 'WebAssembly SQL',
      category: 'Infrastructure',
      definition: 'A complete relational database engine written in C/C++ compiled directly into WebAssembly (WASM), allowing it to execute instructions with near-native performance inside modern web browsers.',
      roleInProject: 'Serves as our client-side storage engine. I utilize this to compile the schema, perform complex subqueries, and persist academic records in memory without requiring server round-trips or high-latency external database queries.',
      technicalDepth: 'Leverages binary WASM execution blocks, running virtualized SQL statement parsers and query planners right inside the client sandbox.',
      icon: Database,
    },
    {
      term: 'React 18',
      category: 'Framework',
      definition: 'A declarative, component-based frontend framework utilizing a virtual representation of the Document Object Model (DOM) to manage reactive interface state transitions.',
      roleInProject: 'I structured the user interface using isolated, modular functional components. When a lecturer updates a score, React calculates the minimal DOM delta, updating only the affected grade badge rather than refreshing the page.',
      technicalDepth: 'Employs a concurrent rendering model with stable state hooks (useState, useEffect, useMemo) to prevent layout thrashing or race conditions.',
      icon: Code2,
    },
    {
      term: 'TypeScript',
      acronym: 'TS',
      category: 'Language',
      definition: 'A strongly typed programming language that builds on JavaScript by adding static type definitions, enabling comprehensive compile-time checks and IDE autocompletion.',
      roleInProject: 'Guarantees perfect mathematical accuracy. By defining rigid interfaces for Student, Course, and Score objects, I completely eliminated runtime type mismatches, preventing errors like adding string-based scores or referencing null values.',
      technicalDepth: 'Uses strict compilation flags (noImplicitAny, strictNullChecks) and explicit type assertions to enforce structural typing agreements.',
      icon: ShieldCheck,
    },
    {
      term: 'Vite',
      category: 'Infrastructure',
      definition: 'A modern, high-speed frontend build tool that leverages native ES modules (ESM) for rapid development server start times and Rollup for tree-shaken, optimized production builds.',
      roleInProject: 'Accelerated development and assembly. It bundles our TypeScript assets, transpiles CSS, and compiles a highly compact, optimized single-page application distribution.',
      technicalDepth: 'Bypasses legacy bundler overhead by serving source files directly via browser-native ESM imports during development and compiling with high-performance Rollup.',
      icon: Zap,
    },
    {
      term: 'Tailwind CSS v4',
      acronym: 'Utility-First CSS',
      category: 'Framework',
      definition: 'A modern, utility-first CSS framework featuring a high-performance compiler that extracts classes directly from source code and outputs optimized, zero-runtime CSS sheets.',
      roleInProject: 'Establishes a cohesive FUAZ brand identity. I used Tailwind’s responsive primitives to design a mobile-friendly, accessible layout using institutional colors like deep emerald green (#064e3b).',
      technicalDepth: 'Operates with a lightning-fast Rust-based extraction engine, removing unused rules to generate a single stylesheet with minimum footprint.',
      icon: Palette,
    },
    {
      term: 'jsPDF',
      acronym: 'Client-Side PDF Generator',
      category: 'Infrastructure',
      definition: 'A JavaScript-based client-side library dedicated to generating vector PDF documents dynamically on the client device without utilizing server-side rendering pipelines.',
      roleInProject: 'Powering the instant export of Senate Broadsheets and Official Statements of Results. I designed the PDF layout programmatically, injecting the FUAZ official logo, tabular course results, and a digital validation QR code.',
      technicalDepth: 'Constructs low-level binary PDF stream objects directly, writing precise coordinates for text, grids, and image matrices within a virtual coordinate grid.',
      icon: FileDown,
    },
    {
      term: 'NUC 5.0 CGPA Scale',
      acronym: 'Nigerian National Standard',
      category: 'Academic Rules',
      definition: 'The official 5-point Cumulative Grade Point Average (CGPA) computation model mandated by the National Universities Commission (NUC) of Nigeria for degree classifications.',
      roleInProject: 'Represents the core logic of my academic engine. I mapped scores dynamically into quality points (A=5.0, B=4.0, C=3.0, D=2.0, F=0.0) and completely omitted the obsolete E grade per standard guidelines.',
      technicalDepth: 'Derived via: Sum of Quality Points (Credit Units × Grade Points) divided by the Sum of Credit Units, rounding strictly to two decimal places.',
      icon: GraduationCap,
    },
  ];

  const filteredTerms = terms.filter(t => {
    const matchesSearch = t.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.roleInProject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-[#064e3b] to-emerald-800 text-white p-6 sm:p-8 rounded-2xl shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold tracking-wider uppercase border border-white/20">
            Section 03 • Technical Vocabulary & Standards
          </span>
          <span className="text-xs text-emerald-200">Glossary & Definition of Terms</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          Technical Definition of Terms
        </h2>
        <p className="text-sm sm:text-base text-emerald-100 max-w-3xl leading-relaxed">
          To establish a clear understanding during my academic defense, I have compiled definitions and contextual project roles for the key technologies, frameworks, and academic rules powering this system.
        </p>
      </div>

      {/* Categories & Search Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4.5 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Infrastructure', 'Framework', 'Language', 'Academic Rules'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search glossary definitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Main Definitions List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-2xs hover:border-emerald-500/30 transition-all space-y-4.5"
              >
                {/* Term title and category label */}
                <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60 flex-shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        {item.term}
                        {item.acronym && (
                          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            {item.acronym}
                          </span>
                        )}
                      </h3>
                      <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                        {item.category} Category
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grid breakdown of Definition vs Project Role */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      Academic & Technical Definition
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      {item.definition}
                    </p>
                  </div>

                  <div className="space-y-1.5 bg-slate-50/50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/60">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Role In My Project
                    </h4>
                    <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-normal">
                      {item.roleInProject}
                    </p>
                  </div>
                </div>

                {/* Engineering under-the-hood depth bar */}
                <div className="text-[11px] bg-slate-50 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400 px-3.5 py-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800/40 font-normal flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>
                    <strong>Under-The-Hood:</strong> {item.technicalDepth}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No definitions found</h4>
            <p className="text-xs text-slate-500 mt-1">Try refining your search keyword or selected category filter.</p>
          </div>
        )}
      </div>

      {/* Footer / Summary Tip */}
      <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/60 flex gap-3">
        <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>Scholarly Note:</strong> I defined these concepts specifically to bridge the gap between high-level web technologies and standard academic scoring regulations. During my presentation, these definitions demonstrate that every technology selected was chosen strictly to fulfill a specific NUC security or performance mandate.
        </div>
      </div>
    </div>
  );
};
