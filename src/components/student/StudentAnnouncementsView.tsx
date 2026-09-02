import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Bell, Clock, Calendar, Search, Filter, AlertCircle, BookOpen } from 'lucide-react';
import { Input } from '../ui/input';

export const StudentAnnouncementsView: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const announcements = [
    {
      id: '1',
      title: 'Mid-Semester Continuous Assessment (CA) Schedule - 2023/2024',
      course: 'University Wide',
      category: 'Exam & CA',
      date: 'Sept 1, 2026',
      author: 'Academic Affairs Unit',
      content: 'All 200L and 300L students are required to complete their CA quizzes before Friday. Ensure your course registration is fully verified and stamped by your level coordinator.',
      type: 'important'
    },
    {
      id: '2',
      title: 'CSC 223 - Fundamentals of Data Structures Assignment 3 Deadline',
      course: 'CSC 223',
      category: 'Assignment',
      date: 'Aug 28, 2026',
      author: 'Dr. Abubakar Sadiq (Department of Computer Science)',
      content: 'Submit your algorithmic implementation reports and source files to the department portal by 11:59 PM. Late submissions attract a 5% penalty deduction.',
      type: 'deadline'
    },
    {
      id: '3',
      title: 'Course Registration Portal Status Notice for 2023/2024 Session',
      course: 'Portal Management',
      category: 'Administrative',
      date: 'Aug 25, 2026',
      author: 'Director of ICT',
      content: 'The course registration portal is currently open. Students are advised to register their electives and core courses promptly to avoid late registration penalties.',
      type: 'info'
    },
    {
      id: '4',
      title: 'MTH 201 - Mathematical Methods Tutorial Notice',
      course: 'MTH 201',
      category: 'Lecture',
      date: 'Aug 20, 2026',
      author: 'Prof. Bello Ahmed',
      content: 'Mandatory problem-solving tutorial session scheduled for Thursday at 10:00 AM at Lecture Theatre 2. Come along with your past question drill booklets.',
      type: 'info'
    }
  ];

  const filteredAnnouncements = announcements.filter(item => {
    if (filterType !== 'all' && item.category.toLowerCase() !== filterType.toLowerCase()) return false;
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) && !item.content.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div id="student-announcements-view" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Platform Announcements & Deadlines
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time university updates, course announcements, assignment deadlines, and CA schedules
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {['All', 'Exam & CA', 'Assignment', 'Administrative', 'Lecture'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterType(cat.toLowerCase())}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === cat.toLowerCase()
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((ann) => (
            <Card key={ann.id} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
              <CardContent className="p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Badge variant={ann.type === 'important' ? 'destructive' : ann.type === 'deadline' ? 'warning' : 'success'}>
                      {ann.course}
                    </Badge>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
                      {ann.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {ann.date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">{ann.title}</h3>
                
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {ann.content}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <span>Posted by: <strong className="text-slate-700 dark:text-slate-300">{ann.author}</strong></span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> Official FUAZ Notice
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Announcements Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No platform notices match your current filter criteria.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
