import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Lock, CheckSquare, CheckCircle2, History, Calendar, BookOpen, Layers } from 'lucide-react';
import { SystemSettings } from '../../types';

interface CourseRegistrationViewProps {
  settings: SystemSettings;
  resultsData: any[]; // student enrollments + results + courses
  availableCourses: any[];
  registrationSemester: 1 | 2;
  setRegistrationSemester: (sem: 1 | 2) => void;
  selectedCoursesToRegister: string[];
  onToggleCourseSelection: (courseId: string) => void;
  onSelectAllSemesterCourses: (courses: any[]) => void;
  onRegisterCourses: () => void;
}

export const CourseRegistrationView: React.FC<CourseRegistrationViewProps> = ({
  settings,
  resultsData,
  availableCourses,
  registrationSemester,
  setRegistrationSemester,
  selectedCoursesToRegister,
  onToggleCourseSelection,
  onSelectAllSemesterCourses,
  onRegisterCourses,
}) => {
  const currentActiveSession = settings.currentSession || '2025/2026';
  const [selectedSession, setSelectedSession] = useState<string>(currentActiveSession);

  // Extract all distinct academic sessions from student records + current session
  const sessionSet = new Set<string>([currentActiveSession, '2022/2023', '2023/2024', '2024/2025', '2025/2026', '2026/2027']);
  resultsData.forEach(item => {
    if (item.enrollment?.academicYear) {
      sessionSet.add(item.enrollment.academicYear);
    }
  });
  const availableSessions = Array.from(sessionSet).sort().reverse();

  const isCurrentSessionView = selectedSession === currentActiveSession;

  // Filter student's registered courses for the selected session and semester
  const registeredItemsForSession = resultsData.filter(item => {
    const yrMatches = item.enrollment?.academicYear === selectedSession;
    const semMatches = item.enrollment?.semester === registrationSemester;
    return yrMatches && semMatches;
  });

  const registeredCreditsTotal = registeredItemsForSession.reduce((acc, curr) => acc + (curr.course?.creditUnits || 0), 0);

  // Available courses for active registration if current session
  const filteredAvailableCourses = availableCourses.filter(c => c.semester === registrationSemester);
  const selectedCreditsTotal = filteredAvailableCourses
    .filter(c => selectedCoursesToRegister.includes(c.id))
    .reduce((acc, curr) => acc + curr.creditUnits, 0);

  return (
    <div id="course-registration-view" className="space-y-6">
      {/* Session & Semester Navigation Bar */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Academic Session & Year Selector</span>
                {isCurrentSessionView && <Badge variant="success">Active Session</Badge>}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Switch between previous registered sessions or current active session registration
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Session Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5">
              <History className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <select
                id="select-registration-session"
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
              >
                {availableSessions.map(sess => (
                  <option key={sess} value={sess} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {sess} Academic Session {sess === currentActiveSession ? '(Current Active)' : '(Past Record)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester Toggle */}
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1">
              <button
                id="btn-reg-sem-1"
                onClick={() => setRegistrationSemester(1)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                  registrationSemester === 1 
                    ? 'bg-white dark:bg-slate-900 shadow-xs text-emerald-800 dark:text-emerald-300' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                1st Semester
              </button>
              <button
                id="btn-reg-sem-2"
                onClick={() => setRegistrationSemester(2)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                  registrationSemester === 2 
                    ? 'bg-white dark:bg-slate-900 shadow-xs text-emerald-800 dark:text-emerald-300' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                2nd Semester
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* If viewing a past session or registration closed */}
      {!isCurrentSessionView ? (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Registered Courses Archive ({selectedSession} - {registrationSemester === 1 ? '1st' : '2nd'} Semester)</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Official locked registration record from university database
              </CardDescription>
            </div>
            <Badge variant="secondary">Archived Record</Badge>
          </CardHeader>
          <CardContent className="p-0">
            {registeredItemsForSession.length > 0 ? (
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Title</TableHead>
                    <TableHead className="text-center">Credit Units</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-center">Status / Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registeredItemsForSession.map(item => (
                    <TableRow key={item.enrollment.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                      <TableCell className="font-bold text-slate-900 dark:text-white">{item.course?.code}</TableCell>
                      <TableCell className="font-medium text-slate-700 dark:text-slate-300">{item.course?.title}</TableCell>
                      <TableCell className="text-center font-bold text-emerald-700 dark:text-emerald-400">{item.course?.creditUnits}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400 text-xs">{item.course?.department}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={item.result?.status === 'Published' ? 'success' : 'secondary'}>
                          {item.result?.status === 'Published' ? `Grade: ${item.result.grade || 'N/A'} (${item.result.totalScore ?? 0}%)` : 'Enrolled'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-12 text-center">
                <Layers className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Registration Records Found for {selectedSession}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                  You did not enroll in or register courses for this specific session and semester combination.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : !settings.courseRegistrationOpen ? (
        <Card id="card-reg-closed" className="border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/20">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mx-auto mb-4 text-amber-600 dark:text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Course Registration Portal Closed</h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto text-sm">
              Course registration for the current active session ({settings.currentSession}) is currently closed by university administration. You can view your already registered courses below or switch to previous session archives above.
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Active Current Session Registration */
        <Card id="card-course-registration" className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Active Course Registration Portal</CardTitle>
                <Badge variant="success">Portal Open</Badge>
              </div>
              <CardDescription className="text-slate-500 dark:text-slate-400">
                {settings.currentSession} Academic Session • Select available courses below for registration
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              {selectedCoursesToRegister.length > 0 && (
                <Button 
                  id="btn-submit-registration"
                  onClick={onRegisterCourses} 
                  className="bg-[#059669] hover:bg-emerald-700 text-white gap-2 font-bold text-xs"
                >
                  <CheckSquare className="h-4 w-4" /> Register ({selectedCoursesToRegister.length} Courses • {selectedCreditsTotal} Units)
                </Button>
              )}
            </div>
          </CardHeader>

          {/* Carryover notice banner if carryover courses are present */}
          {filteredAvailableCourses.some(c => c.isCarryover) && (
            <div className="mx-6 mt-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
              <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 dark:text-amber-300">
                <span className="font-bold">Compulsory Carryover Course(s) Detected:</span> You have outstanding course(s) from previous semesters that have been automatically included in your registration. In accordance with university academic regulations, carryover courses are locked and compulsory for retake.
              </div>
            </div>
          )}

          <div className="p-4 bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
              <span>Available Courses: <strong className="text-slate-900 dark:text-white">{filteredAvailableCourses.length}</strong></span>
              <span>Selected: <strong className="text-slate-900 dark:text-white">{selectedCoursesToRegister.length}</strong></span>
              <span>Total Credit Units: <strong className={selectedCreditsTotal > 24 ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}>{selectedCreditsTotal} / 24 max</strong></span>
            </div>
            {filteredAvailableCourses.length > 0 && (
              <Button 
                id="btn-select-all-courses"
                variant="ghost" 
                size="sm" 
                onClick={() => onSelectAllSemesterCourses(filteredAvailableCourses)}
                className="text-xs text-[#059669] dark:text-emerald-400 hover:text-emerald-800 font-bold"
              >
                {filteredAvailableCourses.filter(c => !c.isCarryover).every(c => selectedCoursesToRegister.includes(c.id)) ? 'Deselect Electives' : 'Select All Courses'}
              </Button>
            )}
          </div>

          <CardContent className="p-0">
            {filteredAvailableCourses.length > 0 ? (
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                  <TableRow>
                    <TableHead className="w-12 text-center">Select</TableHead>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Title</TableHead>
                    <TableHead className="text-center">Credit Units</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-center">Category / Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAvailableCourses.map((course) => {
                    const isSelected = selectedCoursesToRegister.includes(course.id) || course.isCarryover;
                    return (
                      <TableRow 
                        key={course.id} 
                        className={`cursor-pointer transition-colors ${
                          course.isCarryover 
                            ? 'bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-50/80 dark:hover:bg-amber-950/30' 
                            : isSelected 
                              ? 'bg-emerald-50/40 dark:bg-emerald-950/40' 
                              : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/50'
                        }`}
                        onClick={() => onToggleCourseSelection(course.id)}
                      >
                        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            aria-label={`Select ${course.code}`}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-700 cursor-pointer disabled:opacity-75" 
                            checked={isSelected}
                            disabled={course.isCarryover}
                            onChange={() => onToggleCourseSelection(course.id)}
                          />
                        </TableCell>
                        <TableCell className="font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-1.5">
                            <span>{course.code}</span>
                            {course.isCarryover && (
                              <Badge variant="warning" className="text-[10px] py-0 px-1.5 font-bold uppercase tracking-wider">
                                Carryover Retake
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-slate-700 dark:text-slate-300">{course.title}</TableCell>
                        <TableCell className="text-center font-bold text-[#059669] dark:text-emerald-400">{course.creditUnits}</TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-400 text-xs">{course.department}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Badge variant={course.isCarryover ? "warning" : "outline"}>
                              {course.level}L {course.isCarryover ? '(Carryover)' : 'Curriculum'}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="p-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">All {registrationSemester === 1 ? '1st' : '2nd'} Semester Courses Enrolled</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">
                  You have already registered for all standard curriculum courses for this semester. You can review your enrolled courses in the Semester Result Slips tab.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Already registered courses for current session summary if viewing current session */}
      {isCurrentSessionView && registeredItemsForSession.length > 0 && (
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs mt-6">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Currently Enrolled Courses ({selectedSession} - {registrationSemester === 1 ? '1st' : '2nd'} Semester)</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Total Credit Units Enrolled: <strong className="text-emerald-700 dark:text-emerald-300">{registeredCreditsTotal} Units</strong>
              </CardDescription>
            </div>
            <Badge variant="success">Successfully Enrolled</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Title</TableHead>
                  <TableHead className="text-center">Credit Units</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registeredItemsForSession.map(item => (
                  <TableRow key={item.enrollment.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                    <TableCell className="font-bold text-slate-900 dark:text-white">{item.course?.code}</TableCell>
                    <TableCell className="font-medium text-slate-700 dark:text-slate-300">{item.course?.title}</TableCell>
                    <TableCell className="text-center font-bold text-emerald-700 dark:text-emerald-400">{item.course?.creditUnits}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={item.result?.status === 'Published' ? 'success' : 'secondary'}>
                        {item.result?.status === 'Published' ? `Published (${item.result.grade || 'N/A'})` : 'Registered / Pending Score'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
