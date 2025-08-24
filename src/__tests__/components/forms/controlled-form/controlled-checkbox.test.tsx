import { ControlledCheckbox } from "@/components/forms/controlled-form/controlled-checkbox";
import type { LabelProps } from "@/components/ui/label";
import { render, screen } from "@testing-library/react";
import type { InputHTMLAttributes } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/input", () => ({
  Input: (props: InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} data-testid="input" />
  ),
}));

vi.mock("@/components/ui/label", () => ({
  Label: ({ children, htmlFor }: LabelProps) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}));

describe("ControlledCheckbox", () => {
  const checkboxId = "acceptTerms" as const;

  const mockRegister = {
    name: checkboxId,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    id: "acceptTerms" as const,
    label: "Accept Terms",
    register: mockRegister,
  };

  it("should render checkbox with label", () => {
    render(<ControlledCheckbox {...defaultProps} />);

    expect(screen.getByLabelText("Accept Terms")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("should show required indicator when required", () => {
    render(<ControlledCheckbox {...defaultProps} isRequired={true} />);

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("should display error message", () => {
    render(
      <ControlledCheckbox {...defaultProps} error="This field is required" />,
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("should hide error when no error provided", () => {
    render(<ControlledCheckbox {...defaultProps} />);

    const errorElement = screen.getByText("", { selector: "p" });
    expect(errorElement).toHaveClass("opacity-0");
  });

  it("should apply register props to input", () => {
    render(<ControlledCheckbox {...defaultProps} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("name", "acceptTerms");
  });
});
