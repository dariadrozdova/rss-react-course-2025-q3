import { type FC, useState } from "react";

import { ControlledForm } from "@/components/forms/controlled-form/controlled-form";
import { UncontrolledForm } from "@/components/forms/uncontrolled-form/uncontrolled-form";
import { Modal } from "@/components/modal";
import { CatEmoji } from "@/components/twemoji";
import { Button } from "@/components/ui/button";

export const ModalButtons: FC = () => {
  const [isUncontrolledModalOpen, setIsUncontrolledModalOpen] = useState(false);
  const [isControlledFormModalOpen, setIsControlledFormModalOpen] =
    useState(false);

  const handleOpenUncontrolledModal = (): void => {
    setIsUncontrolledModalOpen(true);
  };

  const handleCloseUncontrolledModal = (): void => {
    setIsUncontrolledModalOpen(false);
  };

  const handleOpenControlledFormModal = (): void => {
    setIsControlledFormModalOpen(true);
  };

  const handleCloseControlledFormModal = (): void => {
    setIsControlledFormModalOpen(false);
  };

  return (
    <>
      <div className="flex gap-4">
        <Button onClick={handleOpenUncontrolledModal} variant="primary">
          Open Uncontrolled Form <CatEmoji size="sm" variant="happy" />
        </Button>
        <Button onClick={handleOpenControlledFormModal} variant="secondary">
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
        isOpen={isControlledFormModalOpen}
        onClose={handleCloseControlledFormModal}
        title="Controlled Form"
      >
        <ControlledForm onSuccess={handleCloseControlledFormModal} />
      </Modal>
    </>
  );
};
