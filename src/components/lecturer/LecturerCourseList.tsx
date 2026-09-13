import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { BookOpen, Layers, Check, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { Course } from '../../types';

interface EnrichedCourse extends Course {
  enrolledCount?: number;
  scoredCount?: number;
  submissionStatus?: 'Draft' | 'Submitted' | 'Published' | 'Rejected';
  moderationNotes?: string;
}

interface LecturerCourseListProps {
  courses: EnrichedCourse[];
  selectedCourse: Course | null;
  onSelectCourse: (course: Course) => void;
}

export const LecturerCourseList: React.FC<LecturerCourseListProps> = ({
  courses,
  selectedCourse,
  onSelectCourse,
}) => {
  const [semesterFilter, setSemesterFilter] = useState<'all' | 1 | 2>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'rejected' | 'draft' | 'submitted'>('all');

  const returnedCount = courses.filter((c) => c.submissionStatus === 'Rejected').length;

  const filteredCourses = courses.filter((c) => {
    if (semesterFilter !== 'all' && c.semester !== semesterFilter) return false;
    if (statusFilter === 'rejected' && c.submissionStatus !== 'Rejected') return false;
    if (statusFilter === 'draft' && c.submissionStatus !== 'Draft') return false;
    if (statusFilter === 'submitted' && c.submissionStatus !== 'Submitted' && c.submissionStatus !== 'Published') return false;
    return true;
  });

  return (
    <div id="lecturer-course-list" className="lg:col-span-1 space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Teaching Load
        </h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {filteredCourses.length} of {courses.length}
        </span>
      </div>

      {/* Quick Semester Filter Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
        <button
          id="btn-filter-sem-all"
          onClick={() => setSemesterFilter('all')}
          className={`flex-1 py-1 font-semibold rounded-md transition-all ${
            semesterFilter === 'all'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          All ({courses.length})
        </button>
        <button
          id="btn-filter-sem-1"
          onClick={() => setSemesterFilter(1)}
          className={`flex-1 py-1 font-semibold rounded-md transition-all ${
            semesterFilter === 1
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          1st ({courses.filter((c) => c.semester === 1).length})
        </button>
        <button
          id="btn-filter-sem-2"
          onClick={() => setSemesterFilter(2)}
          className={`flex-1 py-1 font-semibold rounded-md transition-all ${
            semesterFilter === 2
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          2nd ({courses.filter((c) => c.semester === 2).length})
        </button>
      </div>

      {/* Actionable Rejection Alert Chip */}
      {returnedCount > 0 && (
        <button
          onClick={() => setStatusFilter(statusFilter === 'rejected' ? 'all' : 'rejected')}
          className={`w-full p-2 rounded-lg flex items-center justify-between text-xs font-bold transition-all border ${
            statusFilter === 'rejected'
              ? 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border-red-400 ring-1 ring-red-400'
              : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900 hover:bg-red-100'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400 flex-shrink-0" />
            {returnedCount} {returnedCount === 1 ? 'Course' : 'Courses'} Returned by Examiner
          </span>
          <span className="px-1.5 py-0.5 rounded bg-red-200 dark:bg-red-900 text-[10px] text-red-800 dark:text-red-200">
            Action Req.
          </span>
        </button>
      )}

      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-0.5">
        {filteredCourses.map((course) => {
          const isSelected = selectedCourse?.id === course.id;
          const status = course.submissionStatus || 'Draft';
          const enrolled = course.enrolledCount ?? 0;
          const scored = course.scoredCount ?? 0;
          const progressPercent = enrolled > 0 ? Math.round((scored / enrolled) * 100) : 0;

          return (
            <Card
              key={course.id}
              id={`card-lecturer-course-${course.id}`}
              className={`cursor-pointer transition-all border ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 ring-1 ring-emerald-600 shadow-xs'
                  : status === 'Rejected'
                  ? 'border-red-200 dark:border-red-900 bg-red-50/20 dark:bg-red-950/10 hover:border-red-300'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
              }`}
              onClick={() => onSelectCourse(course)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : status === 'Rejected'
                          ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight">
                          {course.code}
                        </h4>
                        {status === 'Rejected' && (
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {course.title}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex-shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {/* Progress bar and status indicator */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      Grading: {scored}/{enrolled}
                    </span>
                    {status === 'Rejected' ? (
                      <span className="inline-flex items-center gap-1 font-bold text-red-600 dark:text-red-400 text-[10px]">
                        <AlertTriangle className="w-3 h-3" /> Returned
                      </span>
                    ) : status === 'Submitted' ? (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 text-[10px]">
                        <Clock className="w-3 h-3" /> Submitted
                      </span>
                    ) : status === 'Published' ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 text-[10px]">
                        {progressPercent}% scored
                      </span>
                    )}
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all rounded-full ${
                        status === 'Rejected'
                          ? 'bg-red-500'
                          : status === 'Published'
                          ? 'bg-emerald-600'
                          : status === 'Submitted'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 font-semibold">
                      {course.creditUnits} Units
                    </span>
                    <span>{course.level} Level</span>
                    <span>•</span>
                    <span>{course.semester === 1 ? '1st Sem' : '2nd Sem'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredCourses.length === 0 && (
          <div className="text-center py-6 px-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No courses match selected filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
