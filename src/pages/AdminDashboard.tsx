import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../lib/db';
import { Button } from '../components/ui/button';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import { useAdminDashboardState } from '../hooks/useAdminDashboardState';
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
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const {
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
  } = useAdminDashboardState();

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
                ? 'bg-[#059669] hover:bg-emerald-700 text-white text-xs cursor-pointer'
                : 'text-xs cursor-pointer'
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
          lecturers={users.filter((u) => u.role === 'Lecturer' || u.role === 'Chief Examiner')}
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
        <AdminSqlExplorerTab onRefreshData={reloadData} showToast={showNotification} />
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
        students={users.filter((u) => u.role === 'Student')}
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
