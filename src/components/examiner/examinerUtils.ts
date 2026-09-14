/**
 * Utility functions for Chief Examiner reporting, exports, and audits.
 */

export function exportCourseRosterCSV(course: any) {
  const detailed = course.detailedResults || [];
  const headers = [
    'Matric Number',
    'Student Name',
    'Course Code',
    'Course Title',
    'CA (40)',
    'Exam (60)',
    'Total (100)',
    'Grade',
    'Status',
  ];
  const rows = detailed.map((dr: any) => [
    `"${dr.student?.matricNumber || ''}"`,
    `"${dr.student?.name || ''}"`,
    `"${course.code || ''}"`,
    `"${course.title || ''}"`,
    dr.result?.caScore ?? '',
    dr.result?.examScore ?? '',
    dr.result?.totalScore ?? '',
    `"${dr.result?.grade ?? ''}"`,
    `"${dr.result?.status ?? ''}"`,
  ]);
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e: string[]) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `${(course.code || 'Course').replace(/\s+/g, '_')}_Roster.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
