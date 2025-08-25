import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FormFields } from "@/components/forms/uncontrolled-form/form-fileds";

describe("FormFields", () => {
  const mockCountries = ["USA", "Canada", "Ukraine"];
  let mockErrors: Partial<Record<string, string>>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockErrors = {};
  });

  describe("Field rendering", () => {
    it("should render all form fields with correct attributes", () => {
      render(<FormFields countries={mockCountries} errors={mockErrors} />);

      const nameInput = document.querySelector('input[name="name"]');
      const ageInput = document.querySelector('input[name="age"]');
      const emailInput = document.querySelector('input[name="email"]');
      const countryInput = document.querySelector('input[name="country"]');
      const passwordInput = document.querySelector('input[name="password"]');
      const confirmPasswordInput = document.querySelector(
        'input[name="confirmPassword"]',
      );

      expect(nameInput).toHaveAttribute("name", "name");
      expect(ageInput).toHaveAttribute("name", "age");
      expect(emailInput).toHaveAttribute("name", "email");
      expect(countryInput).toHaveAttribute("name", "country");
      expect(passwordInput).toHaveAttribute("name", "password");
      expect(confirmPasswordInput).toHaveAttribute("name", "confirmPassword");

      const genderRadios = screen.getAllByRole("radio");
      for (const radio of genderRadios) {
        expect(radio).toHaveAttribute("name", "gender");
      }

      const acceptTermsCheckbox = screen.getByRole("checkbox");
      const fileInput = document.querySelector('input[type="file"]');

      expect(acceptTermsCheckbox).toHaveAttribute("name", "acceptTerms");
      expect(fileInput).toHaveAttribute("name", "picture");

      expect(screen.getByRole("button", { name: /submit/i })).toHaveAttribute(
        "type",
        "submit",
      );
    });
  });

  describe("Error message display", () => {
    it.each([
      ["name", "Name is required"],
      ["email", "Invalid email format"],
      ["age", "Age must be positive"],
      ["country", "Country is required"],
      ["password", "Password is too weak"],
      ["confirmPassword", "Passwords do not match"],
      ["gender", "Gender is required"],
      ["acceptTerms", "Must accept terms"],
      ["picture", "Invalid file type"],
    ])("should display error message for %s field", (field, errorMessage) => {
      const errorsWithMessage = { [field]: errorMessage };
      render(
        <FormFields countries={mockCountries} errors={errorsWithMessage} />,
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("should display multiple error messages simultaneously", () => {
      const multipleErrors = {
        age: "Age must be positive",
        email: "Invalid email format",
        name: "Name is required",
      };

      render(<FormFields countries={mockCountries} errors={multipleErrors} />);

      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Invalid email format")).toBeInTheDocument();
      expect(screen.getByText("Age must be positive")).toBeInTheDocument();
    });

    it("should not display error messages when errors object is empty", () => {
      render(<FormFields countries={mockCountries} errors={{}} />);

      expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
    });
  });

  describe("Country autocomplete", () => {
    it("should pass countries to autocomplete input", () => {
      render(<FormFields countries={mockCountries} errors={mockErrors} />);

      const countryInput = document.querySelector('input[name="country"]');
      fireEvent.focus(countryInput!);

      expect(countryInput).toBeInTheDocument();
      expect(countryInput).toHaveAttribute("name", "country");
    });

    it("should handle empty countries array", () => {
      render(<FormFields countries={[]} errors={mockErrors} />);

      const countryInput = document.querySelector('input[name="country"]');
      expect(countryInput).toBeInTheDocument();
    });
  });

  describe("Gender radio group", () => {
    it("should group all gender options under same name", () => {
      render(<FormFields countries={mockCountries} errors={mockErrors} />);

      const genderInputs = screen.getAllByRole("radio");
      for (const input of genderInputs) {
        expect(input).toHaveAttribute("name", "gender");
      }
    });
  });

  describe("Password fields", () => {
    it("should render two password fields", () => {
      render(<FormFields countries={mockCountries} errors={mockErrors} />);

      const passwordFields = screen.getAllByLabelText(/password/i);
      expect(passwordFields).toHaveLength(2);
    });

    it("should have different names for password fields", () => {
      render(<FormFields countries={mockCountries} errors={mockErrors} />);

      const passwordInput = document.querySelector('input[name="password"]');
      const confirmPasswordInput = document.querySelector(
        'input[name="confirmPassword"]',
      );

      expect(passwordInput).toHaveAttribute("name", "password");
      expect(confirmPasswordInput).toHaveAttribute("name", "confirmPassword");
    });
  });

  describe("Required field indicators", () => {
    it("should show required stars for all required fields", () => {
      render(<FormFields countries={mockCountries} errors={mockErrors} />);

      const requiredStars = screen.getAllByText("*");
      expect(requiredStars).toHaveLength(9);
    });

    it("should have correct styling for required stars", () => {
      render(<FormFields countries={mockCountries} errors={mockErrors} />);

      const requiredStars = screen.getAllByText("*");
      for (const star of requiredStars) {
        expect(star).toHaveClass("text-error", "font-bold", "ml-1");
      }
    });
  });

  describe("Layout and styling", () => {
    it("should apply grid layout classes", () => {
      const { container } = render(
        <FormFields countries={mockCountries} errors={mockErrors} />,
      );

      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toHaveClass(
        "grid-cols-1",
        "gap-4",
        "md:grid-cols-2",
      );
    });

    it("should apply full width wrapper classes to appropriate fields", () => {
      const { container } = render(
        <FormFields countries={mockCountries} errors={mockErrors} />,
      );

      const fullWidthElements = container.querySelectorAll(
        String.raw`.md\:col-span-2`,
      );
      expect(fullWidthElements).toHaveLength(4);
    });

    it("should apply correct classes to submit button", () => {
      render(<FormFields countries={mockCountries} errors={mockErrors} />);

      const submitButton = screen.getByRole("button", { name: /submit/i });
      expect(submitButton).toHaveClass("w-full", "md:col-span-2");
    });
  });
});
