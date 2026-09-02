import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { User, Phone, MapPin, Mail, Shield, BookOpen, Building, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const [name, setName] = useState(user.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [address, setAddress] = useState(user.address || '');
  const [emergencyContact, setEmergencyContact] = useState(user.emergencyContact || '');
  const [successMessage, setSuccessMessage] = useState(false);

  const getDashboardPath = (role: string) => {
    switch (role) {
      case 'Student': return '/student';
      case 'Lecturer': return '/lecturer';
      case 'Chief Examiner': return '/examiner';
      case 'Admin': return '/admin';
      default: return '/';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      phoneNumber,
      address,
      emergencyContact,
    });
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Back to Dashboard Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(getDashboardPath(user.role))}
          className="text-xs gap-2 font-bold text-[#064e3b] dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {user.role} Dashboard</span>
        </Button>
      </div>

      {/* Profile Header Banner */}
      <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-950/30 rounded-full blur-3xl -z-0 pointer-events-none transform translate-x-20 -translate-y-20" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#064e3b] dark:bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-md">
            {user.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-[#064e3b] dark:text-emerald-300 w-fit mx-auto sm:mx-0">
                {user.role}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              {user.matricNumber ? `Matriculation Number: ${user.matricNumber}` : user.staffId ? `Staff ID: ${user.staffId}` : ''}
            </p>
            <p className="text-xs text-[#059669] dark:text-emerald-400 font-semibold">
              {user.department || 'General Department'} • College of {user.college || 'Agriculture, Zuru'}
            </p>
          </div>
        </div>
      </Card>

      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs sm:text-sm flex items-center gap-3 font-semibold shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>Your profile information has been successfully updated!</span>
        </div>
      )}

      {/* Profile Edit Form Card */}
      <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <User className="w-4 h-4 text-[#059669]" />
          <span>Account & Biodata Details</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Institutional Email</Label>
              <Input
                value={user.email}
                disabled
                className="text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                {user.matricNumber ? 'Matriculation Number' : 'Staff ID'}
              </Label>
              <Input
                value={user.matricNumber || user.staffId || 'N/A'}
                disabled
                className="text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-mono cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Department / College</Label>
              <Input
                value={`${user.department || 'General'} (${user.college || 'FUAZ'})`}
                disabled
                className="text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Phone Number</Label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+234 800 000 0000"
                className="text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Emergency Contact</Label>
              <Input
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="Name & Phone (Relation)"
                className="text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Residential / Hostel Address</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Hostel block or off-campus address in Zuru"
              className="text-xs sm:text-sm"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(getDashboardPath(user.role))}
              className="text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#064e3b] hover:bg-emerald-800 text-white text-xs font-bold px-6"
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
