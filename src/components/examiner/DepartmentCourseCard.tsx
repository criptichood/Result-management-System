import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Eye, 
  Check, 
  RotateCcw, 
  Edit3, 
  FileSpreadsheet, 
  Download, 
  MoreVertical, 
  Users, 
  User as UserIcon,
  BookOpen
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Course, User } from '../../types';

interface DepartmentCourseCardProps {
  course: any;
  department: string;
  lecturer: User | null;
  onAudit: (course: any) => void;
  onEdit: (course: Course) => void;
  onApprove?: (courseId: string) => void;
  onReturn?: (course: any) => void;
  onExport: (course: any) => void;
}

export const DepartmentCourseCard: React.FC<DepartmentCourseCardProps> = ({
  course,
  department,
  lecturer,
  onAudit,
  onEdit,
  onApprove,
  onReturn,
  onExport,
}) => {
  const isCore = course.department === department;
  const enrolledCount = course.totalEnrolled || 0;
  const hasPending = course.hasPendingReview;
  const isPublished = course.isFullyPublished;

  return (
    <div className="p-4 space-y-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
      {/* Top Bar: Code, Core Badge & Status */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 tracking-wider">
            {course.code}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              isCore
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
            }`}
          >
            {isCore ? 'Core' : 'Borrowed'}
          </span>
        </div>

        <div>
          {isPublished ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Published
            </span>
          ) : hasPending ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Submitted
            </span>
          ) : enrolledCount > 0 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              <Users className="w-3 h-3 text-slate-400" />
              In Progress
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">
              —
            </span>
          )}
        </div>
      </div>

      {/* Course Title */}
      <div>
        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug">
          {course.title}
        </h4>
        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/80 dark:border-slate-700">
            {course.creditUnits} Units
          </span>
          <span>•</span>
          <span>{course.level}L</span>
          <span>•</span>
          <span>{course.semester === 1 ? '1st Sem' : '2nd Sem'}</span>
        </div>
      </div>

      {/* Lecturer and Enrolment Info */}
      <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2 min-w-0">
          {lecturer ? (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                {lecturer.name.split(' ').map((n: string) => n[0]).filter(Boolean).slice(0, 2).join('')}
              </div>
              <div className="truncate">
                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                  {lecturer.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {lecturer.staffId || lecturer.department}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-400 italic text-[11px]">
              <UserIcon className="w-3 h-3" />
              <span>Unassigned</span>
            </div>
          )}
        </div>

        <div className="text-right flex-shrink-0">
          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
            {enrolledCount} Candidate{enrolledCount === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        {enrolledCount > 0 ? (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 gap-1.5"
            onClick={() => onAudit(course)}
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Audit Scores
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 gap-1.5"
            onClick={() => onEdit(course)}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Course
          </Button>
        )}

        {hasPending && onApprove && (
          <Button
            size="sm"
            className="h-8 px-3 text-xs font-bold bg-[#059669] hover:bg-emerald-700 text-white gap-1.5 shadow-2xs"
            onClick={() => onApprove(course.id)}
          >
            <Check className="w-3.5 h-3.5" />
            Approve
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => onEdit(course)}
              className="cursor-pointer text-xs font-medium"
            >
              <Edit3 className="w-3.5 h-3.5 mr-2 text-slate-500" />
              Edit Course Details
            </DropdownMenuItem>

            {enrolledCount > 0 && (
              <DropdownMenuItem
                onClick={() => onAudit(course)}
                className="cursor-pointer text-xs font-medium"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 mr-2 text-slate-500" />
                View Broadsheet
              </DropdownMenuItem>
            )}

            {hasPending && onReturn && (
              <DropdownMenuItem
                onClick={() => onReturn(course)}
                className="cursor-pointer text-xs font-medium text-amber-600 dark:text-amber-400 focus:text-amber-700"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-2" />
                Return to Lecturer
              </DropdownMenuItem>
            )}

            {enrolledCount > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onExport(course)}
                  className="cursor-pointer text-xs font-medium"
                >
                  <Download className="w-3.5 h-3.5 mr-2 text-slate-500" />
                  Export Roster CSV
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
