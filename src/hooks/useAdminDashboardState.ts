import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/db';
import { Course, Department, User, Enrollment, Result, CourseInstructor, InstructorRole } from '../types';

export function useAdminDashboardState() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [settings, setSettings] = useState({
    lecturerViewEmail: false,
    lecturerViewPhone: false,
    courseRegistrationOpen: true,
    currentSession: '2025/2026',
    currentSemester: 1 as 1 | 2,
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  // Course Filters
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<number | 'all'>('all');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<number | 'all'>('all');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string | 'all'>('all');

  // Course Form Modal State
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseFormData, setCourseFormData] = useState({
    code: '',
    title: '',
    creditUnits: 2,
    department: 'Computer Science',
    college: 'Science',
    level: 100,
    semester: 1 as 1 | 2,
  });

  // Department Form Modal State
  const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);

  // Pre-Existing Courses Import Modal State
  const [isImportCoursesOpen, setIsImportCoursesOpen] = useState(false);

  // User Form Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Session Transition Wizard State
  const [isSessionWizardOpen, setIsSessionWizardOpen] = useState(false);

  // Course Registration Confirmation Modal
  const [isRegConfirmModalOpen, setIsRegConfirmModalOpen] = useState(false);

  // Multi-Lecturer Course Assignment Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedCourseForAssignment, setSelectedCourseForAssignment] = useState<Course | null>(null);

  // Auto Assign Preview Modal State
  const [isAutoAssignModalOpen, setIsAutoAssignModalOpen] = useState(false);

  // Lecturer Workload / Teaching Profile Modal State
  const [isLecturerWorkloadModalOpen, setIsLecturerWorkloadModalOpen] = useState(false);
  const [selectedLecturerForWorkload, setSelectedLecturerForWorkload] = useState<User | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const reloadData = () => {
    setUsers(db.from('users').select());
    setCourses(db.from('courses').select());
    setDepartments(db.from('departments').select());
    setEnrollments(db.from('enrollments').select());
    setResults(db.from('results').select());
    setSettings(db.getSettings());
  };

  useEffect(() => {
    if (user) {
      reloadData();
    }
  }, [user]);

  const handleSettingChange = (key: keyof typeof settings, value?: any) => {
    const newSettings = {
      ...settings,
      [key]: value !== undefined ? value : !settings[key],
    };
    setSettings(newSettings);
    db.updateSettings(newSettings);
    showNotification('System parameter updated.');
  };

  const handleAllocateCourse = (courseId: string, lecturerId?: string) => {
    db.allocateCourseLecturer(courseId, lecturerId);
    reloadData();
    const assignedLec = users.find((u) => u.id === lecturerId);
    const targetCourse = courses.find((c) => c.id === courseId);
    if (assignedLec) {
      showNotification(`Allocated ${targetCourse?.code || 'course'} to ${assignedLec.name}.`);
    } else {
      showNotification(`De-allocated lecturer from ${targetCourse?.code || 'course'}.`, 'info');
    }
  };

  const handleUpdateCourseInstructors = (courseId: string, instructors: CourseInstructor[]) => {
    db.updateCourseInstructors(courseId, instructors);
    reloadData();
    const targetCourse = courses.find((c) => c.id === courseId);
    showNotification(`Updated teaching staff allocations for ${targetCourse?.code || 'course'}.`);
  };

  const handleBatchAllocate = (
    allocations: { courseId: string; lecturerId?: string; instructors?: CourseInstructor[] }[]
  ) => {
    db.batchAllocateCourses(allocations);
    reloadData();
    showNotification(`Successfully allocated ${allocations.length} course(s) across academic departments.`);
  };

  const handleConfirmTransition = (
    newSession: string,
    newSemester: 1 | 2,
    options: { promoteStudents: boolean; openRegistration: boolean }
  ) => {
    db.transitionAcademicSession(newSession, newSemester, options);
    reloadData();
    showNotification(
      `Academic term transitioned to ${newSession} (${newSemester === 1 ? '1st' : '2nd'} Semester)${
        options.promoteStudents ? ' with student cohort level promotions' : ''
      }.`
    );
  };

  const handleConfirmToggleRegistration = () => {
    const updated = !settings.courseRegistrationOpen;
    handleSettingChange('courseRegistrationOpen', updated);
    setIsRegConfirmModalOpen(false);
    showNotification(
      `Course registration has been ${updated ? 'OPENED' : 'CLOSED'} for all students.`
    );
  };

  // Open Lecturer Workload modal
  const handleOpenLecturerWorkload = (lecturerUser: User) => {
    setSelectedLecturerForWorkload(lecturerUser);
    setIsLecturerWorkloadModalOpen(true);
  };

  // Assign course to lecturer directly from Lecturer Workload modal
  const handleAssignCourseToLecturer = (courseId: string, lecturerId: string, role: InstructorRole = 'Lead Instructor') => {
    const targetCourse = courses.find((c) => c.id === courseId);
    if (!targetCourse) return;

    const existing = [...(targetCourse.instructors || [])];
    const isAlready = existing.find((i) => i.lecturerId === lecturerId);
    if (isAlready) {
      isAlready.role = role;
    } else {
      existing.push({
        lecturerId,
        role,
        assignedAt: new Date().toISOString(),
      });
    }

    db.updateCourseInstructors(courseId, existing);
    reloadData();
    showNotification(`Assigned ${targetCourse.code} to teaching portfolio.`);
  };

  // Remove course from lecturer directly from Lecturer Workload modal
  const handleRemoveCourseFromLecturer = (courseId: string, lecturerId: string) => {
    const targetCourse = courses.find((c) => c.id === courseId);
    if (!targetCourse) return;

    const existing = (targetCourse.instructors || []).filter((i) => i.lecturerId !== lecturerId);
    db.updateCourseInstructors(courseId, existing);
    reloadData();
    showNotification(`Removed ${targetCourse.code} from teaching portfolio.`, 'info');
  };

  // Open Instructor assignment modal for a specific course
  const handleOpenAssignModalForCourse = (course: Course) => {
    setSelectedCourseForAssignment(course);
    setIsAssignModalOpen(true);
  };

  // Course Handlers
  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    const defaultDept = departments.length > 0 ? departments[0] : null;
    setCourseFormData({
      code: '',
      title: '',
      creditUnits: 2,
      department: defaultDept ? defaultDept.name : 'Computer Science',
      college: defaultDept ? defaultDept.college : 'Science',
      level: 100,
      semester: 1,
    });
    setIsAddCourseOpen(true);
  };

  const handleOpenEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseFormData({
      code: course.code,
      title: course.title,
      creditUnits: course.creditUnits,
      department: course.department,
      college: course.college,
      level: course.level,
      semester: course.semester,
    });
    setIsAddCourseOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseFormData.code || !courseFormData.title) return;

    if (editingCourse) {
      db.from('courses').update(editingCourse.id, {
        code: courseFormData.code.toUpperCase(),
        title: courseFormData.title,
        creditUnits: Number(courseFormData.creditUnits),
        department: courseFormData.department,
        college: courseFormData.college,
        level: Number(courseFormData.level),
        semester: Number(courseFormData.semester) as 1 | 2,
      });
      showNotification(`Updated course ${courseFormData.code.toUpperCase()}.`);
    } else {
      const newCourse: Course = {
        id: `c_${Date.now()}`,
        code: courseFormData.code.toUpperCase(),
        title: courseFormData.title,
        creditUnits: Number(courseFormData.creditUnits),
        department: courseFormData.department,
        college: courseFormData.college,
        level: Number(courseFormData.level),
        semester: Number(courseFormData.semester) as 1 | 2,
      };
      db.from('courses').insert(newCourse);
      showNotification(`Added new course ${newCourse.code}.`);
    }

    setCourses(db.from('courses').select());
    setIsAddCourseOpen(false);
  };

  const handleDeleteCourse = (courseId: string) => {
    const target = courses.find((c) => c.id === courseId);
    db.from('courses').delete(courseId);
    setCourses(db.from('courses').select());
    showNotification(`Deleted course ${target?.code || ''}.`, 'info');
  };

  const handleSaveDepartment = (deptData: {
    name: string;
    code: string;
    college: string;
    hodName?: string;
  }) => {
    const newDept: Department = {
      id: `dept_${Date.now()}`,
      name: deptData.name,
      code: deptData.code.toUpperCase(),
      college: deptData.college,
      HOD: deptData.hodName || 'Faculty HOD',
    };
    db.from('departments').insert(newDept);
    setDepartments(db.from('departments').select());
    setIsAddDeptOpen(false);
    showNotification(`Added department ${newDept.name}.`);
  };

  const handleImportCourses = (selectedCourseIds: string[], targetDept: string, targetCollege: string) => {
    // Import helper
    reloadData();
    setIsImportCoursesOpen(false);
    showNotification(`Imported ${selectedCourseIds.length} course(s) into curriculum.`);
  };

  // User Handlers
  const handleOpenAddUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (targetUser: User) => {
    setEditingUser(targetUser);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (userData: Partial<User>) => {
    if (editingUser) {
      db.from('users').update(editingUser.id, userData);
      showNotification(`Updated user account ${userData.name || editingUser.name}.`);
    } else {
      const newUser: User = {
        id: `u_${Date.now()}`,
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'Student',
        department: userData.department || 'Computer Science',
        matricNumber: userData.matricNumber,
        staffId: userData.staffId,
        level: userData.level,
      };
      db.from('users').insert(newUser);
      showNotification(`Created account for ${newUser.name}.`);
    }
    setUsers(db.from('users').select());
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    db.from('users').delete(userId);
    setUsers(db.from('users').select());
    showNotification(`Deleted user ${target?.name || ''}.`, 'info');
  };

  const handleImpersonate = (targetUser: User) => {
    login(targetUser);
    if (targetUser.role === 'Student') {
      navigate('/student');
    } else if (targetUser.role === 'Lecturer') {
      navigate('/lecturer');
    } else if (targetUser.role === 'Chief Examiner') {
      navigate('/examiner');
    } else {
      navigate('/admin');
    }
  };

  const handleResetDatabase = () => {
    db.resetDatabase();
    reloadData();
    showNotification('Database successfully reset to default institutional seed data.');
  };

  return {
    user,
    navigate,
    users,
    courses,
    departments,
    enrollments,
    results,
    settings,
    notification,
    reloadData,
    showNotification,
    handleSettingChange,
    handleAllocateCourse,
    handleUpdateCourseInstructors,
    handleBatchAllocate,
    handleConfirmTransition,
    handleConfirmToggleRegistration,
    isRegConfirmModalOpen,
    setIsRegConfirmModalOpen,
    isAssignModalOpen,
    setIsAssignModalOpen,
    selectedCourseForAssignment,
    setSelectedCourseForAssignment,
    handleOpenAssignModalForCourse,
    isAutoAssignModalOpen,
    setIsAutoAssignModalOpen,
    isLecturerWorkloadModalOpen,
    setIsLecturerWorkloadModalOpen,
    selectedLecturerForWorkload,
    setSelectedLecturerForWorkload,
    handleOpenLecturerWorkload,
    handleAssignCourseToLecturer,
    handleRemoveCourseFromLecturer,
    courseSearch,
    setCourseSearch,
    selectedSemesterFilter,
    setSelectedSemesterFilter,
    selectedLevelFilter,
    setSelectedLevelFilter,
    selectedDeptFilter,
    setSelectedDeptFilter,
    isAddCourseOpen,
    setIsAddCourseOpen,
    editingCourse,
    courseFormData,
    setCourseFormData,
    handleOpenAddCourse,
    handleOpenEditCourse,
    handleSaveCourse,
    handleDeleteCourse,
    isAddDeptOpen,
    setIsAddDeptOpen,
    handleSaveDepartment,
    isImportCoursesOpen,
    setIsImportCoursesOpen,
    handleImportCourses,
    isUserModalOpen,
    setIsUserModalOpen,
    editingUser,
    handleOpenAddUser,
    handleEditUser,
    handleSaveUser,
    handleDeleteUser,
    handleImpersonate,
    handleResetDatabase,
    isSessionWizardOpen,
    setIsSessionWizardOpen,
  };
}
