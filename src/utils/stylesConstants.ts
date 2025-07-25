export const BUTTON_BASE_CLASSES = `
  inline-block px-8 py-3 font-semibold rounded-lg shadow-md
  transition-colors duration-200 ease-in-out tracking-wide text-lg
  active:translate-y-0 active:shadow-xs active:shadow-black/10
  cursor-pointer border-none text-white

  disabled:opacity-50
  disabled:cursor-not-allowed
  disabled:pointer-events-none
  disabled:shadow-none
`;

export const BUTTON_COLOR_GREEN = `
  bg-primary-green hover:bg-primary-green-hover
  disabled:hover:bg-primary-green
`;

export const BUTTON_COLOR_RED = `
  bg-primary-red hover:bg-primary-red-hover
  disabled:hover:bg-primary-red
`;
