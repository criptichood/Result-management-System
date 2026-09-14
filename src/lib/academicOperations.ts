import { Course, ResultStatus } from '../types';

export function calculateLetterGrade(total: number): string {
  if (total >= 70) return 'A';
  if (total >= 60) return 'B';
  if (total >= 50) return 'C';
  if (total >= 45) return 'D';
  return 'F';
}

export interface LecturerCourseSummary extends Course {
  enrolledCount: number;
  scoredCount: number;
  submissionStatus: ResultStatus;
  moderationNotes?: string;
}
