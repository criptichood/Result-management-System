import { Course, Department, Enrollment, GradeDispute, ModerationLog, Result, User } from '../types';
import { mockCourses, mockDepartments, mockEnrollments, mockResults, mockUsers } from './mockData';

export const DB_KEY = 'fuaz_srms_db_v15';

export interface DBState {
  users: User[];
  courses: Course[];
  departments: Department[];
  enrollments: Enrollment[];
  results: Result[];
  moderationLogs: ModerationLog[];
  disputes: GradeDispute[];
  settings: {
    lecturerViewEmail: boolean;
    lecturerViewPhone: boolean;
    courseRegistrationOpen: boolean;
    currentSession: string;
    currentSemester: 1 | 2;
  };
}

export function createInitialDBState(): DBState {
  return {
    users: mockUsers,
    courses: mockCourses,
    departments: mockDepartments,
    enrollments: mockEnrollments,
    results: mockResults,
    moderationLogs: [
      {
        id: 'ml_init_1',
        courseId: 'c1',
        courseCode: 'CSC101',
        examinerId: 'u2',
        examinerName: 'Dr. Aliyu Mohammed',
        action: 'Approved',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        notes: 'All 40 CA and 60 Exam scores verified against physical examination scripts.',
        affectedStudentCount: 5,
      },
    ],
    disputes: [
      {
        id: 'disp_1',
        studentId: 'u5',
        studentName: 'Jeremiah Dantani',
        matricNumber: 'UG/2021/02/03/045',
        courseId: 'c1',
        courseCode: 'CSC101',
        courseTitle: 'Introduction to Computer Science',
        lecturerId: 'u2',
        category: 'Missing CA Score',
        description:
          'My CA score reflects 18/40 instead of the 34/40 achieved in the midterm project presentation.',
        requestedScoreType: 'CA',
        originalCa: 18,
        originalExam: 42,
        originalTotal: 60,
        status: 'Under Investigation',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
    settings: {
      lecturerViewEmail: false,
      lecturerViewPhone: false,
      courseRegistrationOpen: true,
      currentSession: '2025/2026',
      currentSemester: 1,
    },
  };
}

export function loadAndMigrateDBState(): DBState {
  const stored = localStorage.getItem(DB_KEY);
  if (stored) {
    try {
      const parsed: DBState = JSON.parse(stored);
      if (!parsed.departments) {
        parsed.departments = mockDepartments;
      } else {
        const existingDeptCodes = new Set(parsed.departments.map((d) => d.code));
        const missingDepts = mockDepartments.filter((d) => !existingDeptCodes.has(d.code));
        if (missingDepts.length > 0) {
          parsed.departments = [...parsed.departments, ...missingDepts];
        }
      }

      if (!parsed.moderationLogs) {
        parsed.moderationLogs = [
          {
            id: 'ml_init_1',
            courseId: 'c1',
            courseCode: 'CSC101',
            examinerId: 'u2',
            examinerName: 'Dr. Aliyu Mohammed',
            action: 'Approved',
            timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
            notes: 'All 40 CA and 60 Exam scores verified against physical examination scripts.',
            affectedStudentCount: 5,
          },
        ];
      }

      const existingCourseCodes = new Set(parsed.courses.map((c) => c.code));
      const missingCourses = mockCourses.filter((c) => !existingCourseCodes.has(c.code));
      if (missingCourses.length > 0) {
        parsed.courses = [...parsed.courses, ...missingCourses];
      }

      const existingEnrollmentIds = new Set(parsed.enrollments.map((e) => e.id));
      const missingEnrollments = mockEnrollments.filter((e) => !existingEnrollmentIds.has(e.id));
      if (missingEnrollments.length > 0) {
        parsed.enrollments = [...parsed.enrollments, ...missingEnrollments];
      }

      const jeremiah = parsed.users.find((u) => u.id === 'u5');
      if (jeremiah) {
        jeremiah.matricNumber = 'UG/2021/02/03/045';
        jeremiah.level = 400;
      }

      if (!parsed.disputes) {
        parsed.disputes = [
          {
            id: 'disp_1',
            studentId: 'u5',
            studentName: 'Jeremiah Dantani',
            matricNumber: 'UG/2021/02/03/045',
            courseId: 'c1',
            courseCode: 'CSC101',
            courseTitle: 'Introduction to Computer Science',
            lecturerId: 'u2',
            category: 'Missing CA Score',
            description:
              'My CA score reflects 18/40 instead of the 34/40 achieved in the midterm project presentation.',
            requestedScoreType: 'CA',
            originalCa: 18,
            originalExam: 42,
            originalTotal: 60,
            status: 'Under Investigation',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
        ];
      }

      return parsed;
    } catch (e) {
      console.error('Failed to parse stored DB state, reinitializing', e);
    }
  }

  const initialState = createInitialDBState();
  localStorage.setItem(DB_KEY, JSON.stringify(initialState));
  return initialState;
}
