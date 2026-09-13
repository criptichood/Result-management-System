import { Course, Result, Enrollment, User, ResultStatus } from '../types';

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
  user: User | undefined,
  allCourses: Course[],
  allEnrollments: Enrollment[],
  allResults: Result[]
) {
  let courses = allCourses;
  const assigned = courses.filter((c) => c.lecturerId === lecturerId);
  if (assigned.length > 0) {
    courses = assigned;
  } else if (user?.department) {
    courses = courses.filter((c) => c.department === user.department);
  }

  return courses.map((course) => {
    const enrollments = allEnrollments.filter((e) => e.courseId === course.id);
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

    return {
      ...course,
      enrolledCount: enrollments.length,
      scoredCount,
      submissionStatus,
      moderationNotes,
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
