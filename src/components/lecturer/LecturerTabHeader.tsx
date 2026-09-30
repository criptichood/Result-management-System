import React from 'react';
import { Course } from '../../types';
import { LecturerCourseOffering } from '../../lib/dbStudentCourses';
import { LecturerCourseSwitcher } from './LecturerCourseSwitcher';
import { formatTabSubtitle, type LecturerTabConfig } from './lecturerTabs';

interface LecturerTabHeaderProps {
  tab: LecturerTabConfig;
  /** Shown on the landing tab only: who is signed in. */
  identity?: { name: string; department?: string; staffId?: string } | null;
  selectedCourse: Course | null;
  activeCourses: LecturerCourseOffering[];
  archivedCount: number;
  onSelectCourse: (course: Course) => void;
  onOpenArchive: () => void;
  currentSession: string;
}

/**
 * Page header for a lecturer tab.
 *
 * The signing-in identity line belongs to the landing tab alone — navigating to
 * the roster, analytics or queries should not re-print "Lecturer Dashboard"
 * above content that has nothing to do with it. Each tab brings its own
 * heading, and only course-scoped tabs carry the course picker.
 */
export const LecturerTabHeader: React.FC<LecturerTabHeaderProps> = ({
  tab,
  identity,
  selectedCourse,
  activeCourses,
  archivedCount,
  onSelectCourse,
  onOpenArchive,
  currentSession,
}) => {
  const TabIcon = tab.icon;
  const isLanding = tab.isLanding === true;

  return (
    <div className="space-y-3">
      <div>
        {isLanding && identity && (
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            {identity.name} • Dept. of {identity.department || 'Computer Science'}{' '}
            {identity.staffId ? `(${identity.staffId})` : ''}
          </p>
        )}

        <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-[#064e3b] dark:text-emerald-400 tracking-tight">
          {isLanding ? null : <TabIcon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />}
          {tab.title}
        </h1>

        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
          {formatTabSubtitle(tab.subtitle, selectedCourse?.code)}
        </p>
      </div>

      {/* Tabs that host the picker in their own sheet header opt out here. */}
      {tab.courseScoped && tab.courseSelectorIn === 'page' && (
        <LecturerCourseSwitcher
          activeCourses={activeCourses}
          selectedCourse={selectedCourse}
          onSelectCourse={onSelectCourse}
          currentSession={currentSession}
          archivedCount={archivedCount}
          onOpenArchive={onOpenArchive}
        />
      )}
    </div>
  );
};
