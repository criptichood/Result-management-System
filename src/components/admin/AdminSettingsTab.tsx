import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface AdminSettingsTabProps {
  settings: {
    lecturerViewEmail: boolean;
    lecturerViewPhone: boolean;
    courseRegistrationOpen: boolean;
  };
  onSettingChange: (key: 'lecturerViewEmail' | 'lecturerViewPhone' | 'courseRegistrationOpen', value?: boolean) => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  settings,
  onSettingChange,
}) => {
  return (
    <Card id="admin-settings-tab">
      <CardHeader className="border-b border-slate-100 p-6">
        <CardTitle>System Settings</CardTitle>
        <CardDescription>Configure global parameters, registration windows, and feature flags.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/50">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Student Course Registration Portal</h4>
              <p className="text-sm text-slate-500 mt-1">Enable or disable self-service course registration for all students.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                id="toggle-course-registration"
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.courseRegistrationOpen} 
                onChange={() => onSettingChange('courseRegistrationOpen')} 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#059669]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/50">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Lecturer View: Student Email</h4>
              <p className="text-sm text-slate-500 mt-1">Allow lecturers to see student email addresses in the class list.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                id="toggle-lecturer-email-view"
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.lecturerViewEmail} 
                onChange={() => onSettingChange('lecturerViewEmail')} 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#059669]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/50">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Lecturer View: Student Phone</h4>
              <p className="text-sm text-slate-500 mt-1">Allow lecturers to see student phone numbers in the class list.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                id="toggle-lecturer-phone-view"
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.lecturerViewPhone} 
                onChange={() => onSettingChange('lecturerViewPhone')} 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#059669]"></div>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
