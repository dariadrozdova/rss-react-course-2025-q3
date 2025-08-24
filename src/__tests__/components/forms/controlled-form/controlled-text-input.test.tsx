import { render, screen } from "@testing-library/react";
import type { UseFormRegisterReturn, UseFormWatch } from "react-hook-form";
import { describe, expect, it, vi, type Mock } from "vitest";

import { ControlledTextInput } from "@/components/forms/controlled-form/controlled-text-input";
import type { FormInput } from "@/utils/form-schema";

const createMockRegister = <T extends keyof FormInput>(
  name: T,
): UseFormRegisterReturn<T> => ({
  name,
  onBlur: vi.fn() as Mock,
  onChange: vi.fn() as Mock,
  ref: vi.fn() as Mock,
});

describe("ControlledTextInput", () => {
  it("should display error message when provided", () => {
    const mockRegister = createMockRegister("name");
    render(
      <ControlledTextInput
        label="Full Name"
        id="name"
        register={mockRegister}
        error="Name is required"
      />,
    );

    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("should show required indicator when isRequired is true", () => {
    const mockRegister = createMockRegister("name");
    render(
      <ControlledTextInput
        label="Full Name"
        id="name"
        register={mockRegister}
        isRequired
      />,
    );

    const label = screen.getByText("Full Name");
    expect(label).toHaveTextContent("Full Name*");
  });

  describe("Password Strength Indicator", () => {
    const mockWatch = vi.fn();

    mockWatch.mockImplementation((fieldName: keyof FormInput) => {
      if (fieldName === "password") {
        return "My_Strong_Password123";
      }
      return "";
    });

    it("should show strength indicator for password input with watch", () => {
      mockWatch.mockImplementationOnce((fieldName: keyof FormInput) => {
        if (fieldName === "password") return "weak";
        return "";
      });

      const mockRegister = createMockRegister("password");
      render(
        <ControlledTextInput
          label="Password"
          id="password"
          register={mockRegister}
          type="password"
          watch={mockWatch as UseFormWatch<FormInput>}
        />,
      );
      expect(screen.getByText(/Strength:/i)).toBeInTheDocument();
    });

    it("should display 'Weak' for a weak password", () => {
      mockWatch.mockImplementationOnce((fieldName: keyof FormInput) => {
        if (fieldName === "password") return "pass";
        return "";
      });

      const mockRegister = createMockRegister("password");
      render(
        <ControlledTextInput
          label="Password"
          id="password"
          register={mockRegister}
          type="password"
          watch={mockWatch as UseFormWatch<FormInput>}
        />,
      );
      expect(screen.getByText("Strength: Weak")).toBeInTheDocument();
    });

    it("should display 'Strong' for a strong password", () => {
      mockWatch.mockImplementation((fieldName: keyof FormInput) => {
        if (fieldName === "password") return "My_Strong_Password123";
        return "";
      });

      const mockRegister = createMockRegister("password");
      render(
        <ControlledTextInput
          label="Password"
          id="password"
          register={mockRegister}
          type="password"
          watch={mockWatch}
        />,
      );
      expect(screen.getByText("Strength: Strong")).toBeInTheDocument();
    });

    it("should not show strength indicator for non-password fields", () => {
      mockWatch.mockReturnValue("");
      const mockRegister = createMockRegister("name");
      render(
        <ControlledTextInput
          label="Name"
          id="name"
          register={mockRegister}
          type="text"
          watch={mockWatch}
        />,
      );
      expect(screen.queryByText(/Strength:/i)).not.toBeInTheDocument();
    });
  });
});
