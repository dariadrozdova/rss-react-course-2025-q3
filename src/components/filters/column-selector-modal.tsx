import { type FC } from "react";

import { ColumnSelectorModalContent } from "@/components/filters";
import { useColumnSelectorModal } from "@/hooks/use-column-selector-modal";
import { AVAILABLE_COLUMNS } from "@/utils/constants";

interface ColumnSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ColumnSelectorModal: FC<ColumnSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { modalReference, state, toggleColumn } = useColumnSelectorModal({
    isOpen,
    onClose,
  });

  if (!isOpen) {
    return null;
  }

  return (
    <ColumnSelectorModalContent
      availableColumns={AVAILABLE_COLUMNS}
      modalReference={modalReference}
      onClose={onClose}
      onToggleColumn={toggleColumn}
      selectedColumns={state.selectedColumns}
    />
  );
};
