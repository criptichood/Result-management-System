import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AdminResetDatabaseModal } from './AdminResetDatabaseModal';
import { Calendar, RotateCcw, Award, Sparkles, ArrowRight } from 'lucide-react';

interface AdminSettingsTabProps {
  settings: {
    lecturerViewEmail: boolean;
    lecturerViewPhone: boolean;
    courseRegistrationOpen: boolean;
    currentSession?: string;
    currentSemester?: 1 | 2;
  };
  onSettingChange: (key: any, value?: any) => void;
  onResetDatabase: () => void;
  onOpenSessionWizard?: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  settings,
  onSettingChange,
  onResetDatabase,
  onOpenSessionWizard,
}) => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const gradingBands = [
    { score: '70% – 100%', grade: 'A', point: '5.0', classification: 'First Class Honours' },
    { score: '60% – 69%', grade: 'B', point: '4.0', classification: 'Second Class Upper (2:1)' },
    { score: '50% – 59%', grade: 'C', point: '3.0', classification: 'Second Class Lower (2:2)' },
    { score: '45% – 49%', grade: 'D', point: '2.0', classification: 'Third Class Honours' },
    { score: '40% – 44%', grade: 'E', point: '1.0', classification: 'Pass' },
    { score: '0% – 39%', grade: 'F', point: '0.0', classification: 'Fail / Carryover' },
  ];

  return (
    <div className="space-y-6">
      <Card id="admin-settings-tab" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6">
          <CardTitle className="text-xl text-slate-900 dark:text-slate-100">
            System Settings & Academic Calendar Configuration
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Configure global academic sessions, semester parameters, student registration windows, and privacy flags.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Active Session & Semester Controller */}
          <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/60 dark:bg-slate-800/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Active Academic Session & Semester
                </h3>
              </div>
              {onOpenSessionWizard && (
                <Button
                  id="btn-open-session-wizard"
                  type="button"
                  onClick={onOpenSessionWizard}
                  className="bg-[#064e3b] hover:bg-[#065f46] text-white text-xs gap-1.5 h-8.5 shadow-2xs self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Launch Term Transition Wizard
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Current Academic Session
                </label>
                <select
                  value={settings.currentSession || '2024/2025'}
                  onChange={(e) => onSettingChange('currentSession', e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="2023/2024">2023/2024 Academic Session</option>
                  <option value="2024/2025">2024/2025 Academic Session (Current)</option>
                  <option value="2025/2026">2025/2026 Academic Session (Upcoming)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Active Semester
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2].map((sem) => (
                    <button
                      key={sem}
                      type="button"
                      onClick={() => onSettingChange('currentSemester', sem as 1 | 2)}
                      className={`flex-1 h-9 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        (settings.currentSemester || 1) === sem
                          ? 'bg-[#064e3b] text-white border-[#064e3b]'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {sem === 1 ? '1st Semester' : '2nd Semester'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Registration and Privacy Flags */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Student Course Registration Portal
                  </h4>
                  <Badge variant={settings.courseRegistrationOpen ? 'success' : 'destructive'}>
                    {settings.courseRegistrationOpen ? 'Open' : 'Closed'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Enable or lock self-service course registration for enrolled undergraduates across all colleges.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="toggle-course-registration"
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.courseRegistrationOpen}
                  onChange={() => onSettingChange('courseRegistrationOpen')}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#059669]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Lecturer View: Student Contact Email
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Allow academic staff to view student email addresses in the course attendance register.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="toggle-lecturer-email-view"
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.lecturerViewEmail}
                  onChange={() => onSettingChange('lecturerViewEmail')}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#059669]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Lecturer View: Student Phone Number
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Allow academic staff to access student phone numbers for lecture and emergency contact.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="toggle-lecturer-phone-view"
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.lecturerViewPhone}
                  onChange={() => onSettingChange('lecturerViewPhone')}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#059669]"></div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nigerian University 5.0 CGPA Grading Scale Reference */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <CardTitle className="text-base text-slate-900 dark:text-slate-100">
                Official Nigerian 5.0 CGPA Grading Benchmark
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                National Universities Commission (NUC) standardized scoring scale
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Percentage Score</th>
                  <th className="p-3 text-center">Letter Grade</th>
                  <th className="p-3 text-center">Grade Point</th>
                  <th className="p-3">Degree Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {gradingBands.map((band) => (
                  <tr key={band.grade} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-mono font-medium text-slate-900 dark:text-slate-100">{band.score}</td>
                    <td className="p-3 text-center">
                      <span className="inline-block w-6 py-0.5 rounded-sm bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-black">
                        {band.grade}
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">{band.point}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">{band.classification}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* System Maintenance Card */}
      <Card className="border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/10 shadow-2xs">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-red-900 dark:text-red-300">
              Reset System to Default Demo State
            </h4>
            <p className="text-xs text-red-700/80 dark:text-red-400/80 mt-1 max-w-xl">
              Purge all local storage state and re-seed the system with standard students, curriculum, enrollments, and mock scores.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsResetModalOpen(true)}
            className="border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/40 text-xs gap-1.5 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Database
          </Button>
        </CardContent>
      </Card>

      <AdminResetDatabaseModal
        isOpen={isResetModalOpen}
        onOpenChange={setIsResetModalOpen}
        onConfirmReset={onResetDatabase}
      />
    </div>
  );
};
