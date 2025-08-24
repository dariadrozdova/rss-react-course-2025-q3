import { ControlledPasswordInput } from "@/components/forms/controlled-form/controlled-password-input/controlled-password-input";
import type { ButtonProps } from "@/components/ui/button";
import type { LabelProps } from "@/components/ui/label";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { InputHTMLAttributes } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick }: ButtonProps) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

vi.mock("@/components/ui/input", () => ({
  Input: (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} data-testid="input" />,
}));

vi.mock("@/components/ui/label", () => ({
  Label: ({ children, htmlFor }: LabelProps) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}));

vi.mock(
  "@/components/forms/controlled-form/controlled-password-input/password-strength-indicator",
  () => ({
    PasswordStrengthIndicator: ({ password }: { password: string }) => (
      <div data-testid="password-strength" data-password={password}>
        Strength Indicator
      </div>
    ),
  }),
);

describe("ControlledPasswordInput", () => {
  const inputId = "password" as const;

  const mockRegister = {
    name: inputId,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  };
  const mockWatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    id: "password" as const,
    label: "Password",
    register: mockRegister,
  };

  it("should render password input with label", () => {
    render(<ControlledPasswordInput {...defaultProps} />);

    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByTestId("input")).toBeInTheDocument();
    expect(screen.getByText("Show")).toBeInTheDocument();
  });

  it("should toggle password visibility", async () => {
    const user = userEvent.setup();
    render(<ControlledPasswordInput {...defaultProps} />);

    const showButton = screen.getByText("Show");
    await user.click(showButton);

    expect(screen.getByText("Hide")).toBeInTheDocument();
  });

  it("should show required indicator when required", () => {
    render(<ControlledPasswordInput {...defaultProps} isRequired={true} />);

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("should show strength indicator when enabled", () => {
    mockWatch.mockReturnValue("password123");

    render(
      <ControlledPasswordInput
        {...defaultProps}
        watch={mockWatch}
        showStrength={true}
      />,
    );

    expect(screen.getByTestId("password-strength")).toBeInTheDocument();
    expect(screen.getByTestId("password-strength")).toHaveAttribute(
      "data-password",
      "password123",
    );
  });

  it("should handle non-string watch value", () => {
    mockWatch.mockReturnValue(null);

    render(
      <ControlledPasswordInput
        {...defaultProps}
        watch={mockWatch}
        showStrength={true}
      />,
    );

    expect(screen.getByTestId("password-strength")).toHaveAttribute(
      "data-password",
      "",
    );
  });

  it("should display error message", () => {
    render(
      <ControlledPasswordInput {...defaultProps} error="Password too weak" />,
    );

    expect(screen.getByText("Password too weak")).toBeInTheDocument();
  });

  it("should pass additional props to input", () => {
    render(
      <ControlledPasswordInput
        {...defaultProps}
        placeholder="Enter password"
        autoComplete="new-password"
      />,
    );

    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("placeholder", "Enter password");
    expect(input).toHaveAttribute("autoComplete", "new-password");
  });
});
