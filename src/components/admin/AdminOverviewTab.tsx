import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Users, 
  BookOpen, 
  Database, 
  ArrowRight, 
  UserCheck, 
  Calendar, 
  GraduationCap, 
  Building2, 
  Lock, 
  Unlock, 
  Clock, 
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatTermDisplay } from '../../lib/academicSessionUtils';

interface AdminOverviewTabProps {
  usersCount: number;
  coursesCount: number;
  departmentsCount?: number;
  enrollmentsCount?: number;
  studentsCount?: number;
  facultyCount?: number;
  settings: {
    courseRegistrationOpen: boolean;
    currentSession: string;
    currentSemester: 1 | 2;
  };
  onToggleRegistration: () => void;
  onOpenSessionWizard?: () => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  usersCount,
  coursesCount,
  departmentsCount = 7,
  enrollmentsCount = 0,
  studentsCount,
  facultyCount,
  settings,
  onToggleRegistration,
  onOpenSessionWizard,
}) => {
  const navigate = useNavigate();

  const isRegOpen = settings.courseRegistrationOpen;
  const currentTermLabel = formatTermDisplay(settings.currentSession, settings.currentSemester);

  return (
    <div className="space-y-6" id="admin-overview-tab">
      {/* 1. Dedicated Institutional Academic Calendar & Registration Portal Gateway */}
      <Card className="border border-emerald-300 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/40 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/20 shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Term Status & Details */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="p-1.5 bg-emerald-600 text-white rounded-lg inline-flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                  Active Institutional Academic Calendar
                </span>
                <Badge
                  variant={isRegOpen ? 'success' : 'destructive'}
                  className="text-[11px] font-semibold px-2.5 py-0.5"
                >
                  {isRegOpen ? '● Portal Registration OPEN' : '● Portal Registration CLOSED'}
                </Badge>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {currentTermLabel}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-2">
                  <span>University session and term operations are synchronized with FUAZ SRMS.</span>
                  {enrollmentsCount > 0 && (
                    <span className="hidden sm:inline-block font-semibold text-emerald-700 dark:text-emerald-400">
                      • {enrollmentsCount} active course enrollments
                    </span>
                  )}
                </p>
              </div>

              {/* Status explanation pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                {isRegOpen ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Students in all active cohorts can add, drop, and submit semester course registrations.</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Course registration is currently locked. Students cannot modify their registered courses.</span>
                  </>
                )}
              </div>
            </div>

            {/* Right: Explicit, Prominent Action Control Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
              {onOpenSessionWizard && (
                <Button
                  onClick={onOpenSessionWizard}
                  className="bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs gap-2 cursor-pointer h-10 transition-transform active:scale-[0.99]"
                >
                  <Calendar className="w-4 h-4 text-emerald-300" />
                  <span>Advance Academic Term</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}

              <Button
                variant="outline"
                onClick={onToggleRegistration}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl border h-10 gap-2 cursor-pointer transition-colors ${
                  isRegOpen
                    ? 'border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40 bg-white dark:bg-slate-900'
                    : 'border-emerald-600 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-950/40 bg-white dark:bg-slate-900'
                }`}
              >
                {isRegOpen ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-red-600" />
                    <span>Close Registration Portal</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Open Registration Portal</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Primary Institutional Metric Cards (4 Balanced Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Users
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {usersCount}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {studentsCount !== undefined ? `${studentsCount} Students • ${facultyCount || 0} Faculty` : 'Active accounts'}
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Total Courses */}
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Curriculum Catalog
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {coursesCount}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Across 100L - 400L levels
              </p>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-[#059669] dark:text-emerald-400">
              <BookOpen className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Academic Departments */}
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Departments
              </p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {departmentsCount}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Faculties of Science & Agric
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400">
              <Building2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Active Session Badge Card */}
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Current Term
              </p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {settings.currentSession}
              </h3>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                {settings.currentSemester === 1 ? '1st Semester' : '2nd Semester'} (Ongoing)
              </p>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Administrative Control Hub (Quick Action Bento Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Senate Degree Broadsheet */}
        <Card className="border border-purple-200 dark:border-purple-800/60 bg-purple-50/40 dark:bg-purple-950/20 shadow-2xs hover:shadow-xs transition-all">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-600 text-white rounded-xl flex-shrink-0 shadow-2xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Senate Degree Broadsheet
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  5.0 CGPA rankings & graduation clearance.
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/admin?tab=senate')}
              className="bg-purple-700 hover:bg-purple-800 text-white text-xs gap-1 flex-shrink-0 cursor-pointer font-semibold"
            >
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardContent>
        </Card>

        {/* Course Allocation Matrix */}
        <Card className="border border-blue-200 dark:border-blue-800/60 bg-blue-50/40 dark:bg-blue-950/20 shadow-2xs hover:shadow-xs transition-all">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl flex-shrink-0 shadow-2xs">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Course Allocation Matrix
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Multi-lecturer teams & workload balance.
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/admin?tab=allocations')}
              variant="outline"
              className="bg-white dark:bg-slate-900 border-blue-300 text-blue-700 hover:bg-blue-50 text-xs gap-1 flex-shrink-0 cursor-pointer font-semibold"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardContent>
        </Card>

        {/* SQLite Database Studio */}
        <Card className="border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-2xs hover:shadow-xs transition-all">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl flex-shrink-0 shadow-2xs">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  SQLite Database Studio
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Live WASM SQL console & backup dumps.
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/admin?tab=database')}
              className="bg-[#059669] hover:bg-emerald-700 text-white text-xs gap-1 flex-shrink-0 cursor-pointer font-semibold"
            >
              <span>Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
