import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/db';
import { Button } from '../components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Course } from '../types';
import {
  AdminOverviewTab,
  AdminCoursesTab,
  AdminUsersTab,
  AdminSettingsTab,
  CourseFormModal,
} from '../components/admin';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [settings, setSettings] = useState({
    lecturerViewEmail: false,
    lecturerViewPhone: false,
    courseRegistrationOpen: true,
    currentSession: '2023/2024',
    currentSemester: 1 as 1 | 2,
  });
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  // Course Management State
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<number | 'all'>('all');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<number | 'all'>('all');

  // New Course Form Modal State
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

  useEffect(() => {
    if (user) {
      setUsers(db.from('users').select());
      setCourses(db.from('courses').select());
      setSettings(db.getSettings());
    }
  }, [user]);

  const handleSettingChange = (key: keyof typeof settings, value?: any) => {
    const newSettings = { 
      ...settings, 
      [key]: value !== undefined ? value : !settings[key] 
    };
    setSettings(newSettings);
    db.updateSettings(newSettings);
  };

  const handleToggleRegistration = () => {
    const updated = !settings.courseRegistrationOpen;
    handleSettingChange('courseRegistrationOpen', updated);
  };

  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setCourseFormData({
      code: '',
      title: '',
      creditUnits: 2,
      department: 'Computer Science',
      college: 'Science',
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
    if (!courseFormData.code || !courseFormData.title) {
      alert('Please fill in both Course Code and Course Title.');
      return;
    }

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
    }

    setCourses(db.from('courses').select());
    setIsAddCourseOpen(false);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      db.from('courses').delete(courseId);
      setCourses(db.from('courses').select());
    }
  };

  if (!user) return null;

  return (
    <div id="admin-dashboard" className="p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#064e3b] tracking-tight">System Administration</h1>
          <p className="text-slate-500 mt-1">Manage curriculum, courses, users, and academic sessions</p>
        </div>
        <div className="flex gap-3">
          <Button 
            id="btn-quick-toggle-registration"
            onClick={handleToggleRegistration} 
            variant={settings.courseRegistrationOpen ? "destructive" : "default"}
            className={!settings.courseRegistrationOpen ? "bg-[#059669] hover:bg-emerald-700 text-white" : ""}
          >
            {settings.courseRegistrationOpen ? (
              <><XCircle className="w-4 h-4 mr-2" /> Close Course Registration</>
            ) : (
              <><CheckCircle2 className="w-4 h-4 mr-2" /> Open Course Registration</>
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
        />
      )}

      {activeTab === 'courses' && (
        <AdminCoursesTab
          courses={courses}
          courseSearch={courseSearch}
          setCourseSearch={setCourseSearch}
          selectedSemesterFilter={selectedSemesterFilter}
          setSelectedSemesterFilter={setSelectedSemesterFilter}
          selectedLevelFilter={selectedLevelFilter}
          setSelectedLevelFilter={setSelectedLevelFilter}
          onOpenAddCourse={handleOpenAddCourse}
          onOpenEditCourse={handleOpenEditCourse}
          onDeleteCourse={handleDeleteCourse}
        />
      )}

      {activeTab === 'users' && (
        <AdminUsersTab users={users} />
      )}

      {activeTab === 'settings' && (
        <AdminSettingsTab
          settings={settings}
          onSettingChange={handleSettingChange}
        />
      )}

      <CourseFormModal
        isOpen={isAddCourseOpen}
        onOpenChange={setIsAddCourseOpen}
        editingCourse={editingCourse}
        formData={courseFormData}
        setFormData={setCourseFormData}
        onSave={handleSaveCourse}
      />
    </div>
  );
};
