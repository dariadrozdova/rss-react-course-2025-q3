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
        bg-white p-6 rounded-lg shadow-md
        text-center flex flex-col items-center justify-center
        w-full box-border font-['Inter'] text-gray-700
        min-h-[1016px]
      "
    >
      <div className="max-w-4xl w-full">
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-8xl font-bold text-gray-800">4</span>
          <img
            alt="Poké Ball"
            className="w-20 h-20"
            src="/icons/pokeball.png"
          />
          <span className="text-8xl font-bold text-gray-800">4</span>
        </div>

        <p className="text-xl text-gray-600 mb-2">
          Looks like this page doesn't exist!
        </p>
        <p className="text-lg text-gray-600 mb-8">
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
