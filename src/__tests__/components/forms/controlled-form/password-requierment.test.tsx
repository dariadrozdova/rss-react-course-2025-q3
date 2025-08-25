import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PasswordRequirement } from "@/components/forms/controlled-form/controlled-password-input/password-requirement";
import { PasswordStrengthIndicator } from "@/components/forms/controlled-form/controlled-password-input/password-strength-indicator";

vi.mock("@/utils/password-strength", () => ({
  calculatePasswordStrength: vi.fn((password: string) => {
    if (password === "weak") {
      return {
        checks: {
          hasLowercase: true,
          hasMinLength: false,
          hasNumber: false,
          hasSpecial: false,
          hasUppercase: false,
        },
        percentage: 25,
        strength: "weak" as const,
      };
    }
    if (password === "medium") {
      return {
        checks: {
          hasLowercase: true,
          hasMinLength: true,
          hasNumber: false,
          hasSpecial: false,
          hasUppercase: true,
        },
        percentage: 60,
        strength: "medium" as const,
      };
    }
    if (password === "strong") {
      return {
        checks: {
          hasLowercase: true,
          hasMinLength: true,
          hasNumber: true,
          hasSpecial: true,
          hasUppercase: true,
        },
        percentage: 100,
        strength: "strong" as const,
      };
    }
    return null;
  }),
}));

describe("PasswordRequirement", () => {
  it("should render requirement text", () => {
    render(<PasswordRequirement met={false} text="At least 8 characters" />);

    expect(screen.getByText("At least 8 characters")).toBeInTheDocument();
  });
});

describe("PasswordStrengthIndicator", () => {
  it("should render empty state with no password", () => {
    render(<PasswordStrengthIndicator password="" />);

    expect(screen.getByText("Password strength:")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("should render weak password strength", () => {
    render(<PasswordStrengthIndicator password="weak" />);

    expect(screen.getByText("weak")).toBeInTheDocument();
    expect(screen.getByText("Password strength:")).toBeInTheDocument();
  });

  it("should render medium password strength", () => {
    render(<PasswordStrengthIndicator password="medium" />);

    expect(screen.getByText("medium")).toBeInTheDocument();
  });

  it("should render strong password strength", () => {
    render(<PasswordStrengthIndicator password="strong" />);

    expect(screen.getByText("strong")).toBeInTheDocument();
  });

  it("should show correct requirement states for weak password", () => {
    render(<PasswordStrengthIndicator password="weak" />);

    expect(screen.getAllByText("✓")).toHaveLength(1);
    expect(screen.getAllByText("○")).toHaveLength(4);
  });

  it("should show correct requirement states for strong password", () => {
    render(<PasswordStrengthIndicator password="strong" />);

    expect(screen.getAllByText("✓")).toHaveLength(5);
    expect(screen.queryByText("○")).not.toBeInTheDocument();
  });

  it("should show met requirement with checkmark", () => {
    render(<PasswordRequirement met text="At least 8 characters" />);

    expect(screen.getByText("✓")).toBeInTheDocument();
    expect(screen.getByText("At least 8 characters")).toBeInTheDocument();
  });

  it("should show unmet requirement with circle", () => {
    render(<PasswordRequirement met={false} text="At least 8 characters" />);

    expect(screen.getByText("○")).toBeInTheDocument();
    expect(screen.getByText("At least 8 characters")).toBeInTheDocument();
  });
});
