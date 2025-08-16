import React from 'react';

import { cn } from '@/utils/classNames';
import { BUTTON_COLOR_GREEN, BUTTON_COLOR_RED } from '@/utils/stylesConstants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'green' | 'red';
  size?: 'default' | 'small';
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  color = 'green',
  size = 'default',
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

  const sizeClasses =
    size === 'small' ? 'px-4 py-2 text-sm' : 'px-8 py-3 text-lg';

  const baseClasses = `
    inline-block font-semibold rounded-lg shadow-md
    transition-colors duration-200 ease-in-out tracking-wide
    active:translate-y-0 active:shadow-xs active:shadow-black/10
    cursor-pointer border-none text-white
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:pointer-events-none
    disabled:shadow-none
  `;

  return (
    <button
      className={cn(baseClasses, sizeClasses, colorClasses, className)}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
