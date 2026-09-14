import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Menu, Calculator, User as UserIcon, LayoutDashboard, ChevronDown, ArrowLeft, Presentation } from 'lucide-react';
import { Button } from './ui/button';
import { Sidebar } from './Sidebar';
import { FuazLogo } from './ui/FuazLogo';
import { ThemeToggle } from './ui/ThemeToggle';

export const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logout();
    navigate('/login');
  };

  const isPublicRoute = location.pathname === '/' || location.pathname === '/login';
  const isGpaGuideRoute = location.pathname === '/gpa-guide' || location.pathname === '/how-gpa-works';

  const getDashboardPath = (role: string) => {
    switch (role) {
      case 'Student': return '/student';
      case 'Lecturer': return '/lecturer';
      case 'Chief Examiner': return '/examiner';
      case 'Admin': return '/admin';
      default: return '/login';
    }
  };

  const firstName = user?.name ? user.name.split(' ')[0] : '';

  return (
    <div className="h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans overflow-hidden transition-colors duration-200">
      {/* Top Navigation */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs flex-shrink-0 z-30 print:hidden transition-colors">
        <div className="flex items-center space-x-3">
          {location.pathname === '/login' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white mr-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          )}

          {user && !isPublicRoute && !isGpaGuideRoute && (
            <button
              onClick={() => setIsMobileNavOpen(prev => !prev)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => navigate(user ? getDashboardPath(user.role) : '/')}
          >
            <div className="flex items-center justify-center">
              <FuazLogo size={38} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                <span>FUAZ SRMS</span>
              </h1>
              <p className="text-[#059669] dark:text-emerald-400 text-[10px] uppercase tracking-wider font-bold">
                Fed. Univ. of Agriculture, Zuru
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">


          {/* GPA Guide Quick Link */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/gpa-guide')}
            className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold rounded-xl ${
              isGpaGuideRoute
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>GPA Guide</span>
          </Button>

          {/* Architecture & Defense Deck Link */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/project-review')}
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-slate-800"
          >
            <Presentation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Architecture & Review</span>
          </Button>

          {/* Theme Toggle (Light / Dark) */}
          <ThemeToggle />

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsUserMenuOpen(prev => !prev)}
                className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-3 py-1.5 px-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
                aria-expanded={isUserMenuOpen}
                aria-label="User profile menu"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#064e3b] dark:bg-emerald-700 flex items-center justify-center text-white font-bold text-xs shadow-xs flex-shrink-0">
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
                
                {/* Responsive Name Display: First Name on Tablet (sm to md), Full Name on Desktop (md+) */}
                <div className="text-left">
                  {/* Tablet view: First name only */}
                  <p className="hidden sm:block md:hidden text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate max-w-[100px]">
                    {firstName}
                  </p>
                  {/* Desktop view: Full name */}
                  <p className="hidden md:block text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate max-w-[140px]">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-[#059669] dark:text-emerald-400 font-semibold">{user.role}</p>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                      {user.matricNumber ? `Matric: ${user.matricNumber}` : user.staffId ? `Staff ID: ${user.staffId}` : user.role}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate(getDashboardPath(user.role));
                      }}
                      className="w-full px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>My Profile & Settings</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            !isPublicRoute && (
              <Button onClick={() => navigate('/login')} variant="outline" size="sm" className="dark:border-slate-700 dark:bg-slate-800">
                Sign In
              </Button>
            )
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {user && !isPublicRoute && !isGpaGuideRoute && (
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
