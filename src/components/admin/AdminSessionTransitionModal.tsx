import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, ArrowRight, CheckCircle2, AlertTriangle, GraduationCap, Clock, ShieldCheck } from 'lucide-react';
import { User } from '../../types';

interface AdminSessionTransitionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentSession: string;
  currentSemester: 1 | 2;
  students: User[];
  onConfirmTransition: (newSession: string, newSemester: 1 | 2, options: { promoteStudents: boolean; openRegistration: boolean }) => void;
}

export const AdminSessionTransitionModal: React.FC<AdminSessionTransitionModalProps> = ({
  isOpen,
  onOpenChange,
  currentSession,
  currentSemester,
  students,
  onConfirmTransition,
}) => {
  // Determine default next session/semester
  const isCurrentlySecondSemester = currentSemester === 2;
  const parseSessionYear = parseInt(currentSession.split('/')[0]) || 2024;
  const nextSessionString = isCurrentlySecondSemester 
    ? `${parseSessionYear + 1}/${parseSessionYear + 2}` 
    : currentSession;
  const nextSemesterVal = isCurrentlySecondSemester ? 1 : 2;

  const [targetSession, setTargetSession] = useState<string>(nextSessionString);
  const [targetSemester, setTargetSemester] = useState<1 | 2>(nextSemesterVal as 1 | 2);
  const [promoteStudents, setPromoteStudents] = useState<boolean>(isCurrentlySecondSemester);
  const [openRegistration, setOpenRegistration] = useState<boolean>(true);
  const [confirmKeyword, setConfirmKeyword] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Calculate promotion stats
  const level100Count = students.filter(s => s.level === 100).length;
  const level200Count = students.filter(s => s.level === 200).length;
  const level300Count = students.filter(s => s.level === 300).length;
  const level400Count = students.filter(s => s.level === 400).length;

  const handleExecute = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onConfirmTransition(targetSession, targetSemester, {
        promoteStudents,
        openRegistration,
      });
      setIsProcessing(false);
      onOpenChange(false);
    }, 600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Calendar className="w-4 h-4 text-emerald-600" />
            Institutional Calendar Management
          </div>
          <DialogTitle className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
            Academic Session & Semester Transition Wizard
          </DialogTitle>
          <DialogDescription className="text-xs">
            Safely transition the university to a new semester or session, advance student cohorts, and configure course registration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Current vs Target Comparison Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Active Term</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{currentSession}</span>
                <span className="text-slate-400">•</span>
                <span>{currentSemester === 1 ? '1st Semester' : '2nd Semester'}</span>
              </p>
              <Badge variant="outline" className="text-[10px]">Active Now</Badge>
            </div>

            <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-3 md:pt-0 md:pl-4">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Target Term</span>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <span>{targetSession}</span>
                <span className="text-emerald-400">•</span>
                <span>{targetSemester === 1 ? '1st Semester' : '2nd Semester'}</span>
              </p>
              <Badge variant="success" className="text-[10px]">Upcoming Term</Badge>
            </div>
          </div>

          {/* Target Term Selection */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              1. Select Target Session & Semester
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Academic Session
                </label>
                <select
                  value={targetSession}
                  onChange={(e) => setTargetSession(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="2024/2025">2024/2025 Academic Session</option>
                  <option value="2025/2026">2025/2026 Academic Session</option>
                  <option value="2026/2027">2026/2027 Academic Session</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
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

          {/* Student Cohort Promotion Configuration */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
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
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    Promote Active Undergraduates to Next Academic Level
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Recommended when transitioning into a new Academic Session (e.g., 2024/2025 to 2025/2026).
                  </p>
                </div>
              </label>

              {promoteStudents && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block">100L ➔ 200L</span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{level100Count} Students</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block">200L ➔ 300L</span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{level200Count} Students</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block">300L ➔ 400L</span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{level300Count} Students</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 block">400L ➔ Graduated</span>
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400">{level400Count} Students</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Registration Window */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              3. Course Registration Window
            </h4>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Automatically Open Registration Portal
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Allows students to immediately register courses for {targetSession} (Semester {targetSemester}).
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

          {/* Safety Verification Box */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Historical Integrity Assurance</span>
            </div>
            <p className="text-[11px] text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
              All previously published semester results and approved grades from prior terms remain permanently preserved in SQLite database snapshots and student academic transcripts.
            </p>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleExecute}
            disabled={isProcessing}
            className="bg-[#064e3b] hover:bg-[#065f46] text-white text-xs gap-1.5"
          >
            {isProcessing ? 'Executing Transition...' : 'Confirm & Execute Term Transition'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
