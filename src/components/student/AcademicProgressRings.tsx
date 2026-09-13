import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Award, BookCheck, TrendingUp } from 'lucide-react';

interface AcademicProgressRingsProps {
  totalEarnedCredits: number;
  maxRequiredCredits?: number; // e.g. 120 units for standard degree
  cumulativeCgpa: number;
  publishedCount: number;
  totalRegisteredCount: number;
}

export const AcademicProgressRings: React.FC<AcademicProgressRingsProps> = ({
  totalEarnedCredits,
  maxRequiredCredits = 120,
  cumulativeCgpa,
  publishedCount,
  totalRegisteredCount,
}) => {
  const creditPercent = Math.min(100, Math.round((totalEarnedCredits / maxRequiredCredits) * 100));
  const cgpaPercent = Math.min(100, Math.round((cumulativeCgpa / 5.0) * 100));
  const completionPercent = totalRegisteredCount > 0 ? Math.min(100, Math.round((publishedCount / totalRegisteredCount) * 100)) : 0;

  const renderRing = (percentage: number, label: string, sublabel: string, color: string, Icon: any) => {
    const size = 84;
    const strokeWidth = 7;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

    return (
      <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-transform hover:scale-[1.01]">
        <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-100 dark:text-slate-800"
              fill="transparent"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-extrabold text-slate-900 dark:text-white">{Math.round(percentage)}%</span>
          </div>
        </div>
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider truncate">{label}</span>
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{sublabel}</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {renderRing(
        creditPercent, 
        'Credit Unit Accumulation', 
        `${totalEarnedCredits} / ${maxRequiredCredits} Units Earned`, 
        '#059669', 
        Award
      )}
      {renderRing(
        cgpaPercent, 
        'CGPA Performance Index', 
        `${cumulativeCgpa.toFixed(2)} CGPA (5.00 Max)`, 
        '#0284c7', 
        TrendingUp
      )}
      {renderRing(
        completionPercent, 
        'Course Result Processing', 
        `${publishedCount} Published / ${totalRegisteredCount} Enrolled`, 
        '#0d9488', 
        BookCheck
      )}
    </div>
  );
};
