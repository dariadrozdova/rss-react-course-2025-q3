import { SubmissionTile } from "@/components/submissions/submission-tile";
import { type FormData } from "@/store/slices/form-slice";
import { fireEvent, render, screen } from "@testing-library/react";
import { type PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/button", () => ({
  Button: vi.fn(({ onClick, children, ...props }) => (
    <button onClick={onClick} {...props} data-testid="mock-button">
      {children}
    </button>
  )),
}));

vi.mock("@/components/ui/card", () => ({
  Card: vi.fn(
    ({ children, className }: PropsWithChildren<{ className?: string }>) => (
      <div data-testid="mock-card" data-classname={className}>
        {children}
      </div>
    ),
  ),
}));

describe("SubmissionTile", () => {
  const mockSubmission: FormData = {
    id: "test-id",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    age: 28,
    gender: "female",
    country: "USA",
    password: "securepassword123",
    picture: "https://example.com/avatar.jpg",
    type: "rhf",
    createdAt: 1672531200000,
    acceptTerms: true,
  };

  it("renders all submission data fields", () => {
    render(<SubmissionTile submission={mockSubmission} isRecent={false} />);

    expect(screen.getByText("React Hook Form")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("28")).toBeInTheDocument();
    expect(screen.getByText("jane.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("female")).toBeInTheDocument();
    expect(screen.getByText("USA")).toBeInTheDocument();
    expect(screen.getByText("Submitted:")).toBeInTheDocument();
    expect(screen.getByText("1/1/2023, 12:00:00 AM")).toBeInTheDocument();
  });

  it("renders avatar image if picture exists", () => {
    render(<SubmissionTile submission={mockSubmission} isRecent={false} />);

    const avatar = screen.getByAltText("Jane Doe's avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", mockSubmission.picture!);
  });

  it("does not render avatar image if picture is null", () => {
    const noPictureSubmission = { ...mockSubmission, picture: "" };
    render(
      <SubmissionTile submission={noPictureSubmission} isRecent={false} />,
    );

    const avatar = screen.queryByAltText("Jane Doe's avatar");
    expect(avatar).not.toBeInTheDocument();
  });

  it('shows password and changes button text to "Hide" on click', () => {
    render(<SubmissionTile submission={mockSubmission} isRecent={false} />);

    const showButton = screen.getByRole("button", { name: "Show" });
    fireEvent.click(showButton);

    const passwordText = screen.getByText("securepassword123", {
      exact: false,
    });

    expect(passwordText).toHaveTextContent("securepassword123");
    expect(screen.getByRole("button", { name: "Hide" })).toBeInTheDocument();
  });
});
