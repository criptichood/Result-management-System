export type Role = 'Admin' | 'Chief Examiner' | 'Lecturer' | 'Student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  college?: string;
  matricNumber?: string; // For students
  level?: number; // 100, 200, 300, 400
  staffId?: string; // For staff
  phoneNumber?: string;
  emergencyContact?: string;
  address?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  college: string;
  HOD?: string;
  description?: string;
}

export type InstructorRole = 
  | 'Lead Instructor'
  | 'Co-Lecturer'
  | 'Practical / Lab Instructor'
  | 'Tutorial Assistant';

export interface CourseInstructor {
  lecturerId: string;
  role: InstructorRole;
  notes?: string;
  assignedAt?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  department: string;
  college: string;
  level: number;
  semester: 1 | 2;
  lecturerId?: string; // Primary / Lead lecturer
  lecturerIds?: string[]; // All assigned lecturers
  instructors?: CourseInstructor[]; // Detailed role assignment
  description?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  semester: 1 | 2;
  academicYear: string;
}

export type ResultStatus = 'Draft' | 'Submitted' | 'Approved' | 'Published' | 'Rejected';

export interface Result {
  id: string;
  enrollmentId: string;
  caScore: number | null; // out of 30 or 40 depending on system, let's use 40
  examScore: number | null; // out of 60
  totalScore: number | null; 
  grade: string | null; 
  status: ResultStatus;
  lecturerId: string;
  lastUpdated: string;
  moderationNotes?: string;
}

export interface SystemSettings {
  lecturerViewEmail: boolean;
  lecturerViewPhone: boolean;
  courseRegistrationOpen: boolean;
  currentSession: string;
  currentSemester: 1 | 2;
}

export interface ModerationLog {
  id: string;
  courseId: string;
  courseCode: string;
  examinerId: string;
  examinerName: string;
  action: 'Approved' | 'Rejected' | 'Score Override' | 'Batch Approved' | 'Batch Rejected';
  timestamp: string;
  notes?: string;
  affectedStudentCount?: number;
  details?: string;
}

export type DisputeCategory =
  | 'Missing CA Score'
  | 'Exam Script Remarking'
  | 'Transcription Error'
  | 'Missing Total Score'
  | 'Other';

export type DisputeStatus =
  | 'Pending'
  | 'Under Investigation'
  | 'Resolved (Score Adjusted)'
  | 'Dismissed';

export interface GradeDispute {
  id: string;
  studentId: string;
  studentName: string;
  matricNumber: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  lecturerId?: string;
  category: DisputeCategory;
  description: string;
  requestedScoreType?: 'CA' | 'Exam' | 'Both';
  originalCa?: number | null;
  originalExam?: number | null;
  originalTotal?: number | null;
  adjustedCa?: number | null;
  adjustedExam?: number | null;
  adjustedTotal?: number | null;
  status: DisputeStatus;
  resolutionNote?: string;
  resolvedBy?: string;
  createdAt: string;
  resolvedAt?: string;
}
