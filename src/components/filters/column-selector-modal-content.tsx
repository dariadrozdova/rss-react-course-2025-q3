import { type FC, type RefObject } from "react";

import { classNames } from "@/utils/class-names";

export interface ColumnType {
  key: string;
  label: string;
  required?: boolean;
}

interface ColumnSelectorModalContentProps {
  availableColumns: readonly ColumnType[];
  modalReference: RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onToggleColumn: (key: string) => void;
  selectedColumns: string[];
}

const STYLES = {
  body: classNames(
    "p-6 overflow-y-auto max-h-[60vh]",
    "scrollbar-thin scrollbar-track-dark-800 scrollbar-thumb-neon-600",
  ),
  button: classNames(
    "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
    "cursor-pointer bg-neon-600/30 hover:bg-neon-600/50 border border-neon-500",
    "text-neon-300 hover:text-neon-200",
  ),
  checkbox: classNames(
    "h-4 w-4 rounded border-2 bg-dark-700 border-slate-600",
    "accent-neon-500 focus:ring-neon-500/50 focus:ring-2",
    "transition-all duration-200",
  ),
  checkboxItem: classNames(
    "flex items-center gap-3 p-3 rounded-lg bg-dark-800/30",
    "border border-slate-700/50 hover:bg-dark-700/50 hover:border-neon-500/50",
    "transition-all duration-200 cursor-pointer",
  ),
  footer: classNames(
    "px-6 py-4 border-t border-glow-neon/30",
    "bg-gradient-to-r from-dark-800/50 to-dark-900/50 flex justify-end gap-3",
  ),
  grid: classNames("grid grid-cols-1 md:grid-cols-2 gap-3"),
  header: classNames(
    "px-6 py-4 border-b border-glow-neon/30",
    "bg-gradient-to-r from-neon-600/20 to-electric-600/20",
  ),
  modal: classNames(
    "bg-dark-900/95 backdrop-blur-lg rounded-xl border border-glow-neon",
    "shadow-2xl shadow-neon-500/20 w-full max-w-2xl max-h-[80vh]",
    "overflow-hidden mx-4 animate-in zoom-in-95 duration-300",
  ),
  overlay: classNames(
    "fixed inset-0 z-50 flex items-center justify-center",
    "bg-black/70 backdrop-blur-sm animate-in fade-in duration-300",
  ),
};

export const ColumnSelectorModalContent: FC<
  ColumnSelectorModalContentProps
> = ({
  availableColumns,
  modalReference,
  onClose,
  onToggleColumn,
  selectedColumns,
}) => {
  const handleToggle = (key: string, required?: boolean): void => {
    if (!required) {
      onToggleColumn(key);
    }
  };

  return (
    <div className={STYLES.overlay}>
      <div className={STYLES.modal} ref={modalReference}>
        <div className={STYLES.header}>
          <h2 className="text-neon-300 text-xl font-semibold">
            Select Additional Columns
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Choose which data fields to display in the table
          </p>
        </div>

        <div className={STYLES.body}>
          <div className={STYLES.grid}>
            {availableColumns.map((column) => {
              const isSelected = selectedColumns.includes(column.key);
              const isRequired = column.required;

              const itemClasses = classNames(
                STYLES.checkboxItem,
                isSelected && "border-neon-500/70 bg-neon-600/10",
                isRequired && "opacity-50 cursor-not-allowed",
              );

              return (
                <div
                  className={itemClasses}
                  key={column.key}
                  onClick={() => {
                    handleToggle(column.key, isRequired);
                  }}
                >
                  <input
                    checked={isSelected}
                    className={classNames(
                      STYLES.checkbox,
                      isRequired && "cursor-not-allowed",
                    )}
                    disabled={isRequired}
                    onChange={() => {
                      handleToggle(column.key, isRequired);
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

        <div className={STYLES.footer}>
          <button className={STYLES.button} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
