import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { ShieldCheck, Download, Printer } from 'lucide-react';
import { SenateInstitutionalAnalytics } from '../../../lib/senateAnalytics';

interface SenateMetricsHeaderProps {
  analytics: SenateInstitutionalAnalytics;
  onExportCsv: () => void;
  onOpenBroadsheetModal: () => void;
}

export const SenateMetricsHeader: React.FC<SenateMetricsHeaderProps> = ({
  analytics,
  onExportCsv,
  onOpenBroadsheetModal,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner & Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Executive Senate Academic Analytics & Degree Broadsheet
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Institutional performance metrics, 5.0 scale degree classifications, graduation clearance, and departmental benchmarks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            id="btn-export-senate-csv"
            variant="outline"
            size="sm"
            onClick={onExportCsv}
            className="text-xs h-9 gap-1.5 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Broadsheet (CSV)</span>
          </Button>

          <Button
            id="btn-open-senate-broadsheet-modal"
            size="sm"
            onClick={onOpenBroadsheetModal}
            className="text-xs h-9 gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Official Broadsheet Slip</span>
          </Button>
        </div>
      </div>

      {/* Executive Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-4">
            <p className="text-2xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Evaluated
            </p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {analytics.totalStudents}
            </h3>
            <p className="text-2xs text-slate-400 mt-0.5">Students on roll</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-4">
            <p className="text-2xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Mean Inst. CGPA
            </p>
            <h3 className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-1 font-mono">
              {analytics.meanCgpa.toFixed(2)}
            </h3>
            <p className="text-2xs text-slate-400 mt-0.5">5.00 Maximum</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-4">
            <p className="text-2xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Distinction Rate
            </p>
            <h3 className="text-xl font-black text-teal-700 dark:text-teal-300 mt-1">
              {analytics.distinctionRate}%
            </h3>
            <p className="text-2xs text-slate-400 mt-0.5">1st Class & 2:1</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-4">
            <p className="text-2xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              Overall Pass Rate
            </p>
            <h3 className="text-xl font-black text-blue-700 dark:text-blue-300 mt-1">
              {analytics.overallPassRate}%
            </h3>
            <p className="text-2xs text-slate-400 mt-0.5">CGPA &ge; 1.00</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-4">
            <p className="text-2xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
              Graduating Cleared
            </p>
            <h3 className="text-xl font-black text-purple-700 dark:text-purple-300 mt-1">
              {analytics.graduatingEligibleCount}
            </h3>
            <p className="text-2xs text-slate-400 mt-0.5">
              {analytics.graduatingDeficientCount} Deficient
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-4">
            <p className="text-2xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
              At-Risk / Warning
            </p>
            <h3 className="text-xl font-black text-red-700 dark:text-red-400 mt-1">
              {analytics.atRiskCount}
            </h3>
            <p className="text-2xs text-slate-400 mt-0.5">CGPA &lt; 1.50</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
