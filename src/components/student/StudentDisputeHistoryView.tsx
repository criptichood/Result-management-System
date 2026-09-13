import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { GradeDispute } from '../../types';
import { FileQuestion, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface StudentDisputeHistoryViewProps {
  disputes: GradeDispute[];
  onOpenNewDispute?: () => void;
}

export const StudentDisputeHistoryView: React.FC<StudentDisputeHistoryViewProps> = ({
  disputes,
  onOpenNewDispute,
}) => {
  const getStatusBadge = (status: GradeDispute['status']) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="warning" className="gap-1"><Clock className="w-3 h-3" /> Awaiting Review</Badge>;
      case 'Under Investigation':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 gap-1"><AlertCircle className="w-3 h-3" /> Under Investigation</Badge>;
      case 'Resolved (Score Adjusted)':
        return <Badge variant="success" className="gap-1"><CheckCircle className="w-3 h-3" /> Resolved (Score Adjusted)</Badge>;
      case 'Dismissed':
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Dismissed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card id="student-disputes-view" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 p-6 gap-4">
        <div>
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Academic Grade Queries & Remarking Petitions
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Track status and departmental resolutions for your published course evaluation queries.
          </CardDescription>
        </div>

        {onOpenNewDispute && (
          <Button
            size="sm"
            onClick={onOpenNewDispute}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1.5 shadow-xs"
          >
            <FileQuestion className="w-3.5 h-3.5" /> Submit Query
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-6">
        {disputes.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <FileQuestion className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">No Active Grade Queries</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              If you notice any discrepancy on your published semester results slip, you can initiate a dispute query from your result slip.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                      {dispute.courseCode}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {dispute.courseTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(dispute.status)}
                    <span className="text-slate-400 text-[11px]">
                      {new Date(dispute.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 text-[11px]">Category:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{dispute.category}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Original Scores:</span>
                    <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      CA: {dispute.originalCa ?? '-'} | Exam: {dispute.originalExam ?? '-'} | Total: {dispute.originalTotal ?? '-'}
                    </p>
                  </div>
                  {dispute.status === 'Resolved (Score Adjusted)' && (
                    <div>
                      <span className="text-slate-400 text-[11px]">Adjusted Scores:</span>
                      <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        CA: {dispute.adjustedCa ?? dispute.originalCa ?? '-'} | Exam: {dispute.adjustedExam ?? dispute.originalExam ?? '-'} | Total: {dispute.adjustedTotal ?? '-'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-slate-400 text-[11px]">Student Statement:</span>
                  <p className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 mt-1">
                    "{dispute.description}"
                  </p>
                </div>

                {dispute.resolutionNote && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 text-[11px]">
                      Departmental Resolution ({dispute.resolvedBy || 'Chief Examiner'}):
                    </span>
                    <p className="text-emerald-800 dark:text-emerald-300 mt-0.5">
                      {dispute.resolutionNote}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
