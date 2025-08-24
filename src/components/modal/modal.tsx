import type { FC } from "react";
import { useEffect, useRef } from "react";

import { FocusTrap } from "focus-trap-react";

import { ModalContent } from "@/components/modal/modal-content";
import { ModalOverlay } from "@/components/modal/modal-overlay";
import { ModalPortal } from "@/components/modal/modal-portal";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: "lg" | "md" | "sm" | "xl";
  title?: string;
}

export const Modal: FC<ModalProps> = ({
  children,
  isOpen,
  onClose,
  size = "md",
  title,
}) => {
  const modalReference = useRef<HTMLDivElement | null>(null);

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
      <ModalOverlay onClose={onClose}>
        <FocusTrap
          active={isOpen}
          focusTrapOptions={{
            escapeDeactivates: true,
            initialFocus: () =>
              document.querySelector<HTMLInputElement>("form input"),
          }}
        >
          <div
            className="fixed inset-0 flex items-center justify-center"
            onClick={(error) => {
              if (error.target === error.currentTarget) {
                onClose();
              }
            }}
            ref={modalReference}
          >
            <ModalContent onClose={onClose} size={size} title={title}>
              {children}
            </ModalContent>
          </div>
        </FocusTrap>
      </ModalOverlay>
    </ModalPortal>
  );
};
