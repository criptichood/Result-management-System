import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../lib/db';

interface AuthContextType {
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('srms_auth_user');
    if (storedUserId) {
      const u = db.from('users').selectById(storedUserId);
      if (u) setUser(u as User);
    }
  }, []);

  const login = (userId: string) => {
    const u = db.from('users').selectById(userId);
    if (u) {
      setUser(u as User);
      localStorage.setItem('srms_auth_user', userId);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('srms_auth_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = db.from('users').update(user.id, updates);
    if (updated) {
      setUser(updated as User);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
