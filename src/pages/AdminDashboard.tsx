import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/db';
import { Button } from '../components/ui/button';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Course, Department, User, Enrollment, Result } from '../types';
import {
  AdminOverviewTab,
  AdminCoursesTab,
  AdminCourseAllocationTab,
  AdminDepartmentsTab,
  AdminUsersTab,
  AdminSettingsTab,
  AdminSessionTransitionModal,
  AdminSqlExplorerTab,
  AdminSenateAnalyticsTab,
  CourseFormModal,
  DepartmentFormModal,
  PreExistingCoursesModal,
  AdminUserFormModal,
} from '../components/admin';

export const AdminDashboard = () => {
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
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  // Course Management State
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

  // Session & Semester Transition Wizard State
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
    const assignedLec = users.find(u => u.id === lecturerId);
    const targetCourse = courses.find(c => c.id === courseId);
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

    // Route dynamically based on role
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

  if (!user) return null;

  return (
    <div id="admin-dashboard" className="p-4 sm:p-8 max-w-6xl mx-auto w-full">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center justify-between shadow-sm transition-all border ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            )}
            <span className="text-sm font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#064e3b] dark:text-emerald-400 tracking-tight">
            System Administration
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Manage curriculum, courses, users, and academic sessions • FUAZ SRMS Core
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            id="btn-quick-toggle-registration"
            onClick={handleToggleRegistration}
            variant={settings.courseRegistrationOpen ? 'destructive' : 'default'}
            className={
              !settings.courseRegistrationOpen
                ? 'bg-[#059669] hover:bg-emerald-700 text-white text-xs'
                : 'text-xs'
            }
          >
            {settings.courseRegistrationOpen ? (
              <>
                <XCircle className="w-4 h-4 mr-1.5" /> Close Course Registration
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Open Course Registration
              </>
            )}
          </Button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <AdminOverviewTab
          usersCount={users.length}
          coursesCount={courses.length}
          settings={settings}
          onToggleRegistration={handleToggleRegistration}
          onOpenSessionWizard={() => setIsSessionWizardOpen(true)}
        />
      )}

      {activeTab === 'senate' && (
        <AdminSenateAnalyticsTab
          users={users}
          courses={courses}
          departments={departments}
          enrollments={enrollments}
          results={results}
          session={settings.currentSession}
          semester={settings.currentSemester}
        />
      )}

      {activeTab === 'courses' && (
        <AdminCoursesTab
          courses={courses}
          departments={departments}
          courseSearch={courseSearch}
          setCourseSearch={setCourseSearch}
          selectedSemesterFilter={selectedSemesterFilter}
          setSelectedSemesterFilter={setSelectedSemesterFilter}
          selectedLevelFilter={selectedLevelFilter}
          setSelectedLevelFilter={setSelectedLevelFilter}
          selectedDeptFilter={selectedDeptFilter}
          setSelectedDeptFilter={setSelectedDeptFilter}
          onOpenAddCourse={handleOpenAddCourse}
          onOpenImportCourse={() => setIsImportCoursesOpen(true)}
          onOpenEditCourse={handleOpenEditCourse}
          onDeleteCourse={handleDeleteCourse}
          onNavigateToAllocations={() => navigate('/admin?tab=allocations')}
        />
      )}

      {activeTab === 'allocations' && (
        <AdminCourseAllocationTab
          courses={courses}
          departments={departments}
          lecturers={users.filter(u => u.role === 'Lecturer' || u.role === 'Chief Examiner')}
          workloads={db.getLecturersWithWorkload()}
          onAllocateCourse={handleAllocateCourse}
          onBatchAllocate={handleBatchAllocate}
        />
      )}

      {activeTab === 'departments' && (
        <AdminDepartmentsTab
          courses={courses}
          users={users}
          departments={departments}
          onOpenAddDepartment={() => setIsAddDeptOpen(true)}
        />
      )}

      {activeTab === 'users' && (
        <AdminUsersTab
          users={users}
          onOpenAddUser={handleOpenAddUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onImpersonate={handleImpersonate}
        />
      )}

      {activeTab === 'database' && (
        <AdminSqlExplorerTab
          onRefreshData={reloadData}
          showToast={showNotification}
        />
      )}

      {activeTab === 'settings' && (
        <AdminSettingsTab
          settings={settings}
          onSettingChange={handleSettingChange}
          onResetDatabase={handleResetDatabase}
          onOpenSessionWizard={() => setIsSessionWizardOpen(true)}
        />
      )}

      {/* Academic Session & Semester Transition Wizard Modal */}
      <AdminSessionTransitionModal
        isOpen={isSessionWizardOpen}
        onOpenChange={setIsSessionWizardOpen}
        currentSession={settings.currentSession}
        currentSemester={settings.currentSemester}
        students={users.filter(u => u.role === 'Student')}
        onConfirmTransition={handleConfirmTransition}
      />

      {/* Manual Single Course Add/Edit Modal */}
      <CourseFormModal
        isOpen={isAddCourseOpen}
        onOpenChange={setIsAddCourseOpen}
        editingCourse={editingCourse}
        departments={departments}
        formData={courseFormData}
        setFormData={setCourseFormData}
        onSave={handleSaveCourse}
      />

      {/* Add New Department Modal */}
      <DepartmentFormModal
        isOpen={isAddDeptOpen}
        onOpenChange={setIsAddDeptOpen}
        onSave={handleSaveDepartment}
      />

      {/* Multi-Select Add from Pre-Existing Courses Modal */}
      <PreExistingCoursesModal
        isOpen={isImportCoursesOpen}
        onOpenChange={setIsImportCoursesOpen}
        targetDepartment={departments[0]?.name || 'Computer Science'}
        targetCollege={departments[0]?.college || 'Science'}
        availableCourses={courses}
        departments={departments}
        onImportCourses={handleImportCourses}
      />

      {/* Add/Edit User Form Modal */}
      <AdminUserFormModal
        isOpen={isUserModalOpen}
        onOpenChange={setIsUserModalOpen}
        editingUser={editingUser}
        departments={departments}
        onSave={handleSaveUser}
      />
    </div>
  );
};
