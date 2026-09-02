import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Users, BookOpen } from 'lucide-react';

interface AdminOverviewTabProps {
  usersCount: number;
  coursesCount: number;
  settings: {
    courseRegistrationOpen: boolean;
    currentSession: string;
    currentSemester: 1 | 2;
  };
  onToggleRegistration: () => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  usersCount,
  coursesCount,
  settings,
  onToggleRegistration,
}) => {
  return (
    <div id="admin-overview-tab" className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="border-emerald-100">
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <Users className="h-6 w-6 text-[#059669]" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Users</p>
            <h3 className="text-2xl font-bold text-slate-900">{usersCount}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-emerald-100">
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <BookOpen className="h-6 w-6 text-[#059669]" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Courses</p>
            <h3 className="text-2xl font-bold text-slate-900">{coursesCount}</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 border-emerald-100 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-2 h-full ${settings.courseRegistrationOpen ? 'bg-[#059669]' : 'bg-red-500'}`}></div>
        <CardContent className="p-6 flex justify-between items-center h-full">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Registration Status</p>
              <Badge variant={settings.courseRegistrationOpen ? "success" : "destructive"}>
                {settings.courseRegistrationOpen ? 'Active (Open)' : 'Closed'}
              </Badge>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{settings.currentSession} • Semester {settings.currentSemester}</h3>
          </div>
          <Button 
            variant="outline" 
            onClick={onToggleRegistration}
            className={settings.courseRegistrationOpen ? "border-red-200 text-red-700 hover:bg-red-50 bg-white" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white"}
          >
            {settings.courseRegistrationOpen ? 'Close Portal' : 'Open Portal'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
