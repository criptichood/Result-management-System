import React, { useEffect, useRef, useState } from 'react';
import { Archive, Check, ChevronDown, Layers } from 'lucide-react';
import { Course } from '../../types';
import { LecturerCourseOffering } from '../../lib/dbStudentCourses';
import { cn } from '../../lib/utils';

interface LecturerCourseSwitcherProps {
  /** Courses being offered in the live session. */
  activeCourses: LecturerCourseOffering[];
  selectedCourse: Course | null;
  onSelectCourse: (course: Course) => void;
  currentSession: string;
  /** Past cohorts on record; this is the shortcut to the archive page. */
  archivedCount: number;
  onOpenArchive: () => void;
}

const STATUS_STYLES: Record<string, { dot: string; label: string; text: string }> = {
  Rejected: { dot: 'bg-red-500', label: 'Returned', text: 'text-red-600 dark:text-red-400' },
  Published: { dot: 'bg-emerald-600', label: 'Published', text: 'text-emerald-600 dark:text-emerald-400' },
  Submitted: { dot: 'bg-amber-500', label: 'Submitted', text: 'text-amber-600 dark:text-amber-400' },
  Draft: { dot: 'bg-slate-400 dark:bg-slate-500', label: 'Draft', text: 'text-slate-500 dark:text-slate-400' },
};

const CourseRow: React.FC<{
  course: LecturerCourseOffering;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ course, isSelected, onSelect }) => {
  const status = STATUS_STYLES[course.submissionStatus] || STATUS_STYLES.Draft;
  const enrolled = course.enrolledCount ?? 0;
  const scored = course.scoredCount ?? 0;

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      onClick={onSelect}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors cursor-pointer border-l-2',
        isSelected
          ? 'border-l-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
          : 'border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'
      )}
    >
      <span
        className={cn(
          'p-1.5 rounded-lg flex-shrink-0',
          isSelected
            ? 'bg-emerald-600 text-white'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
        )}
      >
        <Layers className="h-3.5 w-3.5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {course.code}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            {course.level}L • {course.semester === 1 ? '1st' : '2nd'} Sem • {course.creditUnits} units
          </span>
        </span>
        <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">
          {course.title}
        </span>
      </span>

      <span className="flex items-center gap-2 flex-shrink-0">
        {enrolled > 0 && (
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
            {scored}/{enrolled}
          </span>
        )}
        <span
          className={cn(
            'flex items-center gap-1 text-[10px] font-bold',
            status.text
          )}
        >
          <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
          {status.label}
        </span>
        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
      </span>
    </button>
  );
}

/**
 * Collapsible course picker for the current session.
 *
 * Deliberately a dropdown rather than a row of cards: a lecturer can hold a
 * dozen offerings, and a horizontal strip of them pushes off the right edge and
 * buries the sheet underneath. Collapsed, this is one line showing the course
 * in hand; expanded, a vertical list bounded in width.
 */
export const LecturerCourseSwitcher: React.FC<LecturerCourseSwitcherProps> = ({
  activeCourses,
  selectedCourse,
  onSelectCourse,
  currentSession,
  archivedCount,
  onOpenArchive,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (activeCourses.length === 0) return null;

  const handleSelect = (course: Course) => {
    onSelectCourse(course);
    setIsOpen(false);
  };

  const current = activeCourses.find((c) => c.id === selectedCourse?.id) || activeCourses[0];
  const status = STATUS_STYLES[current.submissionStatus] || STATUS_STYLES.Draft;
  const showToggle = activeCourses.length > 1;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => showToggle && setIsOpen((open) => !open)}
        disabled={!showToggle}
        aria-haspopup={showToggle ? 'listbox' : undefined}
        aria-expanded={showToggle ? isOpen : undefined}
        className={cn(
          'w-full sm:w-auto flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all',
          showToggle ? 'cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-600' : 'cursor-default',
          isOpen
            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-600'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
        )}
      >
        <span
          className={cn(
            'p-1.5 rounded-lg flex-shrink-0',
            isOpen
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          )}
        >
          <Layers className="h-3.5 w-3.5" />
        </span>

        <span className="min-w-0">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {currentSession}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">
              {activeCourses.length} {activeCourses.length === 1 ? 'course' : 'courses'}
            </span>
          </span>
          <span className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
              {current.code}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[14rem] hidden lg:inline">
              {current.title}
            </span>
            <span
              className={cn(
                'flex items-center gap-1 text-[10px] font-bold whitespace-nowrap',
                status.text
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
              {status.label}
            </span>
          </span>
        </span>

        {showToggle && (
          <ChevronDown
            className={cn(
              'w-4 h-4 text-slate-400 flex-shrink-0 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        )}
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Courses in the current session"
          className="absolute left-0 z-30 mt-1.5 w-full sm:w-[26rem] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg overflow-hidden"
        >
          <div className="max-h-[22rem] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {activeCourses.map((course) => (
              <CourseRow
                key={course.id}
                course={course}
                isSelected={selectedCourse?.id === course.id}
                onSelect={() => handleSelect(course)}
              />
            ))}
          </div>

          {archivedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenArchive();
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 transition-colors"
            >
              <Archive className="w-3.5 h-3.5" />
              View {archivedCount} past {archivedCount === 1 ? 'cohort' : 'cohorts'} you have
              taught
            </button>
          )}
        </div>
      )}
    </div>
  );
};
