import React from 'react';
import { User } from '../../types';
import { GraduationCap, BookOpen, Users, Shield, Check } from 'lucide-react';
import { Badge } from '../ui/badge';

interface DemoAccountSelectorProps {
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  filterRole: string;
}

export const DemoAccountSelector: React.FC<DemoAccountSelectorProps> = ({
  users,
  selectedUser,
  onSelectUser,
  filterRole,
}) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Student': return GraduationCap;
      case 'Lecturer': return BookOpen;
      case 'Chief Examiner': return Users;
      default: return Shield;
    }
  };

  const getRoleBadgeVariant = (role: string): 'default' | 'secondary' | 'success' | 'warning' => {
    switch (role) {
      case 'Student': return 'default';
      case 'Lecturer': return 'success';
      case 'Chief Examiner': return 'warning';
      default: return 'secondary';
    }
  };

  // Group or filter users
  const displayedUsers = filterRole === 'all' 
    ? users 
    : users.filter(u => u.role.toLowerCase() === filterRole.toLowerCase());

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Quick-Fill Demo Credentials
        </span>
        <span className="text-[11px] text-slate-400">
          Click any account to populate form
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 no-scrollbar">
        {displayedUsers.map((u) => {
          const Icon = getRoleIcon(u.role);
          const isSelected = selectedUser?.id === u.id;

          return (
            <button
              key={u.id}
              type="button"
              onClick={() => onSelectUser(u)}
              className={`p-3 rounded-xl border text-left flex items-start justify-between gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600'
              }`}
            >
              <div className="flex items-start gap-2.5 truncate">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {u.name}
                  </p>
                  <p className="text-[11px] font-mono truncate mt-0.5">
                    {u.role === 'Student' ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        Matric: {u.matricNumber || u.email}
                      </span>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400">
                        {u.staffId ? `Staff ID: ${u.staffId}` : u.email}
                      </span>
                    )}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                    <Badge variant={getRoleBadgeVariant(u.role)} className="text-[9px] py-0 px-1.5 font-semibold">
                      {u.role}
                    </Badge>
                    {u.role === 'Student' && (
                      <Badge variant="outline" className="text-[9px] py-0 px-1.5 font-bold border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800">
                        {u.level || 200} Level
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
