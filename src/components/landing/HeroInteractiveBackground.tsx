import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface HeroInteractiveBackgroundProps {
  containerRef?: React.RefObject<HTMLElement | null>;
}

export const HeroInteractiveBackground: React.FC<HeroInteractiveBackgroundProps> = ({ containerRef }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for fluid mouse trailing
  const springX = useSpring(mouseX, { stiffness: 120, damping: 25, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 25, mass: 0.5 });

  useEffect(() => {
    // Detect touch device
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      setIsTouchDevice(true);
    }

    const target = containerRef?.current;
    if (!target) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
      if (!isHovered) setIsHovered(true);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const rect = target.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    target.addEventListener('mousemove', handleMouseMove);
    target.addEventListener('mouseenter', handleMouseEnter);
    target.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      target.removeEventListener('mousemove', handleMouseMove);
      target.removeEventListener('mouseenter', handleMouseEnter);
      target.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [containerRef, mouseX, mouseY, isHovered]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 1. Interactive Soft Spotlight Following Cursor on Hover (No grid lines) */}
      {!isTouchDevice && (
        <motion.div
          className="absolute -inset-10 pointer-events-none transition-opacity duration-700 ease-out"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(650px circle at ${springX}px ${springY}px, rgba(5, 150, 105, 0.13), rgba(245, 158, 11, 0.04) 45%, transparent 70%)`,
          }}
        />
      )}

      {/* 2. Ambient Floating Institutional Auras (Smooth atmospheric gradient lighting, completely grid-free) */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [-20, 20, -20],
          y: [-15, 15, -15],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] sm:w-[50rem] sm:h-[50rem] bg-gradient-to-tr from-emerald-400/20 via-teal-300/12 to-amber-200/15 dark:from-emerald-600/15 dark:via-teal-500/10 dark:to-amber-500/10 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 0.95, 1],
          x: [25, -25, 25],
          y: [15, -15, 15],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-6 right-1/4 w-[22rem] h-[22rem] sm:w-[36rem] sm:h-[36rem] bg-gradient-to-br from-amber-400/15 via-emerald-400/10 to-transparent dark:from-amber-600/10 dark:via-emerald-500/5 dark:to-transparent rounded-full blur-3xl pointer-events-none"
      />
    </div>
  );

};
