import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/db';
import { Course, Department, User, Enrollment, Result } from '../types';

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
    currentSession: '2024/2025',
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

  const handleBatchAllocate = (allocations: { courseId: string; lecturerId?: string }[]) => {
    db.batchAllocateCourses(allocations);
    reloadData();
    showNotification(`Batch allocated ${allocations.length} course(s) to departmental faculty.`);
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

  const handleToggleRegistration = () => {
    const updated = !settings.courseRegistrationOpen;
    handleSettingChange('courseRegistrationOpen', updated);
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
    HOD: string;
    description: string;
  }) => {
    const newDept: Department = {
      id: `dept_${Date.now()}`,
      name: deptData.name.trim(),
      code: deptData.code.trim().toUpperCase(),
      college: deptData.college,
      HOD: deptData.HOD.trim() || undefined,
      description: deptData.description.trim() || undefined,
    };
    db.from('departments').insert(newDept);
    setDepartments(db.from('departments').select());
    showNotification(`Added department of ${newDept.name}.`);
  };

  const handleImportCourses = (
    selectedCourses: Course[],
    targetDept: string,
    targetCollege: string
  ) => {
    const existingCourses = db.from('courses').select();

    selectedCourses.forEach((c) => {
      const alreadyInDept = existingCourses.some(
        (existing) =>
          existing.code === c.code &&
          existing.department.toLowerCase() === targetDept.toLowerCase()
      );

      if (!alreadyInDept) {
        const clonedCourse: Course = {
          id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          code: c.code,
          title: c.title,
          creditUnits: c.creditUnits,
          department: targetDept,
          college: targetCollege,
          level: c.level,
          semester: c.semester,
        };
        db.from('courses').insert(clonedCourse);
      }
    });

    setCourses(db.from('courses').select());
    showNotification(`Imported ${selectedCourses.length} curriculum courses into ${targetDept}.`);
  };

  // User Management Handlers
  const handleOpenAddUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (userData: Partial<User>) => {
    if (editingUser) {
      db.from('users').update(editingUser.id, userData);
      showNotification(`Updated user credentials for ${userData.name || editingUser.name}.`);
    } else {
      const newUser: User = {
        id: `u_${Date.now()}`,
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'Student',
        department: userData.department,
        college: userData.college,
        matricNumber: userData.matricNumber,
        staffId: userData.staffId,
        level: userData.level,
        phoneNumber: userData.phoneNumber,
      };
      db.from('users').insert(newUser);
      showNotification(`Registered new user ${newUser.name} (${newUser.role}).`);
    }
    setUsers(db.from('users').select());
  };

  const handleDeleteUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target?.id === user?.id) {
      showNotification('Cannot delete your own active administrator account.', 'info');
      return;
    }
    db.from('users').delete(userId);
    setUsers(db.from('users').select());
    showNotification(`Deleted user ${target?.name || ''}.`, 'info');
  };

  const handleImpersonate = (targetUser: User) => {
    login(targetUser.id);
    showNotification(`Switched session to ${targetUser.name} (${targetUser.role}).`);

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
    handleBatchAllocate,
    handleConfirmTransition,
    handleToggleRegistration,
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
