import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import ErrorBoundary from '@components/ErrorBoundary';
import ThemeSwitch from '@components/ThemeSwitch';

import { ThemeProvider, useTheme } from './context/ThemeContext';

import './index.css';

const AppContent: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div
      className="
        max-w-7xl w-full mx-auto p-4 md:p-8 box-border text-center
        flex flex-col items-center
      "
    >
      <nav
        className={`
          py-3.5 rounded-lg shadow-sm mb-8 w-full
          max-w-[1400px] border box-border
          md:rounded-xl md:shadow-lg
          ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-blue-200'}
        `}
      >
        <div className="flex justify-end px-4 pb-2">
          <ThemeSwitch />
        </div>

        <ul
          className="
            list-none p-0 m-0 flex justify-center flex-wrap
            flex-col gap-4
            sm:gap-2
            md:flex-row md:gap-10
          "
        >
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                `
                block no-underline font-semibold rounded-lg
                transition-colors duration-300
                px-6 py-3 text-center
                sm:text-base
                md:px-4 md:py-2 md:text-lg
                ${
                  isDark
                    ? 'text-gray-200 hover:bg-gray-700 hover:text-teal-400'
                    : 'text-gray-800 hover:bg-blue-100 hover:text-teal-700'
                }
                ${
                  isActive
                    ? 'bg-green-600 text-white font-bold shadow-md shadow-green-600/40'
                    : ''
                }
              `
              }
              to="/"
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                `
                block no-underline font-semibold rounded-lg
                transition-colors duration-300
                px-6 py-3 text-center
                sm:text-base
                md:px-4 md:py-2 md:text-lg
                ${
                  isDark
                    ? 'text-gray-200 hover:bg-gray-700 hover:text-teal-400'
                    : 'text-gray-800 hover:bg-blue-100 hover:text-teal-700'
                }
                ${
                  isActive
                    ? 'bg-green-600 text-white font-bold shadow-md shadow-green-600/40'
                    : ''
                }
              `
              }
              to="/about"
            >
              About
            </NavLink>
          </li>
        </ul>
      </nav>

      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
