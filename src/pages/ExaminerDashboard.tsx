import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/db';
import { useSearchParams } from 'react-router-dom';
import {
  PendingResultsTable,
  DepartmentStudentsTable,
  PublishedResultsTable,
  DepartmentCoursesTable,
} from '../components/examiner';
import { Course, User } from '../types';

export const ExaminerDashboard = () => {
  const { user } = useAuth();
  const [coursesWithResults, setCoursesWithResults] = useState<any[]>([]);
  const [departmentStudents, setDepartmentStudents] = useState<User[]>([]);
  const [departmentCourses, setDepartmentCourses] = useState<any[]>([]);
  const [lecturers, setLecturers] = useState<User[]>([]);
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'pending';
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(() => {
    if (!user) return;

    const allCourses = db.from('courses').select();
    const allResults = db.from('results').select();
    const allEnrollments = db.from('enrollments').select();
    const allUsers = db.from('users').select();

    const students = allUsers.filter(u => u.role === 'Student' && u.department === user.department);
    setDepartmentStudents(students);

    const faculty = allUsers.filter(u => u.role === 'Lecturer' || u.role === 'Chief Examiner');
    setLecturers(faculty);

    const deptStudentIds = new Set(students.map(s => s.id));

    // Group all courses with detailed results and enrollment metrics
    const grouped = allCourses.map(course => {
      // Find all enrollments for this course
      const courseEnrollments = allEnrollments.filter(e => e.courseId === course.id);
      
      // Filter enrollments relevant to this department's student body or course department
      const relevantEnrollments = course.department === user.department
        ? courseEnrollments
        : courseEnrollments.filter(e => deptStudentIds.has(e.studentId));

      const detailedResults = relevantEnrollments.map(e => {
        const result = allResults.find(r => r.enrollmentId === e.id);
        const student = allUsers.find(u => u.id === e.studentId);
        return { enrollment: e, result, student };
      });
      
      const submittedCount = detailedResults.filter(r => r.result?.status === 'Submitted' || r.result?.status === 'Published').length;
      const publishedCount = detailedResults.filter(r => r.result?.status === 'Published').length;
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
        hasPendingReview: detailedResults.some(r => r.result?.status === 'Submitted'),
        isFullyPublished: publishedCount === totalEnrolled && totalEnrolled > 0
      };
    });

    // Courses for moderation (Pending / Published)
    const moderationCourses = grouped.filter(c => c.totalEnrolled > 0 && (c.isCore || c.isTakenByDeptStudents));
    setCoursesWithResults(moderationCourses);

    // Department Courses (Both Core CSC courses and Borrowed courses taken by department students)
    const deptAndBorrowedCourses = grouped.filter(c => c.isCore || c.isTakenByDeptStudents);
    setDepartmentCourses(deptAndBorrowedCourses);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (!user) return null;

  const handleApprove = (courseId: string) => {
    const allEnrollments = db.from('enrollments').select();
    const courseEnrollments = allEnrollments.filter(e => e.courseId === courseId);
    
    courseEnrollments.forEach(e => {
      const res = db.from('results').select().find(r => r.enrollmentId === e.id);
      if (res && res.status !== 'Published') {
        db.from('results').update(res.id, { 
          status: 'Published', 
          lastUpdated: new Date().toISOString() 
        });
      }
    });

    loadData();
  };

  const handleReject = (courseId: string) => {
    const allEnrollments = db.from('enrollments').select();
    const courseEnrollments = allEnrollments.filter(e => e.courseId === courseId);
    
    courseEnrollments.forEach(e => {
      const res = db.from('results').select().find(r => r.enrollmentId === e.id);
      if (res) {
        db.from('results').update(res.id, { 
          status: 'Draft', 
          lastUpdated: new Date().toISOString() 
        });
      }
    });

    loadData();
  };

  const handleSaveCourse = (courseData: Partial<Course>) => {
    if (courseData.id) {
      db.from('courses').update(courseData.id, courseData);
    } else {
      const newCourseId = `c_${(courseData.code || 'course').toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now()}`;
      db.from('courses').insert({
        ...courseData,
        id: newCourseId,
        department: courseData.department || user.department,
        college: courseData.college || 'Science',
        creditUnits: courseData.creditUnits || 2,
        level: courseData.level || 100,
        semester: courseData.semester || 1,
      });
    }
    loadData();
  };

  const pendingCourses = coursesWithResults.filter(c => !c.isFullyPublished);
  const publishedCourses = coursesWithResults.filter(c => c.isFullyPublished);

  const filteredStudents = departmentStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.matricNumber && s.matricNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#064e3b] tracking-tight">Chief Examiner Portal</h1>
          <p className="text-slate-500 text-sm mt-0.5">Academic moderation, curriculum registry, and result validation for Department of {user.department}</p>
        </div>
      </div>

      {activeTab === 'pending' && (
        <PendingResultsTable
          pendingCourses={pendingCourses}
          lecturers={lecturers}
          onApprove={handleApprove}
          onReject={handleReject}
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

      {activeTab === 'published' && (
        <PublishedResultsTable 
          publishedCourses={publishedCourses} 
          lecturers={lecturers}
        />
      )}
    </div>
  );
};
