import type { ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Footer } from "@/components/common/footer";

vi.mock("@/components/twemoji", () => ({
  CatEmoji: ({
    animated,
    size,
    variant,
  }: {
    animated?: boolean;
    size?: string;
    variant?: string;
  }): ReactNode => (
    <div
      data-animated={animated}
      data-size={size}
      data-testid={`cat-emoji-${variant ?? "default"}`}
    >
      Cat {variant}
    </div>
  ),
  TwemojiWrapper: ({
    emoji,
    size,
  }: {
    emoji: string;
    size?: string;
  }): ReactNode => (
    <span data-emoji={emoji} data-size={size} data-testid="twemoji-wrapper">
      {emoji}
    </span>
  ),
}));

describe("Footer", () => {
  it("renders footer element", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it("renders GitHub link with correct attributes", () => {
    render(<Footer />);

    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/dariadrozdova",
    );
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noreferrer");
  });

  it("renders RS School link with correct attributes", () => {
    render(<Footer />);

    const rsSchoolLink = screen.getByRole("link", { name: /rs school/i });
    expect(rsSchoolLink).toHaveAttribute(
      "href",
      "https://rs.school/courses/reactjs",
    );
    expect(rsSchoolLink).toHaveAttribute("target", "_blank");
    expect(rsSchoolLink).toHaveAttribute("rel", "noreferrer");
  });

  it("renders decorative cat emojis", () => {
    render(<Footer />);

    expect(screen.getByTestId("cat-emoji-happy")).toBeInTheDocument();
    expect(screen.getByTestId("cat-emoji-love")).toBeInTheDocument();
  });

  it("renders animated paw cat emoji", () => {
    render(<Footer />);

    const pawEmoji = screen.getByTestId("cat-emoji-paw");
    expect(pawEmoji).toBeInTheDocument();
    expect(pawEmoji).toHaveAttribute("data-animated", "true");
  });

  it("renders twemoji wrappers with correct emojis", () => {
    render(<Footer />);

    const twemojiElements = screen.getAllByTestId("twemoji-wrapper");
    expect(twemojiElements).toHaveLength(2);

    expect(twemojiElements[0]).toHaveAttribute("data-emoji", "🐙");
    expect(twemojiElements[1]).toHaveAttribute("data-emoji", "📚");
  });

  it('renders "Powered by cats" text', () => {
    render(<Footer />);

    expect(screen.getByText("Powered by cats")).toBeInTheDocument();
  });

  it("applies correct size props to cat emojis", () => {
    render(<Footer />);

    const happyCat = screen.getByTestId("cat-emoji-happy");
    const loveCat = screen.getByTestId("cat-emoji-love");
    const pawCat = screen.getByTestId("cat-emoji-paw");

    expect(happyCat).toHaveAttribute("data-size", "lg");
    expect(loveCat).toHaveAttribute("data-size", "lg");
    expect(pawCat).toHaveAttribute("data-size", "sm");
  });
});
