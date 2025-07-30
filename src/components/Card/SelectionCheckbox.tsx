interface SelectionCheckboxProps {
  isItemSelected: boolean;
  onCheckboxChange: () => void;
}

function SelectionCheckbox({
  isItemSelected,
  onCheckboxChange,
}: SelectionCheckboxProps) {
  return (
    <div
      className="mt-auto pt-3 flex items-center justify-center"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <label className="flex items-center cursor-pointer select-none">
        <input
          checked={isItemSelected}
          className="sr-only"
          onChange={onCheckboxChange}
          type="checkbox"
        />
        <div
          className={`
            w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
            ${isItemSelected ? 'bg-teal-500 border-teal-500' : 'border-theme hover:border-teal-400'}
          `}
        >
          {isItemSelected && (
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                fillRule="evenodd"
              />
            </svg>
          )}
        </div>
        <span
          className={`ml-2 text-sm transition-colors ${
            isItemSelected
              ? 'text-teal-600 font-medium'
              : 'text-theme-secondary'
          }`}
        >
          Select
        </span>
      </label>
    </div>
  );
}

export default SelectionCheckbox;
