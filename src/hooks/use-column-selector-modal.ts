import { useEffect, useRef } from "react";

import { useTableState } from "@/contexts/table-context";
import type { TableState } from "@/reducers/table-reducer";

interface UseColumnSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useColumnSelectorModal = ({
  isOpen,
  onClose,
}: UseColumnSelectorModalProps): {
  modalReference: React.RefObject<HTMLDivElement | null>;
  state: TableState;
  toggleColumn: (column: string) => void;
} => {
  const { state, toggleColumn } = useTableState();
  const modalReference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return (): void => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        modalReference.current &&
        !modalReference.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return (): void => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return {
    modalReference,
    state,
    toggleColumn,
  };
};
