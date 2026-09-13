import { GradeDispute, ModerationLog, Result, Enrollment, User } from '../types';
import { DBState } from './dbStateInit';
import { calculateLetterGrade } from './academicOperations';

export function getDisputesList(state: DBState): GradeDispute[] {
  return state.disputes || [];
}

export function getStudentDisputes(state: DBState, studentId: string): GradeDispute[] {
  return (state.disputes || []).filter((d) => d.studentId === studentId);
}

export function getLecturerDisputes(state: DBState, lecturerId: string): GradeDispute[] {
  const lecturerCourses = new Set(
    state.courses.filter((c) => c.lecturerId === lecturerId).map((c) => c.id)
  );
  return (state.disputes || []).filter(
    (d) => d.lecturerId === lecturerId || (d.courseId && lecturerCourses.has(d.courseId))
  );
}

export function addDispute(
  state: DBState,
  disputeData: Omit<GradeDispute, 'id' | 'createdAt' | 'status'>
): GradeDispute {
  const newDispute: GradeDispute = {
    ...disputeData,
    id: `disp_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  if (!state.disputes) {
    state.disputes = [];
  }

  state.disputes.unshift(newDispute);
  return newDispute;
}

export function resolveDispute(
  state: DBState,
  disputeId: string,
  status: GradeDispute['status'],
  resolutionNote?: string,
  adjustedScores?: { ca?: number; exam?: number; total?: number },
  resolver?: { id: string; name: string },
  addModLog?: (log: Omit<ModerationLog, 'id' | 'timestamp'>) => void
): GradeDispute | null {
  if (!state.disputes) return null;
  const index = state.disputes.findIndex((d) => d.id === disputeId);
  if (index === -1) return null;

  const dispute = state.disputes[index];
  dispute.status = status;
  dispute.resolutionNote = resolutionNote || dispute.resolutionNote;
  dispute.resolvedBy = resolver?.name || dispute.resolvedBy;
  dispute.resolvedAt = new Date().toISOString();

  if (adjustedScores) {
    dispute.adjustedCa = adjustedScores.ca ?? dispute.adjustedCa;
    dispute.adjustedExam = adjustedScores.exam ?? dispute.adjustedExam;
    dispute.adjustedTotal = adjustedScores.total ?? dispute.adjustedTotal;

    const enrollment = state.enrollments.find(
      (e) => e.studentId === dispute.studentId && e.courseId === dispute.courseId
    );

    if (enrollment) {
      const ca = dispute.adjustedCa ?? dispute.originalCa ?? 0;
      const exam = dispute.adjustedExam ?? dispute.originalExam ?? 0;
      const total = ca + exam;
      const grade = calculateLetterGrade(total);

      const existingResult = state.results.find((r) => r.enrollmentId === enrollment.id);
      if (existingResult) {
        existingResult.caScore = ca;
        existingResult.examScore = exam;
        existingResult.totalScore = total;
        existingResult.grade = grade;
        existingResult.lastUpdated = new Date().toISOString();
        existingResult.moderationNotes = `Score adjusted following grade query resolution: ${resolutionNote || 'Verified by Department'}`;
      }

      if (addModLog) {
        addModLog({
          courseId: dispute.courseId,
          courseCode: dispute.courseCode,
          examinerId: resolver?.id || 'u2',
          examinerName: resolver?.name || 'Chief Examiner',
          action: 'Score Override',
          notes: `Dispute Resolution: ${resolutionNote || 'Score corrected upon query review'}`,
          affectedStudentCount: 1,
          details: `Candidate: ${dispute.studentName} (${dispute.matricNumber}) query #${disputeId.substring(0, 8)} resolved. New Total: ${total} (${grade})`,
        });
      }
    }
  }

  return dispute;
}
