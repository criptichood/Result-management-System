import React, { useState } from 'react';
import { TableCell, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import {
  Check,
  RotateCcw,
  Square,
  CheckSquare,
  Eye,
  MoreVertical,
  FileSpreadsheet,
  Download,
  ChevronRight,
  ChevronDown,
  Building,
  GraduationCap,
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

interface PendingTableRowProps {
  course: any;
  lecturer: User | null;
  isSelected: boolean;
  onToggleSelect: (courseId: string) => void;
  onAudit: (course: any) => void;
  onApprove: (courseId: string) => void;
  onReturn: (course: any) => void;
  onExport: (course: any) => void;
}

export const PendingTableRow: React.FC<PendingTableRowProps> = ({
  course,
  lecturer,
  isSelected,
  onToggleSelect,
  onAudit,
  onApprove,
  onReturn,
  onExport,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCore = course.department === 'Computer Science' || course.isCore;
  const enrolledCount = course.totalEnrolled || 0;

  return (
    <>
      <TableRow
        className={`transition-colors border-b border-slate-100 dark:border-slate-800 ${
          isSelected
            ? 'bg-emerald-50/70 dark:bg-emerald-950/30'
            : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/60'
        }`}
      >
        {/* Checkbox & Expand Toggle & Code */}
        <TableCell className="py-3 px-3">
          <div className="flex items-center gap-1.5">
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
            ) : (
              <span className="w-4 h-4 inline-block" />
            )}

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 rounded transition-colors focus:outline-none"
              title={isExpanded ? 'Collapse details' : 'Expand details'}
              aria-label={isExpanded ? `Collapse details for ${course.code}` : `Expand details for ${course.code}`}
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100 tracking-wider">
              {course.code}
            </span>

            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                isCore
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60'
              }`}
            >
              {isCore ? 'Core' : 'Borrowed'}
            </span>
          </div>
        </TableCell>

        {/* Course Title & Clean Academic Meta */}
        <TableCell className="py-3 px-3">
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug">
              {course.title}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="font-medium text-slate-700 dark:text-slate-300">{course.creditUnits} Units</span>
              <span className="mx-1.5 text-slate-300 dark:text-slate-600">•</span>
              <span>{course.level}L</span>
              <span className="mx-1.5 text-slate-300 dark:text-slate-600">•</span>
              <span>Sem {course.semester}</span>
            </p>
          </div>
        </TableCell>

        {/* Lecturer Information */}
        <TableCell className="py-3 px-3">
          {lecturer ? (
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                {lecturer.name.split(' ').map((n: string) => n[0]).filter(Boolean).slice(0, 2).join('')}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {lecturer.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {lecturer.staffId || lecturer.department || course.department}
                </p>
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-500 italic">Unassigned</span>
          )}
        </TableCell>

        {/* Submission Status & Candidate Count */}
        <TableCell className="py-3 px-3 text-center whitespace-nowrap">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium">
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {enrolledCount > 0 ? enrolledCount : '—'}
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            {course.hasPendingReview ? (
              <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Submitted
              </span>
            ) : course.isFullyPublished ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
                <Check className="w-3 h-3" />
                Published
              </span>
            ) : (
              <span className="text-slate-400 dark:text-slate-500 text-xs">
                Awaiting
              </span>
            )}
          </div>
        </TableCell>

        {/* Moderation Actions */}
        <TableCell className="py-3 px-3 text-right">
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => onAudit(course)}
            >
              <Eye className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
              Audit
            </Button>

            {course.hasPendingReview && (
              <Button
                size="sm"
                className="h-7 px-2.5 text-xs font-semibold bg-[#064e3b] hover:bg-[#065f46] text-white"
                onClick={() => onApprove(course.id)}
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Approve
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded"
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
        </TableCell>
      </TableRow>

      {/* Expanded Row Drawer */}
      {isExpanded && (
        <TableRow className="bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
          <TableCell colSpan={5} className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <Building className="w-3.5 h-3.5 text-emerald-600" />
                  Course & Department
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Department:</span> {course.department}
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Classification:</span> {isCore ? 'Core Degree Requirement' : 'Borrowed / Elective'}
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Curriculum Units:</span> {course.creditUnits} Credit Units ({course.level} Level)
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  Submission Breakdown
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Total Enrolled:</span> {enrolledCount} Students
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Submitted for Moderation:</span> {course.submittedCount || 0}
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Approved & Published:</span> {course.publishedCount || 0}
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                  Course Lecturer / Examiner
                </div>
                {lecturer ? (
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{lecturer.name}</p>
                    <p className="text-slate-500 dark:text-slate-400">{lecturer.email || lecturer.staffId || lecturer.department}</p>
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No assigned lecturer.</p>
                )}
                <div className="pt-1 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => onAudit(course)}
                    className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold text-[11px] inline-flex items-center gap-1"
                  >
                    <FileSpreadsheet className="w-3 h-3" /> Broadsheet
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => onExport(course)}
                    className="text-slate-600 dark:text-slate-300 hover:underline font-medium text-[11px] inline-flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Export CSV
                  </button>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
