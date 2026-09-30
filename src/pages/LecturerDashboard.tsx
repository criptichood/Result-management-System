import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/db';
import { useSearchParams } from 'react-router-dom';
import { Course } from '../types';
import { LecturerCourseOffering } from '../lib/dbStudentCourses';
import {
  LecturerTabHeader,
  LecturerCourseArchive,
  LecturerCourseSwitcher,
  LecturerGradingTab,
  LecturerClassListTab,
  LecturerAnalyticsTab,
  LecturerCsvUploadModal,
} from '../components/lecturer';
import {
  getLecturerTab,
  getLecturerTabId,
  type LecturerTabId,
} from '../components/lecturer/lecturerTabs';
import { ExaminerDisputeQueue } from '../components/examiner';
import { buildGradingRosterCsv, downloadRosterCsv } from '../lib/gradingRosterCsv';
import { CheckCircle2, Info } from 'lucide-react';

export const LecturerDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<LecturerCourseOffering[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<LecturerCourseOffering | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [scores, setScores] = useState<Record<string, { ca: string; exam: string }>>({});
  const [settings, setSettings] = useState({ lecturerViewEmail: false, lecturerViewPhone: false });
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = getLecturerTabId(searchParams.get('tab'));
  const activeTabConfig = getLecturerTab(activeTabId);

  const handleSelectTab = (tab: LecturerTabId) => {
    setSearchParams({ tab });
  };

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const loadCourseData = (course: LecturerCourseOffering) => {
    setSelectedCourse(course);
    // Only the cohort enrolled in this course's resolved session belongs on
    // this sheet — a catalog course is reused by every cohort that ever took it.
    const enrollments = db
      .from('enrollments')
      .select()
      .filter((e) => e.courseId === course.id && e.academicYear === course.session);
    const users = db.from('users').select();
    const results = db.from('results').select();

    const courseStudents = enrollments.map((e) => {
      const studentUser = users.find((u) => u.id === e.studentId);
      const result = results.find((r) => r.enrollmentId === e.id);
      return {
        enrollmentId: e.id,
        student: studentUser,
        result,
      };
    });

    setStudents(courseStudents);

    const initialScores: Record<string, { ca: string; exam: string }> = {};
    courseStudents.forEach((s) => {
      initialScores[s.enrollmentId] = {
        ca: s.result?.caScore !== null && s.result?.caScore !== undefined ? s.result.caScore.toString() : '',
        exam: s.result?.examScore !== null && s.result?.examScore !== undefined ? s.result.examScore.toString() : '',
      };
    });
    setScores(initialScores);
  };

  /**
   * A lecturer should land on the course that needs them, not simply the first
   * one alphabetically: returned sheets first, then unscored drafts, then
   * whatever is left in the live session.
   */
  const pickDefaultCourse = (activeCourses: LecturerCourseOffering[]) => {
    if (activeCourses.length === 0) return null;
    const priority = { Rejected: 0, Draft: 1, Submitted: 2, Published: 3 };
    return [...activeCourses].sort(
      (a, b) => priority[a.submissionStatus] - priority[b.submissionStatus]
    )[0];
  };

  useEffect(() => {
    if (user) {
      const refresh = () => {
        const lecturerCourses = db.getLecturerCourses(user.id) as LecturerCourseOffering[];
        setCourses(lecturerCourses);

        const liveNow = lecturerCourses.filter((c) => c.isCurrentOffering);
        const selectable = liveNow.length > 0 ? liveNow : lecturerCourses;

        const stillSelectable = lecturerCourses.some((c) => c.id === selectedCourse?.id);
        if (selectedCourse && stillSelectable) {
          const fresh = lecturerCourses.find((c) => c.id === selectedCourse.id);
          if (fresh) loadCourseData(fresh);
        } else {
          const fallback = pickDefaultCourse(selectable);
          if (fallback) loadCourseData(fallback);
        }
        setSettings(db.getSettings());
      };
      refresh();
      const unsubscribe = db.subscribe(refresh);
      return () => unsubscribe();
    }
  }, [user]);

  const liveCourses = courses.filter((c) => c.isCurrentOffering);
  // A lecturer allocated a course before its cohort registers has nothing live
  // yet; fall back to the whole allocation so the page is not blank.
  const activeCourses = liveCourses.length > 0 ? liveCourses : courses;
  const pastOfferingCount = courses.reduce((n, c) => n + c.previousOfferings.length, 0);
  const currentSession = db.getSettings().currentSession || '2025/2026';

  const handleSelectCourse = (course: Course) => {
    const offering = courses.find((c) => c.id === course.id);
    if (offering) loadCourseData(offering);
  };

  // One picker, rendered either in the page header or inside the sheet that
  // owns it, depending on the tab. Built here so both placements stay identical.
  const courseSelectorNode = (
    <LecturerCourseSwitcher
      activeCourses={activeCourses}
      selectedCourse={selectedCourse}
      onSelectCourse={handleSelectCourse}
      currentSession={currentSession}
      archivedCount={pastOfferingCount}
      onOpenArchive={() => handleSelectTab('archive')}
    />
  );

  const handleScoreChange = (enrollmentId: string, type: 'ca' | 'exam', value: string) => {
    if (value === '') {
      setScores((prev) => ({
        ...prev,
        [enrollmentId]: { ...prev[enrollmentId], [type]: '' },
      }));
      return;
    }
    const maxVal = type === 'ca' ? 40 : 60;
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      // Clamped to 0-maxVal immediately so the text input cannot exceed the bounds
      const clamped = Math.min(maxVal, Math.max(0, parsed));
      setScores((prev) => ({
        ...prev,
        [enrollmentId]: { ...prev[enrollmentId], [type]: clamped.toString() },
      }));
    }
  };

  const calculateGrade = (total: number) => {
    if (total >= 70) return 'A';
    if (total >= 60) return 'B';
    if (total >= 50) return 'C';
    if (total >= 45) return 'D';
    if (total >= 40) return 'E';
    return 'F';
  };

  const handleSaveDraft = () => {
    if (!selectedCourse || !user) return;
    db.saveCourseScores(selectedCourse.id, scores, user.id, 'Draft');
    loadCourseData(selectedCourse);
    showNotification(`Draft scores saved for ${students.length} students in ${selectedCourse.code}.`, 'info');
  };

  const handleSubmit = () => {
    if (!selectedCourse || !user) return;
    const result = db.saveCourseScores(selectedCourse.id, scores, user.id, 'Submitted');
    if (!result.ok) {
      // Refused by the data layer. Should not be reachable from the button,
      // which is disabled on the same rule, but never report a false success.
      showNotification(result.reason || 'Submission refused: the sheet is incomplete.', 'info');
      return;
    }
    loadCourseData(selectedCourse);
    showNotification(`Results for ${selectedCourse.code} submitted to Chief Examiner for moderation.`);
  };

  const handleApplyCsvScores = (
    importedScores: Record<string, { ca: string; exam: string }>,
    autoSubmit: boolean = false
  ) => {
    if (!selectedCourse || !user) return;
    const merged = { ...scores, ...importedScores };
    const newStatus = autoSubmit ? 'Submitted' : 'Draft';
    const result = db.saveCourseScores(selectedCourse.id, merged, user.id, newStatus);

    if (!result.ok) {
      // A refused submission writes nothing. Land the same scores as a draft so
      // the lecturer keeps the work they just imported and can finish the rest.
      const asDraft = db.saveCourseScores(selectedCourse.id, merged, user.id, 'Draft');
      setScores(merged);
      loadCourseData(selectedCourse);
      showNotification(
        `${result.reason} ${asDraft.written} ${asDraft.written === 1 ? 'score was' : 'scores were'} saved as a draft instead.`,
        'info'
      );
      return;
    }

    setScores(merged);
    loadCourseData(selectedCourse);
    const count = Object.keys(importedScores).length;
    if (autoSubmit) {
      showNotification(`Successfully imported scores for ${count} students and submitted ${selectedCourse.code} to Chief Examiner for moderation!`, 'success');
    } else {
      showNotification(`Imported & saved draft scores for ${count} students from CSV for ${selectedCourse.code}.`);
    }
  };

  const handleDownloadCSV = () => {
    if (!selectedCourse || students.length === 0) return;
    // Totals and grades ship as live formulas, and the NUC grading key rides
    // alongside in extra columns. See src/lib/gradingRosterCsv.ts.
    const csv = buildGradingRosterCsv({
      course: selectedCourse,
      students,
      getScores: (enrollmentId) => ({
        ca: scores[enrollmentId]?.ca || '',
        exam: scores[enrollmentId]?.exam || '',
      }),
    });
    downloadRosterCsv(`${selectedCourse.code}_Class_Grading_Roster.csv`, csv);
  };

  // Compute Analytics Data with detailed student cohort breakdown
  const computeAnalytics = () => {
    if (!selectedCourse || students.length === 0) return null;

    let totalScoreSum = 0;
    let highestScore = 0;
    let lowestScore = 100;
    let passCount = 0;

    const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };

    const categorizedStudents = students.map((s) => {
      const caVal = scores[s.enrollmentId]?.ca;
      const examVal = scores[s.enrollmentId]?.exam;
      const hasCa = caVal !== '' && caVal !== undefined;
      const hasExam = examVal !== '' && examVal !== undefined;
      const ca = parseFloat(caVal) || 0;
      const exam = parseFloat(examVal) || 0;
      const total = hasCa || hasExam ? ca + exam : 0;
      const grade = hasCa || hasExam ? calculateGrade(total) : 'Incomplete';

      const isLowCa = hasCa && ca < 16;
      const isLowExam = hasExam && exam < 24;

      let category: 'distinction' | 'good' | 'atRisk' | 'failing' | 'incomplete' = 'incomplete';
      let insight = 'Score pending entry';

      if (grade === 'A') {
        category = 'distinction';
        insight = 'Distinction Level — Outstanding subject mastery & analytical depth';
      } else if (grade === 'B') {
        category = 'good';
        insight = 'Solid Performance — Strong overall comprehension across CA and Exam';
      } else if (grade === 'C') {
        category = 'good';
        insight = isLowCa ? 'CA Deficit — Exam carried overall grade' : 'Good Standing — Passed creditably';
      } else if (grade === 'D') {
        category = 'atRisk';
        insight = isLowExam ? 'Exam Deficit — CA was solid, but exam pulled score into marginal band' : 'Marginal Pass — Requires tutorial engagement';
      } else if (grade === 'E') {
        category = 'atRisk';
        insight = 'Pass (Warning) — Bare minimum pass threshold (40-44%); academic warning band';
      } else if (grade === 'F') {
        category = 'failing';
        insight = 'Carryover Deficit — Scored below minimum pass (40%); repeat required';
      }

      return {
        enrollmentId: s.enrollmentId,
        student: s.student,
        caScore: hasCa ? ca : null,
        examScore: hasExam ? exam : null,
        totalScore: hasCa || hasExam ? total : null,
        grade,
        category,
        isLowCa,
        isLowExam,
        insight,
        status: s.result?.status || 'Draft',
      };
    });

    students.forEach((s) => {
      const ca = parseFloat(scores[s.enrollmentId]?.ca) || 0;
      const exam = parseFloat(scores[s.enrollmentId]?.exam) || 0;
      const total = ca + exam;

      if (total > 0) {
        totalScoreSum += total;
        if (total > highestScore) highestScore = total;
        if (total < lowestScore) lowestScore = total;
        if (total >= 40) passCount++;

        const grade = calculateGrade(total) as keyof typeof gradeDistribution;
        if (gradeDistribution[grade] !== undefined) {
          gradeDistribution[grade]++;
        }
      }
    });

    const activeStudents = students.filter(
      (s) =>
        (parseFloat(scores[s.enrollmentId]?.ca) || 0) +
          (parseFloat(scores[s.enrollmentId]?.exam) || 0) >
        0
    );
    const avgScore = activeStudents.length > 0 ? totalScoreSum / activeStudents.length : 0;
    const passRate = activeStudents.length > 0 ? (passCount / activeStudents.length) * 100 : 0;

    const chartData = Object.keys(gradeDistribution).map((key) => ({
      name: key,
      count: gradeDistribution[key as keyof typeof gradeDistribution],
    }));

    return {
      avgScore,
      highestScore,
      lowestScore: lowestScore === 100 ? 0 : lowestScore,
      passRate,
      chartData,
      activeCount: activeStudents.length,
      categorizedStudents,
    };
  };

  const analytics = computeAnalytics();

  if (!user) return null;

  return (
    <div id="lecturer-dashboard-page" className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center justify-between shadow-sm transition-all border ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            )}
            <span className="text-sm font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Each tab brings its own heading; only the landing tab names the lecturer */}
      <div className="space-y-3">
        <LecturerTabHeader
          tab={activeTabConfig}
          identity={{
            name: user.name,
            department: user.department,
            staffId: user.staffId,
          }}
          selectedCourse={selectedCourse}
          activeCourses={activeCourses}
          archivedCount={pastOfferingCount}
          onSelectCourse={handleSelectCourse}
          onOpenArchive={() => handleSelectTab('archive')}
          currentSession={currentSession}
        />

        {activeTabId === 'grading' && (
          <LecturerGradingTab
            selectedCourse={selectedCourse}
            courseSelector={courseSelectorNode}
            students={students}
            scores={scores}
            onScoreChange={handleScoreChange}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            onDownloadCSV={handleDownloadCSV}
            onApplyCsvScores={handleApplyCsvScores}
            calculateGrade={calculateGrade}
            lecturerName={user.name}
          />
        )}

        {activeTabId === 'class-list' && (
          <LecturerClassListTab
            selectedCourse={selectedCourse}
            courseSelector={courseSelectorNode}
            students={students}
            settings={settings}
            scores={scores}
            calculateGrade={calculateGrade}
            onOpenCsvModal={() => setIsCsvModalOpen(true)}
          />
        )}

        {activeTabId === 'analytics' && (
          <LecturerAnalyticsTab
            selectedCourse={selectedCourse}
            totalEnrolled={students.length}
            analytics={analytics}
          />
        )}

        {activeTabId === 'disputes' && (
          <ExaminerDisputeQueue
            currentUser={user}
            onRefresh={() => {
              if (selectedCourse) loadCourseData(selectedCourse);
            }}
          />
        )}

        {activeTabId === 'archive' && (
          <LecturerCourseArchive courses={courses} currentSession={currentSession} />
        )}

        {/* Global CSV Upload Modal accessible from toolbar and class-list */}
        <LecturerCsvUploadModal
          isOpen={isCsvModalOpen}
          onClose={() => setIsCsvModalOpen(false)}
          selectedCourse={selectedCourse}
          students={students}
          draftScores={scores}
          onApplyScores={handleApplyCsvScores}
        />
      </div>
    </div>
  );
};
