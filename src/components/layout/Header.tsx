import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LogOut, Menu, User as UserIcon, LayoutDashboard, 
  ChevronDown, ArrowLeft, LogIn 
} from 'lucide-react';
import { Button } from '../ui/button';
import { FuazLogo } from '../ui/FuazLogo';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  onToggleMobileNav?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
  const isReviewRoute = location.pathname === '/project-review';

  const getDashboardPath = (role: string) => {
    switch (role) {
      case 'Student': return '/student';
      case 'Lecturer': return '/lecturer';
      case 'HOD': return '/examiner';
      case 'Examiner':
      case 'Chief Examiner': return '/examiner';
      case 'Senate': return '/admin?tab=senate';
      case 'Admin': return '/admin';
      default: return '/login';
    }
  };

  const firstName = user?.name ? user.name.split(' ')[0] : '';

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs flex-shrink-0 z-30 print:hidden transition-colors">
      {/* Left Brand & Navigation Controls */}
      <div className="flex items-center space-x-3">
        {/* Back Button for Login / Public Aux pages */}
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

        {/* Mobile Nav Toggle for Authenticated Dashboards */}
        {user && !isPublicRoute && !isGpaGuideRoute && !isReviewRoute && onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Brand Logo & Title */}
        <div 
          className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer" 
          onClick={() => navigate(user ? getDashboardPath(user.role) : '/')}
        >
          <div className="flex items-center justify-center">
            <FuazLogo size={36} />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
              <span>FUAZ SRMS</span>
            </h1>
            <p className="text-[#059669] dark:text-emerald-400 text-[10px] uppercase tracking-wider font-bold">
              Fed. Univ. of Agriculture, Zuru
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Public-only Navigation Links (Hidden when user is logged in on a dashboard) */}
        {!user && isGpaGuideRoute && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Home</span>
          </Button>
        )}

        {/* Public Login Button if not logged in and not already on login page */}
        {!user && location.pathname !== '/login' && (
          <Button
            size="sm"
            onClick={() => navigate('/login')}
            className="gap-1.5 bg-[#064e3b] hover:bg-[#065f46] text-white text-xs font-bold rounded-xl px-3.5 py-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </Button>
        )}

        {/* Theme Toggle (Light / Dark) */}
        <ThemeToggle />

        {/* Authenticated User Menu */}
        {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsUserMenuOpen(prev => !prev)}
              className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-3 py-1.5 px-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer"
              aria-expanded={isUserMenuOpen}
              aria-label="User profile menu"
            >
              <div className="w-8 h-8 rounded-full bg-[#064e3b] dark:bg-emerald-700 flex items-center justify-center text-white font-bold text-xs shadow-xs flex-shrink-0">
                {user.name.substring(0, 2).toUpperCase()}
              </div>
              
              {/* Responsive Name Display: First Name on Tablet, Full Name on Desktop */}
              <div className="text-left hidden xs:block">
                <p className="hidden sm:block md:hidden text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate max-w-[100px]">
                  {firstName}
                </p>
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
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  {user.department && (
                    <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                      Dept: {user.department}
                    </span>
                  )}
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate(getDashboardPath(user.role));
                    }}
                    className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-medium">My Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">Profile & Bio</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
