import React, { useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { db } from '../../../lib/db';
import { Course, Department, Enrollment, Result, User } from '../../../types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Building,
  UserCheck,
  Send,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface SenateRatificationDeskProps {
  courses: Course[];
  departments: Department[];
  enrollments: Enrollment[];
  results: Result[];
  users: User[];
  session?: string;
  onRefreshData?: () => void;
  showToast?: (message: string, type?: 'success' | 'info') => void;
}

export const SenateRatificationDesk: React.FC<SenateRatificationDeskProps> = ({
  courses,
  departments,
  enrollments,
  results,
  users,
  session = '2024/2025',
  onRefreshData,
  showToast,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');

  // Compute courses awaiting Senate Ratification (status === 'Approved')
  const coursesWithDetails = courses.map((course) => {
    const courseEnrollments = enrollments.filter((e) => e.courseId === course.id);
    const courseResults = results.filter((r) =>
      courseEnrollments.some((e) => e.id === r.enrollmentId)
    );

    const approvedCount = courseResults.filter((r) => r.status === 'Approved').length;
    const publishedCount = courseResults.filter((r) => r.status === 'Published').length;
    const submittedCount = courseResults.filter((r) => r.status === 'Submitted').length;
    const totalEnrolled = courseEnrollments.length;

    const isPendingSenate = approvedCount > 0 && publishedCount === 0;
    const isFullyPublished = publishedCount > 0 && publishedCount === totalEnrolled;

    // Calculate mean score
    const scores = courseResults
      .map((r) => r.totalScore)
      .filter((s): s is number => s !== null && s !== undefined);
    const mean = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '—';
    const passCount = scores.filter((s) => s >= 40).length;
    const passRate = scores.length > 0 ? Math.round((passCount / scores.length) * 100) : 0;

    const lecturer = users.find((u) => u.id === course.lecturerId);

    return {
      ...course,
      totalEnrolled,
      approvedCount,
      publishedCount,
      submittedCount,
      isPendingSenate,
      isFullyPublished,
      mean,
      passRate,
      lecturerName: lecturer?.name || 'Assigned Lecturer',
    };
  });

  const pendingSenateCourses = coursesWithDetails.filter(
    (c) =>
      c.isPendingSenate &&
      (selectedDeptFilter === 'all' || c.department === selectedDeptFilter)
  );

  const publishedCourses = coursesWithDetails.filter(
    (c) =>
      c.isFullyPublished &&
      (selectedDeptFilter === 'all' || c.department === selectedDeptFilter)
  );

  const totalCandidatesAwaitingSenate = pendingSenateCourses.reduce(
    (sum, c) => sum + c.approvedCount,
    0
  );

  const handleRatifyAll = () => {
    if (pendingSenateCourses.length === 0) return;
    setIsProcessing(true);
    const courseIds = pendingSenateCourses.map((c) => c.id);
    db.ratifySenateCourses(
      courseIds,
      undefined,
      `Formally ratified by University Senate Examination Council during ${session} statutory academic review.`
    );
    setIsProcessing(false);
    if (onRefreshData) onRefreshData();
    if (showToast) {
      showToast(
        `Senate Examination Council successfully ratified ${courseIds.length} departmental courses! All scores are officially released to student portals.`,
        'success'
      );
    }
  };

  const handleRatifySingle = (courseId: string, courseCode: string) => {
    db.moderateCourse(
      courseId,
      'publish',
      `Formally ratified by University Senate Examination Council. Released to student portal.`,
      undefined
    );
    if (onRefreshData) onRefreshData();
    if (showToast) {
      showToast(
        `Senate clearance granted for ${courseCode}. Results officially published to student portals.`,
        'success'
      );
    }
  };

  return (
    <div className="space-y-6" id="senate-ratification-desk">
      {/* Statutory Header Card */}
      <Card className="border border-emerald-300 dark:border-emerald-800 bg-gradient-to-r from-emerald-950 via-[#064e3b] to-emerald-900 text-white rounded-2xl shadow-md overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-white/10 border border-white/20 text-emerald-300 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Statutory Academic Governance
                </span>
                <Badge variant="outline" className="border-emerald-400 text-emerald-200 text-2xs">
                  Senate Ratification Portal
                </Badge>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                University Senate Examination Council Ratification Panel
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
                As mandated by statutory university regulations (NUC Guidelines), examination broadsheets vetted and recommended by Departmental Boards (chaired by HODs / Chief Examiners) must be formally ratified by the University Senate before public release to student portals.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                size="lg"
                disabled={pendingSenateCourses.length === 0 || isProcessing}
                onClick={handleRatifyAll}
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold shadow-lg gap-2 text-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                <span>Ratify All ({pendingSenateCourses.length}) & Authorize Release</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Awaiting Senate Ratification
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {pendingSenateCourses.length} Courses
              </h3>
              <p className="text-2xs text-amber-600 dark:text-amber-400 font-medium">
                {totalCandidatesAwaitingSenate} student grades endorsed by HODs
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Officially Published Courses
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {publishedCourses.length} Courses
              </h3>
              <p className="text-2xs text-emerald-600 dark:text-emerald-400 font-medium">
                Live on student statements & slips
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Departmental Endorsement
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {departments.length} Depts
              </h3>
              <p className="text-2xs text-slate-400 font-medium">
                Vetted by Departmental Boards
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Table of Courses Awaiting Ratification */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Departmentally Endorsed Broadsheets Awaiting Senate Ratification
            </h3>
            <p className="text-2xs text-slate-500 dark:text-slate-400">
              These courses have been verified by the respective Head of Department and recommended to Senate.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="text-xs h-8 px-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Course Code & Title</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Lead Lecturer</th>
                <th className="py-2.5 px-3 text-center">Enrolled</th>
                <th className="py-2.5 px-3 text-center">Mean Score</th>
                <th className="py-2.5 px-3 text-center">Pass Rate</th>
                <th className="py-2.5 px-3 text-center">Board Vetting Status</th>
                <th className="py-2.5 px-3 text-right">Senate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pendingSenateCourses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
                      {c.code}
                    </div>
                    <div className="text-2xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                      {c.title} • {c.creditUnits} Units ({c.level}L)
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                    {c.department}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    {c.lecturerName}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                    {c.approvedCount} / {c.totalEnrolled}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-800 dark:text-slate-200">
                    {c.mean}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge variant={c.passRate >= 70 ? 'success' : c.passRate >= 45 ? 'default' : 'warning'}>
                      {c.passRate}% Pass
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                      <Clock className="w-3 h-3 text-amber-600" />
                      HOD Endorsed
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      size="sm"
                      onClick={() => handleRatifySingle(c.id, c.code)}
                      className="h-7 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-semibold cursor-pointer shadow-xs gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Ratify Release
                    </Button>
                  </td>
                </tr>
              ))}

              {pendingSenateCourses.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      All Departmentally Endorsed Broadsheets Have Been Ratified!
                    </p>
                    <p className="text-2xs text-slate-500 mt-1">
                      No courses are currently pending Senate Examination Council clearance.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
