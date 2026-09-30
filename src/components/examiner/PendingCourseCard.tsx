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
  Lock,
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
  isHod?: boolean;
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
  isHod = true,
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            {course.hasPendingReview ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>{course.submittedCount} Candidates</span>
              </>
            ) : course.isSenatePending ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>{course.approvedCount} Candidates</span>
              </>
            ) : course.isReturnedForRemarking ? (
              <>
                <RotateCcw className="w-3 h-3 text-red-500" />
                <span>{course.rejectedCount} Candidates</span>
              </>
            ) : course.isFullyPublished ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span>{course.publishedCount} Live</span>
              </>
            ) : (
              <span>{course.totalEnrolled || 0} Enrolled</span>
            )}
          </span>
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
                {lecturer.staffId ? `ID: ${lecturer.staffId}` : (lecturer.department || course.department)}
              </p>
            </div>
          </div>
        ) : (
          <span className="text-slate-400 italic text-[11px] flex items-center gap-1">
            <UserIcon className="w-3 h-3" />
            Unassigned
          </span>
        )}

        <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
          {course.hasPendingReview ? `${course.submittedCount} Submitted` : `${course.totalEnrolled || 0} Enrolled`}
        </span>
      </div>

      {/* Streamlined Actions */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 gap-1.5"
          onClick={() => onAudit(course)}
        >
          <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Audit Scores
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1 text-xs font-semibold"
            >
              <span>Actions</span>
              <MoreVertical className="w-3.5 h-3.5 ml-0.5 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {course.hasPendingReview && (
              isHod ? (
                <DropdownMenuItem
                  onClick={() => onApprove(course.id)}
                  className="text-emerald-700 dark:text-emerald-400 font-semibold cursor-pointer text-xs"
                >
                  <Check className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                  Endorse to Senate
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  disabled
                  className="opacity-60 cursor-not-allowed text-xs text-slate-400 flex items-center justify-between"
                  title="Statutorily reserved for Head of Department (HOD)"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Endorse to Senate</span>
                  </span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 font-medium">HOD Only</span>
                </DropdownMenuItem>
              )
            )}
            {course.isSenatePending && isHod && (
              <DropdownMenuItem
                onClick={() => onApprove(course.id)}
                className="text-emerald-700 dark:text-emerald-400 font-semibold cursor-pointer text-xs"
              >
                <Check className="w-3.5 h-3.5 mr-2 text-emerald-600" />
                Authorize Senate Release
              </DropdownMenuItem>
            )}
            {(course.hasPendingReview || course.isSenatePending) && (
              isHod ? (
                <DropdownMenuItem
                  onClick={() => onReturn(course)}
                  className="text-red-600 dark:text-red-400 cursor-pointer text-xs font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-2" />
                  Return for Remarking
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  disabled
                  className="opacity-60 cursor-not-allowed text-xs text-slate-400 flex items-center justify-between"
                  title="Statutorily reserved for Head of Department (HOD)"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Return for Remarking</span>
                  </span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 font-medium">HOD Only</span>
                </DropdownMenuItem>
              )
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onAudit(course)}
              className="cursor-pointer text-xs font-medium"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-2 text-slate-500" />
              View Broadsheet
            </DropdownMenuItem>
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
