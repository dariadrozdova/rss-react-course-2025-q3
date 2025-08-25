import type { FC, ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps {
  children: ReactNode;
}

export const ModalPortal: FC<ModalPortalProps> = ({ children }) => {
  const portalRoot = document.getElementById("modal-root") ?? document.body;

  return createPortal(children, portalRoot);
};
