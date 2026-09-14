import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/db';
import { Card } from '../components/ui/card';
import { FileText, CheckCircle2, Download, ShieldCheck, FileQuestion } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { 
  StudentHeader, 
  StudentSummaryMetrics, 
  AcademicProgressRings,
  SemesterResultSlip, 
  GradeAnalyticsView, 
  CourseRegistrationView, 
  SemesterSelectorBar,
  OfficialResultSlipModal,
  StudentOverview,
  StudentAnnouncementsView,
  StudentDisputeModal,
  StudentDisputeHistoryView,
  OfficialStatementOfResultModal
} from '../components/student';
import { 
  getDegreeClassification, 
  calculateSemesterStats, 
  exportResultsToCsv,
  sortSemesterKeysDescending,
  computeOutstandingCarryovers
} from '../lib/academicUtils';
import { GradeDispute } from '../types';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [resultsData, setResultsData] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [selectedCoursesToRegister, setSelectedCoursesToRegister] = useState<string[]>([]);
  const [registrationSemester, setRegistrationSemester] = useState<1 | 2>(1);
  const [selectedSemesterKey, setSelectedSemesterKey] = useState<string>('all');
  const [activeViewMode, setActiveViewMode] = useState<'results' | 'analytics'>('results');
  const [analyticsScope, setAnalyticsScope] = useState<string>('all');
  const [settings, setSettings] = useState(db.getSettings());
  const [isOfficialSlipOpen, setIsOfficialSlipOpen] = useState(false);
  const [isVerifiableStatementOpen, setIsVerifiableStatementOpen] = useState(false);
  const [officialSlipScope, setOfficialSlipScope] = useState<string>('all');
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [disputes, setDisputes] = useState<GradeDispute[]>([]);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [selectedDisputeCourse, setSelectedDisputeCourse] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    if (user) {
      loadData();
      const unsubscribe = db.subscribe(() => {
        loadData();
      });
      return () => unsubscribe();
    }
  }, [user]);

  const loadData = () => {
    if (!user) return;
    const res = db.getStudentResults(user.id);
    setResultsData(res);
    const available = db.getAvailableCourses(user.id);
    setAvailableCourses(available);
    
    // Automatically pre-select compulsory carryover courses
    const carryoverIds = available.filter(c => c.isCarryover).map(c => c.id);
    if (carryoverIds.length > 0) {
      setSelectedCoursesToRegister(prev => Array.from(new Set([...prev, ...carryoverIds])));
    }

    setSettings(db.getSettings());
    setDisputes(db.getDisputesByStudent(user.id));

    // Extract and sort semester keys descending
    const rawKeys: string[] = [];
    res.forEach(item => {
      const key = `${item.enrollment.academicYear} ${item.enrollment.semester === 1 ? '1st' : '2nd'} Semester`;
      if (!rawKeys.includes(key)) rawKeys.push(key);
    });
    const sorted = sortSemesterKeysDescending(rawKeys);
    if (sorted.length > 0 && (selectedSemesterKey === 'all' || !sorted.includes(selectedSemesterKey))) {
      // Default to the most recent semester for clean view
      setSelectedSemesterKey(sorted[0]);
    }
  };

  if (!user) return null;

  // Group completed courses by session & semester
  const publishedResults = resultsData.filter(r => r.result?.status === 'Published');
  
  // Group results by "academicYear Semester"
  const semesterGroups: { [key: string]: { academicYear: string; semester: number; items: any[] } } = {};
  
  resultsData.forEach(item => {
    const key = `${item.enrollment.academicYear} ${item.enrollment.semester === 1 ? '1st' : '2nd'} Semester`;
    if (!semesterGroups[key]) {
      semesterGroups[key] = {
        academicYear: item.enrollment.academicYear,
        semester: item.enrollment.semester,
        items: []
      };
    }
    semesterGroups[key].items.push(item);
  });

  // Sort semester keys chronologically descending so recent is first
  const semesterKeys = sortSemesterKeysDescending(Object.keys(semesterGroups));

  // Compute genuine outstanding carryovers (failed courses from earlier level/session not yet cleared)
  const outstandingCourses = computeOutstandingCarryovers(
    resultsData, 
    settings.currentSession || db.getSettings().currentSession || '2025/2026', 
    user.level || 100
  );

  // Calculate Cumulative CGPA across all published courses
  let totalGradePoints = 0;
  let totalEarnedCredits = 0;
  const cumulativeGradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };

  publishedResults.forEach(r => {
    const credits = r.course?.creditUnits || 0;
    const grade = r.result?.grade;
    totalEarnedCredits += credits;
    
    if (grade === 'A') { totalGradePoints += 5 * credits; cumulativeGradeDistribution.A++; }
    else if (grade === 'B') { totalGradePoints += 4 * credits; cumulativeGradeDistribution.B++; }
    else if (grade === 'C') { totalGradePoints += 3 * credits; cumulativeGradeDistribution.C++; }
    else if (grade === 'D') { totalGradePoints += 2 * credits; cumulativeGradeDistribution.D++; }
    else if (grade === 'F') { totalGradePoints += 0 * credits; cumulativeGradeDistribution.F++; }
  });

  const cumulativeCgpa = totalEarnedCredits > 0 ? (totalGradePoints / totalEarnedCredits) : 0;
  const currentClassification = getDegreeClassification(cumulativeCgpa);

  // Active analytics calculation
  const activeAnalyticsData = (() => {
    if (analyticsScope === 'all' || !semesterGroups[analyticsScope]) {
      return {
        distribution: cumulativeGradeDistribution,
        title: 'All Semesters (Cumulative)',
        totalCourses: publishedResults.length,
        avgGpa: cumulativeCgpa.toFixed(2),
        totalCredits: totalEarnedCredits
      };
    }
    const grp = semesterGroups[analyticsScope];
    const stats = calculateSemesterStats(grp.items);
    return {
      distribution: stats.distribution,
      title: analyticsScope,
      totalCourses: stats.coursesCount,
      avgGpa: stats.gpa.toFixed(2),
      totalCredits: stats.credits
    };
  })();

  // Compute chronological trajectory points (earliest semester to latest)
  const chronologicalKeys = [...semesterKeys].reverse();
  let runningQualityPoints = 0;
  let runningEarnedUnits = 0;
  let prevSemesterGpa = 0;

  const trajectoryData = chronologicalKeys.map((semKey, idx) => {
    const grp = semesterGroups[semKey];
    const stats = calculateSemesterStats(grp.items);
    
    runningQualityPoints += stats.totalQualityPoints;
    runningEarnedUnits += stats.credits;
    const runningCgpa = runningEarnedUnits > 0 ? (runningQualityPoints / runningEarnedUnits) : 0;
    const delta = idx === 0 ? 0 : stats.gpa - prevSemesterGpa;
    const percentChange = (idx !== 0 && prevSemesterGpa > 0) ? ((delta / prevSemesterGpa) * 100) : 0;
    prevSemesterGpa = stats.gpa;

    const isSem1 = semKey.includes('1st') || semKey.includes('First');
    const yearMatch = semKey.match(/\d{4}\/\d{4}/);
    const yr = yearMatch ? yearMatch[0] : '';
    const level = yr.startsWith('2022') ? '100L' : '200L';
    const shortLabel = `${level} ${isSem1 ? '1st Sem' : '2nd Sem'}`;

    return {
      semesterKey: semKey,
      academicYear: grp.academicYear,
      semester: grp.semester,
      label: semKey,
      shortLabel,
      gpa: stats.gpa,
      runningCgpa,
      credits: stats.credits,
      qualityPoints: stats.totalQualityPoints,
      coursesCount: stats.coursesCount,
      delta,
      percentChange,
    };
  });

  const handleToggleCourseSelection = (courseId: string) => {
    const targetCourse = availableCourses.find(c => c.id === courseId);
    if (targetCourse?.isCarryover) {
      showToast(`Notice: ${targetCourse.code} is an outstanding carryover course and is compulsory for registration.`);
      return;
    }
    setSelectedCoursesToRegister(prev => 
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const handleSelectAllSemesterCourses = (courseList: any[]) => {
    const carryoverIds = courseList.filter(c => c.isCarryover).map(c => c.id);
    const nonCarryoverIds = courseList.filter(c => !c.isCarryover).map(c => c.id);
    const allNonCarryoversSelected = nonCarryoverIds.length > 0 && nonCarryoverIds.every(id => selectedCoursesToRegister.includes(id));
    
    if (allNonCarryoversSelected) {
      // Unselect regular courses only, retaining carryovers
      setSelectedCoursesToRegister(prev => [
        ...prev.filter(id => !nonCarryoverIds.includes(id)),
        ...carryoverIds
      ]);
    } else {
      setSelectedCoursesToRegister(prev => Array.from(new Set([...prev, ...nonCarryoverIds, ...carryoverIds])));
    }
  };

  const handleRegisterCourses = () => {
    if (selectedCoursesToRegister.length === 0) return;
    db.registerForCourses(user.id, selectedCoursesToRegister, registrationSemester, settings.currentSession || db.getSettings().currentSession || '2025/2026');
    loadData();
    setSelectedCoursesToRegister([]);
    showToast('Course registration submitted and approved successfully!');
  };

  // Global actions
  const handleExportAllCsv = async () => {
    setIsExportingAll(true);
    const targetResults = selectedSemesterKey === 'all' 
      ? publishedResults 
      : (semesterGroups[selectedSemesterKey]?.items.filter(i => i.result?.status === 'Published') || []);
    
    const fileTitle = selectedSemesterKey === 'all' ? 'All_Semesters_Results' : `${selectedSemesterKey.replace(/[^a-zA-Z0-9]/g, '_')}_Results`;
    await exportResultsToCsv(targetResults, user.matricNumber || 'Student', fileTitle);
    setIsExportingAll(false);
    showToast(`CSV successfully exported for ${selectedSemesterKey === 'all' ? 'all semesters' : selectedSemesterKey}`);
  };

  const handleOpenPrintModal = (scopeKey: string = 'all') => {
    setOfficialSlipScope(scopeKey);
    setIsOfficialSlipOpen(true);
  };

  // Per-semester actions
  const handleExportSingleSemesterCsv = async (semesterKey: string, items: any[]) => {
    const published = items.filter(i => i.result?.status === 'Published');
    await exportResultsToCsv(published, user.matricNumber || 'Student', `Slip_${semesterKey.replace(/[^a-zA-Z0-9]/g, '_')}`);
    showToast(`CSV downloaded for ${semesterKey}`);
  };

  const handleOpenDispute = (item: any) => {
    if (!item?.course) return;
    setSelectedDisputeCourse({
      courseId: item.course.id,
      courseCode: item.course.code,
      courseTitle: item.course.title,
      lecturerId: item.course.lecturerId,
      caScore: item.result?.caScore ?? null,
      examScore: item.result?.examScore ?? null,
      totalScore: item.result?.totalScore ?? null,
      grade: item.result?.grade ?? null,
    });
    setIsDisputeModalOpen(true);
  };

  const handleDisputeSubmitted = (newDispute: GradeDispute) => {
    setDisputes(prev => [newDispute, ...prev]);
    showToast(`Grade query for ${newDispute.courseCode} lodged successfully.`);
  };

  const visibleSemesterKeys = selectedSemesterKey === 'all' 
    ? semesterKeys 
    : semesterKeys.filter(k => k === selectedSemesterKey);

  return (
    <div id="student-dashboard" className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div 
          id="toast-student-feedback" 
          className="fixed bottom-6 right-6 z-50 bg-[#064e3b] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 border border-emerald-500 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {activeTab === 'overview' && (
        <StudentOverview
          user={user}
          settings={settings}
          cumulativeCgpa={cumulativeCgpa}
          totalEarnedCredits={totalEarnedCredits}
          classification={currentClassification}
          outstandingCount={outstandingCourses.length}
          publishedCount={publishedResults.length}
          totalRegisteredCount={resultsData.length}
        />
      )}

      {activeTab === 'results' && (
        <div className="space-y-6">
          <StudentHeader
            user={user}
            hasPublishedResults={publishedResults.length > 0}
            onExportCsv={handleExportAllCsv}
            onPrint={() => handleOpenPrintModal(selectedSemesterKey === 'all' ? 'all' : selectedSemesterKey)}
            onOpenVerifiableStatement={() => setIsVerifiableStatementOpen(true)}
            isExporting={isExportingAll}
          />

          <StudentSummaryMetrics
            cumulativeCgpa={cumulativeCgpa}
            totalEarnedCredits={totalEarnedCredits}
            classification={currentClassification}
            outstandingCount={outstandingCourses.length}
            settings={settings}
          />

          <AcademicProgressRings
            totalEarnedCredits={totalEarnedCredits}
            maxRequiredCredits={120}
            cumulativeCgpa={cumulativeCgpa}
            publishedCount={publishedResults.length}
            totalRegisteredCount={resultsData.length}
          />

          <SemesterSelectorBar
            activeViewMode={activeViewMode}
            setActiveViewMode={setActiveViewMode}
            selectedSemesterKey={selectedSemesterKey}
            setSelectedSemesterKey={setSelectedSemesterKey}
            setAnalyticsScope={setAnalyticsScope}
            semesterKeys={semesterKeys}
          />

          {activeViewMode === 'results' && (
            <div className="space-y-8">
              {visibleSemesterKeys.length > 0 ? (
                visibleSemesterKeys.map((semesterKey) => (
                  <SemesterResultSlip
                    key={semesterKey}
                    semesterKey={semesterKey}
                    academicYear={semesterGroups[semesterKey].academicYear}
                    items={semesterGroups[semesterKey].items}
                    cumulativeCgpa={cumulativeCgpa}
                    onPrintSemester={handleOpenPrintModal}
                    onExportSemesterCsv={handleExportSingleSemesterCsv}
                    onQueryGrade={handleOpenDispute}
                  />
                ))
              ) : (
                <Card className="p-12 text-center text-slate-500 bg-white border-slate-200">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <h3 className="text-base font-bold text-slate-800">No Course Results Found</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    You have not registered or received official published results for the selected session.
                  </p>
                </Card>
              )}
            </div>
          )}

          {activeViewMode === 'analytics' && (
            <GradeAnalyticsView
              analyticsScope={analyticsScope}
              semesterKeys={semesterKeys}
              onScopeChange={setAnalyticsScope}
              activeAnalyticsData={activeAnalyticsData}
              cumulativeCgpa={cumulativeCgpa}
              currentClassification={currentClassification}
              trajectoryData={trajectoryData}
              allPublishedResults={publishedResults}
            />
          )}
        </div>
      )}

      {activeTab === 'registration' && (
        <CourseRegistrationView
          settings={settings}
          resultsData={resultsData}
          registrationSemester={registrationSemester}
          setRegistrationSemester={setRegistrationSemester}
          availableCourses={availableCourses}
          selectedCoursesToRegister={selectedCoursesToRegister}
          onToggleCourseSelection={handleToggleCourseSelection}
          onSelectAllSemesterCourses={handleSelectAllSemesterCourses}
          onRegisterCourses={handleRegisterCourses}
        />
      )}

      {activeTab === 'disputes' && (
        <StudentDisputeHistoryView
          disputes={disputes}
          onOpenNewDispute={publishedResults.length > 0 ? () => handleOpenDispute(publishedResults[0]) : undefined}
        />
      )}

      {activeTab === 'announcements' && (
        <StudentAnnouncementsView />
      )}

      {/* Student Grade Dispute Submission Modal */}
      <StudentDisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        student={user}
        courseResult={selectedDisputeCourse}
        onDisputeSubmitted={handleDisputeSubmitted}
      />

      {/* Verifiable Official Statement of Results with Checksum */}
      <OfficialStatementOfResultModal
        isOpen={isVerifiableStatementOpen}
        onClose={() => setIsVerifiableStatementOpen(false)}
        student={user}
        coursesWithResults={publishedResults}
        gpa={semesterKeys.length > 0 ? semesterGroups[semesterKeys[0]]?.items ? calculateSemesterStats(semesterGroups[semesterKeys[0]].items).gpa : 0 : 0}
        cgpa={cumulativeCgpa}
        session={settings.currentSession || db.getSettings().currentSession || '2025/2026'}
        semester={settings.currentSemester || 1}
      />

      {/* Official Semester Result Slip Modal */}
      <OfficialResultSlipModal
        isOpen={isOfficialSlipOpen}
        onClose={() => setIsOfficialSlipOpen(false)}
        user={user}
        settings={settings}
        semesterGroups={semesterGroups}
        semesterKeys={semesterKeys}
        initialScopeKey={officialSlipScope}
        cumulativeCgpa={cumulativeCgpa}
      />
    </div>
  );
};

