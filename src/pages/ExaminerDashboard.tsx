import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/db';
import { useSearchParams } from 'react-router-dom';
import {
  PendingResultsTable,
  DepartmentStudentsTable,
  PublishedResultsTable,
  DepartmentCoursesTable,
  ExaminerBroadSheetModal,
  ExaminerAuditTrailModal,
  ExaminerDisputeQueue,
} from '../components/examiner';
import { AdminSenateAnalyticsTab } from '../components/admin';
import { Course, User, ModerationLog, Department, Enrollment, Result } from '../types';
import { Button } from '../components/ui/button';
import { FileSpreadsheet, CheckCircle2, Info, History } from 'lucide-react';

export const ExaminerDashboard = () => {
  const { user } = useAuth();
  const [coursesWithResults, setCoursesWithResults] = useState<any[]>([]);
  const [departmentStudents, setDepartmentStudents] = useState<User[]>([]);
  const [departmentCourses, setDepartmentCourses] = useState<any[]>([]);
  const [lecturers, setLecturers] = useState<User[]>([]);
  const [moderationLogs, setModerationLogs] = useState<ModerationLog[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [allEnrollments, setAllEnrollments] = useState<Enrollment[]>([]);
  const [allResults, setAllResults] = useState<Result[]>([]);
  const [settings, setSettings] = useState<any>({ currentSession: '2024/2025', currentSemester: 1 });
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'pending';
  const [searchQuery, setSearchQuery] = useState('');
  const [isBroadSheetOpen, setIsBroadSheetOpen] = useState(false);
  const [isAuditTrailOpen, setIsAuditTrailOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const loadData = useCallback(() => {
    if (!user) return;

    const allCourses = db.from('courses').select();
    const allResults = db.from('results').select();
    const allEnrollments = db.from('enrollments').select();
    const allUsers = db.from('users').select();
    const allDepts = db.from('departments').select();
    const appSettings = db.getSettings();
    const logs = db.getModerationLogs();
    setModerationLogs(logs);
    setAllUsers(allUsers);
    setAllCourses(allCourses);
    setDepartments(allDepts);
    setAllEnrollments(allEnrollments);
    setAllResults(allResults);
    setSettings(appSettings);

    const students = allUsers.filter(
      (u) => u.role === 'Student' && u.department === user.department
    );
    setDepartmentStudents(students);

    const faculty = allUsers.filter(
      (u) => u.role === 'Lecturer' || u.role === 'Chief Examiner'
    );
    setLecturers(faculty);

    const deptStudentIds = new Set(students.map((s) => s.id));

    // Group all courses with detailed results and enrollment metrics
    const grouped = allCourses.map((course) => {
      const courseEnrollments = allEnrollments.filter((e) => e.courseId === course.id);

      const relevantEnrollments =
        course.department === user.department
          ? courseEnrollments
          : courseEnrollments.filter((e) => deptStudentIds.has(e.studentId));

      const detailedResults = relevantEnrollments.map((e) => {
        const result = allResults.find((r) => r.enrollmentId === e.id);
        const student = allUsers.find((u) => u.id === e.studentId);
        return { enrollment: e, result, student };
      });

      const submittedCount = detailedResults.filter(
        (r) => r.result?.status === 'Submitted' || r.result?.status === 'Published'
      ).length;
      const publishedCount = detailedResults.filter(
        (r) => r.result?.status === 'Published'
      ).length;
      const totalEnrolled = relevantEnrollments.length;

      const isCore = course.department === user.department;
      const isTakenByDeptStudents = relevantEnrollments.length > 0;

      return {
        ...course,
        detailedResults,
        submittedCount,
        publishedCount,
        totalEnrolled,
        isCore,
        isTakenByDeptStudents,
        hasPendingReview: detailedResults.some((r) => r.result?.status === 'Submitted'),
        isFullyPublished: publishedCount === totalEnrolled && totalEnrolled > 0,
      };
    });

    const moderationCourses = grouped.filter(
      (c) => c.totalEnrolled > 0 && (c.isCore || c.isTakenByDeptStudents)
    );
    setCoursesWithResults(moderationCourses);

    const deptAndBorrowedCourses = grouped.filter(
      (c) => c.isCore || c.isTakenByDeptStudents
    );
    setDepartmentCourses(deptAndBorrowedCourses);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!user) return null;

  const handleApprove = (courseId: string) => {
    db.moderateCourse(courseId, 'approve', undefined, user);
    loadData();
    const course = coursesWithResults.find((c) => c.id === courseId);
    showNotification(
      `Results for ${course?.code || 'course'} successfully published to student portals.`
    );
  };

  const handleReject = (courseId: string, notes?: string) => {
    db.moderateCourse(courseId, 'reject', notes, user);
    loadData();
    const course = coursesWithResults.find((c) => c.id === courseId);
    showNotification(
      `Results for ${course?.code || 'course'} returned to lecturer with revision feedback.`,
      'info'
    );
  };

  const handleBatchModerate = (
    courseIds: string[],
    action: 'approve' | 'reject',
    notes?: string
  ) => {
    db.batchModerateCourses(courseIds, action, notes, user);
    loadData();
    showNotification(
      action === 'approve'
        ? `Successfully approved and published ${courseIds.length} course batches to student portals.`
        : `Returned ${courseIds.length} course batches for lecturer revision.`,
      action === 'approve' ? 'success' : 'info'
    );
  };

  const handleSaveCourse = (courseData: Partial<Course>) => {
    if (courseData.id) {
      db.from('courses').update(courseData.id, courseData);
      showNotification(`Updated course ${courseData.code}.`);
    } else {
      const newCourseId = `c_${(courseData.code || 'course')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')}_${Date.now()}`;
      db.from('courses').insert({
        ...courseData,
        id: newCourseId,
        department: courseData.department || user.department,
        college: courseData.college || 'Science',
        creditUnits: courseData.creditUnits || 2,
        level: courseData.level || 100,
        semester: courseData.semester || 1,
      });
      showNotification(`Created course ${courseData.code}.`);
    }
    loadData();
  };

  const pendingCourses = coursesWithResults.filter((c) => !c.isFullyPublished);
  const publishedCourses = coursesWithResults.filter((c) => c.isFullyPublished);

  const filteredStudents = departmentStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.matricNumber && s.matricNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between shadow-xs transition-all border ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            )}
            <span className="text-sm font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#064e3b] dark:text-emerald-400 tracking-tight">
            Chief Examiner Portal
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
            Academic moderation, curriculum registry, and result validation for Dept. of {user.department}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            onClick={() => setIsAuditTrailOpen(true)}
            className="gap-1.5 text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
          >
            <History className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Audit Trail ({moderationLogs.length})
          </Button>
          <Button
            onClick={() => setIsBroadSheetOpen(true)}
            className="gap-2 bg-[#064e3b] hover:bg-[#053d2e] text-white text-xs shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" /> Senate Master Broad Sheet
          </Button>
        </div>
      </div>

      {activeTab === 'pending' && (
        <PendingResultsTable
          pendingCourses={pendingCourses}
          lecturers={lecturers}
          examiner={user}
          onApprove={handleApprove}
          onReject={handleReject}
          onBatchModerate={handleBatchModerate}
          onOpenAuditTrail={() => setIsAuditTrailOpen(true)}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'disputes' && (
        <ExaminerDisputeQueue
          currentUser={user}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'courses' && (
        <DepartmentCoursesTable
          department={user.department || 'Computer Science'}
          departmentCourses={departmentCourses}
          lecturers={lecturers}
          onSaveCourse={handleSaveCourse}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {activeTab === 'students' && (
        <DepartmentStudentsTable
          department={user.department || 'Computer Science'}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredStudents={filteredStudents}
        />
      )}

      {activeTab === 'broadsheet' && (
        <AdminSenateAnalyticsTab
          users={allUsers}
          courses={allCourses}
          departments={departments}
          enrollments={allEnrollments}
          results={allResults}
          session={settings.currentSession}
          semester={settings.currentSemester}
        />
      )}

      {activeTab === 'published' && (
        <PublishedResultsTable
          publishedCourses={publishedCourses}
          lecturers={lecturers}
        />
      )}

      {/* Senate Master Broad Sheet Modal */}
      <ExaminerBroadSheetModal
        isOpen={isBroadSheetOpen}
        onClose={() => setIsBroadSheetOpen(false)}
        departmentName={user.department || 'Computer Science'}
      />

      {/* Immutable Moderation Audit Trail Modal */}
      <ExaminerAuditTrailModal
        isOpen={isAuditTrailOpen}
        onOpenChange={setIsAuditTrailOpen}
        logs={moderationLogs}
        departmentName={user.department || 'Computer Science'}
      />
    </div>
  );
};
