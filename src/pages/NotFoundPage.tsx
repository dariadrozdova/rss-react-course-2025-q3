import { NavLink } from 'react-router-dom';

import {
  BUTTON_BASE_CLASSES,
  BUTTON_COLOR_GREEN,
} from '@utils/stylesConstants';

function NotFoundPage() {
  const navLinkClasses = `${BUTTON_BASE_CLASSES} ${BUTTON_COLOR_GREEN}`;

  return (
    <div
      className="
        max-w-7xl w-full mx-auto p-4 md:p-8 box-border text-center
        flex flex-col items-center min-h-screen justify-center
      "
    >
      <div
        className="
          bg-white p-8 mb-8 rounded-xl shadow-[var(--color-black-alpha-10)]
          text-center flex flex-col items-center justify-center
          w-full max-w-4xl mx-auto box-border
          md:p-10 lg:p-12
          text-[var(--color-text-light-blue-gray)] font-['Inter']
        "
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-8xl font-bold text-[var(--color-text-dark-blue-gray)]">
            4
          </span>
          <img
            alt="Poké Ball"
            className="w-20 h-20"
            src="/icons/pokeball.png"
          />
          <span className="text-8xl font-bold text-[var(--color-text-dark-blue-gray)]">
            4
          </span>
        </div>

        <p className="text-xl text-[var(--color-text-light-blue-gray)] mb-2">
          Looks like this page doesn't exist!
        </p>
        <p className="text-lg text-[var(--color-text-light-blue-gray)] mb-8">
          Go back to home and continue exploring.
        </p>

        <NavLink className={navLinkClasses} to="/">
          Return to Main Page
        </NavLink>
      </div>
    </div>
  );
}

export default NotFoundPage;
