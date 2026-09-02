import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { GraduationCap, Shield, BookOpen, Users, ArrowLeft, Calculator, Loader2 } from 'lucide-react';
import { FuazLogo } from '../components/ui/FuazLogo';
import { db } from '../lib/db';
import { User } from '../types';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loggingInId, setLoggingInId] = useState<string | null>(null);

  useEffect(() => {
    setUsers(db.from('users').select());
  }, []);

  const handleLogin = (userId: string, path: string) => {
    setLoggingInId(userId);
    setTimeout(() => {
      login(userId);
      navigate(path);
    }, 450);
  };

  const roles = [
    { name: 'Student', icon: GraduationCap, bgClass: 'bg-blue-50 dark:bg-blue-950/60', textClass: 'text-blue-600 dark:text-blue-400', path: '/student', desc: 'View results & history' },
    { name: 'Lecturer', icon: BookOpen, bgClass: 'bg-emerald-50 dark:bg-emerald-950/60', textClass: 'text-[#059669] dark:text-emerald-400', path: '/lecturer', desc: 'Input & submit scores' },
    { name: 'Chief Examiner', icon: Users, bgClass: 'bg-amber-50 dark:bg-amber-950/60', textClass: 'text-amber-600 dark:text-amber-400', path: '/examiner', desc: 'Review & approve results' },
    { name: 'Admin', icon: Shield, bgClass: 'bg-slate-200 dark:bg-slate-800', textClass: 'text-slate-700 dark:text-slate-300', path: '/admin', desc: 'System & user management' },
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-[#f8fafc] dark:bg-slate-950 relative transition-colors">
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate('/')} className="gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 shadow-xs border border-slate-200 dark:border-slate-800">
          <ArrowLeft className="w-4 h-4" /> Back to Portal
        </Button>
      </div>
      <div className="w-full max-w-xl h-full py-8 overflow-y-auto no-scrollbar">
        <div className="text-center mb-8 mt-4">
          <div className="inline-flex items-center justify-center p-2 mb-3">
            <FuazLogo size={96} />
          </div>
          <h2 className="text-2xl font-extrabold text-[#064e3b] dark:text-emerald-400 tracking-tight">Federal University of Agriculture, Zuru</h2>
          <p className="text-xs font-bold text-[#059669] dark:text-emerald-500 uppercase tracking-wider mt-0.5">Student Results Management System (SRMS)</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Select a prototype profile to continue</p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-md">
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-900 dark:text-slate-100">Prototype Access</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/gpa-guide')}
                className="text-xs gap-1.5 text-[#059669] dark:text-emerald-400"
              >
                <Calculator className="w-3.5 h-3.5" /> GPA Guide
              </Button>
            </div>
            <CardDescription className="dark:text-slate-400">
              Select a specific user profile to bypass authentication and view their respective dashboard and data.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {roles.map(role => {
              const roleUsers = users.filter(u => u.role === role.name);
              const Icon = role.icon;
              return (
                <div key={role.name} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                  <div className="flex items-center space-x-3 p-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <div className={`w-10 h-10 rounded-full ${role.bgClass} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${role.textClass}`} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100">{role.name} Profiles</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{role.desc}</div>
                    </div>
                  </div>
                  <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white dark:bg-slate-900">
                    {roleUsers.map(u => (
                      <Button 
                        key={u.id}
                        variant="outline" 
                        disabled={loggingInId !== null}
                        className="justify-start h-auto py-3 px-4 text-left border-slate-200 dark:border-slate-800 hover:border-[#059669] dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg w-full bg-white dark:bg-slate-900 transition-all"
                        onClick={() => handleLogin(u.id, role.path)}
                      >
                        {loggingInId === u.id ? (
                          <div className="flex items-center gap-2 py-1 text-emerald-700 dark:text-emerald-300 font-bold w-full">
                            <Loader2 className="w-4 h-4 animate-spin text-emerald-600 flex-shrink-0" />
                            <span className="truncate text-xs">Signing in...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-start truncate w-full">
                            <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">{u.name}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{u.department || u.staffId || u.matricNumber}</span>
                          </div>
                        )}
                      </Button>
                    ))}
                    {roleUsers.length === 0 && (
                      <div className="col-span-full text-center text-sm text-slate-400 py-2">
                        No profiles found.
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

