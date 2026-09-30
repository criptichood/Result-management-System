import { Course, Department, Enrollment, Result, User } from '../types';

export const mockUsers: User[] = [
  // Institutional Executives & Academic Governance Officers
  { id: 'u1', name: 'Dr. Amina Yusuf (System Admin)', email: 'admin@fuaz.edu.ng', role: 'Admin', staffId: 'ADM001' },
  { id: 'u_senate', name: 'Prof. Abdullahi Ibrahim (Senate Secretariat / VC)', email: 'senate@fuaz.edu.ng', role: 'Senate', staffId: 'SEN001' },
  { id: 'u2', name: 'Prof. Bello Ibrahim (Head of Department)', email: 'hod@fuaz.edu.ng', role: 'HOD', college: 'Science', department: 'Computer Science', staffId: 'HOD001' },
  { id: 'u_examiner', name: 'Dr. Aliyu Mohammed (Departmental Exam Officer)', email: 'examiner@fuaz.edu.ng', role: 'Examiner', college: 'Science', department: 'Computer Science', staffId: 'EXM001' },

  // Academic Teaching Faculty (Computer Science & Service Departments)
  { id: 'u3', name: 'Dr. Chidi Okafor (Senior Lecturer)', email: 'lecturer1@fuaz.edu.ng', role: 'Lecturer', college: 'Science', department: 'Computer Science', staffId: 'LEC001' },
  { id: 'u4', name: 'Dr. Fatima Umar (Senior Lecturer)', email: 'lecturer2@fuaz.edu.ng', role: 'Lecturer', college: 'Science', department: 'Mathematics', staffId: 'LEC002' },
  { id: 'u_lec3', name: 'Dr. Shehu Danbatta (Senior Lecturer)', email: 'danbatta@fuaz.edu.ng', role: 'Lecturer', college: 'Science', department: 'Computer Science', staffId: 'LEC003' },
  { id: 'u_lec4', name: 'Dr. Ngozi Anyaoku (Lecturer I)', email: 'anyaoku@fuaz.edu.ng', role: 'Lecturer', college: 'Science', department: 'Computer Science', staffId: 'LEC004' },
  { id: 'u_lec5', name: 'Engr. Kabir Sani (Lecturer II)', email: 'ksani@fuaz.edu.ng', role: 'Lecturer', college: 'Science', department: 'Computer Science', staffId: 'LEC005' },
  { id: 'u_lec6', name: 'Dr. Yusuf Al-Amin (Lecturer I)', email: 'yalamin@fuaz.edu.ng', role: 'Lecturer', college: 'Science', department: 'Computer Science', staffId: 'LEC006' },

  // =========================================================================
  // 100 LEVEL UNDERGRADUATES (12 Students, 2024/2025 Cohort)
  // =========================================================================
  { id: 'u10', name: 'Fatima Aliyu', email: 'fatima.a@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2024/02/03/001', level: 100, isGraduated: false, entryYear: '2024/2025', phoneNumber: '+234 803 112 3344', emergencyContact: '+234 802 445 5667 (Mother)', address: 'Block C, Female Hostel' },
  { id: 'u11', name: 'Musa Garba', email: 'musa.g@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2024/02/03/002', level: 100, isGraduated: false, entryYear: '2024/2025', phoneNumber: '+234 814 223 3445', emergencyContact: '+234 813 556 6778 (Uncle)', address: 'Block A, Male Hostel' },
  { id: 'u12', name: 'Blessing Okon', email: 'blessing.o@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2024/02/03/003', level: 100, isGraduated: false, entryYear: '2024/2025', phoneNumber: '+234 806 334 4556', emergencyContact: '+234 807 667 7889 (Guardian)', address: 'Block D, Female Hostel' },
  { id: 'u100_4', name: 'Abdullahi Shehu', email: 'abdullahi.s@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2024/02/03/004', level: 100, isGraduated: false, entryYear: '2024/2025', phoneNumber: '+234 803 555 1234', address: 'Block B, Male Hostel' },
  { id: 'u100_5', name: 'Joy Emmanuel', email: 'joy.e@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2024/02/03/005', level: 100, isGraduated: false, entryYear: '2024/2025', phoneNumber: '+234 802 998 7766', address: 'Block C, Female Hostel' },
  { id: 'u100_6', name: 'Usman Farouk', email: 'usman.f@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2024/02/03/006', level: 100, isGraduated: false, entryYear: '2024/2025', phoneNumber: '+234 816 443 2211', address: 'Block A, Male Hostel' },
  { id: 'u100_7', name: 'Halima Sani', email: 'halima.s@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2024/02/03/007', level: 100, isGraduated: false, entryYear: '2024/2025', phoneNumber: '+234 809 112 8899', address: 'Block D, Female Hostel' },
  { id: 'u100_8', name: 'Daniel Kalu', email: 'daniel.k@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2024/02/03/008', level: 100, isGraduated: false, entryYear: '2024/2025', phoneNumber: '+234 805 776 5544', address: 'Block B, Male Hostel' },
  { id: 'u100_9', name: 'Maryam Bello', email: 'maryam.b@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2024/02/03/009', level: 100, isGraduated: false, entryYear: '2024/2025', phoneNumber: '+234 813 665 4433', address: 'Block C, Female Hostel' },
  { id: 'u100_10', name: 'Ibrahim Lawal', email: 'ibrahim.l@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2024/02/03/010', level: 100, isGraduated: false, entryYear: '2024/2025', phoneNumber: '+234 808 332 1199', address: 'Off-campus, Zuru Town' },
  { id: 'u100_11', name: 'Chisom Eze', email: 'chisom.e@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2024/02/03/011', level: 100, isGraduated: false, entryYear: '2024/2025', phoneNumber: '+234 818 221 4455', address: 'Block D, Female Hostel' },
  { id: 'u100_12', name: 'Kabiru Yahaya', email: 'kabiru.y@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2024/02/03/012', level: 100, isGraduated: false, entryYear: '2024/2025', phoneNumber: '+234 802 889 0011', address: 'Block A, Male Hostel' },

  // =========================================================================
  // 200 LEVEL UNDERGRADUATES (12 Students, 2023/2024 Cohort)
  // =========================================================================
  { id: 'u8', name: 'Zainab Ali', email: 'zainab@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2023/02/03/001', level: 200, isGraduated: false, entryYear: '2023/2024', phoneNumber: '+234 816 555 6666', emergencyContact: '+234 803 777 8888 (Sister)', address: 'Block D, Female Hostel' },
  { id: 'u9', name: 'Emeka Uzo', email: 'emeka@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2023/02/03/002', level: 200, isGraduated: false, entryYear: '2023/2024', phoneNumber: '+234 809 999 0000', emergencyContact: '+234 810 123 4567 (Father)', address: 'Off-campus, Zuru Town' },
  { id: 'u13', name: 'Tunde Bakare', email: 'tunde.b@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2023/02/03/003', level: 200, isGraduated: false, entryYear: '2023/2024', phoneNumber: '+234 818 445 5667', emergencyContact: '+234 819 778 8990 (Father)', address: 'Off-campus, Zuru Town' },
  { id: 'u200_4', name: 'Hauwa Idris', email: 'hauwa.i@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2023/02/03/004', level: 200, isGraduated: false, entryYear: '2023/2024', phoneNumber: '+234 803 221 8877', address: 'Block C, Female Hostel' },
  { id: 'u200_5', name: 'Victor Sunday', email: 'victor.s@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2023/02/03/005', level: 200, isGraduated: false, entryYear: '2023/2024', phoneNumber: '+234 814 887 6655', address: 'Block B, Male Hostel' },
  { id: 'u200_6', name: 'Aminu Dangana', email: 'aminu.d@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2023/02/03/006', level: 200, isGraduated: false, entryYear: '2023/2024', phoneNumber: '+234 806 554 3322', address: 'Block A, Male Hostel' },
  { id: 'u200_7', name: 'Racheal Adeleke', email: 'racheal.a@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2023/02/03/007', level: 200, isGraduated: false, entryYear: '2023/2024', phoneNumber: '+234 802 667 8899', address: 'Block D, Female Hostel' },
  { id: 'u200_8', name: 'Abubakar Gwadabe', email: 'abubakar.g@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2023/02/03/008', level: 200, isGraduated: false, entryYear: '2023/2024', phoneNumber: '+234 809 332 5544', address: 'Block B, Male Hostel' },
  { id: 'u200_9', name: 'Deborah Yakubu', email: 'deborah.y@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2023/02/03/009', level: 200, isGraduated: false, entryYear: '2023/2024', phoneNumber: '+234 813 776 2211', address: 'Block C, Female Hostel' },
  { id: 'u200_10', name: 'Solomon Bassey', email: 'solomon.b@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2023/02/03/010', level: 200, isGraduated: false, entryYear: '2023/2024', phoneNumber: '+234 805 119 4433', address: 'Off-campus, Zuru Town' },
  { id: 'u200_11', name: 'Bilkisu Mohammed', email: 'bilkisu.m@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2023/02/03/011', level: 200, isGraduated: false, entryYear: '2023/2024', phoneNumber: '+234 818 990 1122', address: 'Block D, Female Hostel' },
  { id: 'u200_12', name: 'Godwin Peters', email: 'godwin.p@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2023/02/03/012', level: 200, isGraduated: false, entryYear: '2023/2024', phoneNumber: '+234 802 443 6677', address: 'Block A, Male Hostel' },

  // =========================================================================
  // 300 LEVEL UNDERGRADUATES (12 Students, 2022/2023 Cohort)
  // =========================================================================
  { id: 'u7', name: 'David Ojo', email: 'david@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2022/02/03/001', level: 300, isGraduated: false, entryYear: '2022/2023', phoneNumber: '+234 805 111 2222', emergencyContact: '+234 802 333 4444 (Brother)', address: 'Block B, Male Hostel' },
  { id: 'u14', name: 'Aisha Mohammed', email: 'aisha.m@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2022/02/03/002', level: 300, isGraduated: false, entryYear: '2022/2023', phoneNumber: '+234 802 556 6778', emergencyContact: '+234 803 889 9001 (Sister)', address: 'Block C, Female Hostel' },
  { id: 'u300_3', name: 'Samuel Adebayo', email: 'samuel.a@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2022/02/03/003', level: 300, isGraduated: false, entryYear: '2022/2023', phoneNumber: '+234 814 332 5566', address: 'Block A, Male Hostel' },
  { id: 'u300_4', name: 'Khadijah Ahmed', email: 'khadijah.a@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2022/02/03/004', level: 300, isGraduated: false, entryYear: '2022/2023', phoneNumber: '+234 803 778 9900', address: 'Block D, Female Hostel' },
  { id: 'u300_5', name: 'Chukwudi Nnamdi', email: 'chukwudi.n@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2022/02/03/005', level: 300, isGraduated: false, entryYear: '2022/2023', phoneNumber: '+234 816 887 1122', address: 'Block B, Male Hostel' },
  { id: 'u300_6', name: 'Nafisat Aliyu', email: 'nafisat.a@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2022/02/03/006', level: 300, isGraduated: false, entryYear: '2022/2023', phoneNumber: '+234 809 665 4433', address: 'Block C, Female Hostel' },
  { id: 'u300_7', name: 'Olamide Fashola', email: 'olamide.f@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2022/02/03/007', level: 300, isGraduated: false, entryYear: '2022/2023', phoneNumber: '+234 805 221 9988', address: 'Off-campus, Zuru Town' },
  { id: 'u300_8', name: 'Haruna Jibril', email: 'haruna.j@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2022/02/03/008', level: 300, isGraduated: false, entryYear: '2022/2023', phoneNumber: '+234 813 445 7766', address: 'Block A, Male Hostel' },
  { id: 'u300_9', name: 'Esther John', email: 'esther.j@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2022/02/03/009', level: 300, isGraduated: false, entryYear: '2022/2023', phoneNumber: '+234 802 119 3344', address: 'Block D, Female Hostel' },
  { id: 'u300_10', name: 'Sadiq Tanko', email: 'sadiq.t@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2022/02/03/010', level: 300, isGraduated: false, entryYear: '2022/2023', phoneNumber: '+234 818 776 5544', address: 'Block B, Male Hostel' },
  { id: 'u300_11', name: 'Chidiebere Okeke', email: 'chidiebere.o@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2022/02/03/011', level: 300, isGraduated: false, entryYear: '2022/2023', phoneNumber: '+234 808 554 2211', address: 'Block A, Male Hostel' },
  { id: 'u300_12', name: 'Patrick Ogbonna', email: 'patrick.o@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2022/02/03/012', level: 300, isGraduated: false, entryYear: '2022/2023', phoneNumber: '+234 806 998 1122', address: 'Off-campus, Zuru Town' },

  // =========================================================================
  // 400 LEVEL UNDERGRADUATES (12 Students, 2021/2022 Cohort)
  // =========================================================================
  { id: 'u5', name: 'Jeremiah Dantani', email: 'jeremiah@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2021/02/03/045', level: 400, isGraduated: false, entryYear: '2021/2022', phoneNumber: '+234 801 234 5678', emergencyContact: '+234 809 876 5432 (Father)', address: 'Block A, Male Hostel, FUAZ Campus' },
  { id: 'u19', name: 'Zubairu Adamu', email: 'zubairu.a@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2021/02/03/012', level: 400, isGraduated: false, entryYear: '2021/2022', phoneNumber: '+234 802 345 6789', emergencyContact: '+234 803 456 7891 (Father)', address: 'Block B, Male Hostel' },
  { id: 'u20', name: 'Grace Danjuma', email: 'grace.d@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2021/02/03/033', level: 400, isGraduated: false, entryYear: '2021/2022', phoneNumber: '+234 806 789 0123', emergencyContact: '+234 807 890 1234 (Mother)', address: 'Block C, Female Hostel' },
  { id: 'u400_4', name: 'Emmanuel Audu', email: 'emmanuel.a@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2021/02/03/004', level: 400, isGraduated: false, entryYear: '2021/2022', phoneNumber: '+234 803 119 8877', address: 'Block A, Male Hostel' },
  { id: 'u400_5', name: 'Hadiza Umar', email: 'hadiza.u@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2021/02/03/005', level: 400, isGraduated: false, entryYear: '2021/2022', phoneNumber: '+234 814 665 2211', address: 'Block C, Female Hostel' },
  { id: 'u400_6', name: 'Kenneth Okafor', email: 'kenneth.o@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2021/02/03/006', level: 400, isGraduated: false, entryYear: '2021/2022', phoneNumber: '+234 806 778 4433', address: 'Block B, Male Hostel' },
  { id: 'u400_7', name: 'Zainab Abdullahi', email: 'zainab.ab@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2021/02/03/007', level: 400, isGraduated: false, entryYear: '2021/2022', phoneNumber: '+234 809 221 6655', address: 'Block D, Female Hostel' },
  { id: 'u400_8', name: 'Peter Ayodele', email: 'peter.a@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2021/02/03/008', level: 400, isGraduated: false, entryYear: '2021/2022', phoneNumber: '+234 805 887 3322', address: 'Off-campus, Zuru Town' },
  { id: 'u400_9', name: 'Fatima Garba', email: 'fatima.g@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2021/02/03/009', level: 400, isGraduated: false, entryYear: '2021/2022', phoneNumber: '+234 813 554 9988', address: 'Block C, Female Hostel' },
  { id: 'u400_10', name: 'Paulinus Eze', email: 'paulinus.e@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2021/02/03/010', level: 400, isGraduated: false, entryYear: '2021/2022', phoneNumber: '+234 802 331 7766', address: 'Block A, Male Hostel' },
  { id: 'u400_11', name: 'Mahmud Bello', email: 'mahmud.b@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2021/02/03/011', level: 400, isGraduated: false, entryYear: '2021/2022', phoneNumber: '+234 818 443 1100', address: 'Block B, Male Hostel' },
  { id: 'u400_12', name: 'Christopher Bala', email: 'christopher.b@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2021/02/03/013', level: 400, isGraduated: false, entryYear: '2021/2022', phoneNumber: '+234 808 667 9900', address: 'Block A, Male Hostel' },

  // Graduated Alumni
  { id: 'u15', name: 'Ibrahim Yakubu', email: 'ibrahim.y@alumni.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2019/02/03/001', level: 400, isGraduated: true, graduationYear: '2023/2024', graduationSession: '2023/2024 Session', degreeClass: 'First Class Honours', finalCgpa: 4.74, entryYear: '2019/2020', phoneNumber: '+234 803 999 1122', emergencyContact: '+234 803 111 2233 (Father)', address: 'Plot 12, Garki II, Abuja' },
  { id: 'u16', name: 'Maryam Al-Hassan', email: 'maryam.a@alumni.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2019/02/03/018', level: 400, isGraduated: true, graduationYear: '2023/2024', graduationSession: '2023/2024 Session', degreeClass: 'Second Class Honours (Upper Division)', finalCgpa: 4.18, entryYear: '2019/2020', phoneNumber: '+234 812 444 5566', emergencyContact: '+234 802 888 9900 (Mother)', address: '14 Ahmadu Bello Way, Kaduna' },
  { id: 'u17', name: 'Chukwuma Obi', email: 'chukwuma.o@alumni.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2018/02/03/007', level: 400, isGraduated: true, graduationYear: '2022/2023', graduationSession: '2022/2023 Session', degreeClass: 'Second Class Honours (Upper Division)', finalCgpa: 3.82, entryYear: '2018/2019', phoneNumber: '+234 810 777 6655', emergencyContact: '+234 809 333 2211 (Brother)', address: 'Independence Layout, Enugu' },
  { id: 'u18', name: 'Kemi Adeleke', email: 'kemi.a@alumni.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2018/02/03/024', level: 400, isGraduated: true, graduationYear: '2022/2023', graduationSession: '2022/2023 Session', degreeClass: 'Second Class Honours (Lower Division)', finalCgpa: 3.12, entryYear: '2018/2019', phoneNumber: '+234 816 222 3344', emergencyContact: '+234 803 777 6655 (Guardian)', address: 'Bodija, Ibadan' },

  // Non-Departmental Student
  { id: 'u6', name: 'Sarah Musa', email: 'sarah@student.fuaz.edu.ng', role: 'Student', college: 'Agriculture', department: 'Crop Science', matricNumber: 'UG/2022/02/03/002', level: 300, isGraduated: false, entryYear: '2022/2023', phoneNumber: '+234 812 345 6789', emergencyContact: '+234 803 456 7890 (Mother)', address: 'Block C, Female Hostel, FUAZ Campus' },
];

export const mockCourses: Course[] = [
  // 100 Level - 1st Semester
  { id: 'c_chm111', code: 'CHM 111', title: 'General Physical Chemistry', creditUnits: 3, department: 'Chemical Sciences', college: 'Science', level: 100, semester: 1 },
  { id: 'c_csc111', code: 'CSC 111', title: 'Introduction to Computer Science', creditUnits: 2, department: 'Computer Science', college: 'Science', level: 100, semester: 1, lecturerId: 'u3' },
  { id: 'c_gst111', code: 'GST 111', title: 'Use of English I', creditUnits: 2, department: 'General Studies', college: 'Science', level: 100, semester: 1 },
  { id: 'c_gst112', code: 'GST 112', title: 'Use of Library and Study Skills', creditUnits: 2, department: 'General Studies', college: 'Science', level: 100, semester: 1 },
  { id: 'c_gst113', code: 'GST 113', title: 'Logic and Critical Thinking', creditUnits: 2, department: 'General Studies', college: 'Science', level: 100, semester: 1 },
  { id: 'c_mth111', code: 'MTH 111', title: 'Elementary Algebra I', creditUnits: 3, department: 'Mathematics', college: 'Science', level: 100, semester: 1, lecturerId: 'u4' },
  { id: 'c_mth113', code: 'MTH 113', title: 'Geometry', creditUnits: 3, department: 'Mathematics', college: 'Science', level: 100, semester: 1 },
  { id: 'c_mth114', code: 'MTH 114', title: 'Elements of Statistics', creditUnits: 2, department: 'Mathematics', college: 'Science', level: 100, semester: 1 },
  { id: 'c_phy111', code: 'PHY 111', title: 'General Physics I: Mechanics and Properties of Matter I', creditUnits: 2, department: 'Physics', college: 'Science', level: 100, semester: 1 },
  { id: 'c_phy112', code: 'PHY 112', title: 'General Physics Laboratory I', creditUnits: 1, department: 'Physics', college: 'Science', level: 100, semester: 1 },

  // 100 Level - 2nd Semester
  { id: 'c_csc123', code: 'CSC 123', title: 'ICT and Digital Skills Acquisition', creditUnits: 2, department: 'Computer Science', college: 'Science', level: 100, semester: 2, lecturerId: 'u_lec6' },
  { id: 'c_gst121', code: 'GST 121', title: 'Use of English II', creditUnits: 2, department: 'General Studies', college: 'Science', level: 100, semester: 2 },
  { id: 'c_gst122', code: 'GST 122', title: 'Nigeria: People and Culture', creditUnits: 2, department: 'General Studies', college: 'Science', level: 100, semester: 2 },
  { id: 'c_mth121', code: 'MTH 121', title: 'Calculus', creditUnits: 3, department: 'Mathematics', college: 'Science', level: 100, semester: 2, lecturerId: 'u4' },
  { id: 'c_phy123', code: 'PHY 123', title: 'Electricity, Magnetism and Modern Physics', creditUnits: 3, department: 'Physics', college: 'Science', level: 100, semester: 2 },
  { id: 'c_mth123', code: 'MTH 123', title: 'General Mathematics II: Elementary Algebra II', creditUnits: 3, department: 'Mathematics', college: 'Science', level: 100, semester: 2 },
  { id: 'c_mth125', code: 'MTH 125', title: 'Statistical Inference I', creditUnits: 2, department: 'Mathematics', college: 'Science', level: 100, semester: 2 },
  { id: 'c_csc121', code: 'CSC 121', title: 'Introduction to Problem Solving', creditUnits: 2, department: 'Computer Science', college: 'Science', level: 100, semester: 2, lecturerId: 'u_lec4' },
  { id: 'c_csc122', code: 'CSC 122', title: 'Fundamentals of Computer Network', creditUnits: 2, department: 'Computer Science', college: 'Science', level: 100, semester: 2, lecturerId: 'u_lec3' },
  { id: 'c_mth126', code: 'MTH 126', title: 'Probability', creditUnits: 2, department: 'Mathematics', college: 'Science', level: 100, semester: 2 },

  // 200 Level - 1st Semester
  { id: 'c_gst212', code: 'GST 212', title: 'Peace Studies and Conflict Resolution', creditUnits: 2, department: 'General Studies', college: 'Science', level: 200, semester: 1 },
  { id: 'c_csc211', code: 'CSC 211', title: 'Computer Programming I', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 200, semester: 1, lecturerId: 'u3' },
  { id: 'c_mth211', code: 'MTH 211', title: 'Mathematical Methods I', creditUnits: 3, department: 'Mathematics', college: 'Science', level: 200, semester: 1, lecturerId: 'u4' },
  { id: 'c_csc213', code: 'CSC 213', title: 'Discrete Structure', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 200, semester: 1, lecturerId: 'u3' },
  { id: 'c_csc214', code: 'CSC 214', title: 'Digital Logic Design', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 200, semester: 1, lecturerId: 'u_lec5' },
  { id: 'c_mth214', code: 'MTH 214', title: 'Linear Algebra I', creditUnits: 2, department: 'Mathematics', college: 'Science', level: 200, semester: 1, lecturerId: 'u4' },
  { id: 'c_gst211', code: 'GST 211', title: 'History and Philosophy of Science', creditUnits: 2, department: 'General Studies', college: 'Science', level: 200, semester: 1 },
  { id: 'c_csc212', code: 'CSC 212', title: 'Operating System I', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 200, semester: 1, lecturerId: 'u_lec3' },

  // 200 Level - 2nd Semester
  { id: 'c_mth222', code: 'MTH 222', title: 'Elementary Differential Equations I', creditUnits: 3, department: 'Mathematics', college: 'Science', level: 200, semester: 2, lecturerId: 'u4' },
  { id: 'c_phy221', code: 'PHY 221', title: 'Electric Circuits and Electronics', creditUnits: 3, department: 'Physics', college: 'Science', level: 200, semester: 2 },
  { id: 'c_csc221', code: 'CSC 221', title: 'Computer Programming II', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 200, semester: 2, lecturerId: 'u3' },
  { id: 'c_csc222', code: 'CSC 222', title: 'Computer Hardware', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 200, semester: 2, lecturerId: 'u_lec5' },
  { id: 'c_csc223', code: 'CSC 223', title: 'Fundamentals of Data Structures', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 200, semester: 2, lecturerId: 'u_lec4' },
  { id: 'c_csc224', code: 'CSC 224', title: 'Introduction to Web Development', creditUnits: 2, department: 'Computer Science', college: 'Science', level: 200, semester: 2, lecturerId: 'u_lec6' },
  { id: 'c_mth225', code: 'MTH 225', title: 'Linear Algebra II', creditUnits: 2, department: 'Mathematics', college: 'Science', level: 200, semester: 2, lecturerId: 'u4' },
  { id: 'c_gst223', code: 'GST 223', title: 'Entrepreneurship Studies I', creditUnits: 2, department: 'General Studies', college: 'Science', level: 200, semester: 2 },

  // 300 Level - 1st Semester
  { id: 'c_csc311', code: 'CSC 311', title: 'Object-Oriented Programming', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 1, lecturerId: 'u3' },
  { id: 'c_csc312', code: 'CSC 312', title: 'Operating Systems II', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 1, lecturerId: 'u_lec3' },
  { id: 'c_csc313', code: 'CSC 313', title: 'Compiler Construction I', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 1, lecturerId: 'u_lec6' },
  { id: 'c_csc314', code: 'CSC 314', title: 'Computer Architecture and Organization I', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 1, lecturerId: 'u_lec5' },
  { id: 'c_csc315', code: 'CSC 315', title: 'Systems Analysis and Design', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 1, lecturerId: 'u2' },
  { id: 'c_csc316', code: 'CSC 316', title: 'Algorithms and Complexity Analysis', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 1, lecturerId: 'u3' },

  // 300 Level - 2nd Semester
  { id: 'c_csc321', code: 'CSC 321', title: 'Data Management I', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 2, lecturerId: 'u_lec4' },
  { id: 'c_csc322', code: 'CSC 322', title: 'Survey of Programming Language', creditUnits: 4, department: 'Computer Science', college: 'Science', level: 300, semester: 2, lecturerId: 'u_lec6' },
  { id: 'c_csc323', code: 'CSC 323', title: 'Structured Programming', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 2, lecturerId: 'u_lec6' },
  { id: 'c_csc324', code: 'CSC 324', title: 'Computer Architecture and Organization II', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 2, lecturerId: 'u_lec5' },
  { id: 'c_csc325', code: 'CSC 325', title: 'Computational Science & Numerical Methods', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 2, lecturerId: 'u3' },
  { id: 'c_gst321', code: 'GST 321', title: 'Entrepreneurship Studies II', creditUnits: 2, department: 'General Studies', college: 'Science', level: 300, semester: 2 },

  // 400 Level - 1st Semester
  { id: 'c_csc411', code: 'CSC 411', title: 'Organization of Programming Language', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 400, semester: 1, lecturerId: 'u3' },
  { id: 'c_csc412', code: 'CSC 412', title: 'Software Engineering', creditUnits: 4, department: 'Computer Science', college: 'Science', level: 400, semester: 1, lecturerId: 'u3' },
  { id: 'c_csc414', code: 'CSC 414', title: 'Net-Centric Computing', creditUnits: 2, department: 'Computer Science', college: 'Science', level: 400, semester: 1, lecturerId: 'u_lec3' },
  { id: 'c_csc415', code: 'CSC 415', title: 'Human Computer Interface', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 400, semester: 1, lecturerId: 'u2' },
  { id: 'c_csc418', code: 'CSC 418', title: 'Industrial Training', creditUnits: 4, department: 'Computer Science', college: 'Science', level: 400, semester: 1, lecturerId: 'u3' },

  // 400 Level - 2nd Semester
  { id: 'c_csc421', code: 'CSC 421', title: 'Artificial Intelligence', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 400, semester: 2, lecturerId: 'u2' },
  { id: 'c_csc422', code: 'CSC 422', title: 'Computer Networks / Communication', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 400, semester: 2, lecturerId: 'u_lec3' },
  { id: 'c_csc423', code: 'CSC 423', title: 'Data Management II', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 400, semester: 2, lecturerId: 'u_lec4' },
  { id: 'c_csc424', code: 'CSC 424', title: 'Project', creditUnits: 6, department: 'Computer Science', college: 'Science', level: 400, semester: 2, lecturerId: 'u2' },

  { id: 'c_agr101', code: 'AGR 101', title: 'Introductory Agriculture', creditUnits: 2, department: 'Crop Science', college: 'Agriculture', level: 100, semester: 1 },
];

export const mockDepartments: Department[] = [
  { id: 'dept_1', name: 'Computer Science', code: 'CSC', college: 'Science', HOD: 'Prof. Bello Ibrahim', description: 'Department of Computer Science & Information Technology' },
  { id: 'dept_2', name: 'Mathematics', code: 'MTH', college: 'Science', HOD: 'Prof. Bello Ahmed', description: 'Department of Mathematical Sciences' },
  { id: 'dept_3', name: 'Physics', code: 'PHY', college: 'Science', HOD: 'Dr. Kabir Aliyu', description: 'Department of Physics with Electronics' },
  { id: 'dept_4', name: 'Chemical Sciences', code: 'CHM', college: 'Science', HOD: 'Dr. Zainab Umar', description: 'Department of Chemical & Applied Chemistry' },
  { id: 'dept_5', name: 'General Studies', code: 'GST', college: 'Science', HOD: 'Dr. Ibrahim Katcha', description: 'Directorate of General Studies' },
  { id: 'dept_6', name: 'Crop Science', code: 'AGR', college: 'Agriculture', HOD: 'Prof. Musa Danladi', description: 'Department of Crop Production and Protection' },
  { id: 'dept_7', name: 'Animal Science', code: 'ANS', college: 'Agriculture', HOD: 'Dr. Fatima Sanusi', description: 'Department of Animal Science & Livestock' },
];

// Helper to determine NUC grade letter
function getNucGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' {
  if (score >= 70) return 'A';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  if (score >= 45) return 'D';
  if (score >= 40) return 'E';
  return 'F';
}

// Student Performance Profiles for Deterministic Dataset Generation
type AcademicStanding = 'first_class' | 'second_upper' | 'second_lower' | 'third_class' | 'probation';

interface CohortDefinition {
  studentId: string;
  level: number;
  entryYear: string;
  standing: AcademicStanding;
}

const cohorts: CohortDefinition[] = [
  // 100 Level (2024/2025 Entry)
  { studentId: 'u10', level: 100, entryYear: '2024/2025', standing: 'first_class' },
  { studentId: 'u11', level: 100, entryYear: '2024/2025', standing: 'second_upper' },
  { studentId: 'u12', level: 100, entryYear: '2024/2025', standing: 'second_upper' },
  { studentId: 'u100_4', level: 100, entryYear: '2024/2025', standing: 'second_upper' },
  { studentId: 'u100_5', level: 100, entryYear: '2024/2025', standing: 'first_class' },
  { studentId: 'u100_6', level: 100, entryYear: '2024/2025', standing: 'second_lower' },
  { studentId: 'u100_7', level: 100, entryYear: '2024/2025', standing: 'second_upper' },
  { studentId: 'u100_8', level: 100, entryYear: '2024/2025', standing: 'second_lower' },
  { studentId: 'u100_9', level: 100, entryYear: '2024/2025', standing: 'first_class' },
  { studentId: 'u100_10', level: 100, entryYear: '2024/2025', standing: 'second_upper' },
  { studentId: 'u100_11', level: 100, entryYear: '2024/2025', standing: 'third_class' },
  { studentId: 'u100_12', level: 100, entryYear: '2024/2025', standing: 'probation' },

  // 200 Level (2023/2024 Entry)
  { studentId: 'u8', level: 200, entryYear: '2023/2024', standing: 'first_class' },
  { studentId: 'u9', level: 200, entryYear: '2023/2024', standing: 'second_upper' },
  { studentId: 'u13', level: 200, entryYear: '2023/2024', standing: 'second_lower' },
  { studentId: 'u200_4', level: 200, entryYear: '2023/2024', standing: 'first_class' },
  { studentId: 'u200_5', level: 200, entryYear: '2023/2024', standing: 'second_upper' },
  { studentId: 'u200_6', level: 200, entryYear: '2023/2024', standing: 'second_upper' },
  { studentId: 'u200_7', level: 200, entryYear: '2023/2024', standing: 'second_lower' },
  { studentId: 'u200_8', level: 200, entryYear: '2023/2024', standing: 'second_lower' },
  { studentId: 'u200_9', level: 200, entryYear: '2023/2024', standing: 'first_class' },
  { studentId: 'u200_10', level: 200, entryYear: '2023/2024', standing: 'second_upper' },
  { studentId: 'u200_11', level: 200, entryYear: '2023/2024', standing: 'third_class' },
  { studentId: 'u200_12', level: 200, entryYear: '2023/2024', standing: 'probation' },

  // 300 Level (2022/2023 Entry)
  { studentId: 'u7', level: 300, entryYear: '2022/2023', standing: 'second_upper' },
  { studentId: 'u14', level: 300, entryYear: '2022/2023', standing: 'first_class' },
  { studentId: 'u300_3', level: 300, entryYear: '2022/2023', standing: 'second_upper' },
  { studentId: 'u300_4', level: 300, entryYear: '2022/2023', standing: 'second_upper' },
  { studentId: 'u300_5', level: 300, entryYear: '2022/2023', standing: 'second_lower' },
  { studentId: 'u300_6', level: 300, entryYear: '2022/2023', standing: 'first_class' },
  { studentId: 'u300_7', level: 300, entryYear: '2022/2023', standing: 'second_lower' },
  { studentId: 'u300_8', level: 300, entryYear: '2022/2023', standing: 'second_upper' },
  { studentId: 'u300_9', level: 300, entryYear: '2022/2023', standing: 'second_upper' },
  { studentId: 'u300_10', level: 300, entryYear: '2022/2023', standing: 'third_class' },
  { studentId: 'u300_11', level: 300, entryYear: '2022/2023', standing: 'second_lower' },
  { studentId: 'u300_12', level: 300, entryYear: '2022/2023', standing: 'second_upper' },

  // 400 Level (2021/2022 Entry)
  { studentId: 'u5', level: 400, entryYear: '2021/2022', standing: 'second_upper' },
  { studentId: 'u19', level: 400, entryYear: '2021/2022', standing: 'second_upper' },
  { studentId: 'u20', level: 400, entryYear: '2021/2022', standing: 'first_class' },
  { studentId: 'u400_4', level: 400, entryYear: '2021/2022', standing: 'first_class' },
  { studentId: 'u400_5', level: 400, entryYear: '2021/2022', standing: 'second_upper' },
  { studentId: 'u400_6', level: 400, entryYear: '2021/2022', standing: 'second_upper' },
  { studentId: 'u400_7', level: 400, entryYear: '2021/2022', standing: 'second_lower' },
  { studentId: 'u400_8', level: 400, entryYear: '2021/2022', standing: 'second_lower' },
  { studentId: 'u400_9', level: 400, entryYear: '2021/2022', standing: 'first_class' },
  { studentId: 'u400_10', level: 400, entryYear: '2021/2022', standing: 'second_upper' },
  { studentId: 'u400_11', level: 400, entryYear: '2021/2022', standing: 'third_class' },
  { studentId: 'u400_12', level: 400, entryYear: '2021/2022', standing: 'probation' },
];

function getScoreForStanding(standing: AcademicStanding, seed: number): { ca: number; exam: number } {
  const mod = (seed % 7) - 3; // -3 to +3 jitter
  switch (standing) {
    case 'first_class': {
      const ca = Math.min(38, Math.max(30, 34 + mod));
      const exam = Math.min(58, Math.max(42, 48 + mod));
      return { ca, exam };
    }
    case 'second_upper': {
      const ca = Math.min(34, Math.max(26, 30 + mod));
      const exam = Math.min(48, Math.max(34, 38 + mod));
      return { ca, exam };
    }
    case 'second_lower': {
      const ca = Math.min(28, Math.max(20, 24 + mod));
      const exam = Math.min(40, Math.max(28, 32 + mod));
      return { ca, exam };
    }
    case 'third_class': {
      const ca = Math.min(22, Math.max(16, 18 + mod));
      const exam = Math.min(32, Math.max(22, 26 + mod));
      return { ca, exam };
    }
    case 'probation': {
      const ca = Math.min(18, Math.max(8, 12 + mod));
      const exam = Math.min(24, Math.max(10, 16 + mod));
      return { ca, exam };
    }
  }
}

// Generate comprehensive enrollments and results
function generateAcademicRecords() {
  const generatedEnrollments: Enrollment[] = [];
  const generatedResults: Result[] = [];

  const sessionMap: Record<number, Record<number, string>> = {
    100: { 1: '2024/2025', 2: '2024/2025' },
    200: { 1: '2023/2024', 2: '2023/2024' },
    300: { 1: '2022/2023', 2: '2022/2023' },
    400: { 1: '2021/2022', 2: '2021/2022' },
  };

  cohorts.forEach((cohort, studentIdx) => {
    // Determine which academic levels this student has completed / is enrolled in
    const levelsToProcess = [100];
    if (cohort.level >= 200) levelsToProcess.push(200);
    if (cohort.level >= 300) levelsToProcess.push(300);
    if (cohort.level >= 400) levelsToProcess.push(400);

    levelsToProcess.forEach((lvl) => {
      // Calculate session for this level
      const entryStartYear = parseInt(cohort.entryYear.split('/')[0], 10);
      const levelOffset = (lvl - 100) / 100;
      const academicSession = `${entryStartYear + levelOffset}/${entryStartYear + levelOffset + 1}`;

      // Get all courses for this level
      const lvlCourses = mockCourses.filter((c) => c.level === lvl);

      lvlCourses.forEach((course, courseIdx) => {
        // If 400L active 2024/2025 2nd semester courses, skip or make pending draft
        const isCurrentActiveSession = academicSession === '2024/2025';
        const isCurrentSecondSemester = isCurrentActiveSession && course.semester === 2;

        const enrollmentId = `enr_${cohort.studentId}_${course.id}`;
        generatedEnrollments.push({
          id: enrollmentId,
          studentId: cohort.studentId,
          courseId: course.id,
          semester: course.semester,
          academicYear: academicSession,
        });

        // Generate results for 1st semester or completed sessions
        if (!isCurrentSecondSemester) {
          const { ca, exam } = getScoreForStanding(cohort.standing, studentIdx * 11 + courseIdx * 7);
          const total = ca + exam;
          const grade = getNucGrade(total);

          // Active 2024/2025 1st semester courses have Submitted / Pending status for moderation
          let status: 'Published' | 'Submitted' = 'Published';
          if (isCurrentActiveSession && course.semester === 1) {
            status = 'Submitted';
          }

          generatedResults.push({
            id: `res_${cohort.studentId}_${course.id}`,
            enrollmentId,
            caScore: ca,
            examScore: exam,
            totalScore: total,
            grade,
            status,
            lecturerId: course.lecturerId || 'u3',
            lastUpdated: new Date(Date.now() - (400 - lvl) * 86400000 * 90).toISOString(),
          });
        }
      });
    });
  });

  // Add graduated alumni records
  const alumniList = [
    { id: 'u15', standing: 'first_class' as AcademicStanding, year: '2019/2020' },
    { id: 'u16', standing: 'second_upper' as AcademicStanding, year: '2019/2020' },
    { id: 'u17', standing: 'second_upper' as AcademicStanding, year: '2018/2019' },
    { id: 'u18', standing: 'second_lower' as AcademicStanding, year: '2018/2019' },
  ];

  alumniList.forEach((alumnus, aIdx) => {
    [100, 200, 300, 400].forEach((lvl) => {
      const entryStart = parseInt(alumnus.year.split('/')[0], 10);
      const lvlOffset = (lvl - 100) / 100;
      const sess = `${entryStart + lvlOffset}/${entryStart + lvlOffset + 1}`;
      const lvlCourses = mockCourses.filter((c) => c.level === lvl);

      lvlCourses.forEach((course, cIdx) => {
        const enrId = `enr_${alumnus.id}_${course.id}`;
        generatedEnrollments.push({
          id: enrId,
          studentId: alumnus.id,
          courseId: course.id,
          semester: course.semester,
          academicYear: sess,
        });

        const { ca, exam } = getScoreForStanding(alumnus.standing, aIdx * 13 + cIdx * 5);
        const total = ca + exam;
        const grade = getNucGrade(total);

        generatedResults.push({
          id: `res_${alumnus.id}_${course.id}`,
          enrollmentId: enrId,
          caScore: ca,
          examScore: exam,
          totalScore: total,
          grade,
          status: 'Published',
          lecturerId: course.lecturerId || 'u3',
          lastUpdated: '2023-10-15T10:00:00Z',
        });
      });
    });
  });

  return { generatedEnrollments, generatedResults };
}

const { generatedEnrollments, generatedResults } = generateAcademicRecords();

export const mockEnrollments: Enrollment[] = generatedEnrollments;
export const mockResults: Result[] = generatedResults;
