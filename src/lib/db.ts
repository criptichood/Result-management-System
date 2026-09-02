import { Course, Enrollment, Result, User } from '../types';
import { mockCourses, mockEnrollments, mockResults, mockUsers } from './mockData';

const DB_KEY = 'fuaz_srms_db_v8';

interface DBState {
  users: User[];
  courses: Course[];
  enrollments: Enrollment[];
  results: Result[];
  settings: {
    lecturerViewEmail: boolean;
    lecturerViewPhone: boolean;
    courseRegistrationOpen: boolean;
    currentSession: string;
    currentSemester: 1 | 2;
  };
}

class MockDB {
  private state: DBState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): DBState {
    const stored = localStorage.getItem(DB_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    const initialState: DBState = {
      users: mockUsers,
      courses: mockCourses,
      enrollments: mockEnrollments,
      results: mockResults,
      settings: {
        lecturerViewEmail: false,
        lecturerViewPhone: false,
        courseRegistrationOpen: true,
        currentSession: '2023/2024',
        currentSemester: 1,
      }
    };
    this.saveState(initialState);
    return initialState;
  }

  private saveState(state: DBState = this.state) {
    localStorage.setItem(DB_KEY, JSON.stringify(state));
  }

  // Generic querying mimicking a very basic ORM
  from<T extends 'users' | 'courses' | 'enrollments' | 'results'>(table: T) {
    const data = this.state[table] as any[];
    return {
      select: () => data,
      selectById: (id: string) => data.find((item: any) => item.id === id),
      selectWhere: (filterFn: (item: any) => boolean) => data.filter(filterFn),
      insert: (item: any) => {
        this.state[table] = [...data, item] as any;
        this.saveState();
        return item;
      },
      update: (id: string, updates: Partial<any>) => {
        let updatedItem = null;
        this.state[table] = data.map((item: any) => {
          if (item.id === id) {
            updatedItem = { ...item, ...updates };
            return updatedItem;
          }
          return item;
        }) as any;
        this.saveState();
        return updatedItem;
      },
      delete: (id: string) => {
        this.state[table] = data.filter((item: any) => item.id !== id) as any;
        this.saveState();
      }
    };
  }

  // Helpers specific to logic
  getSettings() {
    return this.state.settings || { 
      lecturerViewEmail: false, 
      lecturerViewPhone: false, 
      courseRegistrationOpen: true,
      currentSession: '2023/2024',
      currentSemester: 1,
    };
  }

  updateSettings(newSettings: Partial<DBState['settings']>) {
    this.state.settings = { ...this.state.settings, ...newSettings };
    this.saveState();
  }

  getStudentResults(studentId: string) {
    const enrollments = this.from('enrollments').selectWhere(e => e.studentId === studentId);
    const results = this.from('results').select();
    const courses = this.from('courses').select();

    return enrollments.map(e => {
      const result = results.find(r => r.enrollmentId === e.id);
      const course = courses.find(c => c.id === e.courseId);
      return { enrollment: e, result, course };
    });
  }

  getLecturerCourses(lecturerId: string) {
    const user = this.from('users').selectById(lecturerId);
    if (!user) return this.from('courses').select();
    
    // First priority: explicitly assigned courses
    const assigned = this.from('courses').selectWhere(c => c.lecturerId === lecturerId);
    if (assigned.length > 0) return assigned;

    // Fallback: courses in department
    if (user.department) {
      return this.from('courses').selectWhere(c => c.department === user.department);
    }
    return this.from('courses').select(); 
  }

  getAvailableCourses(studentId: string, semester?: number) {
    const student = this.from('users').selectById(studentId);
    if (!student) return [];
    const enrollments = this.from('enrollments').selectWhere(e => e.studentId === studentId);
    const enrolledCourseIds = new Set(enrollments.map(e => e.courseId));
    
    return this.from('courses').selectWhere(c => {
      const notEnrolled = !enrolledCourseIds.has(c.id);
      const matchesDeptOrGeneral = c.department === student.department || c.college === student.college || c.department === 'General Studies' || c.department === 'Mathematics' || c.department === 'Physics' || c.department === 'Chemical Sciences';
      const matchesSemester = semester ? c.semester === semester : true;
      return notEnrolled && matchesDeptOrGeneral && matchesSemester;
    });
  }

  registerForCourses(studentId: string, courseIds: string[], semester: 1 | 2, academicYear: string) {
    courseIds.forEach(courseId => {
      const enrollmentId = `e_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      this.from('enrollments').insert({
        id: enrollmentId,
        studentId,
        courseId,
        semester,
        academicYear
      });
      // Also initialize a draft result record for lecturers to score
      this.from('results').insert({
        id: `r_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        enrollmentId,
        caScore: null,
        examScore: null,
        totalScore: null,
        grade: null,
        status: 'Draft',
        lecturerId: 'u3',
        lastUpdated: new Date().toISOString()
      });
    });
  }
}

export const db = new MockDB();

