import React from 'react';
import { Archive, BookOpen, Search } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { LecturerCourseOffering } from '../../lib/dbStudentCourses';
import { cn } from '../../lib/utils';

interface LecturerCourseArchiveProps {
  /** Courses allocated to this lecturer, each carrying its own history. */
  courses: LecturerCourseOffering[];
  currentSession: string;
}

interface ArchiveRow {
  course: LecturerCourseOffering;
  session: string;
  enrolledCount: number;
  scoredCount: number;
  averageScore: number | null;
}

/**
 * Read-only register of the cohorts a lecturer has already taught.
 *
 * Not a list of courses they have been dropped from — it is the offering
 * history: for every course they are allocated, every session *before* the
 * live one, so "which cohort did I teach CSC 111 to last year, and how did
 * they score?" is answerable without disturbing the current sheet.
 */
export const LecturerCourseArchive: React.FC<LecturerCourseArchiveProps> = ({
  courses,
  currentSession,
}) => {
  const [query, setQuery] = React.useState('');

  const rows: ArchiveRow[] = [];
  courses.forEach((course) => {
    course.previousOfferings.forEach((offering) => {
      rows.push({
        course,
        session: offering.session,
        enrolledCount: offering.enrolledCount,
        scoredCount: offering.scoredCount,
        averageScore: offering.averageScore,
      });
    });
  });

  const q = query.toLowerCase().trim();
  const filtered = q
    ? rows.filter(
        (r) =>
          r.course.code.toLowerCase().includes(q) ||
          r.course.title.toLowerCase().includes(q) ||
          r.session.includes(q)
      )
    : rows;

  const courseCount = new Set(filtered.map((r) => r.course.id)).size;

  return (
    <Card
      id="lecturer-course-archive"
      className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
    >
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
            <Archive className="w-4 h-4 text-slate-400" />
            Past Offerings
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Cohorts you have already taught, before {currentSession}. Read-only.
          </p>
        </div>

        <div className="relative sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by code, title or session..."
            className="pl-9 h-9 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>

      <CardContent className="p-0">
        {filtered.length === 0 ? (
          <div className="text-center py-14 px-4">
            <BookOpen className="w-9 h-9 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {rows.length === 0
                ? 'No earlier offerings on record.'
                : 'No past offerings match that filter.'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {rows.length === 0
                ? 'Your teaching history will appear here once earlier cohorts are loaded.'
                : 'Try a different course code or session.'}
            </p>
          </div>
        ) : (
          <>
            {/* Column headings, aligned with the row grid below */}
            <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_7rem_5rem_5rem_6rem] gap-4 px-4 py-2 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
              {['Course', 'Session', 'Cohort', 'Scored', 'Mean'].map((h) => (
                <span
                  key={h}
                  className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                >
                  {h}
                </span>
              ))}
            </div>

            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((row) => (
                <li
                  key={`${row.course.id}-${row.session}`}
                  className="px-4 py-3 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_7rem_5rem_5rem_6rem] gap-x-4 gap-y-1 items-center hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {row.course.code}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {row.course.title}
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                    {row.session}
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                    <span className="sm:hidden">Cohort: </span>
                    {row.enrolledCount}
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                    <span className="sm:hidden">Scored: </span>
                    {row.scoredCount}
                  </div>

                  <div
                    className={cn(
                      'text-[11px] font-semibold tabular-nums',
                      row.averageScore === null
                        ? 'text-slate-400 dark:text-slate-500'
                        : 'text-[#059669] dark:text-emerald-400'
                    )}
                  >
                    <span className="sm:hidden">Mean: </span>
                    {row.averageScore === null ? '—' : `${row.averageScore}`}
                  </div>
                </li>
              ))}
            </ul>

            <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500">
              {filtered.length} past {filtered.length === 1 ? 'offering' : 'offerings'} across{' '}
              {courseCount} {courseCount === 1 ? 'course' : 'courses'}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
