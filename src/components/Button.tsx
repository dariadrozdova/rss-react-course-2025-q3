import React from 'react';

import {
  BUTTON_BASE_CLASSES,
  BUTTON_COLOR_GREEN,
  BUTTON_COLOR_RED,
} from '@utils/stylesConstants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'green' | 'red';
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  color = 'green',
  ...rest
}) => {
  let colorClasses = '';
  switch (color) {
    case 'red': {
      colorClasses = BUTTON_COLOR_RED;
      break;
    }
    default: {
      colorClasses = BUTTON_COLOR_GREEN;
      break;
    }
  }

  return (
    <button
      className={`${BUTTON_BASE_CLASSES} ${colorClasses} ${className || ''}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
