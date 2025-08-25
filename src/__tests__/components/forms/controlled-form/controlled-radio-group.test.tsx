import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ControlledRadioGroup } from "@/components/forms/controlled-form/controlled-radio-group";
import type { LabelProps } from "@/components/ui/label";
import type { ReactNode } from "react";

vi.mock("@/components/ui/label", () => ({
  Label: ({ children, htmlFor }: LabelProps): ReactNode => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}));

describe("ControlledRadioGroup", () => {
  const genderId = "gender" as const;
  const mockRegister = {
    name: genderId,
    onBlur: vi.fn(),
    onChange: vi.fn(),
    ref: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const options = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  const defaultProps = {
    label: "Gender",
    options,
    register: mockRegister,
  };

  it("should render radio group with options", () => {
    render(<ControlledRadioGroup {...defaultProps} />);

    expect(screen.getByText("Gender")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByLabelText("Male")).toBeInTheDocument();
    expect(screen.getByLabelText("Female")).toBeInTheDocument();
    expect(screen.getByLabelText("Other")).toBeInTheDocument();
  });

  it("should show required indicator when required", () => {
    render(<ControlledRadioGroup {...defaultProps} isRequired />);

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("should display error message", () => {
    render(
      <ControlledRadioGroup
        {...defaultProps}
        error="Please select an option"
      />,
    );

    expect(screen.getByText("Please select an option")).toBeInTheDocument();
  });

  it("should apply register to all radio inputs", () => {
    render(<ControlledRadioGroup {...defaultProps} />);

    const radios = screen.getAllByRole("radio");
    for (const radio of radios) {
      expect(radio).toHaveAttribute("name", "gender");
    }
  });
});
