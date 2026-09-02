/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { LecturerDashboard } from './pages/LecturerDashboard';
import { ExaminerDashboard } from './pages/ExaminerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { GpaCalculatorPage } from './pages/GpaCalculatorPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="login" element={<Login />} />
              <Route path="student" element={<StudentDashboard />} />
              <Route path="lecturer" element={<LecturerDashboard />} />
              <Route path="examiner" element={<ExaminerDashboard />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="gpa-guide" element={<GpaCalculatorPage />} />
              <Route path="how-gpa-works" element={<GpaCalculatorPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

