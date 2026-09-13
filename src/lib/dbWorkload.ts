import { Course, Enrollment, User } from '../types';

export function computeLecturersWorkload(
  users: User[],
  courses: Course[],
  enrollments: Enrollment[]
) {
  const lecturers = users.filter((u) => u.role === 'Lecturer' || u.role === 'Chief Examiner');

  return lecturers.map((lec) => {
    const assignedCourses = courses.filter((c) => c.lecturerId === lec.id);
    const totalCreditUnits = assignedCourses.reduce((sum, c) => sum + (c.creditUnits || 0), 0);
    const assignedCourseIds = new Set(assignedCourses.map((c) => c.id));
    const totalStudentsEnrolled = enrollments.filter((e) =>
      assignedCourseIds.has(e.courseId)
    ).length;

    return {
      lecturer: lec,
      assignedCourses,
      totalCreditUnits,
      totalStudentsEnrolled,
    };
  });
}
