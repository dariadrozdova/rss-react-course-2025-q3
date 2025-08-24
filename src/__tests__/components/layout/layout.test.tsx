import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Layout } from "@/components/layout/layout";

vi.mock("@/components/common/header", () => ({
  Header: () => <header data-testid="mock-header">Mock Header</header>,
}));

vi.mock("@/components/common/footer", () => ({
  Footer: () => <footer data-testid="mock-footer">Mock Footer</footer>,
}));

vi.mock("@/lib/class-names", () => ({
  classNames: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

describe("Layout", () => {
  it("renders a div element with the main container role", () => {
    render(<Layout />);
    const divElement = screen.getByRole("main").parentElement;
    expect(divElement).toBeInTheDocument();
    expect(divElement?.tagName).toBe("DIV");
  });

  it("renders the Header component", () => {
    render(<Layout />);
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
  });

  it("renders the Footer component", () => {
    render(<Layout />);
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });

  it("renders a main element", () => {
    render(<Layout />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders children inside the main element", () => {
    const testChildren = <div>Test Content for Children</div>;
    render(<Layout>{testChildren}</Layout>);

    const mainElement = screen.getByRole("main");
    expect(mainElement).toContainElement(
      screen.getByText("Test Content for Children"),
    );
  });

  it("renders the decorative cat emoji", () => {
    render(<Layout />);
    expect(screen.getByText("😽")).toBeInTheDocument();
  });
});
