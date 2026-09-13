import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Award, Users, BookOpen } from 'lucide-react';

interface HeroMessage {
  id: string;
  badge: string;
  icon: React.ElementType;
  text: string;
}

const HERO_MESSAGES: HeroMessage[] = [
  {
    id: 'msg-1',
    badge: 'Centralized Academic Records',
    icon: ShieldCheck,
    text: 'A secure, verified, and centralized portal for computing continuous assessments, moderating university broad sheets, and publishing official transcripts.',
  },
  {
    id: 'msg-2',
    badge: '5.0 Scale CGPA & Classification',
    icon: Award,
    text: 'Automated Nigerian 5.0 CGPA evaluation with NUC-standard degree classifications, carryover tracking, and instant digitally stamped result slips.',
  },
  {
    id: 'msg-3',
    badge: 'Multi-Tier Institutional Moderation',
    icon: Users,
    text: 'Seamless academic governance connecting course lecturers, Chief Examiners, and the university Senate board with tamper-evident audit trails.',
  },
  {
    id: 'msg-4',
    badge: 'Official Transcript & Slip Authentication',
    icon: BookOpen,
    text: 'Digitally authenticated semester result slips, official statement of results, and departmental analytics designed for institutional excellence.',
  },
];

export const AnimatedHeroDescription: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_MESSAGES.length);
    }, 5200);

    return () => clearInterval(interval);
  }, [isPaused]);

  const activeMessage = HERO_MESSAGES[currentIndex];
  const Icon = activeMessage.icon;

  return (
    <div
      className="max-w-2xl mx-auto mb-8 sm:mb-9 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Category Square Badge (Square design, no smooth curves) */}
      <div className="flex justify-center mb-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMessage.badge}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-emerald-50/90 dark:bg-emerald-950/80 border border-emerald-600/40 dark:border-emerald-500/40 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#064e3b] dark:text-emerald-300 shadow-2xs"
          >
            <Icon className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400 flex-shrink-0" />
            <span>{activeMessage.badge}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Animated Message Text Area with Fixed Min-Height to Eliminate Layout Shift */}
      <div className="min-h-[4.5rem] sm:min-h-[3.75rem] flex items-center justify-center px-2">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeMessage.id}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal text-center"
          >
            {activeMessage.text}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Interactive Navigation Stepper Blocks (Square design) */}
      <div className="flex items-center justify-center gap-2 mt-3.5">
        {HERO_MESSAGES.map((msg, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={msg.id}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Select message ${index + 1}: ${msg.badge}`}
              className="group p-1 focus:outline-none cursor-pointer"
            >
              <div
                className={`h-1.5 rounded-none transition-all duration-300 ${
                  isActive
                    ? 'w-8 bg-[#059669] dark:bg-emerald-400'
                    : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
