import React from 'react';
import { Provider } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';

import ErrorBoundary from '@components/ErrorBoundary';
import ThemeSwitch from '@components/ThemeSwitch';
import { useSelectedItemsStorage } from '@hooks/useSelectedItemsStorage';

import { ThemeProvider } from './context/ThemeContext';
import { store } from './store';

import './index.css';

const AppContent: React.FC = () => {
  useSelectedItemsStorage();

  return (
    <div
      className="
        max-w-7xl w-full mx-auto p-4 md:p-8 box-border text-center
        flex flex-col items-center
      "
    >
      <nav
        className="
          py-3.5 rounded-lg shadow-sm mb-8 w-full
          max-w-[1400px] border box-border
          md:rounded-xl md:shadow-lg
          bg-theme-secondary border-theme
        "
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
                text-theme-primary hover:bg-theme-primary/20 hover:text-teal-500
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
                text-theme-primary hover:bg-theme-primary/20 hover:text-teal-500
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
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
