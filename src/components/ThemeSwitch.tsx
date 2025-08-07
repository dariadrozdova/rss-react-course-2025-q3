import React from 'react';

import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@context/ThemeContext';

const ThemeSwitch: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {isDark ? <Moon size={16} /> : <Sun size={16} />}
      </span>

      <button
        aria-checked={isDark}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-all duration-300 ease-in-out cursor-pointer border-none
          focus:outline-none focus:ring-0
          ${
            isDark
              ? 'bg-blue-600 focus:ring-blue-500'
              : 'bg-gray-300 focus:ring-blue-400'
          }
          ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}
        `}
        onClick={toggleTheme}
        role="switch"
        type="button"
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow-lg
            transition-transform duration-300 ease-in-out
            ${isDark ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

export default ThemeSwitch;
