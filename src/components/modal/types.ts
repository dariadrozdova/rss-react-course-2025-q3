export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: "lg" | "md" | "sm" | "xl";
  title?: string;
}
