import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { motion } from 'motion/react';

export const InstitutionalGateways: React.FC = () => {
  const navigate = useNavigate();
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const gateways = [
    {
      role: 'Student',
      roleParam: 'Student',
      title: 'Student Portal',
      tag: 'Undergraduate & Post-Graduate',
      description: 'Access term results, monitor degree classification progress, and generate official digitally stamped result slips.',
      icon: GraduationCap,
      badgeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900',
      accentColor: 'text-blue-600 dark:text-blue-400',
      activeRing: 'ring-2 ring-blue-500/40 border-blue-500 dark:border-blue-400 shadow-xl -translate-y-1.5 bg-blue-50/25 dark:bg-blue-950/25',
      activeProgress: 'bg-blue-500',
      buttonBg: 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 text-white',
      borderHover: 'hover:border-blue-400 dark:hover:border-blue-600',
      features: [
        'Real-time semester results & 5.0 CGPA calculation',
        'Download verified, watermarked result slips',
        'Course registration & credit unit allocation',
        'Academic progress & carryover tracking',
      ],
    },
    {
      role: 'Lecturer',
      roleParam: 'Lecturer',
      title: 'Lecturer Desk',
      tag: 'Academic Staff & Course Instructors',
      description: 'Record continuous assessment marks, batch upload final exam scores via CSV, and review grade distributions.',
      icon: BookOpen,
      badgeColor: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
      accentColor: 'text-emerald-600 dark:text-emerald-400',
      activeRing: 'ring-2 ring-emerald-500/40 border-emerald-500 dark:border-emerald-400 shadow-xl -translate-y-1.5 bg-emerald-50/25 dark:bg-emerald-950/25',
      activeProgress: 'bg-emerald-600',
      buttonBg: 'bg-emerald-700 hover:bg-emerald-800 hover:shadow-lg hover:-translate-y-0.5 text-white',
      borderHover: 'hover:border-emerald-500 dark:hover:border-emerald-600',
      features: [
        'Direct CA (40%) and Examination (60%) mark input',
        'One-click batch CSV grade sheet upload',
        'Instant NUC standard grade distribution checks',
        'Submission locking and audit timestamps',
      ],
    },
    {
      role: 'Chief Examiner',
      roleParam: 'Chief Examiner',
      title: 'Examiner Review Desk',
      tag: 'Departmental & Faculty Leadership',
      description: 'Moderate departmental results, audit grade alterations, and generate Senate-ready broadsheets for official sign-off.',
      icon: Users,
      badgeColor: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900',
      accentColor: 'text-amber-600 dark:text-amber-400',
      activeRing: 'ring-2 ring-amber-500/40 border-amber-500 dark:border-amber-400 shadow-xl -translate-y-1.5 bg-amber-50/25 dark:bg-amber-950/25',
      activeProgress: 'bg-amber-500',
      buttonBg: 'bg-amber-600 hover:bg-amber-700 hover:shadow-lg hover:-translate-y-0.5 text-white',
      borderHover: 'hover:border-amber-500 dark:hover:border-amber-600',
      features: [
        'Faculty-wide score moderation & anomaly alerts',
        'Senate broadsheet preview & approval flow',
        'Immutable grade change audit logs',
        'Bulk result release & publication controls',
      ],
    },
    {
      role: 'Admin',
      roleParam: 'Admin',
      title: 'System Administration',
      tag: 'ICT & Academic Planning',
      description: 'Configure academic sessions, manage course catalogs and departmental curricula, and supervise institutional access.',
      icon: Shield,
      badgeColor: 'bg-slate-500/10 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800',
      accentColor: 'text-slate-700 dark:text-slate-300',
      activeRing: 'ring-2 ring-slate-600/40 border-slate-700 dark:border-slate-400 shadow-xl -translate-y-1.5 bg-slate-50/50 dark:bg-slate-800/40',
      activeProgress: 'bg-slate-700',
      buttonBg: 'bg-slate-800 hover:bg-slate-900 hover:shadow-lg hover:-translate-y-0.5 text-white dark:bg-slate-700 dark:hover:bg-slate-600',
      borderHover: 'hover:border-slate-400 dark:hover:border-slate-500',
      features: [
        'Departmental curriculum mapping & course pools',
        'Academic session & semester lifecycle management',
        'User credentials & role-based permission control',
        'Comprehensive database backups & audit archives',
      ],
    },
  ];

  // Selective highlight timed interval (cycles through each card every 4 seconds)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveHighlightIndex((prev) => (prev + 1) % gateways.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused, gateways.length]);

  return (
    <section id="institutional-gateways" className="py-12 sm:py-16 md:py-20 bg-white dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Academic Portals & Workspaces
          </h2>
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Choose your university role below to access your student results, submit semester grades, moderate faculty broadsheets, or manage institutional catalogs.
          </p>

          {/* Selective Highlight Controls Bar */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-5">
            {gateways.map((gw, idx) => {
              const isSelected = idx === activeHighlightIndex;
              return (
                <button
                  key={gw.role}
                  onClick={() => {
                    setActiveHighlightIndex(idx);
                    setIsPaused(true);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#064e3b] text-white shadow-xs scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:-translate-y-0.5'
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                  <span>{gw.role}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {gateways.map((gw, idx) => {
            const Icon = gw.icon;
            const isHighlighted = idx === activeHighlightIndex;

            return (
              <div
                key={gw.role}
                id={`gateway-card-${gw.role.toLowerCase().replace(/\s+/g, '-')}`}
                onMouseEnter={() => {
                  setIsPaused(true);
                  setActiveHighlightIndex(idx);
                }}
                onMouseLeave={() => setIsPaused(false)}
                className={`relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 transition-all duration-300 shadow-xs cursor-pointer group ${
                  isHighlighted
                    ? gw.activeRing
                    : `border-slate-200/90 dark:border-slate-800 hover:-translate-y-1 hover:shadow-md ${gw.borderHover}`
                }`}
              >
                {/* Active Timed Progress Indicator at Top Border */}
                {isHighlighted && !isPaused && (
                  <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-slate-800">
                    <motion.div
                      key={`progress-${idx}`}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 4, ease: 'linear' }}
                      className={`h-full ${gw.activeProgress}`}
                    />
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-transform ${isHighlighted ? 'scale-110 shadow-xs' : 'group-hover:scale-105'}`}>
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${gw.accentColor}`} />
                    </div>
                    
                    <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 border ${gw.badgeColor}`}>
                      {gw.tag}
                    </Badge>
                  </div>

                  <h3 className={`text-base sm:text-lg font-bold tracking-tight transition-colors ${isHighlighted ? 'text-[#064e3b] dark:text-emerald-300' : 'text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400'}`}>
                    {gw.title}
                  </h3>

                  <p className="mt-1.5 sm:mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed min-h-0 sm:min-h-[48px]">
                    {gw.description}
                  </p>

                  <div className="my-4 sm:my-5 border-t border-slate-100 dark:border-slate-800" />

                  <ul className="space-y-2 sm:space-y-2.5 mb-5 sm:mb-6">
                    {gw.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${isHighlighted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/login?role=${encodeURIComponent(gw.roleParam)}`);
                  }}
                  className={`w-full justify-between font-bold text-xs py-4 sm:py-5 min-h-[44px] rounded-xl shadow-xs ${gw.buttonBg} transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                    isHighlighted ? 'ring-2 ring-offset-1 ring-emerald-600/30' : ''
                  }`}
                >
                  <span>Access {gw.role} Desk</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

