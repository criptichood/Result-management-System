import { GradeDispute, ModerationLog, User } from '../types';
import { DB_KEY, DBState, loadAndMigrateDBState, createInitialDBState } from './dbStateInit';
import { syncStateToSqliteBridge, reloadStateFromSqliteBridge } from './dbSqliteBridge';
import { calculateLetterGrade } from './academicOperations';
import { CA_MAX, EXAM_MAX } from './gradingRosterCsv';
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

export interface SaveCourseScoresResult {
  /** False when a submission was refused for being incomplete. */
  ok: boolean;
  /** Result rows written. */
  written: number;
  /** Candidates with no CA and/or Exam score. */
  missingCount: number;
  totalEnrolled: number;
  /** Human-readable explanation, set only when `ok` is false. */
  reason?: string;
}

class MockDB {
  private state: DBState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = loadAndMigrateDBState();
    sqliteEngine.init().catch((e) => console.warn('SQLite init deferred:', e));
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in DB subscriber listener:', err);
      }
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fuaz_db_updated'));
    }
  }

  private saveState(state: DBState = this.state) {
    localStorage.setItem(DB_KEY, JSON.stringify(state));
    this.notifyListeners();
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
        currentSession: '2025/2026',
        currentSemester: 1,
      }
    );
  }

  updateSettings(newSettings: Partial<DBState['settings']>) {
    this.state.settings = { ...this.state.settings, ...newSettings };
    this.saveState();
  }

  allocateCourseLecturer(courseId: string, lecturerId?: string) {
    const course = this.from('courses').selectById(courseId);
    if (!course) return;
    if (!lecturerId) {
      this.from('courses').update(courseId, {
        lecturerId: undefined,
        lecturerIds: [],
        instructors: [],
      });
    } else {
      const existingInstructors = course.instructors || [];
      const isAlreadyIn = existingInstructors.some((i) => i.lecturerId === lecturerId);
      const updatedInstructors = isAlreadyIn
        ? existingInstructors
        : [
            {
              lecturerId,
              role: 'Lead Instructor' as const,
              assignedAt: new Date().toISOString(),
            },
            ...existingInstructors,
          ];
      const allIds = Array.from(new Set([lecturerId, ...(course.lecturerIds || [])]));
      this.from('courses').update(courseId, {
        lecturerId,
        lecturerIds: allIds,
        instructors: updatedInstructors,
      });
    }
    this.saveState();
  }

  updateCourseInstructors(courseId: string, instructors: any[]) {
    const course = this.from('courses').selectById(courseId);
    if (!course) return;
    const lecturerIds = instructors.map((i) => i.lecturerId);
    const primary =
      instructors.find((i) => i.role === 'Lead Instructor') || instructors[0];
    this.from('courses').update(courseId, {
      instructors,
      lecturerIds,
      lecturerId: primary ? primary.lecturerId : undefined,
    });
    this.saveState();
  }

  batchAllocateCourses(
    allocations: {
      courseId: string;
      lecturerId?: string;
      instructors?: any[];
    }[]
  ) {
    allocations.forEach(({ courseId, lecturerId, instructors }) => {
      const course = this.from('courses').selectById(courseId);
      if (course) {
        if (instructors && instructors.length > 0) {
          const lecturerIds = instructors.map((i) => i.lecturerId);
          const primary =
            instructors.find((i) => i.role === 'Lead Instructor') || instructors[0];
          this.from('courses').update(courseId, {
            instructors,
            lecturerIds,
            lecturerId: primary.lecturerId,
          });
        } else {
          this.allocateCourseLecturer(courseId, lecturerId);
        }
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
    const settings = this.getSettings();
    return computeLecturerCourses(
      lecturerId,
      this.from('courses').select(),
      this.from('enrollments').select(),
      this.from('results').select(),
      { currentSession: settings.currentSession || '2025/2026' }
    );
  }

  getOutstandingCarryovers(studentId: string) {
    const student = this.from('users').selectById(studentId);
    const resultsData = this.getStudentResults(studentId);
    const currentSession = this.getSettings().currentSession || '2025/2026';
    return computeOutstandingCarryovers(student, resultsData, currentSession);
  }

  getAvailableCourses(studentId: string, semester?: number) {
    const student = this.from('users').selectById(studentId);
    const currentSession = this.getSettings().currentSession || '2025/2026';
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
    academicYear?: string
  ) {
    const session = academicYear || this.getSettings().currentSession || '2025/2026';
    const courses = this.from('courses').select();
    courseIds.forEach((courseId) => {
      const enrollmentId = `e_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      this.from('enrollments').insert({
        id: enrollmentId,
        studentId,
        courseId,
        semester,
        academicYear: session,
      });
      // Attribute the new sheet to the course's allocated lecturer, not a
      // hardcoded one — otherwise every registration lands on u3 regardless.
      const course = courses.find((c) => c.id === courseId);
      this.from('results').insert({
        id: `r_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        enrollmentId,
        caScore: null,
        examScore: null,
        totalScore: null,
        grade: null,
        status: 'Draft',
        lecturerId: course?.lecturerId || '',
        lastUpdated: new Date().toISOString(),
      });
    });
  }

  calculateGrade(total: number): string {
    return calculateLetterGrade(total);
  }

  /**
   * Writes a sheet. Drafts may be partial; a submission may not.
   *
   * This is the authority for the "no blank report reaches the Chief Examiner"
   * rule, so the check lives here rather than in a button's `disabled`. Every
   * route in (the toolbar, the CSV import's apply-and-submit, anything added
   * later) goes through it.
   */
  saveCourseScores(
    courseId: string,
    scores: Record<string, { ca: string; exam: string }>,
    lecturerId: string,
    status: 'Draft' | 'Submitted' = 'Draft'
  ): SaveCourseScoresResult {
    const enrollments = this.from('enrollments').selectWhere((e) => e.courseId === courseId);
    const existingResults = this.from('results').select();

    if (status === 'Submitted') {
      // Nothing enrolled means nothing to submit. Checked before the loop
      // because an empty roster has no "incomplete" rows to trip the test below.
      if (enrollments.length === 0) {
        return {
          ok: false,
          written: 0,
          missingCount: 0,
          totalEnrolled: 0,
          reason: 'This course has no enrolled candidates, so there is nothing to submit.',
        };
      }

      let incomplete = 0;
      let outOfRange = 0;
      enrollments.forEach((e) => {
        const entry = scores[e.id];
        if (!entry) {
          incomplete++;
          return;
        }
        const ca = parseFloat(entry.ca);
        const exam = parseFloat(entry.exam);
        if (isNaN(ca) || isNaN(exam)) {
          incomplete++;
          return;
        }
        if (ca < 0 || ca > CA_MAX || exam < 0 || exam > EXAM_MAX) outOfRange++;
      });

      if (incomplete > 0 || outOfRange > 0) {
        const parts: string[] = [];
        if (incomplete > 0) {
          parts.push(
            `${incomplete} of ${enrollments.length} candidates still have no CA or Exam score`
          );
        }
        if (outOfRange > 0) {
          parts.push(
            `${outOfRange} ${outOfRange === 1 ? 'score is' : 'scores are'} outside the permitted range (CA 0-${CA_MAX}, Exam 0-${EXAM_MAX})`
          );
        }
        return {
          ok: false,
          written: 0,
          missingCount: incomplete,
          totalEnrolled: enrollments.length,
          reason: `This sheet cannot be submitted for moderation: ${parts.join('; ')}.`,
        };
      }
    }

    let written = 0;

    enrollments.forEach((e) => {
      const studentScore = scores[e.id];
      if (!studentScore) return;
      written++;

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

    return { ok: true, written, missingCount: 0, totalEnrolled: enrollments.length };
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

  moderateCourse(
    courseId: string,
    action: 'endorse' | 'approve' | 'reject' | 'publish',
    notes?: string,
    examiner?: User
  ) {
    const enrollments = this.from('enrollments').selectWhere((e) => e.courseId === courseId);
    const results = this.from('results').select();
    const course = this.from('courses').selectById(courseId);

    let updatedCount = 0;
    const targetStatus =
      action === 'publish'
        ? 'Published'
        : action === 'reject'
        ? 'Rejected'
        : 'Approved'; // 'endorse' or 'approve' sets status to 'Approved' (HOD endorsed, awaiting Senate)

    enrollments.forEach((e) => {
      const res = results.find((r) => r.enrollmentId === e.id);
      if (res) {
        updatedCount++;
        this.from('results').update(res.id, {
          status: targetStatus,
          moderationNotes:
            action === 'reject'
              ? notes || 'Returned to lecturer by HOD for script remarking and score verification.'
              : undefined,
          lastUpdated: new Date().toISOString(),
        });
      }
    });

    if (course) {
      let logAction: ModerationLog['action'] = 'Departmentally Endorsed';
      let defaultNotes = 'Vetted and endorsed by Departmental Board of Examiners (HOD). Recommended to Senate for ratification.';

      if (action === 'publish') {
        logAction = 'Senate Ratified & Released';
        defaultNotes = 'Formally ratified by University Senate Examination Council. Released to student portals.';
      } else if (action === 'reject') {
        logAction = 'Returned for Remarking';
        defaultNotes = 'Returned to lecturer by Departmental Board for script remarking and mark audit.';
      }

      this.addModerationLog({
        courseId,
        courseCode: course.code,
        examinerId: examiner?.id || 'u2',
        examinerName: examiner?.name || 'Prof. Bello Ibrahim (HOD & Chief Examiner)',
        action: logAction,
        notes: notes || defaultNotes,
        affectedStudentCount: updatedCount,
        details: `Course: ${course.title} (${course.code}) • Dept of ${course.department}`,
      });
    }
  }

  batchModerateCourses(
    courseIds: string[],
    action: 'endorse' | 'approve' | 'reject' | 'publish',
    notes?: string,
    examiner?: User
  ) {
    courseIds.forEach((courseId) => {
      this.moderateCourse(courseId, action, notes, examiner);
    });
  }

  ratifySenateCourses(courseIds: string[], senateOfficer?: User, notes?: string) {
    courseIds.forEach((courseId) => {
      this.moderateCourse(
        courseId,
        'publish',
        notes || 'Formally ratified by University Senate. Published to student academic record.',
        senateOfficer
      );
    });
  }

  getSenatePendingCourses() {
    const allCourses = this.from('courses').select();
    const allResults = this.from('results').select();
    const allEnrollments = this.from('enrollments').select();

    return allCourses.filter((course) => {
      const courseEnrollments = allEnrollments.filter((e) => e.courseId === course.id);
      if (courseEnrollments.length === 0) return false;
      return courseEnrollments.some((e) => {
        const r = allResults.find((res) => res.enrollmentId === e.id);
        return r?.status === 'Approved';
      });
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
