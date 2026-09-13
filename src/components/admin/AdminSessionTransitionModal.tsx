import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  ShieldCheck, 
  Check, 
  CalendarDays,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { User } from '../../types';
import { 
  getNextSequentialTerm, 
  getAcademicSessionOptions, 
  parseAcademicSession,
  formatAcademicSession,
  formatTermDisplay 
} from '../../lib/academicSessionUtils';

interface AdminSessionTransitionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentSession: string;
  currentSemester: 1 | 2;
  students: User[];
  onConfirmTransition: (
    newSession: string,
    newSemester: 1 | 2,
    options: { promoteStudents: boolean; openRegistration: boolean }
  ) => void;
}

export const AdminSessionTransitionModal: React.FC<AdminSessionTransitionModalProps> = ({
  isOpen,
  onOpenChange,
  currentSession,
  currentSemester,
  students = [],
  onConfirmTransition,
}) => {
  // Compute automated next sequential progression
  const nextTerm = getNextSequentialTerm(currentSession, currentSemester);
  const sessionOptions = getAcademicSessionOptions(currentSession);

  // Mode: 'preset-next-semester' | 'preset-new-session' | 'custom'
  const [selectedPreset, setSelectedPreset] = useState<'next-semester' | 'new-session' | 'custom'>(
    currentSemester === 1 ? 'next-semester' : 'new-session'
  );

  const [targetSession, setTargetSession] = useState<string>(nextTerm.session);
  const [targetSemester, setTargetSemester] = useState<1 | 2>(nextTerm.semester);
  const [promoteStudents, setPromoteStudents] = useState<boolean>(nextTerm.isNewSession);
  const [openRegistration, setOpenRegistration] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Sync state whenever modal opens or currentSession/Semester changes
  useEffect(() => {
    if (isOpen) {
      const computed = getNextSequentialTerm(currentSession, currentSemester);
      if (currentSemester === 1) {
        setSelectedPreset('next-semester');
        setTargetSession(currentSession);
        setTargetSemester(2);
        setPromoteStudents(false);
      } else {
        setSelectedPreset('new-session');
        setTargetSession(computed.session);
        setTargetSemester(1);
        setPromoteStudents(true);
      }
      setOpenRegistration(true);
    }
  }, [isOpen, currentSession, currentSemester]);

  // Handle Preset Selection
  const handleSelectPreset = (preset: 'next-semester' | 'new-session' | 'custom') => {
    setSelectedPreset(preset);
    const { startYear } = parseAcademicSession(currentSession);

    if (preset === 'next-semester') {
      setTargetSession(currentSession);
      setTargetSemester(2);
      setPromoteStudents(false);
    } else if (preset === 'new-session') {
      const nextSession = formatAcademicSession(startYear + 1);
      setTargetSession(nextSession);
      setTargetSemester(1);
      setPromoteStudents(true);
    }
  };

  // Calculate student promotion metrics
  const level100Count = (students || []).filter((s) => s.level === 100).length;
  const level200Count = (students || []).filter((s) => s.level === 200).length;
  const level300Count = (students || []).filter((s) => s.level === 300).length;
  const level400Count = (students || []).filter((s) => s.level === 400).length;
  const totalStudents = students?.length || 0;

  const handleExecute = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onConfirmTransition(targetSession, targetSemester, {
        promoteStudents,
        openRegistration,
      });
      setIsProcessing(false);
      onOpenChange(false);
    }, 450);
  };

  const isTargetNewSession = targetSession !== currentSession;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-xs tracking-wider uppercase mb-1">
            <Calendar className="w-4 h-4 text-emerald-600" />
            Institutional Calendar Management
          </div>
          <DialogTitle className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
            Academic Session & Semester Transition Wizard
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Advance the university academic calendar seamlessly. Sessions, semesters, and student promotions are calculated automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Active vs Target Visual Timeline Comparison */}
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-gradient-to-r from-emerald-50/70 via-slate-50 to-emerald-50/40 dark:from-emerald-950/30 dark:via-slate-900 dark:to-emerald-950/20">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] items-center gap-4">
              {/* Current Active Term */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Active Term</span>
                  <Badge variant="outline" className="text-[10px] bg-white dark:bg-slate-800">Active</Badge>
                </div>
                <p className="text-base font-extrabold text-slate-900 dark:text-white">
                  {formatTermDisplay(currentSession, currentSemester)}
                </p>
                <p className="text-[11px] text-slate-500">
                  {totalStudents} registered students across all levels
                </p>
              </div>

              {/* Arrow Indicator */}
              <div className="hidden sm:flex flex-col items-center justify-center px-2">
                <div className="p-2 rounded-full bg-emerald-600 text-white shadow-xs">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Target Upcoming Term */}
              <div className="space-y-1 sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Target Term</span>
                  <Badge variant="success" className="text-[10px]">Upcoming Target</Badge>
                </div>
                <p className="text-base font-extrabold text-emerald-800 dark:text-emerald-300">
                  {formatTermDisplay(targetSession, targetSemester)}
                </p>
                <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">
                  {isTargetNewSession ? '✨ New Session Progression' : 'Semester Advancement'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick-Action Presets: One-Click Automatic Term Selection */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              1. Choose Transition Pathway
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Preset 1: Next Semester */}
              <button
                type="button"
                onClick={() => handleSelectPreset('next-semester')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                  selectedPreset === 'next-semester'
                    ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-emerald-600" />
                    <span>Advance to 2nd Semester</span>
                  </div>
                  {selectedPreset === 'next-semester' && (
                    <div className="p-0.5 rounded-full bg-emerald-600 text-white">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Keep <span className="font-semibold text-slate-700 dark:text-slate-300">{currentSession}</span>, transition to 2nd Semester. Student levels are maintained.
                </p>
              </button>

              {/* Preset 2: New Academic Session */}
              <button
                type="button"
                onClick={() => handleSelectPreset('new-session')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                  selectedPreset === 'new-session'
                    ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span>Inaugurate Next Session</span>
                  </div>
                  {selectedPreset === 'new-session' && (
                    <div className="p-0.5 rounded-full bg-emerald-600 text-white">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Commence <span className="font-semibold text-slate-700 dark:text-slate-300">{formatAcademicSession(parseAcademicSession(currentSession).startYear + 1)} (Sem 1)</span> with student level promotions.
                </p>
              </button>
            </div>

            {/* Custom Option Button Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleSelectPreset('custom')}
                className={`text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  selectedPreset === 'custom'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Specify Custom Session / Semester</span>
              </button>
            </div>
          </div>

          {/* Custom Term Controls (Shows when Custom is selected) */}
          {selectedPreset === 'custom' && (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Academic Session
                  </label>
                  <select
                    value={targetSession}
                    onChange={(e) => {
                      setTargetSession(e.target.value);
                      if (e.target.value !== currentSession) {
                        setPromoteStudents(true);
                      }
                    }}
                    className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {sessionOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} {opt.isCurrent ? '★ (Calendar Current)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Semester
                  </label>
                  <div className="flex gap-2">
                    {[1, 2].map((sem) => (
                      <button
                        key={sem}
                        type="button"
                        onClick={() => setTargetSemester(sem as 1 | 2)}
                        className={`flex-1 h-9 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          targetSemester === sem
                            ? 'bg-[#064e3b] text-white border-[#064e3b]'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {sem === 1 ? '1st Semester' : '2nd Semester'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Student Cohort Promotion Configuration */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              2. Student Cohort Level Progression
            </h4>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={promoteStudents}
                  onChange={(e) => setPromoteStudents(e.target.checked)}
                  className="mt-1 h-4 w-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    Promote Active Undergraduates to Next Academic Level
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isTargetNewSession 
                      ? 'Recommended: Automatically advances 100L ➔ 200L, 200L ➔ 300L, 300L ➔ 400L, and clears graduating students.'
                      : 'Disabled for same-session semester transitions (students remain in their current academic level).'}
                  </p>
                </div>
              </label>

              {promoteStudents && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block font-medium">100L ➔ 200L</span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{level100Count} Students</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block font-medium">200L ➔ 300L</span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{level200Count} Students</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block font-medium">300L ➔ 400L</span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{level300Count} Students</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block font-medium">400L ➔ Graduated</span>
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400">{level400Count} Students</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Registration Portal Window Switch */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              3. Course Registration Window
            </h4>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Automatically Open Registration Portal for New Term
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Allows students to immediately register courses for {targetSession} ({targetSemester === 1 ? '1st' : '2nd'} Semester).
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={openRegistration}
                  onChange={(e) => setOpenRegistration(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#059669]"></div>
              </label>
            </div>
          </div>

          {/* Historical Integrity Guarantee */}
          <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-900 dark:text-blue-200 leading-relaxed">
              <span className="font-bold">Historical Snapshot Integrity:</span> All previously published student GPA/CGPA results, semester scores, and senate broadsheets from prior terms are permanently preserved in the database.
            </p>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleExecute}
            disabled={isProcessing}
            className="bg-[#064e3b] hover:bg-[#065f46] text-white text-xs gap-1.5 font-bold"
          >
            {isProcessing ? (
              'Executing Transition...'
            ) : (
              <>
                <span>Confirm & Advance to {targetSession} ({targetSemester === 1 ? '1st' : '2nd'} Sem)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
