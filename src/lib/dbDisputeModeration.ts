import { Result } from '../types';
import { calculateLetterGrade } from './academicOperations';

export interface ScoreOverrideParams {
  enrollmentId: string;
  caScore: number | null;
  examScore: number | null;
  results: Result[];
  justification: string;
}

export function createScoreOverrideResult({
  enrollmentId,
  caScore,
  examScore,
  results,
  justification,
}: ScoreOverrideParams): {
  isUpdate: boolean;
  resultId?: string;
  updatedData?: Partial<Result>;
  newResult?: Result;
  prevCa: number | string;
  prevExam: number | string;
  prevTotal: number | string;
  prevGrade: string;
  total: number | null;
  grade: string | null;
} {
  const existingResult = results.find((r) => r.enrollmentId === enrollmentId);
  const prevCa = existingResult?.caScore ?? 'None';
  const prevExam = existingResult?.examScore ?? 'None';
  const prevTotal = existingResult?.totalScore ?? 'None';
  const prevGrade = existingResult?.grade ?? 'None';

  const hasScores = caScore !== null || examScore !== null;
  const total = hasScores ? (caScore || 0) + (examScore || 0) : null;
  const grade = total !== null ? calculateLetterGrade(total) : null;

  if (existingResult) {
    return {
      isUpdate: true,
      resultId: existingResult.id,
      updatedData: {
        caScore,
        examScore,
        totalScore: total,
        grade,
        lastUpdated: new Date().toISOString(),
        moderationNotes: `Score modified by Chief Examiner: ${justification}`,
      },
      prevCa,
      prevExam,
      prevTotal,
      prevGrade,
      total,
      grade,
    };
  } else {
    return {
      isUpdate: false,
      newResult: {
        id: `r_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        enrollmentId,
        caScore,
        examScore,
        totalScore: total,
        grade,
        status: 'Submitted',
        lecturerId: 'u3',
        lastUpdated: new Date().toISOString(),
        moderationNotes: `Score created via Chief Examiner override: ${justification}`,
      },
      prevCa,
      prevExam,
      prevTotal,
      prevGrade,
      total,
      grade,
    };
  }
}
