import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Calculator, Loader2, Lock, Mail, GraduationCap,
  Eye, EyeOff, AlertCircle
} from 'lucide-react';
import { FuazLogo } from '../components/ui/FuazLogo';
import { db } from '../lib/db';
import { User } from '../types';
import { DemoAccountSelector } from '../components/login';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'all';

  const [selectedRole, setSelectedRole] = useState<string>(initialRole);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form Fields
  const [identifier, setIdentifier] = useState(''); // email, matric number, or staff ID
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadedUsers = db.from('users').select();
    setUsers(loadedUsers);

    // If role query param is provided and matches a user, or default to a reasonable user
    const roleParam = searchParams.get('role');
    if (roleParam) {
      setSelectedRole(roleParam);
      const matched = loadedUsers.find(u => u.role.toLowerCase() === roleParam.toLowerCase());
      if (matched) {
        autoFillUser(matched);
      }
    }
  }, [searchParams]);

  const autoFillUser = (u: User) => {
    setSelectedUser(u);
    if (u.role === 'Student') {
      setIdentifier(u.matricNumber || '');
    } else {
      setIdentifier(u.staffId || u.email);
    }
    setPassword('fuaz-password-2024');
    setErrorMessage(null);
  };

  const isStudentRole = selectedRole.toLowerCase() === 'student' || selectedUser?.role === 'Student';

  const handleRoleFilter = (roleName: string) => {
    setSelectedRole(roleName);
    if (roleName === 'all') {
      searchParams.delete('role');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ role: roleName }, { replace: true });
      // Pick first matching user in that role for convenience
      const match = users.find(u => u.role.toLowerCase() === roleName.toLowerCase());
      if (match) {
        autoFillUser(match);
      }
    }
  };

  const getRoleDashboardPath = (role: string) => {
    switch (role) {
      case 'Student': return '/student';
      case 'Lecturer': return '/lecturer';
      case 'Chief Examiner': return '/examiner';
      case 'Admin': return '/admin';
      default: return '/student';
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanIdentifier = identifier.trim().toLowerCase();
    if (!cleanIdentifier) {
      setErrorMessage(
        isStudentRole
          ? 'Please enter your Admission / Matriculation Number.'
          : 'Please enter your admission number or staff credentials.'
      );
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your portal password.');
      return;
    }

    setIsLoading(true);

    // Find matching user:
    // Students authenticate using their admission/matriculation number
    // Staff/Lecturer/Examiner/Admin authenticate via staffId or email
    const matchedUser = users.find(u => {
      if (u.role === 'Student') {
        return u.matricNumber && u.matricNumber.toLowerCase() === cleanIdentifier;
      }
      return (
        (u.staffId && u.staffId.toLowerCase() === cleanIdentifier) ||
        u.email.toLowerCase() === cleanIdentifier
      );
    });

    setTimeout(() => {
      setIsLoading(false);
      if (matchedUser) {
        login(matchedUser.id);
        navigate(getRoleDashboardPath(matchedUser.role));
      } else {
        const isStudentEmailAttempt = users.some(
          u => u.role === 'Student' && u.email.toLowerCase() === cleanIdentifier
        );
        if (isStudentEmailAttempt) {
          setErrorMessage(
            'Students must sign in using their Admission / Matriculation Number (e.g. UG/2022/02/03/045) instead of university email.'
          );
        } else {
          setErrorMessage(
            isStudentRole
              ? 'Invalid student credentials. Please check your Matriculation / Admission Number (e.g. UG/2022/02/03/045) or pick a demo student below.'
              : 'Invalid university credentials. Please check your admission number, staff ID, or select a demo account below.'
          );
        }
      }
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-[#f8fafc] dark:bg-slate-950 relative transition-colors min-h-[calc(100vh-4rem)]">
      {/* Top Header Controls */}
      <div className="w-full max-w-2xl flex items-center justify-end mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/gpa-guide')}
          className="text-xs gap-1.5 text-[#059669] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-900"
        >
          <Calculator className="w-3.5 h-3.5" /> GPA Guide
        </Button>
      </div>

      <div className="w-full max-w-2xl py-2">
        {/* University Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-2 mb-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800">
            <FuazLogo size={76} />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#064e3b] dark:text-emerald-400 tracking-tight">
            Federal University of Agriculture, Zuru
          </h2>
          <p className="text-xs font-bold text-[#059669] dark:text-emerald-500 uppercase tracking-wider mt-0.5">
            Student Results Management System (SRMS)
          </p>
        </div>

        {/* Real Authentication Form Card */}
        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-lg mb-6">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
              Sign In to Your Workspace
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Enter your official institutional credentials or select an academic demo profile below to auto-populate the authentication fields.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            {/* Error Notification */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Actual Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  {isStudentRole
                    ? 'Admission / Matriculation Number'
                    : selectedRole.toLowerCase() === 'all'
                    ? 'Matriculation No. (Students) or Staff ID / Email'
                    : 'Staff ID or University Email'}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {isStudentRole ? (
                    <GraduationCap className="absolute left-3 top-2.5 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  )}
                  <Input
                    id="input-login-identifier"
                    type="text"
                    placeholder={
                      isStudentRole
                        ? "e.g. UG/2022/02/03/045"
                        : selectedRole.toLowerCase() === 'all'
                        ? "e.g. UG/2022/02/03/045 or LEC001"
                        : "e.g. LEC001 or staff@fuaz.edu.ng"
                    }
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="pl-9 h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm font-medium font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Default: Any password or demo key
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input
                    id="input-login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="pl-9 pr-10 h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                id="btn-submit-login"
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#064e3b] hover:bg-[#065f46] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Authenticating Workspace...</span>
                  </>
                ) : (
                  <span>Sign In to SRMS Portal</span>
                )}
              </Button>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-500 dark:text-slate-400 font-semibold">
                  Or Test with Demo Profiles
                </span>
              </div>
            </div>

            {/* Filter Pills for quick demo accounts */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              {['all', 'Student', 'Lecturer', 'Chief Examiner', 'Admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleFilter(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedRole.toLowerCase() === r.toLowerCase()
                      ? 'bg-white dark:bg-slate-900 text-[#064e3b] dark:text-emerald-400 shadow-xs ring-1 ring-emerald-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {r === 'all' ? 'All Roles' : r}
                </button>
              ))}
            </div>

            {/* Quick Fill Demo Selector Grid */}
            <DemoAccountSelector
              users={users}
              selectedUser={selectedUser}
              onSelectUser={autoFillUser}
              filterRole={selectedRole}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
