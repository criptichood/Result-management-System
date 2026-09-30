import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/db';
import { useSearchParams } from 'react-router-dom';
import { Course } from '../types';
import {
  LecturerCourseList,
  LecturerGradingTab,
  LecturerClassListTab,
  LecturerAnalyticsTab,
  LecturerCsvUploadModal,
} from '../components/lecturer';
import { ExaminerDisputeQueue } from '../components/examiner';
import {
  CheckCircle2,
  Info,
  ClipboardList,
  Users,
  LineChart,
  FileQuestion,
  Download,
  Upload,
} from 'lucide-react';
import { Button } from '../components/ui/button';

export const LecturerDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [scores, setScores] = useState<Record<string, { ca: string; exam: string }>>({});
  const [settings, setSettings] = useState({ lecturerViewEmail: false, lecturerViewPhone: false });
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'grading';

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const loadCourseData = (course: Course) => {
    setSelectedCourse(course);
    const enrollments = db.from('enrollments').select().filter((e) => e.courseId === course.id);
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

  useEffect(() => {
    if (user) {
      const refresh = () => {
        const lecturerCourses = db.getLecturerCourses(user.id);
        setCourses(lecturerCourses);
        if (selectedCourse) {
          const fresh = lecturerCourses.find((c) => c.id === selectedCourse.id);
          if (fresh) loadCourseData(fresh);
        } else if (lecturerCourses.length > 0) {
          loadCourseData(lecturerCourses[0]);
        }
        setSettings(db.getSettings());
      };
      refresh();
      const unsubscribe = db.subscribe(refresh);
      return () => unsubscribe();
    }
  }, [user]);

  const handleSelectCourse = (course: Course) => {
    loadCourseData(course);
  };

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
    db.saveCourseScores(selectedCourse.id, scores, user.id, 'Submitted');
    loadCourseData(selectedCourse);
    showNotification(`Results for ${selectedCourse.code} submitted to Chief Examiner for moderation.`);
  };

  const handleApplyCsvScores = (
    importedScores: Record<string, { ca: string; exam: string }>,
    autoSubmit: boolean = false
  ) => {
    if (!selectedCourse || !user) return;
    const merged = { ...scores, ...importedScores };
    setScores(merged);
    const newStatus = autoSubmit ? 'Submitted' : 'Draft';
    db.saveCourseScores(selectedCourse.id, merged, user.id, newStatus);
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
    // Pre-populated official Class Roster omitting confidential email/phone and providing CA (40) & Exam (60)
    const headers = [
      'S/N',
      'Matric Number',
      'Student Name',
      'Department',
      'Level',
      'CA Score (40)',
      'Exam Score (60)',
      'Total (100)',
      'Grade',
    ];
    const rows = students.map((s, idx) => {
      const caVal = scores[s.enrollmentId]?.ca || '';
      const examVal = scores[s.enrollmentId]?.exam || '';
      const hasScore = caVal !== '' || examVal !== '';
      const ca = parseFloat(caVal) || 0;
      const exam = parseFloat(examVal) || 0;
      const total = hasScore ? ca + exam : '';
      const grade = hasScore ? calculateGrade(Number(total)) : '';
      return [
        idx + 1,
        `"${s.student?.matricNumber || ''}"`,
        `"${s.student?.name || ''}"`,
        `"${s.student?.department || selectedCourse.department}"`,
        s.student?.level || selectedCourse.level,
        caVal,
        examVal,
        total,
        grade,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedCourse.code}_Class_Grading_Roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    <div id="lecturer-dashboard-page" className="p-4 sm:p-8 max-w-6xl mx-auto w-full">
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

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#064e3b] dark:text-emerald-400 tracking-tight">Lecturer Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {user.name} • Dept. of {user.department || 'Computer Science'} ({user.staffId || 'Staff'})
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <LecturerCourseList
          courses={courses}
          selectedCourse={selectedCourse}
          onSelectCourse={handleSelectCourse}
        />

        <div className="lg:col-span-3 space-y-4">
          {/* In-Page Sub-Navigation Tab Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1">
              <button
                onClick={() => setSearchParams({ tab: 'grading' })}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'grading'
                    ? 'bg-[#064e3b] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Grading Sheet</span>
                {students.length > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeTab === 'grading'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {students.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setSearchParams({ tab: 'class-list' })}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'class-list'
                    ? 'bg-[#064e3b] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Class Roster</span>
              </button>

              <button
                onClick={() => setSearchParams({ tab: 'analytics' })}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-[#064e3b] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <LineChart className="w-4 h-4" />
                <span>Cohort Analytics</span>
              </button>

              <button
                onClick={() => setSearchParams({ tab: 'disputes' })}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'disputes'
                    ? 'bg-[#064e3b] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileQuestion className="w-4 h-4" />
                <span>Grade Queries</span>
              </button>
            </div>

            {selectedCourse && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadCSV}
                  className="text-xs gap-1.5 h-8 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  title="Download pre-populated class roster CSV (CA & Exam)"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Export Roster</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsCsvModalOpen(true)}
                  className="text-xs gap-1.5 h-8 bg-[#059669] hover:bg-emerald-700 text-white font-medium shadow-xs"
                  title="Upload completed scores for automated grading"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import Results</span>
                </Button>
              </div>
            )}
          </div>

          {activeTab === 'grading' && (
            <LecturerGradingTab
              selectedCourse={selectedCourse}
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

          {activeTab === 'class-list' && (
            <LecturerClassListTab
              selectedCourse={selectedCourse}
              students={students}
              settings={settings}
              scores={scores}
              calculateGrade={calculateGrade}
              onOpenCsvModal={() => setIsCsvModalOpen(true)}
            />
          )}

          {activeTab === 'analytics' && (
            <LecturerAnalyticsTab
              selectedCourse={selectedCourse}
              totalEnrolled={students.length}
              analytics={analytics}
            />
          )}

          {activeTab === 'disputes' && (
            <ExaminerDisputeQueue
              currentUser={user}
              onRefresh={() => {
                if (selectedCourse) loadCourseData(selectedCourse);
              }}
            />
          )}

          {/* Global CSV Upload Modal accessible from toolbar and class-list */}
          <LecturerCsvUploadModal
            isOpen={isCsvModalOpen}
            onClose={() => setIsCsvModalOpen(false)}
            selectedCourse={selectedCourse}
            students={students}
            onApplyScores={handleApplyCsvScores}
          />
        </div>
      </div>
    </div>
  );
};
