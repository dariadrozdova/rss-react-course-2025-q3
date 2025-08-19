import type { FC } from "react";
import { useEffect } from "react";

import { FocusTrap } from "focus-trap-react";

import { ModalContent } from "@/components/modal/modal-content";
import { ModalOverlay } from "@/components/modal/modal-overlay";
import { ModalPortal } from "@/components/modal/modal-portal";
import type { ModalProps } from "@/components/modal/types";

export const Modal: FC<ModalProps> = ({
  children,
  isOpen,
  onClose,
  size = "md",
  title,
}) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return (): void => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalPortal>
      <FocusTrap
        active={isOpen}
        focusTrapOptions={{
          allowOutsideClick: true,
          clickOutsideDeactivates: true,
          fallbackFocus: "body",
          initialFocus: false,
          onDeactivate: onClose,
        }}
      >
        <ModalOverlay onClose={onClose}>
          <ModalContent onClose={onClose} size={size} title={title}>
            {children}
          </ModalContent>
        </ModalOverlay>
      </FocusTrap>
    </ModalPortal>
  );
};
