import { Course, Result, Enrollment, User, ResultStatus } from '../types';
import { sortSessionsDescending } from './academicSessionUtils';

/**
 * The live term a lecturer's dashboard is anchored to. Mirrors the institution's
 * `system_settings.currentSession`.
 */
export interface LecturerCourseContext {
  currentSession: string;
}

/** One past sitting of a course: who took it, and how they scored. */
export interface OfferingSummary {
  session: string;
  enrolledCount: number;
  scoredCount: number;
  /** Mean total score across scored candidates, or null if never scored. */
  averageScore: number | null;
}

/**
 * A course a lecturer is allocated to, resolved down to the single academic
 * session currently in play for them.
 *
 * A catalog course is not an offering: the same `Course` row is reused by every
 * cohort that ever took it. Enrollments carry the session, so the session is
 * what decides whose marks a lecturer is editing.
 */
export interface LecturerCourseOffering extends Course {
  /** Session this row's counts and status describe. */
  session: string;
  enrolledCount: number;
  scoredCount: number;
  submissionStatus: ResultStatus;
  moderationNotes?: string;
  /** Every session the course has enrollments for, newest first. */
  sessionList: string[];
  /**
   * True when this course is part of the lecturer's load in the live session,
   * i.e. it has a cohort running right now.
   */
  isCurrentOffering: boolean;
  /** False when no student has ever been enrolled (freshly allocated course). */
  hasEnrollments: boolean;
  /** Sessions before the live one, newest first, for the course archive. */
  previousOfferings: OfferingSummary[];
}

/**
 * Picks which session of a course a lecturer should be looking at: the live
 * session if the course is running in it, otherwise the most recent session it
 * has records for, otherwise the live session (an empty, not-yet-launched
 * offering).
 */
export function resolveOfferingSession(
  courseEnrollments: Enrollment[],
  currentSession: string
): string {
  const sessions = Array.from(new Set(courseEnrollments.map((e) => e.academicYear)));
  if (sessions.includes(currentSession)) return currentSession;
  const sorted = sortSessionsDescending(sessions);
  return sorted.length > 0 ? sorted[0] : currentSession;
}

export function computeStudentResults(
  studentId: string,
  enrollments: Enrollment[],
  results: Result[],
  courses: Course[]
) {
  const studentEnrollments = enrollments.filter((e) => e.studentId === studentId);
  return studentEnrollments.map((e) => {
    const result = results.find((r) => r.enrollmentId === e.id);
    const course = courses.find((c) => c.id === e.courseId);
    return { enrollment: e, result, course };
  });
}

export function computeLecturerCourses(
  lecturerId: string,
  allCourses: Course[],
  allEnrollments: Enrollment[],
  allResults: Result[],
  context: LecturerCourseContext
): LecturerCourseOffering[] {
  const { currentSession } = context;

  // Access control: a lecturer sees only what is explicitly allocated to them.
  // There is deliberately no department fallback — a lecturer is not the
  // custodian of every course their department offers.
  const courses = allCourses.filter(
    (c) =>
      c.lecturerId === lecturerId ||
      (c.lecturerIds && c.lecturerIds.includes(lecturerId)) ||
      (c.instructors && c.instructors.some((i) => i.lecturerId === lecturerId))
  );

  return courses.map((course) => {
    const allCourseEnrollments = allEnrollments.filter((e) => e.courseId === course.id);
    const session = resolveOfferingSession(allCourseEnrollments, currentSession);

    // Scope every count to the one session this lecturer is actually marking.
    const enrollments = allCourseEnrollments.filter((e) => e.academicYear === session);
    const enrollmentIds = new Set(enrollments.map((e) => e.id));
    const results = allResults.filter((r) => enrollmentIds.has(r.enrollmentId));

    const hasRejected = results.some((r) => r.status === 'Rejected');
    const isAllPublished = results.length > 0 && results.every((r) => r.status === 'Published');
    const hasSubmitted = results.some((r) => r.status === 'Submitted');
    const hasDraft = results.some((r) => r.status === 'Draft') || results.length < enrollments.length;

    let submissionStatus: ResultStatus = 'Draft';
    if (hasRejected) submissionStatus = 'Rejected';
    else if (isAllPublished) submissionStatus = 'Published';
    else if (hasSubmitted) submissionStatus = 'Submitted';
    else if (hasDraft) submissionStatus = 'Draft';

    const moderationNotes = results.find((r) => r.moderationNotes)?.moderationNotes;
    const scoredCount = results.filter(
      (r) => r.totalScore !== null && r.totalScore !== undefined
    ).length;

    const sessionList = sortSessionsDescending(
      Array.from(new Set(allCourseEnrollments.map((e) => e.academicYear)))
    );

    // Course archive: every past sitting of this course, for the lecturer who
    // taught it. Deliberately does not include the live session.
    const previousOfferings: OfferingSummary[] = sessionList
      .filter((s) => s !== currentSession)
      .map((pastSession) => {
        const pastEnrollments = allCourseEnrollments.filter((e) => e.academicYear === pastSession);
        const pastIds = new Set(pastEnrollments.map((e) => e.id));
        const pastResults = allResults.filter(
          (r) => pastIds.has(r.enrollmentId) && typeof r.totalScore === 'number'
        );
        const averageScore =
          pastResults.length > 0
            ? Math.round(
                (pastResults.reduce((sum, r) => sum + (r.totalScore as number), 0) /
                  pastResults.length) *
                  10
              ) / 10
            : null;
        return {
          session: pastSession,
          enrolledCount: pastEnrollments.length,
          scoredCount: pastResults.length,
          averageScore,
        };
      });

    return {
      ...course,
      session,
      enrolledCount: enrollments.length,
      scoredCount,
      submissionStatus,
      moderationNotes,
      sessionList,
      isCurrentOffering: sessionList.includes(currentSession),
      hasEnrollments: allCourseEnrollments.length > 0,
      previousOfferings,
    };
  });
}

export function computeOutstandingCarryovers(
  student: User | undefined,
  studentResults: { enrollment: Enrollment; result?: Result; course?: Course }[],
  currentSession: string
) {
  if (!student) return [];

  const studentLevel = student.level || 100;
  const passedCourseCodes = new Set<string>();
  const failedMap = new Map<string, any>();

  studentResults
    .filter((r) => r.result?.status === 'Published')
    .forEach((r) => {
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
        const isPastSessionOrLevel =
          r.enrollment?.academicYear !== currentSession || courseLevel < studentLevel;
        if (isPastSessionOrLevel) {
          failedMap.set(code, r);
        }
      }
    });

  return Array.from(failedMap.values());
}

export function computeAvailableCourses(
  student: User | undefined,
  allCourses: Course[],
  allEnrollments: Enrollment[],
  studentResults: { enrollment: Enrollment; result?: Result; course?: Course }[],
  currentSession: string,
  semester?: number
) {
  if (!student) return [];

  const studentLevel = student.level || 100;
  const enrollments = allEnrollments.filter((e) => e.studentId === student.id);

  const currentEnrolledCourseIds = new Set(
    enrollments
      .filter((e) => e.academicYear === currentSession && (!semester || e.semester === semester))
      .map((e) => e.courseId)
  );

  const passedCourseIds = new Set<string>();
  const carryoverCourseMap = new Map<string, Course>();

  studentResults
    .filter((r) => r.result?.status === 'Published')
    .forEach((r) => {
      if (!r.course) return;
      const score = r.result?.totalScore ?? 0;
      const grade = r.result?.grade;
      const isPassed = score >= 40 && grade !== 'F';

      if (isPassed) {
        passedCourseIds.add(r.course.id);
        carryoverCourseMap.delete(r.course.id);
      } else if (!passedCourseIds.has(r.course.id)) {
        const courseLevel = r.course.level || 100;
        const isPastSessionOrLevel =
          r.enrollment?.academicYear !== currentSession || courseLevel < studentLevel;
        if (isPastSessionOrLevel && (!semester || r.course.semester === semester)) {
          carryoverCourseMap.set(r.course.id, r.course);
        }
      }
    });

  const regularCourses = allCourses
    .filter((c) => {
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
    })
    .map((c) => ({
      ...c,
      isCarryover: false,
      isCompulsory: false,
    }));

  const carryoverCourses = Array.from(carryoverCourseMap.values())
    .filter((c) => !currentEnrolledCourseIds.has(c.id))
    .map((c) => ({
      ...c,
      isCarryover: true,
      isCompulsory: true,
    }));

  return [...carryoverCourses, ...regularCourses];
}
