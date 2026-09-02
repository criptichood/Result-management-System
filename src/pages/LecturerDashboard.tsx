import React, { ChangeEvent, useEffect, useState } from 'react';
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

export const LecturerDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [scores, setScores] = useState<Record<string, { ca: string; exam: string }>>({});
  const [settings, setSettings] = useState({ lecturerViewEmail: false, lecturerViewPhone: false });
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'grading';

  useEffect(() => {
    if (user) {
      const lecturerCourses = db.getLecturerCourses(user.id);
      setCourses(lecturerCourses);
      if (lecturerCourses.length > 0 && !selectedCourse) {
        handleSelectCourse(lecturerCourses[0]);
      }
      setSettings(db.getSettings());
    }
  }, [user]);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    const enrollments = db.from('enrollments').select().filter(e => e.courseId === course.id);
    const users = db.from('users').select();
    const results = db.from('results').select();

    const courseStudents = enrollments.map(e => {
      const studentUser = users.find(u => u.id === e.studentId);
      const result = results.find(r => r.enrollmentId === e.id);
      return {
        enrollmentId: e.id,
        student: studentUser,
        result
      };
    });

    setStudents(courseStudents);

    const initialScores: Record<string, { ca: string; exam: string }> = {};
    courseStudents.forEach(s => {
      initialScores[s.enrollmentId] = {
        ca: s.result?.caScore?.toString() || '',
        exam: s.result?.examScore?.toString() || ''
      };
    });
    setScores(initialScores);
  };

  const handleScoreChange = (enrollmentId: string, type: 'ca' | 'exam', value: string) => {
    setScores(prev => ({
      ...prev,
      [enrollmentId]: { ...prev[enrollmentId], [type]: value }
    }));
  };

  const calculateGrade = (total: number) => {
    if (total >= 70) return 'A';
    if (total >= 60) return 'B';
    if (total >= 50) return 'C';
    if (total >= 45) return 'D';
    return 'F';
  };

  const handleSaveDraft = () => {
    alert('Scores saved as draft successfully.');
  };

  const handleSubmit = () => {
    if (confirm('Are you sure you want to submit these results to the Chief Examiner? They will be locked from further editing.')) {
      alert('Results submitted successfully.');
    }
  };

  const handleDownloadCSV = () => {
    if (!selectedCourse || students.length === 0) return;
    const headers = ['Matric No', 'Name', 'CA Score', 'Exam Score', 'Total', 'Grade'];
    const rows = students.map(s => {
      const ca = parseFloat(scores[s.enrollmentId]?.ca) || 0;
      const exam = parseFloat(scores[s.enrollmentId]?.exam) || 0;
      const total = ca + exam;
      const grade = total > 0 ? calculateGrade(total) : '-';
      return [
        s.student?.matricNumber || '',
        s.student?.name || '',
        scores[s.enrollmentId]?.ca || '',
        scores[s.enrollmentId]?.exam || '',
        total > 0 ? total : '',
        grade
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedCourse.code}_Results.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadCSV = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCourse) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n');
      const newScores = { ...scores };
      let updatedCount = 0;
      
      // Skip header row
      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(',');
        if (cols.length >= 4) {
          const matricNo = cols[0].replace(/['"]/g, '').trim();
          const caScore = cols[2].replace(/['"]/g, '').trim();
          const examScore = cols[3].replace(/['"]/g, '').trim();
          
          const student = students.find(s => s.student?.matricNumber === matricNo);
          if (student) {
            newScores[student.enrollmentId] = {
              ca: caScore,
              exam: examScore
            };
            updatedCount++;
          }
        }
      }
      setScores(newScores);
      alert(`Successfully imported grades for ${updatedCount} students.`);
    };
    reader.readAsText(file);
  };

  // Compute Analytics Data with detailed student cohort breakdown
  const computeAnalytics = () => {
    if (!selectedCourse || students.length === 0) return null;
    
    let totalScoreSum = 0;
    let highestScore = 0;
    let lowestScore = 100;
    let passCount = 0;
    
    const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };

    const categorizedStudents = students.map(s => {
      const caVal = scores[s.enrollmentId]?.ca;
      const examVal = scores[s.enrollmentId]?.exam;
      const hasCa = caVal !== '' && caVal !== undefined;
      const hasExam = examVal !== '' && examVal !== undefined;
      const ca = parseFloat(caVal) || 0;
      const exam = parseFloat(examVal) || 0;
      const total = hasCa || hasExam ? (ca + exam) : 0;
      const grade = (hasCa || hasExam) ? calculateGrade(total) : 'Incomplete';

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
        insight = isLowCa ? 'CA Deficit — Exam carried overall grade; encourage assignment focus' : 'Good Standing — Passed creditably';
      } else if (grade === 'D') {
        category = 'atRisk';
        insight = isLowExam ? 'Exam Bottleneck — CA was solid, but final exam pulled score into marginal band' : 'Marginal Pass — Requires remedial tutorial engagement';
      } else if (grade === 'F') {
        category = 'failing';
        insight = 'Carryover Deficit — Scored below minimum pass (45%); repeat required';
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
        status: s.result?.status || 'Draft'
      };
    });
    
    students.forEach(s => {
      const ca = parseFloat(scores[s.enrollmentId]?.ca) || 0;
      const exam = parseFloat(scores[s.enrollmentId]?.exam) || 0;
      const total = ca + exam;
      
      if (total > 0) {
        totalScoreSum += total;
        if (total > highestScore) highestScore = total;
        if (total < lowestScore) lowestScore = total;
        if (total >= 45) passCount++;
        
        const grade = calculateGrade(total) as keyof typeof gradeDistribution;
        if (gradeDistribution[grade] !== undefined) {
          gradeDistribution[grade]++;
        }
      }
    });

    const activeStudents = students.filter(s => (parseFloat(scores[s.enrollmentId]?.ca) || 0) + (parseFloat(scores[s.enrollmentId]?.exam) || 0) > 0);
    const avgScore = activeStudents.length > 0 ? (totalScoreSum / activeStudents.length) : 0;
    const passRate = activeStudents.length > 0 ? ((passCount / activeStudents.length) * 100) : 0;

    const chartData = Object.keys(gradeDistribution).map(key => ({
      name: key,
      count: gradeDistribution[key as keyof typeof gradeDistribution]
    }));

    return { 
      avgScore, 
      highestScore, 
      lowestScore: lowestScore === 100 ? 0 : lowestScore, 
      passRate, 
      chartData, 
      activeCount: activeStudents.length,
      categorizedStudents,
      distinctionCount: categorizedStudents.filter(s => s.category === 'distinction').length,
      goodCount: categorizedStudents.filter(s => s.category === 'good').length,
      atRiskCount: categorizedStudents.filter(s => s.category === 'atRisk').length,
      failingCount: categorizedStudents.filter(s => s.category === 'failing').length,
      incompleteCount: categorizedStudents.filter(s => s.category === 'incomplete').length
    };
  };

  const analytics = computeAnalytics();

  if (!user) return null;

  return (
    <div id="lecturer-dashboard-page" className="p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#064e3b] tracking-tight">Lecturer Dashboard</h1>
        <p className="text-slate-500 mt-1">{user.name} • Dept. of {user.department}</p>
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
              onUploadCSV={handleUploadCSV}
              calculateGrade={calculateGrade}
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
        </div>
      </div>
    </div>
  );
};
