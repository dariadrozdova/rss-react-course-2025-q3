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
        theme-card p-6 rounded-lg shadow-md
        text-center flex flex-col items-center justify-center
        w-full box-border font-['Inter']
        min-h-[1016px]
      "
    >
      <div className="max-w-4xl w-full">
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-8xl font-bold text-theme-primary">4</span>
          <img
            alt="Poké Ball"
            className="w-20 h-20"
            src="/icons/pokeball.png"
          />
          <span className="text-8xl font-bold text-theme-primary">4</span>
        </div>

        <p className="text-xl mb-2 text-theme-secondary">
          Looks like this page doesn't exist!
        </p>
        <p className="text-lg mb-8 text-theme-secondary">
          Go back to the homepage and continue exploring.
        </p>

        <NavLink className={navLinkClasses} to="/">
          Back to Homepage
        </NavLink>
      </div>
    </div>
  );
}

export default NotFoundPage;
