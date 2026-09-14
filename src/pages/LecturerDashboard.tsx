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
} from '../components/lecturer';
import { ExaminerDisputeQueue } from '../components/examiner';
import { CheckCircle2, Info } from 'lucide-react';

export const LecturerDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [scores, setScores] = useState<Record<string, { ca: string; exam: string }>>({});
  const [settings, setSettings] = useState({ lecturerViewEmail: false, lecturerViewPhone: false });
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);
  const [searchParams] = useSearchParams();
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
    setScores((prev) => ({
      ...prev,
      [enrollmentId]: { ...prev[enrollmentId], [type]: value },
    }));
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

  const handleApplyCsvScores = (importedScores: Record<string, { ca: string; exam: string }>) => {
    if (!selectedCourse || !user) return;
    const merged = { ...scores, ...importedScores };
    setScores(merged);
    db.saveCourseScores(selectedCourse.id, merged, user.id, 'Draft');
    loadCourseData(selectedCourse);
    const count = Object.keys(importedScores).length;
    showNotification(`Imported & saved draft for ${count} students from CSV.`);
  };

  const handleDownloadCSV = () => {
    if (!selectedCourse || students.length === 0) return;
    const headers = ['Matric No', 'Student Name', 'CA Score (40)', 'Exam Score (60)', 'Total (100)', 'Grade'];
    const rows = students.map((s) => {
      const ca = parseFloat(scores[s.enrollmentId]?.ca) || 0;
      const exam = parseFloat(scores[s.enrollmentId]?.exam) || 0;
      const total = ca + exam;
      const hasScore = scores[s.enrollmentId]?.ca !== '' || scores[s.enrollmentId]?.exam !== '';
      const grade = hasScore ? calculateGrade(total) : '-';
      return [
        s.student?.matricNumber || '',
        s.student?.name || '',
        scores[s.enrollmentId]?.ca || '',
        scores[s.enrollmentId]?.exam || '',
        hasScore ? total : '',
        grade,
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedCourse.code}_ScoreSheet.csv`);
    link.style.visibility = 'hidden';
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
        insight = 'Narrow Pass — Bare minimum threshold met (40%)';
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

        <div className="lg:col-span-3">
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
        </div>
      </div>
    </div>
  );
};
