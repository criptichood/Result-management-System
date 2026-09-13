import { Course, Department, Enrollment, GradeDispute, ModerationLog, Result, ResultStatus, User } from '../types';
import { mockCourses, mockDepartments, mockEnrollments, mockResults, mockUsers } from './mockData';
import { sqliteEngine } from './sqliteEngine';

const DB_KEY = 'fuaz_srms_db_v14';

interface DBState {
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

class MockDB {
  private state: DBState;

  constructor() {
    this.state = this.loadState();
    // Initialize SQLite WASM engine in background
    sqliteEngine.init().catch(e => console.warn('SQLite init deferred:', e));
  }

  private loadState(): DBState {
    const stored = localStorage.getItem(DB_KEY);
    if (stored) {
      try {
        const parsed: DBState = JSON.parse(stored);
        if (!parsed.departments) {
          parsed.departments = mockDepartments;
        } else {
          // Ensure any default department exists
          const existingDeptCodes = new Set(parsed.departments.map(d => d.code));
          const missingDepts = mockDepartments.filter(d => !existingDeptCodes.has(d.code));
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
              affectedStudentCount: 5
            }
          ];
        }

        // Ensure any newly added courses in mockCourses exist in existing storage
        const existingCourseCodes = new Set(parsed.courses.map(c => c.code));
        const missingCourses = mockCourses.filter(c => !existingCourseCodes.has(c.code));
        if (missingCourses.length > 0) {
          parsed.courses = [...parsed.courses, ...missingCourses];
        }

        // Ensure newly added enrollments exist
        const existingEnrollmentIds = new Set(parsed.enrollments.map(e => e.id));
        const missingEnrollments = mockEnrollments.filter(e => !existingEnrollmentIds.has(e.id));
        if (missingEnrollments.length > 0) {
          parsed.enrollments = [...parsed.enrollments, ...missingEnrollments];
        }

        // Sync Jeremiah Dantani matric number and level if needed
        const jeremiah = parsed.users.find(u => u.id === 'u5');
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
              description: 'My CA score reflects 18/40 instead of the 34/40 achieved in the midterm project presentation.',
              requestedScoreType: 'CA',
              originalCa: 18,
              originalExam: 42,
              originalTotal: 60,
              status: 'Under Investigation',
              createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            }
          ];
        }

        this.saveState(parsed);
        return parsed;
      } catch (e) {
        console.error('Failed to parse stored DB state, reinitializing', e);
      }
    }
    const initialState: DBState = {
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
          affectedStudentCount: 5
        }
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
          description: 'My CA score reflects 18/40 instead of the 34/40 achieved in the midterm project presentation.',
          requestedScoreType: 'CA',
          originalCa: 18,
          originalExam: 42,
          originalTotal: 60,
          status: 'Under Investigation',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        }
      ],
      settings: {
        lecturerViewEmail: false,
        lecturerViewPhone: false,
        courseRegistrationOpen: true,
        currentSession: '2024/2025',
        currentSemester: 1,
      }
    };
    this.saveState(initialState);
    return initialState;
  }

  private saveState(state: DBState = this.state) {
    localStorage.setItem(DB_KEY, JSON.stringify(state));
    // Automatically synchronize state changes to SQLite database in the background
    this.syncStateToSqlite().catch(err => console.warn('SQLite background sync warning:', err));
  }

  public async syncStateToSqlite(): Promise<void> {
    if (!sqliteEngine.isReady()) {
      try {
        await sqliteEngine.init();
      } catch {
        return;
      }
    }
    if (!sqliteEngine.isReady()) return;

    try {
      // Sync Users
      const stmtUser = sqliteEngine.getDatabase().prepare(`
        INSERT OR REPLACE INTO users (id, name, email, role, college, department, matric_number, level, phone_number, emergency_contact, address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      this.state.users.forEach(u => {
        stmtUser.run([
          u.id,
          u.name,
          u.email,
          u.role,
          u.college || null,
          u.department || null,
          u.matricNumber || null,
          u.level || null,
          u.phoneNumber || null,
          u.emergencyContact || null,
          u.address || null
        ]);
      });
      stmtUser.free();

      // Sync Courses
      const stmtCourse = sqliteEngine.getDatabase().prepare(`
        INSERT OR REPLACE INTO courses (id, code, title, credit_units, semester, level, department, college, lecturer_id, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      this.state.courses.forEach(c => {
        stmtCourse.run([
          c.id,
          c.code,
          c.title,
          c.creditUnits,
          c.semester,
          c.level,
          c.department,
          c.college,
          c.lecturerId || null,
          c.description || null
        ]);
      });
      stmtCourse.free();

      // Sync Departments
      const stmtDept = sqliteEngine.getDatabase().prepare(`
        INSERT OR REPLACE INTO departments (id, name, code, college, hod, description)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      this.state.departments.forEach(d => {
        stmtDept.run([d.id, d.name, d.code, d.college, d.HOD || null, d.description || null]);
      });
      stmtDept.free();

      // Sync Enrollments
      const stmtEnroll = sqliteEngine.getDatabase().prepare(`
        INSERT OR REPLACE INTO enrollments (id, student_id, course_id, semester, academic_year)
        VALUES (?, ?, ?, ?, ?)
      `);
      this.state.enrollments.forEach(e => {
        stmtEnroll.run([e.id, e.studentId, e.courseId, e.semester, e.academicYear]);
      });
      stmtEnroll.free();

      // Sync Results
      const stmtResult = sqliteEngine.getDatabase().prepare(`
        INSERT OR REPLACE INTO results (id, enrollment_id, ca_score, exam_score, total_score, grade, status, lecturer_id, moderation_notes, last_updated)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      this.state.results.forEach(r => {
        stmtResult.run([
          r.id,
          r.enrollmentId,
          r.caScore ?? null,
          r.examScore ?? null,
          r.totalScore ?? null,
          r.grade ?? null,
          r.status,
          r.lecturerId || null,
          r.moderationNotes || null,
          r.lastUpdated || new Date().toISOString()
        ]);
      });
      stmtResult.free();

      // Sync Moderation Logs
      const stmtLog = sqliteEngine.getDatabase().prepare(`
        INSERT OR REPLACE INTO moderation_logs (id, course_id, course_code, examiner_id, examiner_name, action, timestamp, notes, affected_student_count, details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      (this.state.moderationLogs || []).forEach(l => {
        stmtLog.run([
          l.id,
          l.courseId,
          l.courseCode,
          l.examinerId,
          l.examinerName,
          l.action,
          l.timestamp,
          l.notes || null,
          l.affectedStudentCount || null,
          l.details || null
        ]);
      });
      stmtLog.free();

      // Sync Settings
      const stmtSetting = sqliteEngine.getDatabase().prepare(`INSERT OR REPLACE INTO system_settings (key, value) VALUES (?, ?)`);
      Object.entries(this.state.settings || {}).forEach(([k, v]) => {
        stmtSetting.run([k, String(v)]);
      });
      stmtSetting.free();

      // Persist binary snapshot to IndexedDB
      await sqliteEngine.persistToIndexedDB();
    } catch (e) {
      console.warn('Failed to sync state to SQLite:', e);
    }
  }

  // Generic querying mimicking a very basic ORM
  from<T extends 'users' | 'courses' | 'departments' | 'enrollments' | 'results' | 'moderationLogs'>(table: T) {
    const data = (this.state[table] || []) as any[];
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

  allocateCourseLecturer(courseId: string, lecturerId?: string) {
    this.from('courses').update(courseId, { lecturerId: lecturerId || undefined });
    this.saveState();
  }

  batchAllocateCourses(allocations: { courseId: string; lecturerId?: string }[]) {
    allocations.forEach(({ courseId, lecturerId }) => {
      const course = this.from('courses').selectById(courseId);
      if (course) {
        this.from('courses').update(courseId, { lecturerId: lecturerId || undefined });
      }
    });
    this.saveState();
  }

  getLecturersWithWorkload() {
    const lecturers = this.from('users').selectWhere(u => u.role === 'Lecturer' || u.role === 'Chief Examiner');
    const courses = this.from('courses').select();
    const enrollments = this.from('enrollments').select();

    return lecturers.map(lec => {
      const assignedCourses = courses.filter(c => c.lecturerId === lec.id);
      const totalCreditUnits = assignedCourses.reduce((sum, c) => sum + (c.creditUnits || 0), 0);
      const assignedCourseIds = new Set(assignedCourses.map(c => c.id));
      const totalStudentsEnrolled = enrollments.filter(e => assignedCourseIds.has(e.courseId)).length;

      return {
        lecturer: lec,
        assignedCourses,
        totalCreditUnits,
        totalStudentsEnrolled
      };
    });
  }

  transitionAcademicSession(
    newSession: string,
    newSemester: 1 | 2,
    options: { promoteStudents?: boolean; openRegistration?: boolean } = {}
  ) {
    // 1. Update active session & semester in settings
    this.state.settings = {
      ...this.state.settings,
      currentSession: newSession,
      currentSemester: newSemester,
      ...(options.openRegistration !== undefined ? { courseRegistrationOpen: options.openRegistration } : {})
    };

    // 2. Promote students if requested (e.g. at start of new academic session)
    if (options.promoteStudents) {
      this.state.users = this.state.users.map(u => {
        if (u.role === 'Student' && u.level) {
          let nextLevel = u.level + 100;
          if (nextLevel > 500) nextLevel = 500;
          return {
            ...u,
            level: nextLevel
          };
        }
        return u;
      });
    }

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
    let courses = this.from('courses').select();
    
    // First priority: explicitly assigned courses
    const assigned = courses.filter(c => c.lecturerId === lecturerId);
    if (assigned.length > 0) {
      courses = assigned;
    } else if (user?.department) {
      courses = courses.filter(c => c.department === user.department);
    }

    const allEnrollments = this.from('enrollments').select();
    const allResults = this.from('results').select();

    return courses.map(course => {
      const enrollments = allEnrollments.filter(e => e.courseId === course.id);
      const enrollmentIds = new Set(enrollments.map(e => e.id));
      const results = allResults.filter(r => enrollmentIds.has(r.enrollmentId));
      
      const hasRejected = results.some(r => r.status === 'Rejected');
      const isAllPublished = results.length > 0 && results.every(r => r.status === 'Published');
      const hasSubmitted = results.some(r => r.status === 'Submitted');
      const hasDraft = results.some(r => r.status === 'Draft') || results.length < enrollments.length;

      let submissionStatus: ResultStatus = 'Draft';
      if (hasRejected) submissionStatus = 'Rejected';
      else if (isAllPublished) submissionStatus = 'Published';
      else if (hasSubmitted) submissionStatus = 'Submitted';
      else if (hasDraft) submissionStatus = 'Draft';

      const moderationNotes = results.find(r => r.moderationNotes)?.moderationNotes;
      const scoredCount = results.filter(r => r.totalScore !== null && r.totalScore !== undefined).length;

      return {
        ...course,
        enrolledCount: enrollments.length,
        scoredCount,
        submissionStatus,
        moderationNotes
      };
    });
  }

  getOutstandingCarryovers(studentId: string) {
    const student = this.from('users').selectById(studentId);
    if (!student) return [];
    
    const resultsData = this.getStudentResults(studentId);
    const studentLevel = student.level || 100;
    const currentSession = this.getSettings().currentSession || '2024/2025';
    
    const passedCourseCodes = new Set<string>();
    const failedMap = new Map<string, any>();

    resultsData.filter(r => r.result?.status === 'Published').forEach(r => {
      const code = r.course?.code;
      if (!code) return;
      const score = r.result?.totalScore ?? 0;
      const grade = r.result?.grade;
      const isPassed = score >= 40 && grade !== 'F';

      if (isPassed) {
        passedCourseCodes.add(code);
        failedMap.delete(code);
      } else if (!passedCourseCodes.has(code)) {
        const courseLevel = r.course?.level || 100;
        const isPastSessionOrLevel = (r.enrollment?.academicYear !== currentSession) || (courseLevel < studentLevel);
        if (isPastSessionOrLevel) {
          failedMap.set(code, r);
        }
      }
    });

    return Array.from(failedMap.values());
  }

  getAvailableCourses(studentId: string, semester?: number) {
    const student = this.from('users').selectById(studentId);
    if (!student) return [];
    
    const currentSession = this.getSettings().currentSession || '2024/2025';
    const studentLevel = student.level || 100;
    const enrollments = this.from('enrollments').selectWhere(e => e.studentId === studentId);
    
    // Courses already enrolled in the active session
    const currentEnrolledCourseIds = new Set(
      enrollments
        .filter(e => e.academicYear === currentSession && (!semester || e.semester === semester))
        .map(e => e.courseId)
    );

    // Track all previously passed courses & past failed carryovers
    const allStudentResults = this.getStudentResults(studentId);
    const passedCourseIds = new Set<string>();
    const carryoverCourseMap = new Map<string, Course>();

    allStudentResults.filter(r => r.result?.status === 'Published').forEach(r => {
      if (!r.course) return;
      const score = r.result?.totalScore ?? 0;
      const grade = r.result?.grade;
      const isPassed = score >= 40 && grade !== 'F';

      if (isPassed) {
        passedCourseIds.add(r.course.id);
        carryoverCourseMap.delete(r.course.id);
      } else if (!passedCourseIds.has(r.course.id)) {
        const courseLevel = r.course.level || 100;
        const isPastSessionOrLevel = (r.enrollment?.academicYear !== currentSession) || (courseLevel < studentLevel);
        if (isPastSessionOrLevel && (!semester || r.course.semester === semester)) {
          carryoverCourseMap.set(r.course.id, r.course);
        }
      }
    });

    // 1. Regular curriculum courses for the student's CURRENT level only
    const regularCourses = this.from('courses').selectWhere(c => {
      if (currentEnrolledCourseIds.has(c.id)) return false;
      if (passedCourseIds.has(c.id)) return false;
      if (carryoverCourseMap.has(c.id)) return false;

      const matchesLevel = c.level === studentLevel;
      const matchesSemester = semester ? c.semester === semester : true;
      const matchesDeptOrGeneral = 
        c.department === student.department || 
        c.college === student.college || 
        c.department === 'General Studies' || 
        c.department === 'Mathematics' || 
        c.department === 'Physics' || 
        c.department === 'Chemical Sciences';

      return matchesLevel && matchesSemester && matchesDeptOrGeneral;
    }).map(c => ({
      ...c,
      isCarryover: false,
      isCompulsory: false
    }));

    // 2. Outstanding carryovers (compulsory retake)
    const carryoverCourses = Array.from(carryoverCourseMap.values())
      .filter(c => !currentEnrolledCourseIds.has(c.id))
      .map(c => ({
        ...c,
        isCarryover: true,
        isCompulsory: true
      }));

    return [...carryoverCourses, ...regularCourses];
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

  calculateGrade(total: number): string {
    if (total >= 70) return 'A';
    if (total >= 60) return 'B';
    if (total >= 50) return 'C';
    if (total >= 45) return 'D';
    if (total >= 40) return 'E';
    return 'F';
  }

  saveCourseScores(
    courseId: string,
    scores: Record<string, { ca: string; exam: string }>,
    lecturerId: string,
    status: 'Draft' | 'Submitted' = 'Draft'
  ) {
    const enrollments = this.from('enrollments').selectWhere(e => e.courseId === courseId);
    const existingResults = this.from('results').select();

    enrollments.forEach(e => {
      const studentScore = scores[e.id];
      if (!studentScore) return;

      const caVal = studentScore.ca !== '' && studentScore.ca !== undefined ? parseFloat(studentScore.ca) : null;
      const examVal = studentScore.exam !== '' && studentScore.exam !== undefined ? parseFloat(studentScore.exam) : null;
      const hasScores = caVal !== null || examVal !== null;
      const total = hasScores ? ((caVal || 0) + (examVal || 0)) : null;
      const grade = total !== null ? this.calculateGrade(total) : null;

      const existingResult = existingResults.find(r => r.enrollmentId === e.id);
      if (existingResult) {
        this.from('results').update(existingResult.id, {
          caScore: caVal,
          examScore: examVal,
          totalScore: total,
          grade,
          status,
          lecturerId,
          lastUpdated: new Date().toISOString(),
          // Clear rejection notes upon re-submission
          ...(status === 'Submitted' ? { moderationNotes: undefined } : {})
        });
      } else {
        this.from('results').insert({
          id: `r_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          enrollmentId: e.id,
          caScore: caVal,
          examScore: examVal,
          totalScore: total,
          grade,
          status,
          lecturerId,
          lastUpdated: new Date().toISOString()
        });
      }
    });
  }

  getModerationLogs(courseId?: string): ModerationLog[] {
    const logs = (this.state.moderationLogs || []).slice();
    // Sort descending by timestamp
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    if (courseId) {
      return logs.filter(l => l.courseId === courseId);
    }
    return logs;
  }

  addModerationLog(log: Omit<ModerationLog, 'id' | 'timestamp'>): ModerationLog {
    const newLog: ModerationLog = {
      ...log,
      id: `ml_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString()
    };
    if (!this.state.moderationLogs) {
      this.state.moderationLogs = [];
    }
    this.state.moderationLogs = [newLog, ...this.state.moderationLogs];
    this.saveState();
    return newLog;
  }

  moderateCourse(courseId: string, action: 'approve' | 'reject', notes?: string, examiner?: User) {
    const enrollments = this.from('enrollments').selectWhere(e => e.courseId === courseId);
    const results = this.from('results').select();
    const course = this.from('courses').selectById(courseId);

    let updatedCount = 0;
    enrollments.forEach(e => {
      const res = results.find(r => r.enrollmentId === e.id);
      if (res) {
        updatedCount++;
        if (action === 'approve') {
          this.from('results').update(res.id, {
            status: 'Published',
            moderationNotes: undefined,
            lastUpdated: new Date().toISOString()
          });
        } else {
          this.from('results').update(res.id, {
            status: 'Rejected',
            moderationNotes: notes || 'Returned for revision by Chief Examiner.',
            lastUpdated: new Date().toISOString()
          });
        }
      }
    });

    if (course) {
      this.addModerationLog({
        courseId,
        courseCode: course.code,
        examinerId: examiner?.id || 'u2',
        examinerName: examiner?.name || 'Dr. Aliyu Mohammed',
        action: action === 'approve' ? 'Approved' : 'Rejected',
        notes: notes || (action === 'approve' ? 'All student scores approved and published to portal.' : 'Returned to lecturer for revision.'),
        affectedStudentCount: updatedCount,
        details: `Course: ${course.title} (${course.code})`
      });
    }
  }

  batchModerateCourses(
    courseIds: string[],
    action: 'approve' | 'reject',
    notes?: string,
    examiner?: User
  ) {
    courseIds.forEach(courseId => {
      this.moderateCourse(courseId, action, notes, examiner);
    });
  }

  overrideStudentScore(
    enrollmentId: string,
    caScore: number | null,
    examScore: number | null,
    examiner: User,
    justification: string
  ) {
    const enrollment = this.from('enrollments').selectById(enrollmentId);
    if (!enrollment) return null;

    const course = this.from('courses').selectById(enrollment.courseId);
    const student = this.from('users').selectById(enrollment.studentId);
    const existingResult = this.from('results').selectWhere(r => r.enrollmentId === enrollmentId)[0];

    const prevCa = existingResult?.caScore ?? 'None';
    const prevExam = existingResult?.examScore ?? 'None';
    const prevTotal = existingResult?.totalScore ?? 'None';
    const prevGrade = existingResult?.grade ?? 'None';

    const hasScores = caScore !== null || examScore !== null;
    const total = hasScores ? ((caScore || 0) + (examScore || 0)) : null;
    const grade = total !== null ? this.calculateGrade(total) : null;

    let updatedResult;
    if (existingResult) {
      updatedResult = this.from('results').update(existingResult.id, {
        caScore,
        examScore,
        totalScore: total,
        grade,
        lastUpdated: new Date().toISOString(),
        moderationNotes: `Score modified by Chief Examiner: ${justification}`
      });
    } else {
      updatedResult = this.from('results').insert({
        id: `r_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        enrollmentId,
        caScore,
        examScore,
        totalScore: total,
        grade,
        status: 'Submitted',
        lecturerId: course?.lecturerId || 'u3',
        lastUpdated: new Date().toISOString(),
        moderationNotes: `Score created via Chief Examiner override: ${justification}`
      });
    }

    if (course) {
      this.addModerationLog({
        courseId: course.id,
        courseCode: course.code,
        examinerId: examiner.id,
        examinerName: examiner.name,
        action: 'Score Override',
        notes: justification,
        affectedStudentCount: 1,
        details: `Candidate: ${student?.name || 'Student'} (${student?.matricNumber || ''}) | Adjusted from CA: ${prevCa}, Exam: ${prevExam}, Total: ${prevTotal} (${prevGrade}) ➔ CA: ${caScore ?? 0}, Exam: ${examScore ?? 0}, Total: ${total} (${grade})`
      });
    }

    return updatedResult;
  }

  // --- Grade Disputes & Remarking Request Methods ---

  getDisputes(): GradeDispute[] {
    return this.state.disputes || [];
  }

  getDisputesByStudent(studentId: string): GradeDispute[] {
    return (this.state.disputes || []).filter(d => d.studentId === studentId);
  }

  getDisputesByLecturer(lecturerId: string): GradeDispute[] {
    const lecturerCourses = new Set(this.state.courses.filter(c => c.lecturerId === lecturerId).map(c => c.id));
    return (this.state.disputes || []).filter(d => d.lecturerId === lecturerId || (d.courseId && lecturerCourses.has(d.courseId)));
  }

  createDispute(disputeData: Omit<GradeDispute, 'id' | 'createdAt' | 'status'>): GradeDispute {
    const newDispute: GradeDispute = {
      ...disputeData,
      id: `disp_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    if (!this.state.disputes) {
      this.state.disputes = [];
    }

    this.state.disputes.unshift(newDispute);
    this.saveState();
    return newDispute;
  }

  updateDisputeStatus(
    disputeId: string,
    status: GradeDispute['status'],
    resolutionNote?: string,
    adjustedScores?: { ca?: number; exam?: number; total?: number },
    resolver?: { id: string; name: string }
  ): GradeDispute | null {
    if (!this.state.disputes) return null;
    const index = this.state.disputes.findIndex(d => d.id === disputeId);
    if (index === -1) return null;

    const dispute = this.state.disputes[index];
    dispute.status = status;
    dispute.resolutionNote = resolutionNote || dispute.resolutionNote;
    dispute.resolvedBy = resolver?.name || dispute.resolvedBy;
    dispute.resolvedAt = new Date().toISOString();

    if (adjustedScores) {
      dispute.adjustedCa = adjustedScores.ca ?? dispute.adjustedCa;
      dispute.adjustedExam = adjustedScores.exam ?? dispute.adjustedExam;
      dispute.adjustedTotal = adjustedScores.total ?? dispute.adjustedTotal;

      // If scores were adjusted, find the student's enrollment and update the live result record
      const enrollment = this.state.enrollments.find(
        e => e.studentId === dispute.studentId && e.courseId === dispute.courseId
      );

      if (enrollment) {
        const ca = dispute.adjustedCa ?? dispute.originalCa ?? 0;
        const exam = dispute.adjustedExam ?? dispute.originalExam ?? 0;
        const total = ca + exam;
        const grade = this.calculateGrade(total);

        const existingResult = this.state.results.find(r => r.enrollmentId === enrollment.id);
        if (existingResult) {
          existingResult.caScore = ca;
          existingResult.examScore = exam;
          existingResult.totalScore = total;
          existingResult.grade = grade;
          existingResult.lastUpdated = new Date().toISOString();
          existingResult.moderationNotes = `Score adjusted following grade query resolution: ${resolutionNote || 'Verified by Department'}`;
        }

        // Add moderation log
        this.addModerationLog({
          courseId: dispute.courseId,
          courseCode: dispute.courseCode,
          examinerId: resolver?.id || 'u2',
          examinerName: resolver?.name || 'Chief Examiner',
          action: 'Score Override',
          notes: `Dispute Resolution: ${resolutionNote || 'Score corrected upon query review'}`,
          affectedStudentCount: 1,
          details: `Candidate: ${dispute.studentName} (${dispute.matricNumber}) query #${disputeId.substring(0, 8)} resolved. New Total: ${total} (${grade})`
        });
      }
    }

    this.saveState();
    return dispute;
  }

  async resetDatabase() {
    localStorage.removeItem(DB_KEY);
    this.state = {
      users: mockUsers,
      courses: mockCourses,
      departments: mockDepartments,
      enrollments: mockEnrollments,
      results: mockResults,
      moderationLogs: [],
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
          description: 'My CA score reflects 18/40 instead of the 34/40 achieved in the midterm project presentation.',
          requestedScoreType: 'CA',
          originalCa: 18,
          originalExam: 42,
          originalTotal: 60,
          status: 'Under Investigation',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        }
      ],
      settings: {
        lecturerViewEmail: false,
        lecturerViewPhone: false,
        courseRegistrationOpen: true,
        currentSession: '2024/2025',
        currentSemester: 1,
      }
    };
    this.saveState();
    if (sqliteEngine.isReady()) {
      await sqliteEngine.resetDatabase();
    }
  }

  // SQLite Access Helpers
  async executeSql(sql: string, params: any[] = []) {
    await sqliteEngine.init();
    const result = sqliteEngine.executeQuery(sql, params);
    // Reload state if an INSERT/UPDATE/DELETE was executed
    if (sql.trim().toUpperCase().startsWith('INSERT') || 
        sql.trim().toUpperCase().startsWith('UPDATE') || 
        sql.trim().toUpperCase().startsWith('DELETE') ||
        sql.trim().toUpperCase().startsWith('REPLACE')) {
      await this.reloadStateFromSqlite();
    }
    return result;
  }

  getSqliteTables() {
    return sqliteEngine.getTablesInfo();
  }

  exportSqliteBinary() {
    return sqliteEngine.exportDatabaseBinary();
  }

  generateSqlDump() {
    return sqliteEngine.generateSqlDump();
  }

  async importSqliteBinary(buffer: ArrayBuffer | Uint8Array) {
    await sqliteEngine.importDatabaseBinary(buffer);
    await this.reloadStateFromSqlite();
  }

  private async reloadStateFromSqlite() {
    if (!sqliteEngine.isReady()) return;
    try {
      const usersRes = sqliteEngine.executeQuery('SELECT * FROM users');
      const coursesRes = sqliteEngine.executeQuery('SELECT * FROM courses');
      const deptsRes = sqliteEngine.executeQuery('SELECT * FROM departments');
      const enrollsRes = sqliteEngine.executeQuery('SELECT * FROM enrollments');
      const resultsRes = sqliteEngine.executeQuery('SELECT * FROM results');

      this.state.users = usersRes.rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        role: r.role,
        college: r.college || undefined,
        department: r.department || undefined,
        matricNumber: r.matric_number || undefined,
        level: r.level ? Number(r.level) : undefined,
        phoneNumber: r.phone_number || undefined,
        emergencyContact: r.emergency_contact || undefined,
        address: r.address || undefined
      }));

      this.state.courses = coursesRes.rows.map((r: any) => ({
        id: r.id,
        code: r.code,
        title: r.title,
        creditUnits: Number(r.credit_units),
        semester: Number(r.semester) as 1 | 2,
        level: Number(r.level),
        department: r.department,
        college: r.college,
        lecturerId: r.lecturer_id || undefined,
        description: r.description || undefined
      }));

      this.state.departments = deptsRes.rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        code: r.code,
        college: r.college,
        HOD: r.hod || undefined,
        description: r.description || undefined
      }));

      this.state.enrollments = enrollsRes.rows.map((r: any) => ({
        id: r.id,
        studentId: r.student_id,
        courseId: r.course_id,
        semester: Number(r.semester) as 1 | 2,
        academicYear: r.academic_year
      }));

      this.state.results = resultsRes.rows.map((r: any) => ({
        id: r.id,
        enrollmentId: r.enrollment_id,
        caScore: r.ca_score !== null && r.ca_score !== undefined ? Number(r.ca_score) : null,
        examScore: r.exam_score !== null && r.exam_score !== undefined ? Number(r.exam_score) : null,
        totalScore: r.total_score !== null && r.total_score !== undefined ? Number(r.total_score) : null,
        grade: r.grade || null,
        status: r.status,
        lecturerId: r.lecturer_id,
        lastUpdated: r.last_updated,
        moderationNotes: r.moderation_notes || undefined
      }));

      this.saveState();
    } catch (e) {
      console.warn('Could not reload state from SQLite:', e);
    }
  }
}

export const db = new MockDB();

