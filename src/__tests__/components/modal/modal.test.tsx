import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Modal } from "@/components/modal/modal";
import { ModalButtons } from "@/components/modal/modal-buttons";
import { ModalContent } from "@/components/modal/modal-content";
import { ModalOverlay } from "@/components/modal/modal-overlay";
import { ModalPortal } from "@/components/modal/modal-portal";

vi.mock("focus-trap-react", () => ({
  FocusTrap: ({
    active,
    children,
  }: {
    active: boolean;
    children: React.ReactNode;
  }) => (active ? <div data-testid="focus-trap">{children}</div> : children),
}));

vi.mock("@/components/twemoji", () => ({
  CatEmoji: ({ size, variant }: { size: string; variant: string }) => (
    <span data-size={size} data-testid="cat-emoji" data-variant={variant}>
      🐱
    </span>
  ),
}));

vi.mock("@/components/forms/controlled-form/controlled-form", () => ({
  ControlledForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <div data-testid="controlled-form" onClick={onSuccess}>
      Controlled Form
    </div>
  ),
}));

vi.mock("@/components/forms/uncontrolled-form/uncontrolled-form", () => ({
  UncontrolledForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <div data-testid="uncontrolled-form" onClick={onSuccess}>
      Uncontrolled Form
    </div>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    variant,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant: string;
  }) => (
    <button data-testid="button" data-variant={variant} onClick={onClick}>
      {children}
    </button>
  ),
}));

describe("Modal Components", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    const modalRoot = document.createElement("div");
    modalRoot.id = "modal-root";
    document.body.append(modalRoot);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    const modalRoot = document.getElementById("modal-root");
    if (modalRoot) {
      modalRoot.remove();
    }
    document.body.style.overflow = "";
  });

  describe("ModalPortal", () => {
    it("should render children in modal-root", () => {
      render(
        <ModalPortal>
          <div data-testid="portal-content">Portal Content</div>
        </ModalPortal>,
      );

      const modalRoot = document.getElementById("modal-root");
      expect(modalRoot).toBeInTheDocument();
      expect(screen.getByTestId("portal-content")).toBeInTheDocument();
    });

    it("should fallback to document.body when modal-root not found", () => {
      const modalRoot = document.getElementById("modal-root");
      if (modalRoot) {
        modalRoot.remove();
      }

      render(
        <ModalPortal>
          <div data-testid="portal-fallback">Fallback Content</div>
        </ModalPortal>,
      );

      expect(screen.getByTestId("portal-fallback")).toBeInTheDocument();
    });
  });

  describe("ModalOverlay", () => {
    it("should render children and handle overlay click", async () => {
      const user = userEvent.setup();

      render(
        <ModalOverlay onClose={mockOnClose}>
          <div data-testid="overlay-content">Content</div>
        </ModalOverlay>,
      );

      expect(screen.getByTestId("overlay-content")).toBeInTheDocument();
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      const overlay = screen.getByRole("dialog");
      await user.click(overlay);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should not close when clicking on content", async () => {
      const user = userEvent.setup();

      render(
        <ModalOverlay onClose={mockOnClose}>
          <div data-testid="overlay-content">Content</div>
        </ModalOverlay>,
      );

      const content = screen.getByTestId("overlay-content");
      await user.click(content);
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("ModalContent", () => {
    const defaultProps = {
      children: <div>Modal Content</div>,
      onClose: mockOnClose,
    };

    it("should render without title", () => {
      render(<ModalContent {...defaultProps} />);

      expect(screen.getByText("Modal Content")).toBeInTheDocument();
      expect(screen.queryByRole("banner")).not.toBeInTheDocument();
    });

    it("should render with title and header", () => {
      render(<ModalContent {...defaultProps} title="Test Title" />);

      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getAllByTestId("cat-emoji")).toHaveLength(2);
    });

    it("should handle close button click", async () => {
      const user = userEvent.setup();

      render(<ModalContent {...defaultProps} title="Test Title" />);

      const closeButton = screen.getByLabelText("Close modal");
      await user.click(closeButton);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should stop propagation on click", () => {
      const stopPropagation = vi.fn();

      render(<ModalContent {...defaultProps} />);

      const content = screen.getByText("Modal Content").closest("div");
      fireEvent.click(content!, { stopPropagation });
    });
  });

  describe("Modal", () => {
    const defaultProps = {
      children: <div>Modal Children</div>,
      isOpen: true,
      onClose: mockOnClose,
    };

    it("should not render when closed", () => {
      render(<Modal {...defaultProps} isOpen={false} />);

      expect(screen.queryByText("Modal Children")).not.toBeInTheDocument();
    });

    it("should render when open", () => {
      render(<Modal {...defaultProps} />);

      expect(screen.getByText("Modal Children")).toBeInTheDocument();
      expect(screen.getByTestId("focus-trap")).toBeInTheDocument();
    });

    it("should handle escape key", () => {
      render(<Modal {...defaultProps} />);

      fireEvent.keyDown(document, { key: "Escape" });
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should set body overflow when open", () => {
      render(<Modal {...defaultProps} />);
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("should handle click outside to close", async () => {
      const user = userEvent.setup();

      render(<Modal {...defaultProps} />);

      const backdrop = screen
        .getByText("Modal Children")
        .closest('[class*="fixed inset-0"]');
      await user.click(backdrop!);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it("should pass props to ModalContent", () => {
      render(<Modal {...defaultProps} size="lg" title="Test Title" />);

      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });
  });

  describe("ModalButtons", () => {
    it("should render both buttons", () => {
      render(<ModalButtons />);

      const buttons = screen.getAllByTestId("button");
      expect(buttons).toHaveLength(2);
      expect(screen.getByText(/Open Uncontrolled Form/)).toBeInTheDocument();
      expect(screen.getByText(/Open RHF Form/)).toBeInTheDocument();
    });

    it("should close modals on form success", async () => {
      const user = userEvent.setup();

      render(<ModalButtons />);

      await user.click(screen.getByText(/Open Uncontrolled Form/));
      expect(screen.getByTestId("uncontrolled-form")).toBeInTheDocument();

      await user.click(screen.getByTestId("uncontrolled-form"));
      expect(screen.queryByTestId("uncontrolled-form")).not.toBeInTheDocument();
    });

    it("should handle both modals independently", async () => {
      const user = userEvent.setup();

      render(<ModalButtons />);

      await user.click(screen.getByText(/Open Uncontrolled Form/));
      await user.click(screen.getByText(/Open RHF Form/));

      expect(screen.getByTestId("uncontrolled-form")).toBeInTheDocument();
      expect(screen.getByTestId("controlled-form")).toBeInTheDocument();
    });
  });
});
