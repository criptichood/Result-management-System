import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './button';

interface ThemeToggleProps {
  className?: string;
  variant?: 'outline' | 'ghost' | 'default';
  showLabel?: boolean;
}

export const ThemeToggle = ({ className = '', variant = 'ghost', showLabel = false }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={showLabel ? 'sm' : 'icon'}
      onClick={toggleTheme}
      className={`relative rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/70 dark:hover:bg-slate-800 transition-colors ${className}`}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 transition-transform hover:-rotate-12" />
      )}
      {showLabel && (
        <span className="ml-2 font-medium text-xs">
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </Button>
  );
};
