import { type FC, type RefObject } from "react";

import { classNames } from "@/utils/class-names";

export interface ColumnType {
  key: string;
  label: string;
  required: boolean;
}

interface ColumnSelectorModalContentProps {
  availableColumns: ColumnType[];
  modalReference: RefObject<HTMLDivElement>;
  onClose: () => void;
  onToggleColumn: (key: string) => void;
  selectedColumns: string[];
}

export const ColumnSelectorModalContent: FC<
  ColumnSelectorModalContentProps
// eslint-disable-next-line max-lines-per-function
> = ({
  availableColumns,
  modalReference,
  onClose,
  onToggleColumn,
  selectedColumns,
}) => {
  const overlayClasses = classNames(
    "fixed inset-0 z-50 flex items-center justify-center",
    "bg-black/70 backdrop-blur-sm",
    "animate-in fade-in duration-300",
  );

  const modalClasses = classNames(
    "bg-dark-900/95 backdrop-blur-lg rounded-xl",
    "border border-glow-neon shadow-2xl shadow-neon-500/20",
    "w-full max-w-2xl max-h-[80vh] overflow-hidden",
    "mx-4 animate-in zoom-in-95 duration-300",
  );

  const headerClasses = classNames(
    "px-6 py-4 border-b border-glow-neon/30",
    "bg-gradient-to-r from-neon-600/20 to-electric-600/20",
  );

  const bodyClasses = classNames(
    "p-6 overflow-y-auto max-h-[60vh]",
    "scrollbar-thin scrollbar-track-dark-800 scrollbar-thumb-neon-600",
  );

  const gridClasses = classNames("grid grid-cols-1 md:grid-cols-2 gap-3");

  const checkboxItemClasses = classNames(
    "flex items-center gap-3 p-3 rounded-lg",
    "bg-dark-800/30 border border-slate-700/50",
    "hover:bg-dark-700/50 hover:border-neon-500/50",
    "transition-all duration-200 cursor-pointer",
  );

  const footerClasses = classNames(
    "px-6 py-4 border-t border-glow-neon/30",
    "bg-gradient-to-r from-dark-800/50 to-dark-900/50",
    "flex justify-end gap-3",
  );

  const buttonClasses = classNames(
    "px-4 py-2 rounded-md text-sm font-medium",
    "transition-all duration-200 cursor-pointer",
  );

  const closeButtonClasses = classNames(
    buttonClasses,
    "bg-neon-600/30 hover:bg-neon-600/50",
    "border border-neon-500 text-neon-300",
    "hover:text-neon-200",
  );

  return (
    <div className={overlayClasses}>
      <div className={modalClasses} ref={modalReference}>
        <div className={headerClasses}>
          <h2 className="text-neon-300 text-xl font-semibold">
            Select Additional Columns
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Choose which data fields to display in the table
          </p>
        </div>

        <div className={bodyClasses}>
          <div className={gridClasses}>
            {availableColumns.map((column) => {
              const isSelected = selectedColumns.includes(column.key);
              const isRequired = column.required;

              const itemClasses = classNames(
                checkboxItemClasses,
                isSelected && "border-neon-500/70 bg-neon-600/10",
                isRequired && "opacity-50 cursor-not-allowed",
              );

              return (
                <div
                  className={itemClasses}
                  key={column.key}
                  onClick={() => {
                    if (!isRequired) {
                      onToggleColumn(column.key);
                    }
                  }}
                >
                  <input
                    checked={isSelected}
                    className={classNames(
                      "h-4 w-4 rounded border-2",
                      "bg-dark-700 border-slate-600",
                      "checked:bg-neon-600 checked:border-neon-500",
                      "focus:ring-neon-500/50 focus:ring-2",
                      "transition-all duration-200",
                      isRequired && "cursor-not-allowed",
                    )}
                    disabled={isRequired}
                    onChange={() => {
                      if (!isRequired) {
                        onToggleColumn(column.key);
                      }
                    }}
                    type="checkbox"
                  />
                  <div className="flex-1">
                    <div
                      className={classNames(
                        "font-medium",
                        isSelected ? "text-neon-300" : "text-slate-300",
                      )}
                    >
                      {column.label}
                      {isRequired && (
                        <span className="ml-1 text-xs text-slate-500">
                          (Required)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={footerClasses}>
          <button className={closeButtonClasses} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
