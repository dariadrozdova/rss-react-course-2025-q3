import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card } from "@/components/ui/card";

describe("Card", () => {
  it("renders children correctly", () => {
    const testText = "This is a test content inside the Card";
    render(<Card>{testText}</Card>);

    expect(screen.getByText(testText)).toBeInTheDocument();
  });
});
