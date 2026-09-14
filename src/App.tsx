/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';

// Eager load critical landing and login for instant first paint
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';

// Lazy load role dashboards and auxiliary tools for optimal bundle chunking
const StudentDashboard = lazy(() => import('./pages/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const LecturerDashboard = lazy(() => import('./pages/LecturerDashboard').then(m => ({ default: m.LecturerDashboard })));
const ExaminerDashboard = lazy(() => import('./pages/ExaminerDashboard').then(m => ({ default: m.ExaminerDashboard })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const GpaCalculatorPage = lazy(() => import('./pages/GpaCalculatorPage').then(m => ({ default: m.GpaCalculatorPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const ProjectReviewPage = lazy(() => import('./pages/ProjectReviewPage').then(m => ({ default: m.ProjectReviewPage })));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh] w-full">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-semibold text-slate-500">Loading module...</span>
    </div>
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="login" element={<Login />} />
              <Route
                path="student"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <StudentDashboard />
                  </Suspense>
                }
              />
              <Route
                path="lecturer"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <LecturerDashboard />
                  </Suspense>
                }
              />
              <Route
                path="examiner"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ExaminerDashboard />
                  </Suspense>
                }
              />
              <Route
                path="admin"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <AdminDashboard />
                  </Suspense>
                }
              />
              <Route
                path="gpa-guide"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <GpaCalculatorPage />
                  </Suspense>
                }
              />
              <Route
                path="how-gpa-works"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <GpaCalculatorPage />
                  </Suspense>
                }
              />
              <Route
                path="profile"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <ProfilePage />
                  </Suspense>
                }
              />
            </Route>
            {/* Standalone Project Review & Architecture Slide Deck Routes */}
            <Route
              path="/project-review"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ProjectReviewPage />
                </Suspense>
              }
            />
            <Route
              path="/system-review"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ProjectReviewPage />
                </Suspense>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
