import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Bell, Calendar, BookMarked, FileText, CheckCircle2, AlertCircle, Clock, Award, ArrowRight } from 'lucide-react';
import { StudentSummaryMetrics } from './StudentSummaryMetrics';
import { AcademicProgressRings } from './AcademicProgressRings';
import { useNavigate } from 'react-router-dom';

interface StudentOverviewProps {
  user: any;
  settings: any;
  cumulativeCgpa: number;
  totalEarnedCredits: number;
  classification: any;
  outstandingCount: number;
  publishedCount: number;
  totalRegisteredCount: number;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({
  user,
  settings,
  cumulativeCgpa,
  totalEarnedCredits,
  classification,
  outstandingCount,
  publishedCount,
  totalRegisteredCount,
}) => {
  const navigate = useNavigate();

  const mockAnnouncements = [
    {
      id: '1',
      title: 'Mid-Semester Continuous Assessment (CA) Schedule - 2023/2024',
      course: 'University Wide',
      date: 'Sept 1, 2026',
      content: 'All 200L and 300L students are required to complete their CA quizzes before Friday. Ensure your course registration is fully verified.',
      type: 'important'
    },
    {
      id: '2',
      title: 'CSC 223 - Fundamentals of Data Structures Assignment 3 Deadline',
      course: 'CSC 223',
      date: 'Aug 28, 2026',
      content: 'Submit your algorithmic implementation reports to the department portal by 11:59 PM. Late submissions attract a 5% penalty.',
      type: 'deadline'
    },
    {
      id: '3',
      title: 'Course Registration Portal Status Notice',
      course: 'Academic Affairs',
      date: 'Aug 25, 2026',
      content: settings.courseRegistrationOpen ? 'Course registration portal is currently OPEN for the current session.' : 'Course registration portal is currently closed. Contact your level coordinator for late registration.',
      type: 'info'
    }
  ];

  return (
    <div id="student-overview-view" className="space-y-6">
      {/* Welcome Hero Card */}
      <Card className="border-emerald-200 dark:border-emerald-900 bg-gradient-to-r from-emerald-900 to-[#064e3b] text-white shadow-md rounded-2xl overflow-hidden">
        <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="success" className="bg-emerald-500/30 text-emerald-200 border-emerald-400/40">
                FUAZ Student Portal
              </Badge>
              <span className="text-emerald-300 text-xs font-semibold">• Session: {settings.currentSession || '2023/2024'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Welcome back, {user.name}!
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Federal University of Agriculture, Zuru • {user.department || 'Department of Computer Science'} • {user.matricNumber || 'FUAZ/SCI/22/1042'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => navigate('/student?tab=results')}
              className="bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-xs gap-2"
            >
              <FileText className="w-4 h-4 text-emerald-700" /> View My Results
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <Button
              onClick={() => navigate('/student?tab=registration')}
              variant="outline"
              className="border-emerald-400 text-white hover:bg-emerald-800/60 font-bold text-xs gap-2"
            >
              <BookMarked className="w-4 h-4" /> Course Registration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Metrics & Progress Rings */}
      <StudentSummaryMetrics
        cumulativeCgpa={cumulativeCgpa}
        totalEarnedCredits={totalEarnedCredits}
        classification={classification}
        outstandingCount={outstandingCount}
        settings={settings}
      />

      <AcademicProgressRings
        totalEarnedCredits={totalEarnedCredits}
        maxRequiredCredits={120}
        cumulativeCgpa={cumulativeCgpa}
        publishedCount={publishedCount}
        totalRegisteredCount={totalRegisteredCount}
      />

      {/* Announcements & Upcoming Deadlines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Announcements */}
        <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Platform & Lecturer Announcements</CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Recent notices, schedule updates, and academic bulletins</CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/student?tab=announcements')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              View All ({mockAnnouncements.length})
            </Button>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {mockAnnouncements.map((ann) => (
              <div key={ann.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={ann.type === 'important' ? 'default' : ann.type === 'deadline' ? 'warning' : 'success'}>
                      {ann.course}
                    </Badge>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {ann.date}
                    </span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ann.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right Col: Quick Status & Portal Info */}
        <div className="space-y-4">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" /> Portal Status Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span>Course Registration:</span>
                <Badge variant={settings.courseRegistrationOpen ? 'success' : 'destructive'}>
                  {settings.courseRegistrationOpen ? 'OPEN' : 'CLOSED'}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span>Result Upload Status:</span>
                <Badge variant="success">Verified (5.0 CGPA)</Badge>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span>Active Session:</span>
                <span className="font-bold text-slate-900 dark:text-white">{settings.currentSession || '2023/2024'}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span>Academic Standing:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{classification.label}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200/80 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/30 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" /> Quick Navigation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student?tab=results')}
                className="w-full justify-between text-xs font-semibold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              >
                <span>My Results & Analytics</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student?tab=registration')}
                className="w-full justify-between text-xs font-semibold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              >
                <span>Course Registration Portal</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
