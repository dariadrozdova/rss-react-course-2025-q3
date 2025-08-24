import { ControlledFileInput } from "@/components/forms/controlled-form/controlled-file-input";
import type { ButtonProps } from "@/components/ui/button";
import type { LabelProps } from "@/components/ui/label";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick }: ButtonProps) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

vi.mock("@/components/ui/label", () => ({
  Label: ({ children, htmlFor }: LabelProps) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}));

describe("ControlledFileInput", () => {
  const mockSetValue = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    HTMLInputElement.prototype.click = vi.fn();
  });

  const defaultProps = {
    id: "picture" as const,
    label: "Upload Picture",
    setValue: mockSetValue,
  };

  it("should render file input with label", () => {
    render(<ControlledFileInput {...defaultProps} />);

    expect(screen.getByText("Upload Picture")).toBeInTheDocument();
    expect(screen.getByText("Choose File")).toBeInTheDocument();
    expect(screen.getByText("No file chosen")).toBeInTheDocument();
  });

  it("should show required indicator when required", () => {
    render(<ControlledFileInput {...defaultProps} isRequired={true} />);

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("should trigger file input click when button clicked", async () => {
    const user = userEvent.setup();
    render(<ControlledFileInput {...defaultProps} />);

    const chooseButton = screen.getByText("Choose File");
    await user.click(chooseButton);

    expect(HTMLInputElement.prototype.click).toHaveBeenCalled();
  });

  it("should handle string error", () => {
    render(<ControlledFileInput {...defaultProps} error="File required" />);

    expect(screen.getByText("File required")).toBeInTheDocument();
  });

  it("should handle FieldError object", () => {
    const fieldError = { message: "Invalid file type", type: "validate" };
    render(<ControlledFileInput {...defaultProps} error={fieldError} />);

    expect(screen.getByText("Invalid file type")).toBeInTheDocument();
  });
});
