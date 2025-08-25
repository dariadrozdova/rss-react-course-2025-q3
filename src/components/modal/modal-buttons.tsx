import { type FC, useState } from "react";

import { ControlledForm } from "@/components/forms/controlled-form/controlled-form";
import { UncontrolledForm } from "@/components/forms/uncontrolled-form/uncontrolled-form";
import { Modal } from "@/components/modal";
import { CatEmoji } from "@/components/twemoji";
import { Button } from "@/components/ui/button";

type ModalType = "uncontrolled" | "controlled" | null;

export const ModalButtons: FC = () => {
  const [modalType, setModalType] = useState<ModalType>(null);

  const handleOpenUncontrolledModal = (): void => {
    setModalType("uncontrolled");
  };

  const handleOpenControlledFormModal = (): void => {
    setModalType("controlled");
  };

  const handleCloseModal = (): void => {
    setModalType(null);
  };

  const isModalOpen = modalType !== null;

  const getModalTitle = (): string => {
    return modalType === "uncontrolled"
      ? "Uncontrolled Form"
      : "Controlled Form";
  };

  const renderModalContent = () => {
    if (modalType === "uncontrolled") {
      return <UncontrolledForm onSuccess={handleCloseModal} />;
    }
    if (modalType === "controlled") {
      return <ControlledForm onSuccess={handleCloseModal} />;
    }
    return null;
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
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={getModalTitle()}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};
