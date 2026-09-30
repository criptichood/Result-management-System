import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Course } from '../../../types';

interface GradingWorkflowBannerProps {
  selectedCourse: Course;
  totalStudents: number;
  filledCount: number;
  isLocked: boolean;
  onDownloadCSV: () => void;
  onOpenCsvModal: () => void;
}

export const GradingWorkflowBanner: React.FC<GradingWorkflowBannerProps> = ({
  selectedCourse,
  totalStudents,
  filledCount,
  isLocked,
  onDownloadCSV,
  onOpenCsvModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const percentComplete = totalStudents > 0 ? Math.round((filledCount / totalStudents) * 100) : 0;

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-[#064e3b] to-emerald-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-800/80 mb-6 transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800/60 pb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-emerald-300">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                Recommended Grading Flow
              </span>
              <span className="text-xs text-emerald-300 font-mono">
                {filledCount} of {totalStudents} Scored ({percentComplete}%)
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              Automated Class Roster Score Upload
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed mt-0.5">
              Avoid slow manual one-by-one entry. Export the pre-sorted class list, record CA & Exam offline, and upload for instant automated grading.
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={onDownloadCSV}
            className="text-xs gap-1.5 bg-white/10 hover:bg-white/20 text-white border-white/20 hover:text-white"
            title="Download sorted class roster CSV template"
          >
            <Download className="w-3.5 h-3.5 text-emerald-300" />
            Export Class Roster (CSV)
          </Button>

          <Button
            size="sm"
            onClick={onOpenCsvModal}
            disabled={isLocked}
            className="text-xs gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md"
            title="Import completed scores from CSV"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload & Auto-Grade
          </Button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-200 hover:text-white transition-colors cursor-pointer"
            aria-label={isExpanded ? 'Collapse guide' : 'Expand guide'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded 3-Step Walkthrough */}
      {isExpanded && (
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in-50 duration-200">
          {/* Step 1 */}
          <div className="p-3.5 rounded-xl bg-black/25 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300 mb-1.5">
                <span>1. Export Class Roster</span>
                <span className="text-[10px] font-mono text-emerald-400/80">Step 1</span>
              </div>
              <p className="text-[11px] text-slate-200 leading-normal">
                Download the official roster for <strong>{selectedCourse.code}</strong> with all matric numbers, student names, department, and level pre-populated.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-emerald-300/80 font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Includes existing CA & Exam columns</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-xl bg-black/25 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300 mb-1.5">
                <span>2. Score in Excel / Sheets</span>
                <span className="text-[10px] font-mono text-emerald-400/80">Step 2</span>
              </div>
              <p className="text-[11px] text-slate-200 leading-normal">
                Fill marks offline: <strong>CA Score (Max 40)</strong> and <strong>Exam Score (Max 60)</strong>. Save as standard CSV when done.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-emerald-300/80 font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Strict 0-40 & 0-60 boundaries</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-xl bg-black/25 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300 mb-1.5">
                <span>3. Upload & Auto-Compute</span>
                <span className="text-[10px] font-mono text-emerald-400/80">Step 3</span>
              </div>
              <p className="text-[11px] text-slate-200 leading-normal">
                Upload the file. The system validates all matric numbers, computes Total (/100), resolves letter grades (A–F with E), and saves as draft!
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-emerald-300/80 font-mono">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Ready for 1-click Senate submission</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
