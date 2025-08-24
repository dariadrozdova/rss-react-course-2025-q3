import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Header } from "@/components/common/header";

vi.mock("@/components/twemoji", () => ({
  CatEmoji: ({
    animated,
    size,
    variant,
  }: {
    animated?: boolean;
    size?: string;
    variant?: string;
  }) => (
    <div
      data-animated={animated ? "true" : "false"}
      data-size={size}
      data-testid={`cat-emoji-${variant || "default"}`}
      data-variant={variant}
    >
      Cat {variant}
    </div>
  ),
  TwemojiWrapper: ({
    animated,
    emoji,
    size,
  }: {
    animated?: boolean;
    emoji: string;
    size?: string;
  }) => (
    <span
      data-animated={animated ? "true" : "false"}
      data-emoji={emoji}
      data-size={size}
      data-testid="twemoji-wrapper"
    >
      {emoji}
    </span>
  ),
}));

vi.mock("@/lib/class-names", () => ({
  classNames: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

describe("Header", () => {
  it("renders header element", () => {
    render(<Header />);
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("renders the main heading text", () => {
    render(<Header />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Purrfect Forms");
  });

  it("renders twemoji wrapper with correct emoji and props", () => {
    render(<Header />);
    const twemoji = screen.getByTestId("twemoji-wrapper");

    expect(twemoji).toBeInTheDocument();
    expect(twemoji).toHaveAttribute("data-emoji", "❤️");
    expect(twemoji).toHaveAttribute("data-size", "sm");
    expect(twemoji).toHaveAttribute("data-animated", "true");
  });

  it('renders the "Made with" text', () => {
    render(<Header />);
    expect(screen.getByText("Made with")).toBeInTheDocument();
  });

  it('renders the "and" text', () => {
    render(<Header />);
    expect(screen.getByText("and")).toBeInTheDocument();
  });
});
