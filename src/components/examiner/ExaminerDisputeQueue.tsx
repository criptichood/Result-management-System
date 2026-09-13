import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { GradeDispute, User } from '../../types';
import {
  FileQuestion,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  SlidersHorizontal,
  Clock,
  Wrench,
  Check,
  X,
} from 'lucide-react';
import { db } from '../../lib/db';

interface ExaminerDisputeQueueProps {
  currentUser: User;
  onRefresh?: () => void;
}

export const ExaminerDisputeQueue: React.FC<ExaminerDisputeQueueProps> = ({
  currentUser,
  onRefresh,
}) => {
  const [disputes, setDisputes] = useState<GradeDispute[]>(() => db.getDisputes());
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Under Investigation' | 'Resolved (Score Adjusted)' | 'Dismissed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Dispute Actions
  const [selectedDispute, setSelectedDispute] = useState<GradeDispute | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isDismissModalOpen, setIsDismissModalOpen] = useState(false);

  // Adjustment form state
  const [adjCa, setAdjCa] = useState('');
  const [adjExam, setAdjExam] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [dismissNote, setDismissNote] = useState('');

  const reloadDisputes = () => {
    setDisputes(db.getDisputes());
    if (onRefresh) onRefresh();
  };

  const handleStartInvestigation = (dispute: GradeDispute) => {
    db.updateDisputeStatus(
      dispute.id,
      'Under Investigation',
      'The Department has retrieved original physical examination scripts for audit.',
      undefined,
      currentUser
    );
    reloadDisputes();
  };

  const openAdjustModal = (dispute: GradeDispute) => {
    setSelectedDispute(dispute);
    setAdjCa(dispute.originalCa?.toString() || '0');
    setAdjExam(dispute.originalExam?.toString() || '0');
    setResolutionNote('Physical assessment scripts verified; score reconciled to reflect actual midterm presentation mark.');
    setIsAdjustModalOpen(true);
  };

  const handleConfirmAdjustment = () => {
    if (!selectedDispute) return;

    const ca = parseFloat(adjCa) || 0;
    const exam = parseFloat(adjExam) || 0;
    const total = ca + exam;

    db.updateDisputeStatus(
      selectedDispute.id,
      'Resolved (Score Adjusted)',
      resolutionNote.trim(),
      { ca, exam, total },
      currentUser
    );

    setIsAdjustModalOpen(false);
    setSelectedDispute(null);
    reloadDisputes();
  };

  const openDismissModal = (dispute: GradeDispute) => {
    setSelectedDispute(dispute);
    setDismissNote('Physical script cross-checked against attendance broadsheet. Original marks accurately recorded with no transcription omission.');
    setIsDismissModalOpen(true);
  };

  const handleConfirmDismissal = () => {
    if (!selectedDispute) return;

    db.updateDisputeStatus(
      selectedDispute.id,
      'Dismissed',
      dismissNote.trim(),
      undefined,
      currentUser
    );

    setIsDismissModalOpen(false);
    setSelectedDispute(null);
    reloadDisputes();
  };

  // Filter logic
  const filteredDisputes = disputes.filter((d) => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchMatric = d.matricNumber.toLowerCase().includes(q);
      const matchName = d.studentName.toLowerCase().includes(q);
      const matchCourse = d.courseCode.toLowerCase().includes(q);
      if (!matchMatric && !matchName && !matchCourse) return false;
    }
    return true;
  });

  const pendingCount = disputes.filter((d) => d.status === 'Pending' || d.status === 'Under Investigation').length;

  return (
    <Card id="examiner-dispute-queue" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 p-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Academic Grade Query & Remarking Inbox
            </CardTitle>
            {pendingCount > 0 && (
              <Badge variant="warning">{pendingCount} Action Required</Badge>
            )}
          </div>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Formal student grade petitions awaiting verification, script retrieval, and score reconciliation.
          </CardDescription>
        </div>
      </CardHeader>

      {/* Filter Bar */}
      <div className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Search by student, matric, or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All ({disputes.length})
          </button>
          <button
            onClick={() => setStatusFilter('Pending')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              statusFilter === 'Pending'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
            }`}
          >
            Pending ({disputes.filter((d) => d.status === 'Pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('Under Investigation')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              statusFilter === 'Under Investigation'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
            }`}
          >
            Under Investigation ({disputes.filter((d) => d.status === 'Under Investigation').length})
          </button>
          <button
            onClick={() => setStatusFilter('Resolved (Score Adjusted)')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              statusFilter === 'Resolved (Score Adjusted)'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            Resolved ({disputes.filter((d) => d.status === 'Resolved (Score Adjusted)').length})
          </button>
        </div>
      </div>

      <CardContent className="p-6">
        {filteredDisputes.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No grade disputes match your filter criteria.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDisputes.map((dispute) => (
              <div
                key={dispute.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {dispute.studentName}
                      </span>
                      <span className="font-mono text-slate-500 font-medium">({dispute.matricNumber})</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                      Query for <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{dispute.courseCode}</span>: {dispute.courseTitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {dispute.status === 'Pending' ? (
                      <Badge variant="warning">Pending Review</Badge>
                    ) : dispute.status === 'Under Investigation' ? (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">Under Investigation</Badge>
                    ) : dispute.status === 'Resolved (Score Adjusted)' ? (
                      <Badge variant="success">Resolved (Adjusted)</Badge>
                    ) : (
                      <Badge variant="destructive">Dismissed</Badge>
                    )}
                    <span className="text-slate-400 text-[11px]">
                      {new Date(dispute.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[11px]">Dispute Reason:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{dispute.category}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Recorded Original Marks:</span>
                    <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      CA: {dispute.originalCa ?? '-'} | Exam: {dispute.originalExam ?? '-'} | Total: {dispute.originalTotal ?? '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Status/Resolution:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {dispute.status === 'Resolved (Score Adjusted)'
                        ? `New Total: ${dispute.adjustedTotal ?? '-'} (Adjusted)`
                        : dispute.status}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px]">Candidate Justification:</span>
                  <p className="text-slate-700 dark:text-slate-300 italic mt-0.5">
                    "{dispute.description}"
                  </p>
                </div>

                {dispute.resolutionNote && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 text-[11px]">
                      Examiner Resolution Note ({dispute.resolvedBy}):
                    </span>
                    <p className="text-emerald-800 dark:text-emerald-300 mt-0.5">
                      {dispute.resolutionNote}
                    </p>
                  </div>
                )}

                {/* Actions Toolbar */}
                {(dispute.status === 'Pending' || dispute.status === 'Under Investigation') && (
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    {dispute.status === 'Pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStartInvestigation(dispute)}
                        className="text-xs text-blue-700 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300"
                      >
                        <Clock className="w-3.5 h-3.5 mr-1" /> Mark Under Investigation
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDismissModal(dispute)}
                      className="text-xs text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                    >
                      <X className="w-3.5 h-3.5 mr-1" /> Dismiss Petition
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => openAdjustModal(dispute)}
                      className="text-xs bg-[#059669] hover:bg-emerald-700 text-white shadow-xs"
                    >
                      <Wrench className="w-3.5 h-3.5 mr-1" /> Reconcile & Adjust Score
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Adjust Score Modal */}
      <Dialog open={isAdjustModalOpen} onOpenChange={setIsAdjustModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Reconcile Candidate Score — {selectedDispute?.courseCode}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Candidate: <strong>{selectedDispute?.studentName}</strong> ({selectedDispute?.matricNumber})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Adjusted CA Score (Max 40)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="40"
                  value={adjCa}
                  onChange={(e) => setAdjCa(e.target.value)}
                  className="font-mono h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Adjusted Exam Score (Max 60)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="60"
                  value={adjExam}
                  onChange={(e) => setAdjExam(e.target.value)}
                  className="font-mono h-8 text-xs"
                />
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex justify-between items-center font-semibold">
              <span>New Total Score:</span>
              <span className="font-mono font-bold text-sm">
                {(parseFloat(adjCa) || 0) + (parseFloat(adjExam) || 0)} / 100 ({db.calculateGrade((parseFloat(adjCa) || 0) + (parseFloat(adjExam) || 0))})
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Official Resolution & Audit Note <span className="text-red-500">*</span>
              </label>
              <Textarea
                rows={2}
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Reason for adjustment, script verification details..."
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsAdjustModalOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button onClick={handleConfirmAdjustment} className="bg-[#059669] hover:bg-emerald-700 text-white text-xs gap-1">
              <Check className="w-3.5 h-3.5" /> Approve & Update Student Result
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dismiss Petition Modal */}
      <Dialog open={isDismissModalOpen} onOpenChange={setIsDismissModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Dismiss Grade Petition
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Provide formal explanatory reasons for dismissing the student's query for <strong>{selectedDispute?.courseCode}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2 text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Explanatory Dismissal Justification <span className="text-red-500">*</span>
            </label>
            <Textarea
              rows={3}
              value={dismissNote}
              onChange={(e) => setDismissNote(e.target.value)}
              placeholder="Script audited and score confirmed accurate..."
              className="text-xs"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsDismissModalOpen(false)} className="text-xs">
              Cancel
            </Button>
            <Button onClick={handleConfirmDismissal} variant="destructive" className="text-xs">
              Confirm Dismissal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
