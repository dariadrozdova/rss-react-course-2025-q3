import { TwemojiWrapper } from "@/components/twemoji/twemoji-wrapper";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-twemoji", () => ({
  default: vi.fn(({ children, options }) => (
    <div data-testid="twemoji-mock" data-options={JSON.stringify(options)}>
      {children}
    </div>
  )),
}));

describe("TwemojiWrapper", () => {
  it("renders a span with the correct emoji inside Twemoji component", () => {
    const testEmoji = "✨";
    render(<TwemojiWrapper emoji={testEmoji} />);

    expect(screen.getByText(testEmoji)).toBeInTheDocument();
  });

  it("passes the correct options to the Twemoji component", () => {
    const testEmoji = "🚀";
    render(<TwemojiWrapper emoji={testEmoji} />);

    const twemojiMock = screen.getByTestId("twemoji-mock");
    const parsedOptions = JSON.parse(twemojiMock.dataset.options || "{}");

    expect(parsedOptions.ext).toBe(".svg");
    expect(parsedOptions.folder).toBe("svg");
    expect(parsedOptions.className).toContain("twemoji");
  });

  it("applies different sizes correctly", () => {
    render(<TwemojiWrapper emoji="😊" size="lg" />);
    const twemojiMock = screen.getByTestId("twemoji-mock");
    const parsedOptions = JSON.parse(twemojiMock.dataset.options || "{}");

    expect(parsedOptions.className).toContain("w-6 h-6");
  });

  it("applies animated and interactive classes when props are true", () => {
    render(<TwemojiWrapper emoji="🎉" animated={true} interactive={true} />);
    const twemojiMock = screen.getByTestId("twemoji-mock");
    const parsedOptions = JSON.parse(twemojiMock.dataset.options || "{}");

    expect(parsedOptions.className).toContain("animate-bounce");
    expect(parsedOptions.className).toContain("twemoji-interactive");
  });

  it("applies a custom className", () => {
    const customClassName = "my-custom-class";
    render(<TwemojiWrapper emoji="👍" className={customClassName} />);
    const twemojiMock = screen.getByTestId("twemoji-mock");
    const parsedOptions = JSON.parse(twemojiMock.dataset.options || "{}");

    expect(parsedOptions.className).toContain(customClassName);
  });
});
