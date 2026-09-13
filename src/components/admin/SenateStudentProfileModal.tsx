import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { User, Award, BookOpen, AlertCircle, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { StudentSenateSummary } from '../../lib/senateAnalytics';

interface SenateStudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentSummary: StudentSenateSummary | null;
}

export const SenateStudentProfileModal: React.FC<SenateStudentProfileModalProps> = ({
  isOpen,
  onClose,
  studentSummary,
}) => {
  if (!studentSummary) return null;
  const { student, tcr, tce, twp, cgpa, classOfDegree, classBadgeColor, standing, carryoverCount, carryoverCourses, graduationStatus, isGraduatingLevel } = studentSummary;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[94vw] p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center text-lg shadow-xs">
                {student.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                  {student.name}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{student.matricNumber || 'NO_MATRIC'}</span>
                  <span>•</span>
                  <span>{student.department} ({student.level || 100}L)</span>
                  <span>•</span>
                  <span>{student.college || 'Faculty of Sciences'}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-2xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Credits Reg</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">{tcr}</p>
            </div>
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-center">
              <p className="text-2xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">Credits Earned</p>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1 font-mono">{tce}</p>
            </div>
            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800/60 text-center">
              <p className="text-2xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400">Quality Points</p>
              <p className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-1 font-mono">{twp}</p>
            </div>
            <div className="p-3.5 bg-slate-900 text-white dark:bg-slate-800 rounded-xl border border-slate-800 text-center shadow-xs">
              <p className="text-2xs font-bold uppercase tracking-wider text-emerald-400">Current CGPA</p>
              <p className="text-2xl font-black text-white mt-1 font-mono">{cgpa.toFixed(2)}</p>
            </div>
          </div>

          {/* Academic Standing & Degree Standing */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" /> Senate Classification & Standing
            </h4>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Projected Class of Degree</p>
                <div className={`mt-1 inline-flex px-2.5 py-1 rounded-md text-xs font-bold border ${classBadgeColor}`}>
                  {classOfDegree}
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Senate Academic Status</p>
                <div className="mt-1">
                  {standing === 'Academic Probation' ? (
                    <Badge variant="destructive" className="text-xs font-semibold">Academic Probation (CGPA &lt; 1.00)</Badge>
                  ) : standing === 'Academic Warning' ? (
                    <Badge variant="warning" className="text-xs font-semibold">Academic Warning (CGPA &lt; 1.50)</Badge>
                  ) : (
                    <Badge variant="success" className="text-xs font-semibold">{standing}</Badge>
                  )}
                </div>
              </div>

              {isGraduatingLevel && (
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Graduation Clearance</p>
                  <div className="mt-1">
                    {graduationStatus === 'Cleared for Graduation' ? (
                      <Badge variant="success" className="text-xs font-semibold gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Cleared
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs font-semibold">
                        {graduationStatus}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Outstanding Carryover Breakdown */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Outstanding Course Deficiencies & Carryovers
              </h4>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {carryoverCount} {carryoverCount === 1 ? 'Course' : 'Courses'}
              </span>
            </div>

            {carryoverCount === 0 ? (
              <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-lg flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Zero pending carryovers. Student has passed all registered curriculum requirements to date.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {carryoverCourses.map((c, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-amber-900 dark:text-amber-200 mr-2">{c.code}</span>
                      <span className="text-slate-700 dark:text-slate-300">{c.title}</span>
                      <span className="ml-2 text-2xs text-slate-500">({c.units} Units)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-mono text-slate-500">Recorded Score: {c.score}</span>
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold rounded text-2xs">
                        Grade {c.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex justify-end">
          <Button onClick={onClose} variant="outline" size="sm" className="text-xs">
            Close Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
