import { ControlledFormFields } from "@/components/forms/controlled-form/controlled-form-fields";
import type { FormInput } from "@/utils/form-schema";
import { render, screen } from "@testing-library/react";
import type { ButtonHTMLAttributes } from "react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";

interface MockedProps {
  label: string;
  isRequired?: boolean;
}

interface MockedPasswordProps extends MockedProps {
  showStrength?: boolean;
}

interface MockedRadioGroupProps extends MockedProps {
  options: string[];
}

interface MockedTextInputProps extends MockedProps {
  type?: string;
}

interface MockedButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className?: string;
}

vi.mock(
  "@/components/forms/controlled-form/controlled-autocomplete-input",
  () => ({
    ControlledAutocompleteInput: ({ label, isRequired }: MockedProps) => (
      <div data-testid={`controlled-autocomplete-${label.toLowerCase()}`}>
        {label}
        {isRequired && <span>*</span>}
      </div>
    ),
  }),
);

vi.mock("@/components/forms/controlled-form/controlled-checkbox", () => ({
  ControlledCheckbox: ({ label, isRequired }: MockedProps) => (
    <div
      data-testid={`controlled-checkbox-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {label}
      {isRequired && <span>*</span>}
    </div>
  ),
}));

vi.mock("@/components/forms/controlled-form/controlled-file-input", () => ({
  ControlledFileInput: ({ label, isRequired }: MockedProps) => (
    <div
      data-testid={`controlled-file-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {label}
      {isRequired && <span>*</span>}
    </div>
  ),
}));

vi.mock(
  "@/components/forms/controlled-form/controlled-password-input/controlled-password-input",
  () => ({
    ControlledPasswordInput: ({
      label,
      isRequired,
      showStrength,
    }: MockedPasswordProps) => (
      <div
        data-testid={`controlled-password-${label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {label}
        {isRequired && <span>*</span>}
        {showStrength && (
          <div data-testid="password-strength">Strength indicator</div>
        )}
      </div>
    ),
  }),
);

vi.mock("@/components/forms/controlled-form/controlled-radio-group", () => ({
  ControlledRadioGroup: ({
    label,
    options,
    isRequired,
  }: MockedRadioGroupProps) => (
    <div data-testid={`controlled-radio-${label.toLowerCase()}`}>
      {label}
      {isRequired && <span>*</span>}
      <div data-testid="radio-options">{options.length} options</div>
    </div>
  ),
}));

vi.mock("@/components/forms/controlled-form/controlled-text-input", () => ({
  ControlledTextInput: ({ label, type, isRequired }: MockedTextInputProps) => (
    <div data-testid={`controlled-text-${label.toLowerCase()}`}>
      {label}
      {isRequired && <span>*</span>}
      {type && <span data-testid="input-type">{type}</span>}
    </div>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, disabled, type, className }: MockedButtonProps) => (
    <button
      type={type}
      disabled={disabled}
      className={className}
      data-testid="submit-button"
    >
      {children}
    </button>
  ),
}));

vi.mock("@/hooks/use-required-field", () => ({
  useRequiredFields: () => ({
    isRequired: () => true,
  }),
}));

describe("ControlledFormFields", () => {
  let mockProps: {
    countries: string[];
    errors: FieldErrors<FormInput>;
    isValid: boolean;
    register: UseFormRegister<FormInput>;
    setValue: UseFormSetValue<FormInput>;
    watch: UseFormWatch<FormInput>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockProps = {
      countries: ["USA", "Canada", "Ukraine"],
      errors: {},
      isValid: true,
      register: vi.fn(),
      setValue: vi.fn(),
      watch: vi.fn(),
    };
  });

  describe("Field rendering", () => {
    it("should render all controlled form components", () => {
      render(<ControlledFormFields {...mockProps} />);

      expect(screen.getByTestId("controlled-text-name")).toBeInTheDocument();
      expect(screen.getByTestId("controlled-text-age")).toBeInTheDocument();
      expect(screen.getByTestId("controlled-text-email")).toBeInTheDocument();

      expect(
        screen.getByTestId("controlled-autocomplete-country"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("controlled-password-password"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("controlled-password-confirm-password"),
      ).toBeInTheDocument();

      expect(screen.getByTestId("controlled-radio-gender")).toBeInTheDocument();
      expect(
        screen.getByTestId("controlled-checkbox-accept-terms-and-conditions"),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("controlled-file-upload-picture"),
      ).toBeInTheDocument();

      expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    });

    it("should show required indicators for all fields", () => {
      render(<ControlledFormFields {...mockProps} />);

      const requiredStars = screen.getAllByText("*");
      expect(requiredStars).toHaveLength(9);
    });
  });

  describe("Submit button state", () => {
    it.each([
      [true, false],
      [false, true],
    ])(
      "should set button disabled to %s when form isValid is %s",
      (isValid, expectedDisabled) => {
        const props = { ...mockProps, isValid };
        render(<ControlledFormFields {...props} />);

        const submitButton = screen.getByTestId("submit-button");
        if (expectedDisabled) {
          expect(submitButton).toBeDisabled();
        } else {
          expect(submitButton).not.toBeDisabled();
        }
      },
    );

    it("should have correct attributes and classes", () => {
      render(<ControlledFormFields {...mockProps} />);

      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).toHaveAttribute("type", "submit");
      expect(submitButton).toHaveClass("w-full", "md:col-span-2");
      expect(submitButton).toHaveTextContent("Submit");
    });
  });

  describe("Layout structure", () => {
    it("should apply grid layout to main container", () => {
      const { container } = render(<ControlledFormFields {...mockProps} />);

      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toHaveClass(
        "grid-cols-1",
        "gap-4",
        "md:grid-cols-2",
      );
    });
  });

  describe("Props integration", () => {
    it("should pass countries prop to autocomplete component", () => {
      const customCountries = ["France", "Germany", "Spain"];
      const props = { ...mockProps, countries: customCountries };

      render(<ControlledFormFields {...props} />);
      expect(
        screen.getByTestId("controlled-autocomplete-country"),
      ).toBeInTheDocument();
    });

    it("should handle empty countries array", () => {
      const props = { ...mockProps, countries: [] };

      render(<ControlledFormFields {...props} />);
      expect(
        screen.getByTestId("controlled-autocomplete-country"),
      ).toBeInTheDocument();
    });

    it("should pass react-hook-form props to components", () => {
      render(<ControlledFormFields {...mockProps} />);

      expect(mockProps.register).toHaveBeenCalled();
      expect(mockProps.setValue).not.toHaveBeenCalled();
    });
  });

  describe("Error handling integration", () => {
    it("should handle errors object structure", () => {
      const propsWithErrors = {
        ...mockProps,
        errors: {
          name: { message: "Name is required" },
          email: { message: "Invalid email" },
        } as FieldErrors<FormInput>,
      };

      render(<ControlledFormFields {...propsWithErrors} />);

      expect(screen.getByTestId("controlled-text-name")).toBeInTheDocument();
      expect(screen.getByTestId("controlled-text-email")).toBeInTheDocument();
    });
  });
});
