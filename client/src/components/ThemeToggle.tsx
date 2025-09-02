import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
<button
  onClick={toggleTheme}
  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 ring-offset-2 ring-primary-500 ring-offset-theme-surface ${
    theme === 'dark'
      ? 'bg-tactical-surface hover:bg-neutral-800 text-tactical-text-secondary hover:text-tactical-text-primary'
      : 'bg-tactical-light-surface hover:bg-slate-100 text-tactical-light-text-secondary hover:text-tactical-light-text-primary'
  } border border-theme-primary ${className}`}
  type="button"
  aria-pressed={theme === 'dark'}
  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
>
  {/* …icon or label… */}
</button>
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <FontAwesomeIcon 
        icon={theme === 'dark' ? faSun : faMoon} 
        className="text-sm transition-transform hover:scale-110" 
      />
    </button>
  );
}