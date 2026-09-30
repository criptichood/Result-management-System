import React, { useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Header } from './layout/Header';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isPublicRoute = location.pathname === '/' || location.pathname === '/login';
  const isGpaGuideRoute = location.pathname === '/gpa-guide' || location.pathname === '/how-gpa-works';
  const isReviewRoute = location.pathname === '/project-review';

  return (
    <div className="h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans overflow-hidden transition-colors duration-200">
      {/* Top Navigation Component */}
      <Header onToggleMobileNav={() => setIsMobileNavOpen(prev => !prev)} />

      {/* Main App Content Body */}
      <div className="flex-1 flex overflow-hidden">
        {user && !isPublicRoute && !isGpaGuideRoute && !isReviewRoute && (
          <Sidebar 
            user={user} 
            isOpen={isMobileNavOpen} 
            onClose={() => setIsMobileNavOpen(false)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          />
        )}
        <main className="flex-1 flex flex-col bg-[#fdfcf9] dark:bg-slate-950 overflow-y-auto transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
