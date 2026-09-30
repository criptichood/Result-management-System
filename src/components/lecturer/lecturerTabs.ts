import { Archive, ClipboardList, FileQuestion, LineChart, Users, type LucideIcon } from 'lucide-react';

export type LecturerTabId = 'grading' | 'class-list' | 'analytics' | 'disputes' | 'archive';

export interface LecturerTabConfig {
  id: LecturerTabId;
  /** Page heading. */
  title: string;
  /** Page sub-heading. `{course}` is replaced with the selected course code. */
  subtitle: string;
  icon: LucideIcon;
  /**
   * Whether this tab operates on one course at a time. Only course-scoped tabs
   * get the course switcher.
   */
  courseScoped: boolean;
  /** Landing view: the one you arrive on after signing in. */
  isLanding?: boolean;
  /**
   * Where the course picker is rendered for this tab. `'card'` puts it in the
   * sheet's own header, beside that sheet's actions, rather than floating in
   * the page header where it reads as detached from the controls.
   */
  courseSelectorIn: 'page' | 'card';
}

/**
 * Page metadata for the lecturer portal's views.
 *
 * Navigation lives in `src/components/Sidebar.tsx` (the lecturer menu) — there
 * is deliberately no second in-page tab bar, since the sidebar already lists
 * these ids. Keep the two in sync when adding a view.
 */
export const LECTURER_TABS: LecturerTabConfig[] = [
  {
    id: 'grading',
    title: 'Lecturer Dashboard',
    // No {course} token: the course picker now lives in the sheet header below,
    // so repeating the code up here would just state the same fact twice.
    subtitle: 'Continuous Assessment and Examination scoring',
    icon: ClipboardList,
    courseScoped: true,
    courseSelectorIn: 'card',
    isLanding: true,
  },
  {
    id: 'class-list',
    title: 'Class Roster',
    subtitle: 'Registered candidates and their academic records',
    icon: Users,
    courseScoped: true,
    courseSelectorIn: 'card',
  },
  {
    id: 'analytics',
    title: 'Cohort Analytics',
    subtitle: 'Grade distribution, class performance and at-risk diagnostics for {course}',
    icon: LineChart,
    courseScoped: true,
    courseSelectorIn: 'page',
  },
  {
    id: 'disputes',
    title: 'Grade Queries',
    subtitle: 'Student score petitions raised against your courses',
    icon: FileQuestion,
    courseScoped: false,
    courseSelectorIn: 'page',
  },
  {
    id: 'archive',
    title: 'Course Archive',
    subtitle: 'Cohorts you have already taught in earlier sessions',
    icon: Archive,
    courseScoped: false,
    courseSelectorIn: 'page',
  },
];

export const DEFAULT_LECTURER_TAB: LecturerTabId = 'grading';

/**
 * Sanitises the `?tab=` param. Guards against hand-typed or stale ids: an
 * unknown id would otherwise render the default tab's header with no content,
 * because the content blocks compare against the id directly.
 */
export function getLecturerTabId(id: string | null | undefined): LecturerTabId {
  const match = LECTURER_TABS.find((t) => t.id === id);
  return match ? match.id : DEFAULT_LECTURER_TAB;
}

export function getLecturerTab(id: string | null | undefined): LecturerTabConfig {
  return LECTURER_TABS.find((t) => t.id === id) || LECTURER_TABS[0];
}

/** Fills `{course}` in a tab subtitle, degrading gracefully when none is selected. */
export function formatTabSubtitle(subtitle: string, courseCode?: string): string {
  return subtitle.replace('{course}', courseCode || 'the selected course');
}
