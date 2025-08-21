import { type FC, useState } from "react";

import { UncontrolledForm } from "@/components/forms/uncontrolled-form";
import { Modal } from "@/components/modal";
import { CatEmoji } from "@/components/twemoji";
import { Button } from "@/components/ui/button";

export const ModalButtons: FC = () => {
  const [isUncontrolledModalOpen, setIsUncontrolledModalOpen] = useState(false);
  const [isRHFModalOpen, setIsRHFModalOpen] = useState(false);

  const handleOpenUncontrolledModal = (): void => {
    setIsUncontrolledModalOpen(true);
  };

  const handleCloseUncontrolledModal = (): void => {
    setIsUncontrolledModalOpen(false);
  };

  const handleOpenRHFModal = (): void => {
    setIsRHFModalOpen(true);
  };

  const handleCloseRHFModal = (): void => {
    setIsRHFModalOpen(false);
  };

  return (
    <>
      <div className="flex gap-4">
        <Button onClick={handleOpenUncontrolledModal} variant="primary">
          Open Uncontrolled Form <CatEmoji size="sm" variant="happy" />
        </Button>
        <Button onClick={handleOpenRHFModal} variant="secondary">
          Open RHF Form <CatEmoji size="sm" variant="paw" />
        </Button>
      </div>

      <Modal
        isOpen={isUncontrolledModalOpen}
        onClose={handleCloseUncontrolledModal}
        title="Uncontrolled Form"
      >
        <UncontrolledForm onSuccess={handleCloseUncontrolledModal} />
      </Modal>

      <Modal
        isOpen={isRHFModalOpen}
        onClose={handleCloseRHFModal}
        title="React Hook Form"
      >
        <p>Form will be here</p>
      </Modal>
    </>
  );
};
