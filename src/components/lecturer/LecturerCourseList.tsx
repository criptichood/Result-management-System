import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { BookOpen, Layers, Check } from 'lucide-react';
import { Course } from '../../types';

interface LecturerCourseListProps {
  courses: Course[];
  selectedCourse: Course | null;
  onSelectCourse: (course: Course) => void;
}

export const LecturerCourseList: React.FC<LecturerCourseListProps> = ({
  courses,
  selectedCourse,
  onSelectCourse,
}) => {
  const [semesterFilter, setSemesterFilter] = useState<'all' | 1 | 2>('all');

  const filteredCourses = courses.filter(c => {
    if (semesterFilter === 'all') return true;
    return c.semester === semesterFilter;
  });

  return (
    <div id="lecturer-course-list" className="lg:col-span-1 space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-600" /> Teaching Load
        </h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
          {filteredCourses.length} of {courses.length}
        </span>
      </div>

      {/* Quick Semester Filter Tabs */}
      <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
        <button
          id="btn-filter-sem-all"
          onClick={() => setSemesterFilter('all')}
          className={`flex-1 py-1 font-semibold rounded-md transition-all ${
            semesterFilter === 'all'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All ({courses.length})
        </button>
        <button
          id="btn-filter-sem-1"
          onClick={() => setSemesterFilter(1)}
          className={`flex-1 py-1 font-semibold rounded-md transition-all ${
            semesterFilter === 1
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1st Sem ({courses.filter(c => c.semester === 1).length})
        </button>
        <button
          id="btn-filter-sem-2"
          onClick={() => setSemesterFilter(2)}
          className={`flex-1 py-1 font-semibold rounded-md transition-all ${
            semesterFilter === 2
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2nd Sem ({courses.filter(c => c.semester === 2).length})
        </button>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-0.5">
        {filteredCourses.map(course => {
          const isSelected = selectedCourse?.id === course.id;
          return (
            <Card 
              key={course.id} 
              id={`card-lecturer-course-${course.id}`}
              className={`cursor-pointer transition-all border ${
                isSelected 
                  ? 'border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-600 shadow-xs' 
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
              onClick={() => onSelectCourse(course)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">{course.code}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{course.title}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="p-1 rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-semibold">
                    {course.creditUnits} Units
                  </span>
                  <span>{course.level} Level</span>
                  <span>•</span>
                  <span>{course.semester === 1 ? '1st Sem' : '2nd Sem'}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredCourses.length === 0 && (
          <div className="text-center py-6 px-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-500">No courses match selected semester filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
