import { CatEmoji } from "@/components/twemoji/cat-emoji";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/twemoji/twemoji-wrapper", () => ({
  TwemojiWrapper: vi.fn(({ emoji, ...props }) => (
    <div data-testid="twemoji-wrapper-mock" data-emoji={emoji} {...props}>
      Mocked TwemojiWrapper for {emoji}
    </div>
  )),
}));

describe("CatEmoji", () => {
  it('renders with the default "happy" variant emoji', () => {
    render(<CatEmoji />);
    const wrapper = screen.getByTestId("twemoji-wrapper-mock");
    expect(wrapper).toHaveAttribute("data-emoji", "😸");
  });

  it('renders the correct emoji for the "angry" variant', () => {
    render(<CatEmoji variant="angry" />);
    const wrapper = screen.getByTestId("twemoji-wrapper-mock");
    expect(wrapper).toHaveAttribute("data-emoji", "😾");
  });

  it('renders the correct emoji for the "love" variant', () => {
    render(<CatEmoji variant="love" />);
    const wrapper = screen.getByTestId("twemoji-wrapper-mock");
    expect(wrapper).toHaveAttribute("data-emoji", "😻");
  });

  it('renders the correct emoji for the "wink" variant', () => {
    render(<CatEmoji variant="wink" />);
    const wrapper = screen.getByTestId("twemoji-wrapper-mock");
    expect(wrapper).toHaveAttribute("data-emoji", "😽");
  });
});
