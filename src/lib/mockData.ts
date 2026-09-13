import { Course, Department, Enrollment, Result, User } from '../types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Dr. Amina Yusuf', email: 'admin@fuaz.edu.ng', role: 'Admin', staffId: 'ADM001' },
  { id: 'u2', name: 'Prof. Bello Ibrahim', email: 'chief@fuaz.edu.ng', role: 'Chief Examiner', college: 'Science', department: 'Computer Science', staffId: 'CE001' },
  { id: 'u3', name: 'Dr. Chidi Okafor (Lecturer A)', email: 'lecturer1@fuaz.edu.ng', role: 'Lecturer', college: 'Science', department: 'Computer Science', staffId: 'LEC001' },
  { id: 'u4', name: 'Dr. Fatima Umar (Lecturer B)', email: 'lecturer2@fuaz.edu.ng', role: 'Lecturer', college: 'Science', department: 'Mathematics', staffId: 'LEC002' },
  { id: 'u5', name: 'Jeremiah Dantani', email: 'jeremiah@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2021/02/03/045', level: 400, phoneNumber: '+234 801 234 5678', emergencyContact: '+234 809 876 5432 (Father)', address: 'Block A, Male Hostel, FUAZ Campus' },
  { id: 'u6', name: 'Sarah Musa', email: 'sarah@student.fuaz.edu.ng', role: 'Student', college: 'Agriculture', department: 'Crop Science', matricNumber: 'UG/2022/02/03/002', level: 300, phoneNumber: '+234 812 345 6789', emergencyContact: '+234 803 456 7890 (Mother)', address: 'Block C, Female Hostel, FUAZ Campus' },
  { id: 'u7', name: 'David Ojo', email: 'david@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2022/02/03/003', level: 300, phoneNumber: '+234 805 111 2222', emergencyContact: '+234 802 333 4444 (Brother)', address: 'Block B, Male Hostel' },
  { id: 'u8', name: 'Zainab Ali', email: 'zainab@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2023/02/03/004', level: 200, phoneNumber: '+234 816 555 6666', emergencyContact: '+234 803 777 8888 (Sister)', address: 'Block D, Female Hostel' },
  { id: 'u9', name: 'Emeka Uzo', email: 'emeka@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2023/02/03/005', level: 200, phoneNumber: '+234 809 999 0000', emergencyContact: '+234 810 123 4567 (Father)', address: 'Off-campus, Zuru Town' },
  { id: 'u10', name: 'Fatima Aliyu', email: 'fatima.a@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2024/02/03/006', level: 100, phoneNumber: '+234 803 112 3344', emergencyContact: '+234 802 445 5667 (Mother)', address: 'Block C, Female Hostel' },
  { id: 'u11', name: 'Musa Garba', email: 'musa.g@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2024/02/03/007', level: 100, phoneNumber: '+234 814 223 3445', emergencyContact: '+234 813 556 6778 (Uncle)', address: 'Block A, Male Hostel' },
  { id: 'u12', name: 'Blessing Okon', email: 'blessing.o@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2024/02/03/008', level: 100, phoneNumber: '+234 806 334 4556', emergencyContact: '+234 807 667 7889 (Guardian)', address: 'Block D, Female Hostel' },
  { id: 'u13', name: 'Tunde Bakare', email: 'tunde.b@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2023/02/03/009', level: 200, phoneNumber: '+234 818 445 5667', emergencyContact: '+234 819 778 8990 (Father)', address: 'Off-campus, Zuru Town' },
  { id: 'u14', name: 'Aisha Mohammed', email: 'aisha.m@student.fuaz.edu.ng', role: 'Student', college: 'Science', department: 'Computer Science', matricNumber: 'UG/2022/02/03/010', level: 300, phoneNumber: '+234 802 556 6778', emergencyContact: '+234 803 889 9001 (Sister)', address: 'Block C, Female Hostel' },
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
  { id: 'c_csc123', code: 'CSC 123', title: 'ICT and Digital Skills Acquisition', creditUnits: 2, department: 'Computer Science', college: 'Science', level: 100, semester: 2, lecturerId: 'u3' },
  { id: 'c_gst121', code: 'GST 121', title: 'Use of English II', creditUnits: 2, department: 'General Studies', college: 'Science', level: 100, semester: 2 },
  { id: 'c_gst122', code: 'GST 122', title: 'Nigeria: People and Culture', creditUnits: 2, department: 'General Studies', college: 'Science', level: 100, semester: 2 },
  { id: 'c_mth121', code: 'MTH 121', title: 'Calculus', creditUnits: 3, department: 'Mathematics', college: 'Science', level: 100, semester: 2, lecturerId: 'u4' },
  { id: 'c_phy123', code: 'PHY 123', title: 'Electricity, Magnetism and Modern Physics', creditUnits: 3, department: 'Physics', college: 'Science', level: 100, semester: 2 },
  { id: 'c_mth123', code: 'MTH 123', title: 'General Mathematics II: Elementary Algebra II', creditUnits: 3, department: 'Mathematics', college: 'Science', level: 100, semester: 2 },
  { id: 'c_mth125', code: 'MTH 125', title: 'Statistical Inference I', creditUnits: 2, department: 'Mathematics', college: 'Science', level: 100, semester: 2 },
  { id: 'c_csc121', code: 'CSC 121', title: 'Introduction to Problem Solving', creditUnits: 2, department: 'Computer Science', college: 'Science', level: 100, semester: 2, lecturerId: 'u3' },
  { id: 'c_csc122', code: 'CSC 122', title: 'Fundamentals of Computer Network', creditUnits: 2, department: 'Computer Science', college: 'Science', level: 100, semester: 2 },
  { id: 'c_mth126', code: 'MTH 126', title: 'Probability', creditUnits: 2, department: 'Mathematics', college: 'Science', level: 100, semester: 2 },

  // 200 Level - 2023/2024 1st Semester Courses
  { id: 'c_gst212', code: 'GST 212', title: 'Peace Studies and Conflict Resolution', creditUnits: 2, department: 'General Studies', college: 'Science', level: 200, semester: 1 },
  { id: 'c_csc211', code: 'CSC 211', title: 'Computer Programming I', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 200, semester: 1, lecturerId: 'u3' },
  { id: 'c_mth211', code: 'MTH 211', title: 'Mathematical Methods I', creditUnits: 3, department: 'Mathematics', college: 'Science', level: 200, semester: 1, lecturerId: 'u4' },
  { id: 'c_csc213', code: 'CSC 213', title: 'Discrete Structure', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 200, semester: 1, lecturerId: 'u3' },
  { id: 'c_csc214', code: 'CSC 214', title: 'Digital Logic Design', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 200, semester: 1, lecturerId: 'u3' },
  { id: 'c_mth214', code: 'MTH 214', title: 'Linear Algebra I', creditUnits: 2, department: 'Mathematics', college: 'Science', level: 200, semester: 1, lecturerId: 'u4' },
  { id: 'c_gst211', code: 'GST 211', title: 'History and Philosophy of Science', creditUnits: 2, department: 'General Studies', college: 'Science', level: 200, semester: 1 },
  { id: 'c_csc212', code: 'CSC 212', title: 'Operating System I', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 200, semester: 1, lecturerId: 'u3' },

  // 200 Level - 2023/2024 2nd Semester Courses
  { id: 'c_mth222', code: 'MTH 222', title: 'Elementary Differential Equations I', creditUnits: 3, department: 'Mathematics', college: 'Science', level: 200, semester: 2, lecturerId: 'u4' },
  { id: 'c_phy221', code: 'PHY 221', title: 'Electric Circuits and Electronics', creditUnits: 3, department: 'Physics', college: 'Science', level: 200, semester: 2 },
  { id: 'c_csc221', code: 'CSC 221', title: 'Computer Programming II', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 200, semester: 2, lecturerId: 'u3' },
  { id: 'c_csc222', code: 'CSC 222', title: 'Computer Hardware', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 200, semester: 2, lecturerId: 'u3' },
  { id: 'c_csc223', code: 'CSC 223', title: 'Fundamentals of Data Structures', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 200, semester: 2, lecturerId: 'u3' },
  { id: 'c_csc224', code: 'CSC 224', title: 'Introduction to Web Development', creditUnits: 2, department: 'Computer Science', college: 'Science', level: 200, semester: 2, lecturerId: 'u3' },
  { id: 'c_mth225', code: 'MTH 225', title: 'Linear Algebra II', creditUnits: 2, department: 'Mathematics', college: 'Science', level: 200, semester: 2, lecturerId: 'u4' },
  { id: 'c_gst223', code: 'GST 223', title: 'Entrepreneurship Studies I', creditUnits: 2, department: 'General Studies', college: 'Science', level: 200, semester: 2 },

  // 300 Level - 1st Semester Courses (21 Units)
  // CSC 213 (Discrete Structure - 3 units) already exists at 200L 1st Semester
  { id: 'c_csc311', code: 'CSC 311', title: 'Object-Oriented Programming', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 1, lecturerId: 'u3' },
  { id: 'c_csc312', code: 'CSC 312', title: 'Operating Systems II', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 1, lecturerId: 'u3' },
  { id: 'c_csc313', code: 'CSC 313', title: 'Compiler Construction I', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 1, lecturerId: 'u3' },
  { id: 'c_csc314', code: 'CSC 314', title: 'Computer Architecture and Organization I', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 1, lecturerId: 'u3' },
  { id: 'c_csc315', code: 'CSC 315', title: 'Systems Analysis and Design', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 1, lecturerId: 'u3' },
  { id: 'c_csc316', code: 'CSC 316', title: 'Algorithms and Complexity Analysis', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 1, lecturerId: 'u3' },

  // 300 Level - 2nd Semester Courses (18 Units)
  { id: 'c_csc321', code: 'CSC 321', title: 'Data Management I', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 2, lecturerId: 'u3' },
  { id: 'c_csc322', code: 'CSC 322', title: 'Survey of Programming Language', creditUnits: 4, department: 'Computer Science', college: 'Science', level: 300, semester: 2, lecturerId: 'u3' },
  { id: 'c_csc323', code: 'CSC 323', title: 'Structured Programming', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 2, lecturerId: 'u3' },
  { id: 'c_csc324', code: 'CSC 324', title: 'Computer Architecture and Organization II', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 2, lecturerId: 'u3' },
  { id: 'c_csc325', code: 'CSC 325', title: 'Computational Science & Numerical Methods', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 300, semester: 2, lecturerId: 'u3' },
  { id: 'c_gst321', code: 'GST 321', title: 'Entrepreneurship Studies II', creditUnits: 2, department: 'General Studies', college: 'Science', level: 300, semester: 2 },

  // 400 Level - 1st Semester Courses (16 Units)
  { id: 'c_csc411', code: 'CSC 411', title: 'Organization of Programming Language', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 400, semester: 1, lecturerId: 'u3' },
  { id: 'c_csc412', code: 'CSC 412', title: 'Software Engineering', creditUnits: 4, department: 'Computer Science', college: 'Science', level: 400, semester: 1, lecturerId: 'u3' },
  { id: 'c_csc414', code: 'CSC 414', title: 'Net-Centric Computing', creditUnits: 2, department: 'Computer Science', college: 'Science', level: 400, semester: 1, lecturerId: 'u3' },
  { id: 'c_csc415', code: 'CSC 415', title: 'Human Computer Interface', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 400, semester: 1, lecturerId: 'u3' },
  { id: 'c_csc418', code: 'CSC 418', title: 'Industrial Training', creditUnits: 4, department: 'Computer Science', college: 'Science', level: 400, semester: 1, lecturerId: 'u3' },

  // 400 Level - 2nd Semester Courses (15 Units)
  { id: 'c_csc421', code: 'CSC 421', title: 'Artificial Intelligence', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 400, semester: 2, lecturerId: 'u3' },
  { id: 'c_csc422', code: 'CSC 422', title: 'Computer Networks / Communication', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 400, semester: 2, lecturerId: 'u3' },
  { id: 'c_csc423', code: 'CSC 423', title: 'Data Management II', creditUnits: 3, department: 'Computer Science', college: 'Science', level: 400, semester: 2, lecturerId: 'u3' },
  { id: 'c_csc424', code: 'CSC 424', title: 'Project', creditUnits: 6, department: 'Computer Science', college: 'Science', level: 400, semester: 2, lecturerId: 'u3' },

  { id: 'c_agr101', code: 'AGR 101', title: 'Introductory Agriculture', creditUnits: 2, department: 'Crop Science', college: 'Agriculture', level: 100, semester: 1 },
];

export const mockEnrollments: Enrollment[] = [
  // Jeremiah Dantani (u5) - 2021/2022 1st Semester (100 Level / UG1)
  { id: 'e1_chm111', studentId: 'u5', courseId: 'c_chm111', semester: 1, academicYear: '2021/2022' },
  { id: 'e1_csc111', studentId: 'u5', courseId: 'c_csc111', semester: 1, academicYear: '2021/2022' },
  { id: 'e1_gst111', studentId: 'u5', courseId: 'c_gst111', semester: 1, academicYear: '2021/2022' },
  { id: 'e1_gst112', studentId: 'u5', courseId: 'c_gst112', semester: 1, academicYear: '2021/2022' },
  { id: 'e1_gst113', studentId: 'u5', courseId: 'c_gst113', semester: 1, academicYear: '2021/2022' },
  { id: 'e1_mth111', studentId: 'u5', courseId: 'c_mth111', semester: 1, academicYear: '2021/2022' },
  { id: 'e1_mth113', studentId: 'u5', courseId: 'c_mth113', semester: 1, academicYear: '2021/2022' },
  { id: 'e1_mth114', studentId: 'u5', courseId: 'c_mth114', semester: 1, academicYear: '2021/2022' },
  { id: 'e1_phy111', studentId: 'u5', courseId: 'c_phy111', semester: 1, academicYear: '2021/2022' },
  { id: 'e1_phy112', studentId: 'u5', courseId: 'c_phy112', semester: 1, academicYear: '2021/2022' },

  // Jeremiah Dantani (u5) - 2021/2022 2nd Semester (100 Level / UG1)
  { id: 'e2_csc123', studentId: 'u5', courseId: 'c_csc123', semester: 2, academicYear: '2021/2022' },
  { id: 'e2_gst121', studentId: 'u5', courseId: 'c_gst121', semester: 2, academicYear: '2021/2022' },
  { id: 'e2_gst122', studentId: 'u5', courseId: 'c_gst122', semester: 2, academicYear: '2021/2022' },
  { id: 'e2_mth121', studentId: 'u5', courseId: 'c_mth121', semester: 2, academicYear: '2021/2022' },
  { id: 'e2_phy123', studentId: 'u5', courseId: 'c_phy123', semester: 2, academicYear: '2021/2022' },
  { id: 'e2_mth123', studentId: 'u5', courseId: 'c_mth123', semester: 2, academicYear: '2021/2022' },
  { id: 'e2_mth125', studentId: 'u5', courseId: 'c_mth125', semester: 2, academicYear: '2021/2022' },
  { id: 'e2_csc121', studentId: 'u5', courseId: 'c_csc121', semester: 2, academicYear: '2021/2022' },
  { id: 'e2_csc122', studentId: 'u5', courseId: 'c_csc122', semester: 2, academicYear: '2021/2022' },
  { id: 'e2_mth126', studentId: 'u5', courseId: 'c_mth126', semester: 2, academicYear: '2021/2022' },

  // Jeremiah Dantani (u5) - 2022/2023 1st Semester (200 Level / UG2)
  { id: 'e3_gst212', studentId: 'u5', courseId: 'c_gst212', semester: 1, academicYear: '2022/2023' },
  { id: 'e3_csc211', studentId: 'u5', courseId: 'c_csc211', semester: 1, academicYear: '2022/2023' },
  { id: 'e3_mth211', studentId: 'u5', courseId: 'c_mth211', semester: 1, academicYear: '2022/2023' },
  { id: 'e3_csc213', studentId: 'u5', courseId: 'c_csc213', semester: 1, academicYear: '2022/2023' },
  { id: 'e3_csc214', studentId: 'u5', courseId: 'c_csc214', semester: 1, academicYear: '2022/2023' },
  { id: 'e3_mth214', studentId: 'u5', courseId: 'c_mth214', semester: 1, academicYear: '2022/2023' },
  { id: 'e3_gst211', studentId: 'u5', courseId: 'c_gst211', semester: 1, academicYear: '2022/2023' },
  { id: 'e3_csc212', studentId: 'u5', courseId: 'c_csc212', semester: 1, academicYear: '2022/2023' },

  // Jeremiah Dantani (u5) - 2022/2023 2nd Semester (200 Level / UG2)
  { id: 'e4_mth222', studentId: 'u5', courseId: 'c_mth222', semester: 2, academicYear: '2022/2023' },
  { id: 'e4_phy221', studentId: 'u5', courseId: 'c_phy221', semester: 2, academicYear: '2022/2023' },
  { id: 'e4_csc221', studentId: 'u5', courseId: 'c_csc221', semester: 2, academicYear: '2022/2023' },
  { id: 'e4_csc222', studentId: 'u5', courseId: 'c_csc222', semester: 2, academicYear: '2022/2023' },
  { id: 'e4_csc223', studentId: 'u5', courseId: 'c_csc223', semester: 2, academicYear: '2022/2023' },
  { id: 'e4_csc224', studentId: 'u5', courseId: 'c_csc224', semester: 2, academicYear: '2022/2023' },
  { id: 'e4_mth225', studentId: 'u5', courseId: 'c_mth225', semester: 2, academicYear: '2022/2023' },
  { id: 'e4_gst223', studentId: 'u5', courseId: 'c_gst223', semester: 2, academicYear: '2022/2023' },

  // Jeremiah Dantani (u5) - 2023/2024 1st Semester (300 Level / UG3)
  { id: 'e5_csc311', studentId: 'u5', courseId: 'c_csc311', semester: 1, academicYear: '2023/2024' },
  { id: 'e5_csc312', studentId: 'u5', courseId: 'c_csc312', semester: 1, academicYear: '2023/2024' },
  { id: 'e5_csc313', studentId: 'u5', courseId: 'c_csc313', semester: 1, academicYear: '2023/2024' },
  { id: 'e5_csc314', studentId: 'u5', courseId: 'c_csc314', semester: 1, academicYear: '2023/2024' },
  { id: 'e5_csc315', studentId: 'u5', courseId: 'c_csc315', semester: 1, academicYear: '2023/2024' },
  { id: 'e5_csc316', studentId: 'u5', courseId: 'c_csc316', semester: 1, academicYear: '2023/2024' },

  // Jeremiah Dantani (u5) - 2023/2024 2nd Semester (300 Level / UG3)
  { id: 'e6_csc321', studentId: 'u5', courseId: 'c_csc321', semester: 2, academicYear: '2023/2024' },
  { id: 'e6_csc322', studentId: 'u5', courseId: 'c_csc322', semester: 2, academicYear: '2023/2024' },
  { id: 'e6_csc323', studentId: 'u5', courseId: 'c_csc323', semester: 2, academicYear: '2023/2024' },
  { id: 'e6_csc324', studentId: 'u5', courseId: 'c_csc324', semester: 2, academicYear: '2023/2024' },
  { id: 'e6_csc325', studentId: 'u5', courseId: 'c_csc325', semester: 2, academicYear: '2023/2024' },
  { id: 'e6_gst321', studentId: 'u5', courseId: 'c_gst321', semester: 2, academicYear: '2023/2024' },

  // Jeremiah Dantani (u5) - 2024/2025 ACTIVE SESSION (400 Level / UG4)
  // 1st Semester (Registered courses)
  { id: 'e7_csc411', studentId: 'u5', courseId: 'c_csc411', semester: 1, academicYear: '2024/2025' },
  { id: 'e7_csc412', studentId: 'u5', courseId: 'c_csc412', semester: 1, academicYear: '2024/2025' },
  { id: 'e7_csc414', studentId: 'u5', courseId: 'c_csc414', semester: 1, academicYear: '2024/2025' },
  { id: 'e7_csc415', studentId: 'u5', courseId: 'c_csc415', semester: 1, academicYear: '2024/2025' },
  { id: 'e7_csc418', studentId: 'u5', courseId: 'c_csc418', semester: 1, academicYear: '2024/2025' },
  // 2nd Semester
  { id: 'e7_csc421', studentId: 'u5', courseId: 'c_csc421', semester: 2, academicYear: '2024/2025' },
  { id: 'e7_csc422', studentId: 'u5', courseId: 'c_csc422', semester: 2, academicYear: '2024/2025' },
  { id: 'e7_csc423', studentId: 'u5', courseId: 'c_csc423', semester: 2, academicYear: '2024/2025' },
  { id: 'e7_csc424', studentId: 'u5', courseId: 'c_csc424', semester: 2, academicYear: '2024/2025' },

  // David Ojo (u7) - 300 Level
  { id: 'e_david_csc311', studentId: 'u7', courseId: 'c_csc311', semester: 1, academicYear: '2023/2024' },
  { id: 'e_david_csc312', studentId: 'u7', courseId: 'c_csc312', semester: 1, academicYear: '2023/2024' },
  { id: 'e_david_csc211', studentId: 'u7', courseId: 'c_csc211', semester: 1, academicYear: '2022/2023' },
  { id: 'e_david_csc212', studentId: 'u7', courseId: 'c_csc212', semester: 1, academicYear: '2022/2023' },
  { id: 'e_david_csc221', studentId: 'u7', courseId: 'c_csc221', semester: 2, academicYear: '2022/2023' },
  { id: 'e_david_csc224', studentId: 'u7', courseId: 'c_csc224', semester: 2, academicYear: '2022/2023' },
  { id: 'e_david_csc111', studentId: 'u7', courseId: 'c_csc111', semester: 1, academicYear: '2021/2022' },
  { id: 'e_david_mth111', studentId: 'u7', courseId: 'c_mth111', semester: 1, academicYear: '2021/2022' },

  // Aisha Mohammed (u14) - 300 Level
  { id: 'e_aisha_csc311', studentId: 'u14', courseId: 'c_csc311', semester: 1, academicYear: '2023/2024' },
  { id: 'e_aisha_csc312', studentId: 'u14', courseId: 'c_csc312', semester: 1, academicYear: '2023/2024' },
  { id: 'e_aisha_csc211', studentId: 'u14', courseId: 'c_csc211', semester: 1, academicYear: '2022/2023' },
  { id: 'e_aisha_csc212', studentId: 'u14', courseId: 'c_csc212', semester: 1, academicYear: '2022/2023' },
  { id: 'e_aisha_csc221', studentId: 'u14', courseId: 'c_csc221', semester: 2, academicYear: '2022/2023' },
  { id: 'e_aisha_csc224', studentId: 'u14', courseId: 'c_csc224', semester: 2, academicYear: '2022/2023' },
  { id: 'e_aisha_csc111', studentId: 'u14', courseId: 'c_csc111', semester: 1, academicYear: '2021/2022' },

  // Zainab Ali (u8) - 200 Level
  { id: 'e_zainab_csc211', studentId: 'u8', courseId: 'c_csc211', semester: 1, academicYear: '2023/2024' },
  { id: 'e_zainab_csc212', studentId: 'u8', courseId: 'c_csc212', semester: 1, academicYear: '2023/2024' },
  { id: 'e_zainab_csc221', studentId: 'u8', courseId: 'c_csc221', semester: 2, academicYear: '2023/2024' },
  { id: 'e_zainab_csc224', studentId: 'u8', courseId: 'c_csc224', semester: 2, academicYear: '2023/2024' },
  { id: 'e_zainab_csc111', studentId: 'u8', courseId: 'c_csc111', semester: 1, academicYear: '2022/2023' },
  { id: 'e_zainab_mth111', studentId: 'u8', courseId: 'c_mth111', semester: 1, academicYear: '2022/2023' },

  // Emeka Uzo (u9) - 200 Level
  { id: 'e_emeka_csc211', studentId: 'u9', courseId: 'c_csc211', semester: 1, academicYear: '2023/2024' },
  { id: 'e_emeka_csc111', studentId: 'u9', courseId: 'c_csc111', semester: 1, academicYear: '2022/2023' },
  { id: 'e_emeka_mth111', studentId: 'u9', courseId: 'c_mth111', semester: 1, academicYear: '2022/2023' },

  // 100 Level students (2024/2025 cohort)
  { id: 'e_fatima_csc111', studentId: 'u10', courseId: 'c_csc111', semester: 1, academicYear: '2024/2025' },
  { id: 'e_musa_csc111', studentId: 'u11', courseId: 'c_csc111', semester: 1, academicYear: '2024/2025' },
  { id: 'e_blessing_csc111', studentId: 'u12', courseId: 'c_csc111', semester: 1, academicYear: '2024/2025' },
  { id: 'e_tunde_csc111', studentId: 'u13', courseId: 'c_csc111', semester: 1, academicYear: '2023/2024' },
  { id: 'e_sarah_agr101', studentId: 'u6', courseId: 'c_agr101', semester: 1, academicYear: '2022/2023' },
];

export const mockResults: Result[] = [
  // ==========================================
  // Jeremiah Dantani (u5) - 100 Level / UG1
  // ==========================================
  // 2021/2022 1st Semester (GPA 3.77, 22 Credits, 10 Courses)
  { id: 'r1_chm111', enrollmentId: 'e1_chm111', caScore: 21, examScore: 35, totalScore: 56, grade: 'C', status: 'Published', lecturerId: 'u3', lastUpdated: '2022-04-15T10:00:00Z' },
  { id: 'r1_csc111', enrollmentId: 'e1_csc111', caScore: 35, examScore: 45, totalScore: 80, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2022-04-15T10:00:00Z' },
  { id: 'r1_gst111', enrollmentId: 'e1_gst111', caScore: 20, examScore: 31, totalScore: 51, grade: 'C', status: 'Published', lecturerId: 'u3', lastUpdated: '2022-04-15T10:00:00Z' },
  { id: 'r1_gst112', enrollmentId: 'e1_gst112', caScore: 32, examScore: 40, totalScore: 72, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2022-04-15T10:00:00Z' },
  { id: 'r1_gst113', enrollmentId: 'e1_gst113', caScore: 23, examScore: 42, totalScore: 65, grade: 'B', status: 'Published', lecturerId: 'u3', lastUpdated: '2022-04-15T10:00:00Z' },
  { id: 'r1_mth111', enrollmentId: 'e1_mth111', caScore: 35, examScore: 13, totalScore: 48, grade: 'D', status: 'Published', lecturerId: 'u4', lastUpdated: '2022-04-15T10:00:00Z' },
  { id: 'r1_mth113', enrollmentId: 'e1_mth113', caScore: 29, examScore: 38, totalScore: 67, grade: 'B', status: 'Published', lecturerId: 'u4', lastUpdated: '2022-04-15T10:00:00Z' },
  { id: 'r1_mth114', enrollmentId: 'e1_mth114', caScore: 32, examScore: 31, totalScore: 63, grade: 'B', status: 'Published', lecturerId: 'u4', lastUpdated: '2022-04-15T10:00:00Z' },
  { id: 'r1_phy111', enrollmentId: 'e1_phy111', caScore: 27, examScore: 44, totalScore: 71, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2022-04-15T10:00:00Z' },
  { id: 'r1_phy112', enrollmentId: 'e1_phy112', caScore: 35, examScore: 26, totalScore: 61, grade: 'B', status: 'Published', lecturerId: 'u3', lastUpdated: '2022-04-15T10:00:00Z' },

  // 2021/2022 2nd Semester (GPA 4.61, 23 Credits, 10 Courses)
  { id: 'r2_csc123', enrollmentId: 'e2_csc123', caScore: 34, examScore: 48, totalScore: 82, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2022-10-20T10:00:00Z' },
  { id: 'r2_gst121', enrollmentId: 'e2_gst121', caScore: 30, examScore: 42, totalScore: 72, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2022-10-20T10:00:00Z' },
  { id: 'r2_gst122', enrollmentId: 'e2_gst122', caScore: 30, examScore: 34, totalScore: 64, grade: 'B', status: 'Published', lecturerId: 'u3', lastUpdated: '2022-10-20T10:00:00Z' },
  { id: 'r2_mth121', enrollmentId: 'e2_mth121', caScore: 35, examScore: 30, totalScore: 65, grade: 'B', status: 'Published', lecturerId: 'u4', lastUpdated: '2022-10-20T10:00:00Z' },
  { id: 'r2_phy123', enrollmentId: 'e2_phy123', caScore: 31, examScore: 45, totalScore: 76, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2022-10-20T10:00:00Z' },
  { id: 'r2_mth123', enrollmentId: 'e2_mth123', caScore: 34, examScore: 45, totalScore: 79, grade: 'A', status: 'Published', lecturerId: 'u4', lastUpdated: '2022-10-20T10:00:00Z' },
  { id: 'r2_mth125', enrollmentId: 'e2_mth125', caScore: 32, examScore: 43, totalScore: 75, grade: 'A', status: 'Published', lecturerId: 'u4', lastUpdated: '2022-10-20T10:00:00Z' },
  { id: 'r2_csc121', enrollmentId: 'e2_csc121', caScore: 31, examScore: 44, totalScore: 75, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2022-10-20T10:00:00Z' },
  { id: 'r2_csc122', enrollmentId: 'e2_csc122', caScore: 17, examScore: 37, totalScore: 54, grade: 'C', status: 'Published', lecturerId: 'u3', lastUpdated: '2022-10-20T10:00:00Z' },
  { id: 'r2_mth126', enrollmentId: 'e2_mth126', caScore: 24, examScore: 50, totalScore: 74, grade: 'A', status: 'Published', lecturerId: 'u4', lastUpdated: '2022-10-20T10:00:00Z' },

  // ==========================================
  // Jeremiah Dantani (u5) - 200 Level / UG2
  // ==========================================
  // 2022/2023 1st Semester (200 Level) - GPA: 3.67, 21 Credits, 8 Courses
  { id: 'r3_gst212', enrollmentId: 'e3_gst212', caScore: 20, examScore: 28, totalScore: 48, grade: 'D', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-03-22T10:00:00Z' },
  { id: 'r3_csc211', enrollmentId: 'e3_csc211', caScore: 29, examScore: 31, totalScore: 60, grade: 'B', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-03-22T10:00:00Z' },
  { id: 'r3_mth211', enrollmentId: 'e3_mth211', caScore: 40, examScore: 37, totalScore: 77, grade: 'A', status: 'Published', lecturerId: 'u4', lastUpdated: '2023-03-22T10:00:00Z' },
  { id: 'r3_csc213', enrollmentId: 'e3_csc213', caScore: 31, examScore: 19, totalScore: 50, grade: 'C', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-03-22T10:00:00Z' },
  { id: 'r3_csc214', enrollmentId: 'e3_csc214', caScore: 34, examScore: 26, totalScore: 60, grade: 'B', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-03-22T10:00:00Z' },
  { id: 'r3_mth214', enrollmentId: 'e3_mth214', caScore: 30, examScore: 38, totalScore: 68, grade: 'B', status: 'Published', lecturerId: 'u4', lastUpdated: '2023-03-22T10:00:00Z' },
  { id: 'r3_gst211', enrollmentId: 'e3_gst211', caScore: 35, examScore: 43, totalScore: 78, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-03-22T10:00:00Z' },
  { id: 'r3_csc212', enrollmentId: 'e3_csc212', caScore: 32, examScore: 42, totalScore: 74, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-03-22T10:00:00Z' },

  // 2022/2023 2nd Semester (200 Level) - GPA: 3.57, 21 Credits, 8 Courses
  { id: 'r4_mth222', enrollmentId: 'e4_mth222', caScore: 29, examScore: 22, totalScore: 51, grade: 'C', status: 'Published', lecturerId: 'u4', lastUpdated: '2023-09-18T10:00:00Z' },
  { id: 'r4_phy221', enrollmentId: 'e4_phy221', caScore: 30, examScore: 34, totalScore: 64, grade: 'B', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-09-18T10:00:00Z' },
  { id: 'r4_csc221', enrollmentId: 'e4_csc221', caScore: 32, examScore: 21, totalScore: 53, grade: 'C', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-09-18T10:00:00Z' },
  { id: 'r4_csc222', enrollmentId: 'e4_csc222', caScore: 32, examScore: 40, totalScore: 72, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-09-18T10:00:00Z' },
  { id: 'r4_csc223', enrollmentId: 'e4_csc223', caScore: 26, examScore: 21, totalScore: 47, grade: 'D', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-09-18T10:00:00Z' },
  { id: 'r4_csc224', enrollmentId: 'e4_csc224', caScore: 34, examScore: 37, totalScore: 71, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-09-18T10:00:00Z' },
  { id: 'r4_mth225', enrollmentId: 'e4_mth225', caScore: 25, examScore: 20, totalScore: 45, grade: 'D', status: 'Published', lecturerId: 'u4', lastUpdated: '2023-09-18T10:00:00Z' },
  { id: 'r4_gst223', enrollmentId: 'e4_gst223', caScore: 34, examScore: 47, totalScore: 81, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-09-18T10:00:00Z' },

  // ==========================================
  // Jeremiah Dantani (u5) - 300 Level / UG3
  // ==========================================
  // 2023/2024 1st Semester (300 Level) - GPA: 4.67, 18 Credits, 6 Courses
  { id: 'r5_csc311', enrollmentId: 'e5_csc311', caScore: 34, examScore: 46, totalScore: 80, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-03-20T10:00:00Z' },
  { id: 'r5_csc312', enrollmentId: 'e5_csc312', caScore: 30, examScore: 42, totalScore: 72, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-03-20T10:00:00Z' },
  { id: 'r5_csc313', enrollmentId: 'e5_csc313', caScore: 28, examScore: 37, totalScore: 65, grade: 'B', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-03-20T10:00:00Z' },
  { id: 'r5_csc314', enrollmentId: 'e5_csc314', caScore: 31, examScore: 39, totalScore: 70, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-03-20T10:00:00Z' },
  { id: 'r5_csc315', enrollmentId: 'e5_csc315', caScore: 35, examScore: 43, totalScore: 78, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-03-20T10:00:00Z' },
  { id: 'r5_csc316', enrollmentId: 'e5_csc316', caScore: 29, examScore: 38, totalScore: 67, grade: 'B', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-03-20T10:00:00Z' },

  // 2023/2024 2nd Semester (300 Level) - GPA: 4.67, 18 Credits, 6 Courses
  { id: 'r6_csc321', enrollmentId: 'e6_csc321', caScore: 35, examScore: 45, totalScore: 80, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-09-22T10:00:00Z' },
  { id: 'r6_csc322', enrollmentId: 'e6_csc322', caScore: 33, examScore: 41, totalScore: 74, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-09-22T10:00:00Z' },
  { id: 'r6_csc323', enrollmentId: 'e6_csc323', caScore: 29, examScore: 38, totalScore: 67, grade: 'B', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-09-22T10:00:00Z' },
  { id: 'r6_csc324', enrollmentId: 'e6_csc324', caScore: 31, examScore: 44, totalScore: 75, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-09-22T10:00:00Z' },
  { id: 'r6_csc325', enrollmentId: 'e6_csc325', caScore: 30, examScore: 38, totalScore: 68, grade: 'B', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-09-22T10:00:00Z' },
  { id: 'r6_gst321', enrollmentId: 'e6_gst321', caScore: 36, examScore: 48, totalScore: 84, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-09-22T10:00:00Z' },

  // ==========================================
  // Class Cohort Results (300L & 200L & 100L)
  // ==========================================
  // 300L 2023/2024 Results
  { id: 'r_david_csc311', enrollmentId: 'e_david_csc311', caScore: 30, examScore: 41, totalScore: 71, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-03-20T10:00:00Z' },
  { id: 'r_david_csc312', enrollmentId: 'e_david_csc312', caScore: 28, examScore: 38, totalScore: 66, grade: 'B', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-03-20T10:00:00Z' },
  { id: 'r_aisha_csc311', enrollmentId: 'e_aisha_csc311', caScore: 36, examScore: 46, totalScore: 82, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-03-20T10:00:00Z' },
  { id: 'r_aisha_csc312', enrollmentId: 'e_aisha_csc312', caScore: 34, examScore: 44, totalScore: 78, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-03-20T10:00:00Z' },

  // 200L Cohort Results
  { id: 'r_david_csc211', enrollmentId: 'e_david_csc211', caScore: 28, examScore: 35, totalScore: 63, grade: 'B', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-03-22T10:00:00Z' },
  { id: 'r_david_csc212', enrollmentId: 'e_david_csc212', caScore: 31, examScore: 40, totalScore: 71, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-03-22T10:00:00Z' },
  { id: 'r_david_csc221', enrollmentId: 'e_david_csc221', caScore: 26, examScore: 38, totalScore: 64, grade: 'B', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-09-18T10:00:00Z' },
  { id: 'r_david_csc224', enrollmentId: 'e_david_csc224', caScore: 35, examScore: 45, totalScore: 80, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-09-18T10:00:00Z' },

  { id: 'r_zainab_csc211', enrollmentId: 'e_zainab_csc211', caScore: 36, examScore: 42, totalScore: 78, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-03-22T10:00:00Z' },
  { id: 'r_zainab_csc212', enrollmentId: 'e_zainab_csc212', caScore: 33, examScore: 46, totalScore: 79, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-03-22T10:00:00Z' },
  { id: 'r_zainab_csc221', enrollmentId: 'e_zainab_csc221', caScore: 34, examScore: 41, totalScore: 75, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-09-18T10:00:00Z' },
  { id: 'r_zainab_csc224', enrollmentId: 'e_zainab_csc224', caScore: 37, examScore: 48, totalScore: 85, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-09-18T10:00:00Z' },

  { id: 'r_aisha_csc211', enrollmentId: 'e_aisha_csc211', caScore: 38, examScore: 47, totalScore: 85, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-03-22T10:00:00Z' },
  { id: 'r_aisha_csc212', enrollmentId: 'e_aisha_csc212', caScore: 35, examScore: 45, totalScore: 80, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-03-22T10:00:00Z' },
  { id: 'r_aisha_csc221', enrollmentId: 'e_aisha_csc221', caScore: 36, examScore: 46, totalScore: 82, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-09-18T10:00:00Z' },
  { id: 'r_aisha_csc224', enrollmentId: 'e_aisha_csc224', caScore: 38, examScore: 50, totalScore: 88, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-09-18T10:00:00Z' },

  // 100L Cohort Results
  { id: 'r_david_csc111', enrollmentId: 'e_david_csc111', caScore: 28, examScore: 42, totalScore: 70, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2022-04-15T10:00:00Z' },
  { id: 'r_zainab_csc111', enrollmentId: 'e_zainab_csc111', caScore: 35, examScore: 50, totalScore: 85, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-04-15T10:00:00Z' },
  { id: 'r_aisha_csc111', enrollmentId: 'e_aisha_csc111', caScore: 38, examScore: 54, totalScore: 92, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2022-04-15T10:00:00Z' },
  { id: 'r_blessing_csc111', enrollmentId: 'e_blessing_csc111', caScore: 26, examScore: 40, totalScore: 66, grade: 'B', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-04-15T10:00:00Z' },
  { id: 'r_tunde_csc111', enrollmentId: 'e_tunde_csc111', caScore: 22, examScore: 36, totalScore: 58, grade: 'C', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-04-15T10:00:00Z' },
  { id: 'r_emeka_csc111', enrollmentId: 'e_emeka_csc111', caScore: 16, examScore: 29, totalScore: 45, grade: 'D', status: 'Published', lecturerId: 'u3', lastUpdated: '2023-04-15T10:00:00Z' },
  { id: 'r_musa_csc111', enrollmentId: 'e_musa_csc111', caScore: 32, examScore: 40, totalScore: 72, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-04-15T10:00:00Z' },
  { id: 'r_fatima_csc111', enrollmentId: 'e_fatima_csc111', caScore: 28, examScore: 42, totalScore: 70, grade: 'A', status: 'Published', lecturerId: 'u3', lastUpdated: '2024-04-15T10:00:00Z' },

  // MTH 111 Cohort
  { id: 'r_david_mth111', enrollmentId: 'e_david_mth111', caScore: 30, examScore: 35, totalScore: 65, grade: 'B', status: 'Published', lecturerId: 'u4', lastUpdated: '2022-04-15T10:00:00Z' },
  { id: 'r_zainab_mth111', enrollmentId: 'e_zainab_mth111', caScore: 33, examScore: 45, totalScore: 78, grade: 'A', status: 'Published', lecturerId: 'u4', lastUpdated: '2023-04-15T10:00:00Z' },
  { id: 'r_emeka_mth111', enrollmentId: 'e_emeka_mth111', caScore: 10, examScore: 22, totalScore: 32, grade: 'F', status: 'Published', lecturerId: 'u4', lastUpdated: '2023-04-15T10:00:00Z' },
];

export const mockDepartments: Department[] = [
  { id: 'dept_1', name: 'Computer Science', code: 'CSC', college: 'Science', HOD: 'Dr. Abubakar Sadiq', description: 'Department of Computer Science & Information Technology' },
  { id: 'dept_2', name: 'Mathematics', code: 'MTH', college: 'Science', HOD: 'Prof. Bello Ahmed', description: 'Department of Mathematical Sciences' },
  { id: 'dept_3', name: 'Physics', code: 'PHY', college: 'Science', HOD: 'Dr. Kabir Aliyu', description: 'Department of Physics with Electronics' },
  { id: 'dept_4', name: 'Chemical Sciences', code: 'CHM', college: 'Science', HOD: 'Dr. Zainab Umar', description: 'Department of Chemical & Applied Chemistry' },
  { id: 'dept_5', name: 'General Studies', code: 'GST', college: 'Science', HOD: 'Dr. Ibrahim Katcha', description: 'Directorate of General Studies' },
  { id: 'dept_6', name: 'Crop Science', code: 'AGR', college: 'Agriculture', HOD: 'Prof. Musa Danladi', description: 'Department of Crop Production and Protection' },
  { id: 'dept_7', name: 'Animal Science', code: 'ANS', college: 'Agriculture', HOD: 'Dr. Fatima Sanusi', description: 'Department of Animal Science & Livestock' },
];


