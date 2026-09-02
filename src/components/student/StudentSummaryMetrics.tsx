import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Trophy, Award, AlertCircle, FileText } from 'lucide-react';
import { DegreeClassification } from '../../lib/academicUtils';
import { SystemSettings } from '../../types';

interface StudentSummaryMetricsProps {
  cumulativeCgpa: number;
  totalEarnedCredits: number;
  classification: DegreeClassification;
  outstandingCount: number;
  settings: SystemSettings;
}

export const StudentSummaryMetrics: React.FC<StudentSummaryMetricsProps> = ({
  cumulativeCgpa,
  totalEarnedCredits,
  classification,
  outstandingCount,
  settings,
}) => {
  return (
    <div id="student-summary-metrics" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Cumulative CGPA Card */}
      <Card id="card-cgpa" className="border-emerald-200/70 dark:border-emerald-800/60 bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-900 dark:to-emerald-950/20 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-1 p-4">
          <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cumulative CGPA</CardTitle>
          <Trophy className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{cumulativeCgpa.toFixed(2)}</div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded">
              5.00 Max
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">• {totalEarnedCredits} Credits</span>
          </div>
        </CardContent>
      </Card>

      {/* Class Standing Card */}
      <Card id="card-standing" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-1 p-4">
          <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Standing</CardTitle>
          <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight mt-1 line-clamp-1">
            {classification.label}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            Graduating Class Classification
          </p>
        </CardContent>
      </Card>

      {/* Carryover / Outstanding Card */}
      <Card id="card-carryovers" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-1 p-4">
          <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Carryovers</CardTitle>
          <AlertCircle className={`h-4 w-4 ${outstandingCount > 0 ? 'text-red-500 dark:text-red-400' : 'text-emerald-500 dark:text-emerald-400'}`} />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">{outstandingCount}</div>
          <p className={`text-[11px] mt-1 font-medium ${outstandingCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {outstandingCount === 0 ? 'Good Academic Standing' : 'Outstanding courses pending'}
          </p>
        </CardContent>
      </Card>

      {/* Registration Status Card */}
      <Card id="card-registration-status" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-1 p-4">
          <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Registration</CardTitle>
          <FileText className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center gap-1.5 mt-0.5">
            <Badge variant={settings.courseRegistrationOpen ? "success" : "secondary"}>
              {settings.courseRegistrationOpen ? 'Portal Open' : 'Closed'}
            </Badge>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">{settings.currentSession} Session</p>
        </CardContent>
      </Card>
    </div>
  );
};

