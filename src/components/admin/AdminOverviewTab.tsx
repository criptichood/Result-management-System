import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Users, BookOpen, Database, ArrowRight, UserCheck, Sparkles, Calendar, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminOverviewTabProps {
  usersCount: number;
  coursesCount: number;
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
  settings,
  onToggleRegistration,
  onOpenSessionWizard,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div id="admin-overview-tab" className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl">
              <Users className="h-6 w-6 text-[#059669] dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Users</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{usersCount}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl">
              <BookOpen className="h-6 w-6 text-[#059669] dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Courses</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{coursesCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-slate-200 dark:border-slate-800 dark:bg-slate-900 relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-2 h-full ${settings.courseRegistrationOpen ? 'bg-[#059669]' : 'bg-red-500'}`}></div>
          <CardContent className="p-6 flex justify-between items-center h-full">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Registration Status</p>
                <Badge variant={settings.courseRegistrationOpen ? "success" : "destructive"}>
                  {settings.courseRegistrationOpen ? 'Active (Open)' : 'Closed'}
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{settings.currentSession} • Semester {settings.currentSemester}</h3>
            </div>
            <div className="flex items-center gap-2">
              {onOpenSessionWizard && (
                <Button 
                  variant="outline" 
                  onClick={onOpenSessionWizard}
                  className="border-slate-200 dark:border-slate-700 text-xs gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Transition Term
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={onToggleRegistration}
                className={settings.courseRegistrationOpen ? "border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 text-xs" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300 text-xs"}
              >
                {settings.courseRegistrationOpen ? 'Close Portal' : 'Open Portal'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Launch Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Senate Analytics Quick Card */}
        <Card className="border border-purple-200 dark:border-purple-800/60 bg-purple-50/40 dark:bg-purple-950/20 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-600 text-white rounded-xl">
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
              className="bg-purple-700 hover:bg-purple-800 text-white text-xs gap-1 flex-shrink-0"
            >
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardContent>
        </Card>

        {/* Course Allocation Quick Card */}
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 rounded-xl">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Course Allocation Matrix
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Assign lecturers & balance faculty workload.
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/admin?tab=allocations')}
              variant="outline"
              className="text-xs gap-1 flex-shrink-0"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardContent>
        </Card>

        {/* SQLite Studio Quick Card */}
        <Card className="border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
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
              className="bg-[#059669] hover:bg-emerald-700 text-white text-xs gap-1 flex-shrink-0"
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

