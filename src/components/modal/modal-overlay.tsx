import { type FC, type MouseEvent } from "react";

import { classNames } from "@/lib/class-names";

interface ModalOverlayProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const ModalOverlay: FC<ModalOverlayProps> = ({ children, onClose }) => {
  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      aria-modal="true"
      className={classNames(
        "fixed inset-0 z-50",
        "flex items-center justify-center",
        "bg-black/50 backdrop-blur-sm",
        "p-4",
        "animate-in fade-in duration-200",
      )}
      onClick={handleOverlayClick}
      role="dialog"
    >
      {children}
    </div>
  );
};
