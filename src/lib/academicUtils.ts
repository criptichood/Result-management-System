// Academic calculations and helpers

export interface GradeDistribution {
  A: number;
  B: number;
  C: number;
  D: number;
  F: number;
}

export interface DegreeClassification {
  label: string;
  badgeClass: string;
}

export const getDegreeClassification = (cgpa: number): DegreeClassification => {
  if (cgpa >= 4.50) return { label: 'First Class Honours', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  if (cgpa >= 3.50) return { label: 'Second Class Honours (Upper Division)', badgeClass: 'bg-teal-100 text-teal-800 border-teal-300' };
  if (cgpa >= 2.40) return { label: 'Second Class Honours (Lower Division)', badgeClass: 'bg-blue-100 text-blue-800 border-blue-300' };
  if (cgpa >= 1.50) return { label: 'Third Class Honours', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300' };
  return { label: 'Pass Degree', badgeClass: 'bg-slate-100 text-slate-800 border-slate-300' };
};

export const getGradePoint = (grade: string | undefined): number => {
  switch (grade) {
    case 'A': return 5;
    case 'B': return 4;
    case 'C': return 3;
    case 'D': return 2;
    default: return 0;
  }
};

/**
 * Sorts semester keys (e.g. "2023/2024 2nd Semester", "2023/2024 1st Semester", "2022/2023 2nd Semester")
 * chronologically in descending order so the most recent semester is at the top.
 */
export const sortSemesterKeysDescending = (keys: string[]): string[] => {
  return [...keys].sort((a, b) => {
    // Extract year start (e.g. "2023/2024" -> 2023)
    const yearMatchA = a.match(/(\d{4})\/(\d{4})/);
    const yearMatchB = b.match(/(\d{4})\/(\d{4})/);
    
    const yearA = yearMatchA ? parseInt(yearMatchA[1], 10) : 0;
    const yearB = yearMatchB ? parseInt(yearMatchB[1], 10) : 0;

    if (yearA !== yearB) {
      return yearB - yearA; // Higher year first
    }

    // Same year: 2nd Semester is newer than 1st Semester
    const isSem2A = a.toLowerCase().includes('2nd') || a.toLowerCase().includes('second');
    const isSem2B = b.toLowerCase().includes('2nd') || b.toLowerCase().includes('second');

    if (isSem2A && !isSem2B) return -1;
    if (!isSem2A && isSem2B) return 1;

    return a.localeCompare(b);
  });
};

export const calculateSemesterStats = (items: any[]) => {
  let semPoints = 0;
  let semCredits = 0;
  let totalScoreSum = 0;
  let totalCaSum = 0;
  let totalExamSum = 0;
  let scoredCourses = 0;
  const dist: GradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  const failedItems: any[] = [];

  items.forEach(r => {
    const credits = r.course?.creditUnits || 0;
    if (r.result?.status === 'Published' && r.result?.grade) {
      const grade = r.result.grade;
      semCredits += credits;
      scoredCourses++;
      totalScoreSum += (r.result.totalScore || 0);
      totalCaSum += (r.result.caScore || 0);
      totalExamSum += (r.result.examScore || 0);

      const gp = getGradePoint(grade);
      semPoints += gp * credits;
      
      if (grade === 'A') dist.A++;
      else if (grade === 'B') dist.B++;
      else if (grade === 'C') dist.C++;
      else if (grade === 'D') dist.D++;
      else if (grade === 'F') dist.F++;

      if ((r.result.totalScore ?? 0) < 40 || grade === 'F') {
        failedItems.push(r);
      }
    }
  });

  return {
    gpa: semCredits > 0 ? (semPoints / semCredits) : 0,
    credits: semCredits || items.reduce((acc, curr) => acc + (curr.course?.creditUnits || 0), 0),
    coursesCount: items.length,
    distribution: dist,
    totalQualityPoints: semPoints,
    avgScore: scoredCourses > 0 ? (totalScoreSum / scoredCourses).toFixed(1) : '0.0',
    avgCa: scoredCourses > 0 ? (totalCaSum / scoredCourses).toFixed(1) : '0.0',
    avgExam: scoredCourses > 0 ? (totalExamSum / scoredCourses).toFixed(1) : '0.0',
    failedItems
  };
};

/**
 * Computes genuine outstanding carryovers for a student:
 * - A course from a previous session / lower level that was failed (Grade F or score < 40)
 * - Has NOT subsequently been retaken and passed (Grade >= E / score >= 40)
 */
export const computeOutstandingCarryovers = (
  resultsData: any[],
  currentSession: string = '2024/2025',
  studentLevel: number = 100
): any[] => {
  const passedCourseCodes = new Set<string>();
  const failedRecordsByCode = new Map<string, any>();

  // Sort chronological
  const publishedRecords = resultsData.filter(r => r.result?.status === 'Published');
  
  publishedRecords.forEach(r => {
    const code = r.course?.code;
    if (!code) return;
    const score = r.result?.totalScore ?? 0;
    const grade = r.result?.grade;
    const isPassed = score >= 40 && grade !== 'F';

    if (isPassed) {
      passedCourseCodes.add(code);
      failedRecordsByCode.delete(code);
    } else if (!passedCourseCodes.has(code)) {
      // It is only a carryover if it is from an earlier level OR prior session
      const courseLevel = r.course?.level || 100;
      const isPastSessionOrLevel = (r.enrollment?.academicYear !== currentSession) || (courseLevel < studentLevel);
      
      if (isPastSessionOrLevel) {
        failedRecordsByCode.set(code, r);
      }
    }
  });

  return Array.from(failedRecordsByCode.values());
};

export const exportResultsToCsv = (
  publishedResults: any[], 
  matricNumber: string, 
  title: string = 'Academic_Results'
): Promise<boolean> => {
  return new Promise((resolve) => {
    // Artificial small delay for UX feedback
    setTimeout(() => {
      if (publishedResults.length === 0) {
        resolve(false);
        return;
      }
      
      const headers = [
        'Academic Session',
        'Semester',
        'Course Code',
        'Course Title',
        'Credit Units',
        'CA Score (30/40)',
        'Exam Score (70/60)',
        'Total Score (100)',
        'Grade',
        'Grade Point',
        'Quality Points (W.S)',
        'Status'
      ];

      let totalCredits = 0;
      let totalQualityPoints = 0;

      const rows = publishedResults.map(r => {
        const credits = r.course?.creditUnits || 0;
        const grade = r.result?.grade || '-';
        const gp = getGradePoint(grade);
        const qp = r.result?.status === 'Published' ? (gp * credits) : 0;
        
        if (r.result?.status === 'Published') {
          totalCredits += credits;
          totalQualityPoints += qp;
        }

        return [
          r.enrollment?.academicYear || '',
          r.enrollment?.semester === 1 ? '1st Semester' : '2nd Semester',
          r.course?.code || '',
          r.course?.title || '',
          credits,
          r.result?.caScore ?? '-',
          r.result?.examScore ?? '-',
          r.result?.totalScore ?? '-',
          grade,
          gp,
          qp,
          (r.result?.totalScore ?? 0) >= 40 ? 'Passed' : (r.result?.status === 'Published' ? 'Failed' : 'Pending')
        ];
      });

      const gpa = totalCredits > 0 ? (totalQualityPoints / totalCredits).toFixed(2) : '0.00';

      const summaryRows = [
        [],
        ['SUMMARY STATISTICS', '', '', '', '', '', '', '', '', '', '', ''],
        ['Total Registered Credits', totalCredits, '', '', '', '', '', '', '', '', '', ''],
        ['Total Quality Points', totalQualityPoints, '', '', '', '', '', '', '', '', '', ''],
        ['Calculated GPA / CGPA', gpa, '', '', '', '', '', '', '', '', '', ''],
        ['Generated Date', new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), '', '', '', '', '', '', '', '', '', '']
      ];

      const csvContent = [
        [`"FEDERAL UNIVERSITY OF AGRICULTURE, ZURU - OFFICIAL STATEMENT OF RESULTS"`, '', '', '', '', '', '', '', '', '', '', ''],
        [`"Matriculation Number: ${matricNumber}"`, '', '', '', '', '', '', '', '', '', '', ''],
        [],
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
        ...summaryRows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      const sanitizedTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
      link.setAttribute('download', `${matricNumber || 'Student'}_${sanitizedTitle}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      resolve(true);
    }, 450);
  });
};
