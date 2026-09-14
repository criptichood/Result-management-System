import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Check,
  RotateCcw,
  Square,
  CheckSquare,
  Eye,
  MoreVertical,
  FileSpreadsheet,
  Download,
  Users,
  User as UserIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { User } from '../../types';

interface PendingCourseCardProps {
  course: any;
  lecturer: User | null;
  isSelected: boolean;
  onToggleSelect: (courseId: string) => void;
  onAudit: (course: any) => void;
  onApprove: (courseId: string) => void;
  onReturn: (course: any) => void;
  onExport: (course: any) => void;
}

export const PendingCourseCard: React.FC<PendingCourseCardProps> = ({
  course,
  lecturer,
  isSelected,
  onToggleSelect,
  onAudit,
  onApprove,
  onReturn,
  onExport,
}) => {
  const isCore = course.department === 'Computer Science' || course.isCore;

  return (
    <div
      className={`p-4 space-y-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 last:border-b-0 transition-colors ${
        isSelected ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
      }`}
    >
      {/* Top Header: Selection Checkbox + Code + Badges */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2.5">
          {course.hasPendingReview ? (
            <button
              type="button"
              onClick={() => onToggleSelect(course.id)}
              className="text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 focus:outline-none flex items-center justify-center p-0.5"
              aria-label={`Select ${course.code}`}
            >
              {isSelected ? (
                <CheckSquare className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </button>
          ) : null}

          <span className="font-mono font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 tracking-wider">
            {course.code}
          </span>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              isCore
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60'
            }`}
          >
            {isCore ? 'Core' : 'Borrowed'}
          </span>
        </div>

        <div>
          {course.hasPendingReview ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Submitted ({course.submittedCount}/{course.totalEnrolled})
            </span>
          ) : course.isFullyPublished ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Published ({course.publishedCount}/{course.totalEnrolled})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              <Users className="w-3 h-3 text-slate-400" />
              Awaiting ({course.totalEnrolled})
            </span>
          )}
        </div>
      </div>

      {/* Course Title & Details */}
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
          <span>•</span>
          <span>{course.department}</span>
        </div>
      </div>

      {/* Lecturer Information */}
      <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-100 dark:border-slate-800/80">
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
                {lecturer.department || course.department}
              </p>
            </div>
          </div>
        ) : (
          <span className="text-slate-400 italic text-[11px] flex items-center gap-1">
            <UserIcon className="w-3 h-3" />
            Unassigned
          </span>
        )}

        <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
          {course.totalEnrolled} Candidate{course.totalEnrolled === 1 ? '' : 's'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 gap-1.5"
          onClick={() => onAudit(course)}
        >
          <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Audit
        </Button>

        {course.hasPendingReview && (
          <Button
            size="sm"
            className="h-8 px-3 text-xs font-bold bg-[#064e3b] hover:bg-[#065f46] text-white gap-1.5 shadow-2xs"
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
          <DropdownMenuContent align="end" className="w-44">
            {course.hasPendingReview && (
              <DropdownMenuItem
                onClick={() => onReturn(course)}
                className="text-red-600 dark:text-red-400 cursor-pointer text-xs font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-2" />
                Return to Lecturer
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onAudit(course)}
              className="cursor-pointer text-xs font-medium"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-2 text-slate-500" />
              View Broadsheet
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onExport(course)}
              className="cursor-pointer text-xs font-medium"
            >
              <Download className="w-3.5 h-3.5 mr-2 text-slate-500" />
              Export CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
