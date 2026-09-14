import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Printer, Download, X, CheckCircle2, ShieldCheck, QrCode, Loader2, FileDown } from 'lucide-react';
import { FuazLogo } from '../ui/FuazLogo';
import { User, SystemSettings } from '../../types';
import { getGradePoint, getDegreeClassification, calculateSemesterStats, exportResultsToCsv } from '../../lib/academicUtils';
import { generateOfficialResultPdf } from '../../lib/pdfUtils';

interface OfficialResultSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  settings: SystemSettings;
  semesterGroups: { [key: string]: { academicYear: string; semester: number; items: any[] } };
  semesterKeys: string[];
  initialScopeKey?: string; // 'all' or specific semester key
  cumulativeCgpa: number;
}

export const OfficialResultSlipModal: React.FC<OfficialResultSlipModalProps> = ({
  isOpen,
  onClose,
  user,
  settings,
  semesterGroups,
  semesterKeys,
  initialScopeKey = 'all',
  cumulativeCgpa,
}) => {
  const [selectedScope, setSelectedScope] = useState<string>(initialScopeKey);
  const [isExporting, setIsExporting] = useState(false);
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);

  // Sync initial scope if opened with a specific semester
  React.useEffect(() => {
    if (initialScopeKey) {
      setSelectedScope(initialScopeKey);
    }
  }, [initialScopeKey, isOpen]);

  if (!isOpen) return null;

  const targetSemesterKeys = selectedScope === 'all' 
    ? semesterKeys 
    : semesterKeys.filter(k => k === selectedScope);

  const allPublishedItems = targetSemesterKeys.flatMap(k => 
    semesterGroups[k]?.items.filter(i => i.result?.status === 'Published') || []
  );

  const handlePrint = async () => {
    try {
      const scopeLabel = selectedScope === 'all' ? 'All_Semesters' : selectedScope.replace(/[^a-zA-Z0-9]/g, '_');
      
      let totalUnitsRegistered = 0;
      let totalUnitsPassed = 0;
      const formattedItems = allPublishedItems.map(item => {
        const credits = item.course?.creditUnits || item.units || 0;
        const score = item.result?.totalScore ?? item.result?.score ?? 0;
        totalUnitsRegistered += credits;
        if (score >= 40) {
          totalUnitsPassed += credits;
        }
        return {
          code: item.course?.code || item.code || '',
          title: item.course?.title || item.title || '',
          units: credits,
          result: {
            score,
            grade: item.result?.grade || 'F',
            status: 'Published'
          }
        };
      });

      await generateOfficialResultPdf(
        user,
        formattedItems,
        scopeLabel,
        cumulativeCgpa,
        totalUnitsRegistered,
        totalUnitsPassed,
        'preview'
      );
    } catch (err) {
      console.error('PDF preview failed:', err);
      alert('Failed to preview PDF. Please try again.');
    }
  };

  const handleDownloadPdf = async () => {
    setIsPdfDownloading(true);
    try {
      const scopeLabel = selectedScope === 'all' ? 'All_Semesters' : selectedScope.replace(/[^a-zA-Z0-9]/g, '_');
      
      let totalUnitsRegistered = 0;
      let totalUnitsPassed = 0;
      const formattedItems = allPublishedItems.map(item => {
        const credits = item.course?.creditUnits || item.units || 0;
        const score = item.result?.totalScore ?? item.result?.score ?? 0;
        totalUnitsRegistered += credits;
        if (score >= 40) {
          totalUnitsPassed += credits;
        }
        return {
          code: item.course?.code || item.code || '',
          title: item.course?.title || item.title || '',
          units: credits,
          result: {
            score,
            grade: item.result?.grade || 'F',
            status: 'Published'
          }
        };
      });

      await new Promise(resolve => setTimeout(resolve, 400));
      generateOfficialResultPdf(
        user,
        formattedItems,
        scopeLabel,
        cumulativeCgpa,
        totalUnitsRegistered,
        totalUnitsPassed
      );
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsPdfDownloading(false);
    }
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    const scopeLabel = selectedScope === 'all' ? 'All_Semesters' : selectedScope.replace(/[^a-zA-Z0-9]/g, '_');
    await exportResultsToCsv(allPublishedItems, user.matricNumber || 'Student', `Result_Slip_${scopeLabel}`);
    setIsExporting(false);
  };

  const classification = getDegreeClassification(cumulativeCgpa);
  const printDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const verificationCode = `FUAZ-SRMS-${user.matricNumber?.replace(/[^a-zA-Z0-9]/g, '') || 'ST'}-${Date.now().toString(36).toUpperCase()}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        id="modal-official-result-slip"
        hideCloseButton
        className="max-w-4xl w-full max-h-[92vh] overflow-y-auto p-0 bg-slate-100/90 dark:bg-slate-950 border-slate-300 dark:border-slate-800 print:border-none print:shadow-none print:p-0 print:max-w-none print:w-full print:max-h-none print:bg-white"
      >
        {/* Top Floating Control Bar (Hidden on print) */}
        <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Slip Scope:</span>
            <select
              id="select-modal-slip-scope"
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="text-xs border border-slate-300 dark:border-slate-700 rounded-md px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="all">Complete Statement (All Semesters)</option>
              {semesterKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              id="btn-modal-export-csv"
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              disabled={isExporting || allPublishedItems.length === 0}
              className="text-xs gap-1.5 h-8 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 cursor-pointer active:scale-95 transition-all shadow-xs hover:shadow-md"
            >
              {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Button>
            <Button
              id="btn-modal-download-pdf"
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isPdfDownloading || allPublishedItems.length === 0}
              className="text-xs gap-1.5 h-8 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-semibold cursor-pointer active:scale-95 transition-all shadow-xs hover:shadow-md"
            >
              {isPdfDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700 dark:text-emerald-400" /> : <FileDown className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />}
              {isPdfDownloading ? 'Generating PDF...' : 'Download PDF'}
            </Button>
            <Button
              id="btn-modal-trigger-print"
              size="sm"
              onClick={handlePrint}
              className="text-xs gap-1.5 h-8 bg-[#064e3b] dark:bg-emerald-700 hover:bg-[#053d2e] dark:hover:bg-emerald-600 text-white font-semibold cursor-pointer active:scale-95 transition-all shadow-xs hover:shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Preview
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* The Printable Official Document Body */}
        <div className="p-4 sm:p-8 bg-slate-100 dark:bg-slate-950 print:bg-white print:p-0">
          <div 
            id="official-printable-slip"
            className="bg-white border border-slate-300 shadow-md print:shadow-none print:border-none p-6 sm:p-10 max-w-3xl mx-auto rounded-xl print:rounded-none text-slate-900"
          >
            {/* Header / Letterhead */}
            <div className="text-center pb-6 border-b-2 border-emerald-900 space-y-1.5">
              <div className="flex justify-center mb-2">
                <FuazLogo size={76} />
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold uppercase tracking-wide text-[#064e3b]">
                Federal University of Agriculture, Zuru
              </h1>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Kebbi State, Nigeria • Directorate of Academic Affairs & Examinations
              </p>
              <div className="pt-2">
                <span className="inline-block px-4 py-1 bg-emerald-50 border border-emerald-300 text-[#064e3b] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-md">
                  {selectedScope === 'all' ? 'Official Statement of Academic Results' : `Semester Result Slip — ${selectedScope}`}
                </span>
              </div>
            </div>

            {/* Student Biodata Profile Table */}
            <div className="my-6 bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                <div className="flex justify-between border-b border-slate-200/80 pb-1">
                  <span className="text-slate-500 font-medium">Student Name:</span>
                  <span className="font-bold text-slate-900">{user.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-1">
                  <span className="text-slate-500 font-medium">Matriculation No:</span>
                  <span className="font-bold text-slate-900">{user.matricNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-1">
                  <span className="text-slate-500 font-medium">Faculty / College:</span>
                  <span className="font-semibold text-slate-800">College of {user.college || 'Agriculture'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-1">
                  <span className="text-slate-500 font-medium">Department:</span>
                  <span className="font-semibold text-slate-800">{user.department || 'Computer Science'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-1">
                  <span className="text-slate-500 font-medium">Degree Programme:</span>
                  <span className="font-semibold text-slate-800">B.Sc. ({user.department || 'Computer Science'})</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-1">
                  <span className="text-slate-500 font-medium">Current Session:</span>
                  <span className="font-semibold text-slate-800">{settings.currentSession || '2025/2026'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-1">
                  <span className="text-slate-500 font-medium">Grading System:</span>
                  <span className="font-semibold text-slate-800">5.00 Scale (NUC Standard)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/80 pb-1">
                  <span className="text-slate-500 font-medium">Date Generated:</span>
                  <span className="font-semibold text-slate-800">{printDate}</span>
                </div>
              </div>
            </div>

            {/* Academic Results Breakdown per Semester */}
            <div className="space-y-6">
              {targetSemesterKeys.map((semesterKey) => {
                const grp = semesterGroups[semesterKey];
                if (!grp) return null;
                const stats = calculateSemesterStats(grp.items);

                return (
                  <div key={semesterKey} className="border border-slate-200 rounded-lg overflow-hidden">
                    {/* Sub-Header */}
                    <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200">
                      <span className="font-bold text-xs uppercase tracking-wide text-slate-800">
                        {semesterKey}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-800">
                        GPA: {stats.gpa.toFixed(2)} | Credits: {stats.credits}
                      </span>
                    </div>

                    {/* Course Table */}
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                          <th className="py-2 px-3">Course Code</th>
                          <th className="py-2 px-3">Course Title</th>
                          <th className="py-2 px-2 text-center">Units</th>
                          <th className="py-2 px-2 text-center">CA</th>
                          <th className="py-2 px-2 text-center">Exam</th>
                          <th className="py-2 px-2 text-center">Total</th>
                          <th className="py-2 px-2 text-center">Grade</th>
                          <th className="py-2 px-2 text-center">Points</th>
                          <th className="py-2 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {grp.items.map((item) => {
                          const isPublished = item.result?.status === 'Published';
                          const grade = item.result?.grade || '-';
                          const gp = getGradePoint(grade);
                          const credits = item.course?.creditUnits || 0;
                          const qp = isPublished ? gp * credits : 0;
                          const isPassed = (item.result?.totalScore ?? 0) >= 40;

                          return (
                            <tr key={item.enrollment.id} className="text-slate-800">
                              <td className="py-2 px-3 font-bold">{item.course?.code}</td>
                              <td className="py-2 px-3 text-slate-700">{item.course?.title}</td>
                              <td className="py-2 px-2 text-center font-semibold">{credits}</td>
                              <td className="py-2 px-2 text-center text-slate-600">{isPublished ? item.result?.caScore ?? '-' : '-'}</td>
                              <td className="py-2 px-2 text-center text-slate-600">{isPublished ? item.result?.examScore ?? '-' : '-'}</td>
                              <td className="py-2 px-2 text-center font-bold text-slate-900">{isPublished ? item.result?.totalScore ?? '-' : '-'}</td>
                              <td className="py-2 px-2 text-center font-bold">{isPublished ? grade : '-'}</td>
                              <td className="py-2 px-2 text-center font-semibold text-slate-700">{isPublished ? qp : '-'}</td>
                              <td className="py-2 px-3 text-right">
                                {isPublished ? (
                                  <span className={isPassed ? 'text-emerald-700 font-semibold' : 'text-red-700 font-bold'}>
                                    {isPassed ? 'Passed' : 'Failed'}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 italic">In Progress</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Semester Summary Sub-box */}
                    <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex flex-wrap justify-between text-xs font-semibold text-slate-700">
                      <div>Registered Units (TRU): <span className="font-bold text-slate-900">{stats.credits}</span></div>
                      <div>Quality Points (TQP): <span className="font-bold text-slate-900">{stats.totalQualityPoints}</span></div>
                      <div>Semester GPA: <span className="font-bold text-emerald-700">{stats.gpa.toFixed(2)}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall Cumulative Summary Box */}
            <div className="mt-8 bg-emerald-50/60 border border-emerald-200 rounded-lg p-4 text-xs space-y-2">
              <h3 className="font-bold uppercase tracking-wider text-[#064e3b] text-[11px]">
                Cumulative Academic Performance Record
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Cumulative CGPA</span>
                  <span className="text-base sm:text-lg font-bold text-[#064e3b]">{cumulativeCgpa.toFixed(2)} / 5.00</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Class of Degree</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{classification.label}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Academic Standing</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-700">Good Standing</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Total Semesters</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{semesterKeys.length}</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 text-center text-[10px] text-slate-400 italic">
              * This statement of results is generated officially from the FUAZ Student Result Management System (SRMS) for personal review and record keeping.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
