import { User, Course, Result, Enrollment } from '../types';
import { getGradePoint } from './academicUtils';

export interface StudentSenateSummary {
  student: User;
  tcr: number; // Total Credits Registered
  tce: number; // Total Credits Earned (Grade != F && score >= 40)
  twp: number; // Total Weighted Points (Quality Points)
  cgpa: number;
  classOfDegree: 'First Class' | 'Second Class Upper' | 'Second Class Lower' | 'Third Class' | 'Pass' | 'Probation / Warning';
  classBadgeColor: string;
  standing: 'Excellent Standing' | 'Good Standing' | 'Academic Warning' | 'Academic Probation' | 'Graduation Deficient';
  standingBadgeVariant: 'success' | 'warning' | 'destructive' | 'default';
  carryoverCount: number;
  carryoverCourses: { code: string; title: string; score: number; grade: string; units: number }[];
  isGraduatingLevel: boolean;
  graduationStatus: 'Cleared for Graduation' | 'Deficient (Carryovers)' | 'Deficient (Credits)' | 'In Progress';
  resultsCount: number;
}

export interface DepartmentBenchmark {
  department: string;
  college: string;
  totalStudents: number;
  meanCgpa: number;
  passRate: number; // Percentage with CGPA >= 1.00
  distinctionRate: number; // Percentage with CGPA >= 3.50 (First Class + 2:1)
  firstClassCount: number;
  secondUpperCount: number;
  secondLowerCount: number;
  thirdClassCount: number;
  passCount: number;
  probationCount: number;
  atRiskCount: number;
}

export interface CourseAnomaly {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  department: string;
  creditUnits: number;
  lecturerName: string;
  enrolledCount: number;
  scoredCount: number;
  passedCount: number;
  failedCount: number;
  failureRate: number; // Percentage
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  anomalySeverity: 'Normal' | 'Moderate Concern' | 'Severe Anomaly';
  anomalyReason?: string;
}

export interface SenateInstitutionalAnalytics {
  totalStudents: number;
  meanCgpa: number;
  overallPassRate: number;
  distinctionRate: number; // First Class + 2:1
  atRiskCount: number; // Warning or Probation
  graduatingEligibleCount: number;
  graduatingDeficientCount: number;
  degreeDistribution: {
    name: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  departmentBenchmarks: DepartmentBenchmark[];
  studentSummaries: StudentSenateSummary[];
  courseAnomalies: CourseAnomaly[];
  levelBreakdown: {
    level: number;
    count: number;
    meanCgpa: number;
    passRate: number;
  }[];
}

export const getStudentDegreeClass = (cgpa: number): { title: StudentSenateSummary['classOfDegree']; badgeColor: string } => {
  if (cgpa >= 4.50) return { title: 'First Class', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' };
  if (cgpa >= 3.50) return { title: 'Second Class Upper', badgeColor: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800' };
  if (cgpa >= 2.40) return { title: 'Second Class Lower', badgeColor: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800' };
  if (cgpa >= 1.50) return { title: 'Third Class', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800' };
  if (cgpa >= 1.00) return { title: 'Pass', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' };
  return { title: 'Probation / Warning', badgeColor: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800' };
};

export const computeStudentSenateSummary = (
  student: User,
  enrollments: Enrollment[],
  results: Result[],
  courses: Course[]
): StudentSenateSummary => {
  const studentEnrollments = enrollments.filter(e => e.studentId === student.id);
  const studentEnrollmentIds = new Set(studentEnrollments.map(e => e.id));
  const studentResults = results.filter(r => studentEnrollmentIds.has(r.enrollmentId));
  const coursesMap = new Map(courses.map(c => [c.id, c]));

  let tcr = 0;
  let tce = 0;
  let twp = 0;

  const passedCourses = new Set<string>();
  const failedMap = new Map<string, { code: string; title: string; score: number; grade: string; units: number }>();

  studentEnrollments.forEach(enrollment => {
    const res = studentResults.find(r => r.enrollmentId === enrollment.id);
    const course = coursesMap.get(enrollment.courseId);
    if (!course) return;

    const units = course.creditUnits || 0;

    if (res && res.status === 'Published' && res.grade) {
      tcr += units;
      const score = res.totalScore ?? 0;
      const grade = res.grade;
      const isPassed = score >= 40 && grade !== 'F';

      const gp = getGradePoint(grade);
      twp += units * gp;

      if (isPassed) {
        tce += units;
        passedCourses.add(course.code);
        failedMap.delete(course.code);
      } else {
        if (!passedCourses.has(course.code)) {
          failedMap.set(course.code, {
            code: course.code,
            title: course.title,
            score,
            grade,
            units
          });
        }
      }
    }
  });

  const cgpa = tcr > 0 ? parseFloat((twp / tcr).toFixed(2)) : 0.0;
  const { title: classOfDegree, badgeColor: classBadgeColor } = getStudentDegreeClass(cgpa);

  const carryoverCourses = Array.from(failedMap.values());
  const carryoverCount = carryoverCourses.length;

  let standing: StudentSenateSummary['standing'] = 'Good Standing';
  let standingBadgeVariant: StudentSenateSummary['standingBadgeVariant'] = 'default';

  if (cgpa >= 4.50) {
    standing = 'Excellent Standing';
    standingBadgeVariant = 'success';
  } else if (cgpa >= 1.50) {
    standing = 'Good Standing';
    standingBadgeVariant = 'default';
  } else if (cgpa >= 1.00) {
    standing = 'Academic Warning';
    standingBadgeVariant = 'warning';
  } else {
    standing = 'Academic Probation';
    standingBadgeVariant = 'destructive';
  }

  const isGraduatingLevel = (student.level || 100) >= 400;
  let graduationStatus: StudentSenateSummary['graduationStatus'] = 'In Progress';

  if (isGraduatingLevel) {
    if (carryoverCount > 0) {
      graduationStatus = 'Deficient (Carryovers)';
    } else if (tce < 120 && tcr > 0) {
      // In Nigerian universities, minimum required credits for standard 4-year degree is ~120
      graduationStatus = 'Deficient (Credits)';
    } else if (tcr > 0 && cgpa >= 1.00) {
      graduationStatus = 'Cleared for Graduation';
    }
  }

  return {
    student,
    tcr,
    tce,
    twp,
    cgpa,
    classOfDegree,
    classBadgeColor,
    standing,
    standingBadgeVariant,
    carryoverCount,
    carryoverCourses,
    isGraduatingLevel,
    graduationStatus,
    resultsCount: studentResults.filter(r => r.status === 'Published').length
  };
};

export const computeSenateInstitutionalAnalytics = (
  users: User[],
  courses: Course[],
  enrollments: Enrollment[],
  results: Result[],
  filters?: {
    department?: string;
    level?: number;
    college?: string;
  }
): SenateInstitutionalAnalytics => {
  let students = users.filter(u => u.role === 'Student');

  if (filters?.department && filters.department !== 'all') {
    students = students.filter(s => s.department === filters.department);
  }
  if (filters?.level && filters.level !== 0) {
    students = students.filter(s => s.level === filters.level);
  }
  if (filters?.college && filters.college !== 'all') {
    students = students.filter(s => s.college === filters.college);
  }

  const studentSummaries = students.map(student =>
    computeStudentSenateSummary(student, enrollments, results, courses)
  );

  const totalStudents = studentSummaries.length;
  const scoredStudents = studentSummaries.filter(s => s.tcr > 0);

  const meanCgpa = scoredStudents.length > 0
    ? parseFloat((scoredStudents.reduce((acc, s) => acc + s.cgpa, 0) / scoredStudents.length).toFixed(2))
    : 0.0;

  const passedStudents = scoredStudents.filter(s => s.cgpa >= 1.00);
  const overallPassRate = scoredStudents.length > 0
    ? parseFloat(((passedStudents.length / scoredStudents.length) * 100).toFixed(1))
    : 0.0;

  const distinctionStudents = scoredStudents.filter(s => s.cgpa >= 3.50);
  const distinctionRate = scoredStudents.length > 0
    ? parseFloat(((distinctionStudents.length / scoredStudents.length) * 100).toFixed(1))
    : 0.0;

  const atRiskCount = scoredStudents.filter(s => s.cgpa < 1.50).length;

  const graduatingCandidates = studentSummaries.filter(s => s.isGraduatingLevel);
  const graduatingEligibleCount = graduatingCandidates.filter(s => s.graduationStatus === 'Cleared for Graduation').length;
  const graduatingDeficientCount = graduatingCandidates.filter(s => s.graduationStatus.startsWith('Deficient')).length;

  // Degree Distribution
  const firstClass = scoredStudents.filter(s => s.classOfDegree === 'First Class').length;
  const secondUpper = scoredStudents.filter(s => s.classOfDegree === 'Second Class Upper').length;
  const secondLower = scoredStudents.filter(s => s.classOfDegree === 'Second Class Lower').length;
  const thirdClass = scoredStudents.filter(s => s.classOfDegree === 'Third Class').length;
  const passDegree = scoredStudents.filter(s => s.classOfDegree === 'Pass').length;
  const probation = scoredStudents.filter(s => s.classOfDegree === 'Probation / Warning').length;

  const degreeDistribution = [
    { name: 'First Class (4.50 - 5.00)', count: firstClass, percentage: scoredStudents.length ? Math.round((firstClass / scoredStudents.length) * 100) : 0, color: '#059669' },
    { name: '2nd Class Upper (3.50 - 4.49)', count: secondUpper, percentage: scoredStudents.length ? Math.round((secondUpper / scoredStudents.length) * 100) : 0, color: '#0d9488' },
    { name: '2nd Class Lower (2.40 - 3.49)', count: secondLower, percentage: scoredStudents.length ? Math.round((secondLower / scoredStudents.length) * 100) : 0, color: '#2563eb' },
    { name: 'Third Class (1.50 - 2.39)', count: thirdClass, percentage: scoredStudents.length ? Math.round((thirdClass / scoredStudents.length) * 100) : 0, color: '#d97706' },
    { name: 'Pass Degree (1.00 - 1.49)', count: passDegree, percentage: scoredStudents.length ? Math.round((passDegree / scoredStudents.length) * 100) : 0, color: '#64748b' },
    { name: 'Probation (< 1.00)', count: probation, percentage: scoredStudents.length ? Math.round((probation / scoredStudents.length) * 100) : 0, color: '#dc2626' },
  ];

  // Department Benchmarks
  const deptMap = new Map<string, StudentSenateSummary[]>();
  studentSummaries.forEach(s => {
    const dept = s.student.department || 'General';
    if (!deptMap.has(dept)) deptMap.set(dept, []);
    deptMap.get(dept)!.push(s);
  });

  const departmentBenchmarks: DepartmentBenchmark[] = Array.from(deptMap.entries()).map(([dept, dStudents]) => {
    const dScored = dStudents.filter(s => s.tcr > 0);
    const dMean = dScored.length > 0
      ? parseFloat((dScored.reduce((acc, s) => acc + s.cgpa, 0) / dScored.length).toFixed(2))
      : 0.0;
    const dPassed = dScored.filter(s => s.cgpa >= 1.00);
    const dPassRate = dScored.length > 0 ? parseFloat(((dPassed.length / dScored.length) * 100).toFixed(1)) : 0;
    const dDistinction = dScored.filter(s => s.cgpa >= 3.50);
    const dDistinctionRate = dScored.length > 0 ? parseFloat(((dDistinction.length / dScored.length) * 100).toFixed(1)) : 0;

    return {
      department: dept,
      college: dStudents[0]?.student.college || 'FCAS',
      totalStudents: dStudents.length,
      meanCgpa: dMean,
      passRate: dPassRate,
      distinctionRate: dDistinctionRate,
      firstClassCount: dScored.filter(s => s.classOfDegree === 'First Class').length,
      secondUpperCount: dScored.filter(s => s.classOfDegree === 'Second Class Upper').length,
      secondLowerCount: dScored.filter(s => s.classOfDegree === 'Second Class Lower').length,
      thirdClassCount: dScored.filter(s => s.classOfDegree === 'Third Class').length,
      passCount: dScored.filter(s => s.classOfDegree === 'Pass').length,
      probationCount: dScored.filter(s => s.classOfDegree === 'Probation / Warning').length,
      atRiskCount: dScored.filter(s => s.cgpa < 1.50).length
    };
  }).sort((a, b) => b.meanCgpa - a.meanCgpa);

  // Level breakdown
  const levels = [100, 200, 300, 400];
  const levelBreakdown = levels.map(level => {
    const lStudents = studentSummaries.filter(s => (s.student.level || 100) === level);
    const lScored = lStudents.filter(s => s.tcr > 0);
    const lMean = lScored.length > 0 ? parseFloat((lScored.reduce((a, s) => a + s.cgpa, 0) / lScored.length).toFixed(2)) : 0.0;
    const lPass = lScored.filter(s => s.cgpa >= 1.00);
    const lPassRate = lScored.length > 0 ? parseFloat(((lPass.length / lScored.length) * 100).toFixed(1)) : 0.0;

    return {
      level,
      count: lStudents.length,
      meanCgpa: lMean,
      passRate: lPassRate
    };
  });

  // Course Anomalies Detection
  const usersMap = new Map(users.map(u => [u.id, u.name]));
  const courseAnomalies: CourseAnomaly[] = courses.map(course => {
    const cEnrollments = enrollments.filter(e => e.courseId === course.id);
    const cEnrollmentIds = new Set(cEnrollments.map(e => e.id));
    const cResults = results.filter(r => cEnrollmentIds.has(r.enrollmentId) && r.status === 'Published' && r.totalScore !== null);

    const scoredCount = cResults.length;
    if (scoredCount === 0) {
      return {
        courseId: course.id,
        courseCode: course.code,
        courseTitle: course.title,
        department: course.department,
        creditUnits: course.creditUnits,
        lecturerName: course.lecturerId ? usersMap.get(course.lecturerId) || 'Assigned Lecturer' : 'Unassigned',
        enrolledCount: cEnrollments.length,
        scoredCount: 0,
        passedCount: 0,
        failedCount: 0,
        failureRate: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        anomalySeverity: 'Normal' as const,
      };
    }

    const scores = cResults.map(r => r.totalScore || 0);
    const passed = cResults.filter(r => (r.totalScore || 0) >= 40 && r.grade !== 'F').length;
    const failed = scoredCount - passed;
    const failRate = parseFloat(((failed / scoredCount) * 100).toFixed(1));
    const avgScore = parseFloat((scores.reduce((a, b) => a + b, 0) / scoredCount).toFixed(1));
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    let anomalySeverity: CourseAnomaly['anomalySeverity'] = 'Normal';
    let anomalyReason: string | undefined = undefined;

    if (failRate >= 35) {
      anomalySeverity = 'Severe Anomaly';
      anomalyReason = `High Failure Rate of ${failRate}% (${failed}/${scoredCount} students failed).`;
    } else if (failRate >= 20 || avgScore < 45) {
      anomalySeverity = 'Moderate Concern';
      anomalyReason = `Elevated Failure Rate (${failRate}%) or below-average class mean score (${avgScore}/100).`;
    }

    return {
      courseId: course.id,
      courseCode: course.code,
      courseTitle: course.title,
      department: course.department,
      creditUnits: course.creditUnits,
      lecturerName: course.lecturerId ? usersMap.get(course.lecturerId) || 'Assigned Lecturer' : 'Unassigned',
      enrolledCount: cEnrollments.length,
      scoredCount,
      passedCount: passed,
      failedCount: failed,
      failureRate: failRate,
      averageScore: avgScore,
      highestScore: maxScore,
      lowestScore: minScore,
      anomalySeverity,
      anomalyReason
    };
  }).filter(c => c.scoredCount > 0).sort((a, b) => b.failureRate - a.failureRate);

  return {
    totalStudents,
    meanCgpa,
    overallPassRate,
    distinctionRate,
    atRiskCount,
    graduatingEligibleCount,
    graduatingDeficientCount,
    degreeDistribution,
    departmentBenchmarks,
    studentSummaries,
    courseAnomalies,
    levelBreakdown
  };
};

export const exportSenateBroadsheetToCsv = (
  students: StudentSenateSummary[],
  title: string = 'Senate_Official_Broadsheet'
) => {
  if (students.length === 0) return;

  const headers = [
    'S/N',
    'Matriculation Number',
    'Student Full Name',
    'Department',
    'College',
    'Academic Level',
    'TCR (Total Credits Reg)',
    'TCE (Total Credits Earned)',
    'TWP (Weighted Quality Points)',
    'CGPA (5.00 Max)',
    'Class of Degree Standing',
    'Academic Standing',
    'Carryover Count',
    'Carryover Courses Summary',
    'Graduation Clearance'
  ];

  const rows = students.map((s, idx) => [
    idx + 1,
    s.student.matricNumber || 'N/A',
    s.student.name,
    s.student.department || 'N/A',
    s.student.college || 'FCAS',
    `${s.student.level || 100}L`,
    s.tcr,
    s.tce,
    s.twp,
    s.cgpa.toFixed(2),
    s.classOfDegree,
    s.standing,
    s.carryoverCount,
    s.carryoverCourses.map(c => `${c.code}(${c.score})`).join('; ') || 'None',
    s.graduationStatus
  ]);

  const csvContent = [
    [`"FEDERAL UNIVERSITY OF AGRICULTURE & TECHNOLOGY - SENATE ACADEMIC BROADSHEET"`],
    [`"Generated on: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()}"`],
    [],
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${title}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
