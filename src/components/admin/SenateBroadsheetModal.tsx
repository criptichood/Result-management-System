import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Download, Printer, ShieldCheck, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { StudentSenateSummary, exportSenateBroadsheetToCsv } from '../../lib/senateAnalytics';

interface SenateBroadsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentSenateSummary[];
  departmentFilter?: string;
  levelFilter?: number;
  session?: string;
  semester?: number;
}

export const SenateBroadsheetModal: React.FC<SenateBroadsheetModalProps> = ({
  isOpen,
  onClose,
  students,
  departmentFilter = 'All Departments',
  levelFilter = 0,
  session = '2025/2026',
  semester = 1,
}) => {
  const [filterClass, setFilterClass] = useState<string>('all');

  const filteredStudents = filterClass === 'all'
    ? students
    : students.filter(s => s.classOfDegree === filterClass);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    exportSenateBroadsheetToCsv(filteredStudents, `Senate_Broadsheet_${session.replace('/', '-')}_${departmentFilter}`);
  };

  const graduatingCleared = filteredStudents.filter(s => s.graduationStatus === 'Cleared for Graduation').length;
  const firstClassCount = filteredStudents.filter(s => s.classOfDegree === 'First Class').length;
  const secondUpperCount = filteredStudents.filter(s => s.classOfDegree === 'Second Class Upper').length;
  const secondLowerCount = filteredStudents.filter(s => s.classOfDegree === 'Second Class Lower').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[96vw] max-h-[92vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        {/* Header toolbar */}
        <div className="p-4 sm:p-5 pr-14 sm:pr-16 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/60 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700 text-white rounded-lg shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Official Senate Broadsheet & Graduation Clearance Record
              </DialogTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Session: {session} • {semester === 1 ? '1st' : '2nd'} Semester • Department: {departmentFilter} • Level: {levelFilter ? `${levelFilter}L` : 'All Levels'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="text-xs h-8 px-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-emerald-600"
            >
              <option value="all">All Classifications ({students.length})</option>
              <option value="First Class">First Class ({students.filter(s => s.classOfDegree === 'First Class').length})</option>
              <option value="Second Class Upper">2nd Class Upper ({students.filter(s => s.classOfDegree === 'Second Class Upper').length})</option>
              <option value="Second Class Lower">2nd Class Lower ({students.filter(s => s.classOfDegree === 'Second Class Lower').length})</option>
              <option value="Third Class">Third Class ({students.filter(s => s.classOfDegree === 'Third Class').length})</option>
              <option value="Pass">Pass Degree ({students.filter(s => s.classOfDegree === 'Pass').length})</option>
              <option value="Probation / Warning">Probation / Warning ({students.filter(s => s.classOfDegree === 'Probation / Warning').length})</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="text-xs h-8 gap-1.5 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </Button>

            <Button
              size="sm"
              onClick={handlePrint}
              className="text-xs h-8 gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Broadsheet</span>
            </Button>
          </div>
        </div>

        {/* Scrollable Printable Document Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-100/50 dark:bg-slate-950/40 print:p-0 print:bg-white">
          <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm print:border-none print:shadow-none print:p-0">
            
            {/* University Letterhead */}
            <div className="text-center border-b-2 border-emerald-800 pb-5 mb-6">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Federal University of Agriculture, Zuru
              </h1>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-800 dark:text-emerald-400 mt-1">
                Office of the Academic Secretary • Senate Committee on Examinations
              </p>
              <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 mt-2 bg-slate-100 dark:bg-slate-800 py-1 px-3 rounded inline-block">
                OFFICIAL SENATE DEGREE BROADSHEET & ACADEMIC CLASSIFICATION SUMMARY
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 mt-3 max-w-3xl mx-auto text-left sm:text-center">
                <div><span className="font-bold text-slate-900 dark:text-white">Session:</span> {session}</div>
                <div><span className="font-bold text-slate-900 dark:text-white">Semester:</span> {semester === 1 ? 'First Semester' : 'Second Semester'}</div>
                <div><span className="font-bold text-slate-900 dark:text-white">Department:</span> {departmentFilter}</div>
                <div><span className="font-bold text-slate-900 dark:text-white">Cohort Total:</span> {filteredStudents.length} Students</div>
              </div>
            </div>

            {/* Quick Executive Summary Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 print:border print:border-slate-300 print:p-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                <p className="text-2xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">First Class</p>
                <p className="text-xl font-black text-emerald-900 dark:text-emerald-200 mt-0.5">{firstClassCount}</p>
              </div>
              <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-lg border border-teal-200 dark:border-teal-800/60">
                <p className="text-2xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400">2nd Class Upper</p>
                <p className="text-xl font-black text-teal-900 dark:text-teal-200 mt-0.5">{secondUpperCount}</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800/60">
                <p className="text-2xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400">2nd Class Lower</p>
                <p className="text-xl font-black text-blue-900 dark:text-blue-200 mt-0.5">{secondLowerCount}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-2xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Graduation Cleared</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{graduatingCleared}</p>
              </div>
            </div>

            {/* Broadsheet Table */}
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase text-2xs tracking-wider">
                    <th className="py-2.5 px-2 text-center w-10">S/N</th>
                    <th className="py-2.5 px-3">Matric No.</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-2 text-center">Level</th>
                    <th className="py-2.5 px-2 text-center">TCR</th>
                    <th className="py-2.5 px-2 text-center">TCE</th>
                    <th className="py-2.5 px-2 text-center">TWP</th>
                    <th className="py-2.5 px-2 text-center font-black">CGPA</th>
                    <th className="py-2.5 px-3">Class of Degree</th>
                    <th className="py-2.5 px-2 text-center">Carryover</th>
                    <th className="py-2.5 px-3 text-center">Senate Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-slate-500 dark:text-slate-400">
                        No student academic records matching the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s, idx) => (
                      <tr key={s.student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-2 px-2 text-center text-slate-500 font-mono text-2xs">{idx + 1}</td>
                        <td className="py-2 px-3 font-mono font-semibold text-slate-900 dark:text-white">
                          {s.student.matricNumber || 'N/A'}
                        </td>
                        <td className="py-2 px-3 font-medium">
                          {s.student.name}
                          <div className="text-2xs text-slate-500 dark:text-slate-400">{s.student.department}</div>
                        </td>
                        <td className="py-2 px-2 text-center font-mono">{s.student.level || 100}L</td>
                        <td className="py-2 px-2 text-center font-mono text-slate-600 dark:text-slate-300">{s.tcr}</td>
                        <td className="py-2 px-2 text-center font-mono font-semibold text-emerald-700 dark:text-emerald-400">{s.tce}</td>
                        <td className="py-2 px-2 text-center font-mono text-slate-600 dark:text-slate-300">{s.twp}</td>
                        <td className="py-2 px-2 text-center font-mono font-black text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/80">
                          {s.cgpa.toFixed(2)}
                        </td>
                        <td className="py-2 px-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-2xs font-semibold border ${s.classBadgeColor}`}>
                            {s.classOfDegree}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-center">
                          {s.carryoverCount > 0 ? (
                            <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold font-mono text-2xs bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              {s.carryoverCount}
                            </span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-2xs">0</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {s.graduationStatus === 'Cleared for Graduation' ? (
                            <Badge variant="success" className="text-3xs py-0.5 px-1.5 gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Cleared
                            </Badge>
                          ) : s.standing === 'Academic Probation' ? (
                            <Badge variant="destructive" className="text-3xs py-0.5 px-1.5">
                              Probation
                            </Badge>
                          ) : s.standing === 'Academic Warning' ? (
                            <Badge variant="warning" className="text-3xs py-0.5 px-1.5">
                              Warning
                            </Badge>
                          ) : (
                            <span className="text-2xs text-slate-600 dark:text-slate-400 font-medium">
                              {s.standing}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Official Certification Signature Block */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 mt-8 border-t border-slate-200 dark:border-slate-800 text-center">
              <div>
                <div className="border-b border-slate-400 dark:border-slate-600 h-10 mb-2"></div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Prof. A. B. Umar</p>
                <p className="text-2xs text-slate-500 dark:text-slate-400">Chief Examiner / Head of Department</p>
              </div>
              <div>
                <div className="border-b border-slate-400 dark:border-slate-600 h-10 mb-2"></div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Prof. Ibrahim Garba</p>
                <p className="text-2xs text-slate-500 dark:text-slate-400">Dean, Faculty of Sciences & Agriculture</p>
              </div>
              <div>
                <div className="border-b border-slate-400 dark:border-slate-600 h-10 mb-2"></div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Dr. K. N. Danladi</p>
                <p className="text-2xs text-slate-500 dark:text-slate-400">Registrar & Secretary to Senate</p>
              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
