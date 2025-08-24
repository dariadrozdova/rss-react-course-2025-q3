import { Card } from "@/components/ui/card";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/class-names", () => ({
  classNames: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

describe("Card", () => {
  it("renders children correctly", () => {
    const testText = "This is a test content inside the Card";
    render(<Card>{testText}</Card>);

    expect(screen.getByText(testText)).toBeInTheDocument();
  });
});
