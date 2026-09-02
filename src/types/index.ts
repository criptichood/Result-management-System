export type Role = 'Admin' | 'Chief Examiner' | 'Lecturer' | 'Student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  college?: string;
  matricNumber?: string; // For students
  staffId?: string; // For staff
  phoneNumber?: string;
  emergencyContact?: string;
  address?: string;
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
  lecturerId?: string;
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
}

export interface SystemSettings {
  lecturerViewEmail: boolean;
  lecturerViewPhone: boolean;
  courseRegistrationOpen: boolean;
  currentSession: string;
  currentSemester: 1 | 2;
}
