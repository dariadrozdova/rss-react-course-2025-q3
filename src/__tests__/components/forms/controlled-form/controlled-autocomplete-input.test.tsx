import { render, screen } from "@testing-library/react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

import { ControlledAutocompleteInput } from "@/components/forms/controlled-form/controlled-autocomplete-input";
import type { FormInput } from "@/utils/form-schema";

const createMockRegister = <T extends keyof FormInput>(
  name: T,
): UseFormRegisterReturn<T> => ({
  name,
  onBlur: vi.fn() as Mock,
  onChange: vi.fn() as Mock,
  ref: vi.fn() as Mock,
});

type MockProps<T extends keyof FormInput> = {
  id: T;
  label: string;
  options: string[];
  register: UseFormRegisterReturn<T>;
};

describe("ControlledAutocompleteInput", () => {
  const mockOptions = ["France", "Germany", "Spain"];
  let mockProps: MockProps<"country">;

  beforeEach(() => {
    vi.clearAllMocks();
    mockProps = {
      id: "country",
      label: "Country",
      options: mockOptions,
      register: createMockRegister("country"),
    };
  });

  describe("Props handling", () => {
    it("should display the error message when provided", () => {
      const propsWithErrors = { ...mockProps, error: "Country is required" };
      render(<ControlledAutocompleteInput {...propsWithErrors} />);

      expect(screen.getByText("Country is required")).toBeInTheDocument();
    });

    it("should show required indicator when isRequired is true", () => {
      const propsWithRequired = { ...mockProps, isRequired: true };
      render(<ControlledAutocompleteInput {...propsWithRequired} />);

      const label = screen.getByText("Country");
      expect(label).toHaveTextContent("Country*");
    });

    it("should not show error text when there is no error", () => {
      const { container } = render(
        <ControlledAutocompleteInput {...mockProps} />,
      );

      const errorParagraph = container.querySelector("p");
      expect(errorParagraph).toHaveClass("opacity-0");
    });
  });
});
