import React from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { 
  LayoutDashboard, Users, BookOpen, Settings, FileSearch, 
  LineChart, FileText, ClipboardList, BookMarked, Calculator, 
  X, PanelLeftClose, PanelLeftOpen, Bell 
} from 'lucide-react';

interface SidebarProps {
  user: User;
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ user, isOpen = false, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  let activeTab = searchParams.get('tab');
  
  const getMenus = () => {
    switch(user.role) {
      case 'Student':
        activeTab = activeTab || 'overview';
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'results', label: 'My Results', icon: FileText },
          { id: 'registration', label: 'Course Registration', icon: BookMarked },
          { id: 'announcements', label: 'Announcements', icon: Bell },
        ];
      case 'Lecturer':
        activeTab = activeTab || 'grading';
        return [
          { id: 'grading', label: 'Grading & Courses', icon: ClipboardList },
          { id: 'class-list', label: 'Class List', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: LineChart },
        ];
      case 'Chief Examiner':
        activeTab = activeTab || 'pending';
        return [
          { id: 'pending', label: 'Pending Approvals', icon: FileSearch },
          { id: 'courses', label: 'Department Courses', icon: BookMarked },
          { id: 'students', label: 'Department Students', icon: Users },
          { id: 'published', label: 'Published Results', icon: BookOpen },
        ];
      case 'Admin':
        activeTab = activeTab || 'overview';
        return [
          { id: 'overview', label: 'System Overview', icon: LayoutDashboard },
          { id: 'courses', label: 'Course Management', icon: BookOpen },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const menus = getMenus();

  const handleNavigate = (id: string) => {
    navigate(`${location.pathname}?tab=${id}`);
    if (onClose) onClose();
  };

  const handleGoToGpaGuide = () => {
    navigate('/gpa-guide');
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden print:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 md:z-10
        bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0 shadow-md md:shadow-none h-full
        transition-all duration-200 ease-in-out print:hidden
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-20' : 'md:w-64'}
      `}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate">
              {user.role} Navigation
            </h2>
          )}
          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mx-auto md:mx-0"
          >
            {isCollapsed ? <PanelLeftOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>

          {/* Mobile close button */}
          {onClose && (
            <button 
              onClick={onClose} 
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="p-3 space-y-2 flex-1 overflow-y-auto">
          {menus.map(menu => {
            const Icon = menu.icon;
            const isActive = activeTab === menu.id;
            return (
              <button 
                key={menu.id}
                onClick={() => handleNavigate(menu.id)}
                title={isCollapsed ? menu.label : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-colors ${
                  isActive 
                    ? 'bg-emerald-50 text-[#064e3b] dark:bg-emerald-950/60 dark:text-emerald-300 shadow-xs' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#064e3b] dark:text-emerald-300' : 'text-slate-500 dark:text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">{menu.label}</span>}
              </button>
            );
          })}

          {/* Dedicated GPA Explainer / Guide link */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <button
              onClick={handleGoToGpaGuide}
              title={isCollapsed ? "How GPA is Calculated" : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#059669] dark:text-emerald-400 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 transition-colors ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              <Calculator className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">How GPA is Calculated</span>}
            </button>
          </div>
        </nav>

        {!isCollapsed && (
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Logged in as:</p>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">{user.name}</p>
            <p className="text-[11px] text-[#059669] dark:text-emerald-400 font-semibold truncate mt-0.5">{user.department || user.role}</p>
          </div>
        )}
      </aside>
    </>
  );
}
