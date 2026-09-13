import { GradeDispute, ModerationLog, User } from '../types';
import { DB_KEY, DBState, loadAndMigrateDBState, createInitialDBState } from './dbStateInit';
import { syncStateToSqliteBridge, reloadStateFromSqliteBridge } from './dbSqliteBridge';
import { calculateLetterGrade } from './academicOperations';
import { computeLecturersWorkload } from './dbWorkload';
import {
  computeStudentResults,
  computeLecturerCourses,
  computeOutstandingCarryovers,
  computeAvailableCourses,
} from './dbStudentCourses';
import { createScoreOverrideResult } from './dbDisputeModeration';
import {
  getDisputesList,
  getStudentDisputes,
  getLecturerDisputes,
  addDispute,
  resolveDispute,
} from './dbDisputes';
import {
  executeSqlWithSync,
  getSqliteTablesInfo,
  exportSqliteBinaryData,
  generateSqlDumpData,
  importSqliteBinaryData,
} from './dbSqliteProxy';
import { sqliteEngine } from './sqliteEngine';

class MockDB {
  private state: DBState;

  constructor() {
    this.state = loadAndMigrateDBState();
    sqliteEngine.init().catch((e) => console.warn('SQLite init deferred:', e));
  }

  private saveState(state: DBState = this.state) {
    localStorage.setItem(DB_KEY, JSON.stringify(state));
    this.syncStateToSqlite().catch((err) => console.warn('SQLite background sync warning:', err));
  }

  public async syncStateToSqlite(): Promise<void> {
    await syncStateToSqliteBridge(this.state);
  }

  from<T extends 'users' | 'courses' | 'departments' | 'enrollments' | 'results' | 'moderationLogs'>(
    table: T
  ) {
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
      },
    };
  }

  getSettings() {
    return (
      this.state.settings || {
        lecturerViewEmail: false,
        lecturerViewPhone: false,
        courseRegistrationOpen: true,
        currentSession: '2023/2024',
        currentSemester: 1,
      }
    );
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
    return computeLecturersWorkload(
      this.from('users').select(),
      this.from('courses').select(),
      this.from('enrollments').select()
    );
  }

  transitionAcademicSession(
    newSession: string,
    newSemester: 1 | 2,
    options: { promoteStudents?: boolean; openRegistration?: boolean } = {}
  ) {
    this.state.settings = {
      ...this.state.settings,
      currentSession: newSession,
      currentSemester: newSemester,
      ...(options.openRegistration !== undefined
        ? { courseRegistrationOpen: options.openRegistration }
        : {}),
    };

    if (options.promoteStudents) {
      this.state.users = this.state.users.map((u) => {
        if (u.role === 'Student' && u.level) {
          let nextLevel = u.level + 100;
          if (nextLevel > 500) nextLevel = 500;
          return { ...u, level: nextLevel };
        }
        return u;
      });
    }

    this.saveState();
  }

  getStudentResults(studentId: string) {
    return computeStudentResults(
      studentId,
      this.from('enrollments').select(),
      this.from('results').select(),
      this.from('courses').select()
    );
  }

  getLecturerCourses(lecturerId: string) {
    const user = this.from('users').selectById(lecturerId);
    return computeLecturerCourses(
      lecturerId,
      user,
      this.from('courses').select(),
      this.from('enrollments').select(),
      this.from('results').select()
    );
  }

  getOutstandingCarryovers(studentId: string) {
    const student = this.from('users').selectById(studentId);
    const resultsData = this.getStudentResults(studentId);
    const currentSession = this.getSettings().currentSession || '2024/2025';
    return computeOutstandingCarryovers(student, resultsData, currentSession);
  }

  getAvailableCourses(studentId: string, semester?: number) {
    const student = this.from('users').selectById(studentId);
    const currentSession = this.getSettings().currentSession || '2024/2025';
    const allCourses = this.from('courses').select();
    const allEnrollments = this.from('enrollments').select();
    const studentResults = this.getStudentResults(studentId);
    return computeAvailableCourses(
      student,
      allCourses,
      allEnrollments,
      studentResults,
      currentSession,
      semester
    );
  }

  registerForCourses(
    studentId: string,
    courseIds: string[],
    semester: 1 | 2,
    academicYear: string
  ) {
    courseIds.forEach((courseId) => {
      const enrollmentId = `e_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      this.from('enrollments').insert({
        id: enrollmentId,
        studentId,
        courseId,
        semester,
        academicYear,
      });
      this.from('results').insert({
        id: `r_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        enrollmentId,
        caScore: null,
        examScore: null,
        totalScore: null,
        grade: null,
        status: 'Draft',
        lecturerId: 'u3',
        lastUpdated: new Date().toISOString(),
      });
    });
  }

  calculateGrade(total: number): string {
    return calculateLetterGrade(total);
  }

  saveCourseScores(
    courseId: string,
    scores: Record<string, { ca: string; exam: string }>,
    lecturerId: string,
    status: 'Draft' | 'Submitted' = 'Draft'
  ) {
    const enrollments = this.from('enrollments').selectWhere((e) => e.courseId === courseId);
    const existingResults = this.from('results').select();

    enrollments.forEach((e) => {
      const studentScore = scores[e.id];
      if (!studentScore) return;

      const caVal =
        studentScore.ca !== '' && studentScore.ca !== undefined
          ? parseFloat(studentScore.ca)
          : null;
      const examVal =
        studentScore.exam !== '' && studentScore.exam !== undefined
          ? parseFloat(studentScore.exam)
          : null;
      const hasScores = caVal !== null || examVal !== null;
      const total = hasScores ? (caVal || 0) + (examVal || 0) : null;
      const grade = total !== null ? this.calculateGrade(total) : null;

      const existingResult = existingResults.find((r) => r.enrollmentId === e.id);
      if (existingResult) {
        this.from('results').update(existingResult.id, {
          caScore: caVal,
          examScore: examVal,
          totalScore: total,
          grade,
          status,
          lecturerId,
          lastUpdated: new Date().toISOString(),
          ...(status === 'Submitted' ? { moderationNotes: undefined } : {}),
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
          lastUpdated: new Date().toISOString(),
        });
      }
    });
  }

  getModerationLogs(courseId?: string): ModerationLog[] {
    const logs = (this.state.moderationLogs || []).slice();
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    if (courseId) {
      return logs.filter((l) => l.courseId === courseId);
    }
    return logs;
  }

  addModerationLog(log: Omit<ModerationLog, 'id' | 'timestamp'>): ModerationLog {
    const newLog: ModerationLog = {
      ...log,
      id: `ml_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
    };
    if (!this.state.moderationLogs) {
      this.state.moderationLogs = [];
    }
    this.state.moderationLogs = [newLog, ...this.state.moderationLogs];
    this.saveState();
    return newLog;
  }

  moderateCourse(courseId: string, action: 'approve' | 'reject', notes?: string, examiner?: User) {
    const enrollments = this.from('enrollments').selectWhere((e) => e.courseId === courseId);
    const results = this.from('results').select();
    const course = this.from('courses').selectById(courseId);

    let updatedCount = 0;
    enrollments.forEach((e) => {
      const res = results.find((r) => r.enrollmentId === e.id);
      if (res) {
        updatedCount++;
        if (action === 'approve') {
          this.from('results').update(res.id, {
            status: 'Published',
            moderationNotes: undefined,
            lastUpdated: new Date().toISOString(),
          });
        } else {
          this.from('results').update(res.id, {
            status: 'Rejected',
            moderationNotes: notes || 'Returned for revision by Chief Examiner.',
            lastUpdated: new Date().toISOString(),
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
        notes:
          notes ||
          (action === 'approve'
            ? 'All student scores approved and published to portal.'
            : 'Returned to lecturer for revision.'),
        affectedStudentCount: updatedCount,
        details: `Course: ${course.title} (${course.code})`,
      });
    }
  }

  batchModerateCourses(
    courseIds: string[],
    action: 'approve' | 'reject',
    notes?: string,
    examiner?: User
  ) {
    courseIds.forEach((courseId) => {
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
    const results = this.from('results').select();

    const overrideInfo = createScoreOverrideResult({
      enrollmentId,
      caScore,
      examScore,
      results,
      justification,
    });

    let updatedResult;
    if (overrideInfo.isUpdate && overrideInfo.resultId && overrideInfo.updatedData) {
      updatedResult = this.from('results').update(overrideInfo.resultId, overrideInfo.updatedData);
    } else if (overrideInfo.newResult) {
      updatedResult = this.from('results').insert(overrideInfo.newResult);
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
        details: `Candidate: ${student?.name || 'Student'} (${student?.matricNumber || ''}) | Adjusted from CA: ${overrideInfo.prevCa}, Exam: ${overrideInfo.prevExam}, Total: ${overrideInfo.prevTotal} (${overrideInfo.prevGrade}) ➔ CA: ${caScore ?? 0}, Exam: ${examScore ?? 0}, Total: ${overrideInfo.total} (${overrideInfo.grade})`,
      });
    }

    return updatedResult;
  }

  getDisputes(): GradeDispute[] {
    return getDisputesList(this.state);
  }

  getDisputesByStudent(studentId: string): GradeDispute[] {
    return getStudentDisputes(this.state, studentId);
  }

  getDisputesByLecturer(lecturerId: string): GradeDispute[] {
    return getLecturerDisputes(this.state, lecturerId);
  }

  createDispute(disputeData: Omit<GradeDispute, 'id' | 'createdAt' | 'status'>): GradeDispute {
    const newDispute = addDispute(this.state, disputeData);
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
    const dispute = resolveDispute(
      this.state,
      disputeId,
      status,
      resolutionNote,
      adjustedScores,
      resolver,
      (log) => this.addModerationLog(log)
    );
    if (dispute) {
      this.saveState();
    }
    return dispute;
  }

  async resetDatabase() {
    localStorage.removeItem(DB_KEY);
    this.state = createInitialDBState();
    this.saveState();
    if (sqliteEngine.isReady()) {
      await sqliteEngine.resetDatabase();
    }
  }

  async executeSql(sql: string, params: any[] = []) {
    const { result, isMutation } = await executeSqlWithSync(sql, params);
    if (isMutation) {
      this.reloadStateFromSqlite();
    }
    return result;
  }

  getSqliteTables() {
    return getSqliteTablesInfo();
  }

  exportSqliteBinary() {
    return exportSqliteBinaryData();
  }

  generateSqlDump() {
    return generateSqlDumpData();
  }

  async importSqliteBinary(buffer: ArrayBuffer | Uint8Array) {
    await importSqliteBinaryData(buffer);
    this.reloadStateFromSqlite();
  }

  private reloadStateFromSqlite() {
    this.state = reloadStateFromSqliteBridge(this.state);
    this.saveState();
  }
}

export const db = new MockDB();
