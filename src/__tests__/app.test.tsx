import type { ReactNode } from "react";
import { Provider } from "react-redux";

import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { App } from "@/app";
import countriesReducer from "@/store/slices/countries-slice";
import formsReducer from "@/store/slices/form-slice";

vi.mock("@/components/layout/layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }): ReactNode => (
    <div data-testid="layout">{children}</div>
  ),
}));

vi.mock("@/components/modal/modal-buttons", () => ({
  ModalButtons: (): ReactNode => (
    <div data-testid="modal-buttons">Modal Buttons</div>
  ),
}));

vi.mock("@/components/submissions/submissions-list", () => ({
  SubmissionsList: (): ReactNode => (
    <div data-testid="submissions-list">Submissions List</div>
  ),
}));

vi.mock("@/components/twemoji", () => ({
  CatEmoji: ({
    animated,
    size,
    variant,
  }: {
    animated: boolean;
    size: string;
    variant: string;
  }): ReactNode => (
    <div
      data-animated={animated}
      data-size={size}
      data-testid="cat-emoji"
      data-variant={variant}
    >
      Cat Emoji
    </div>
  ),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className: string;
  }): ReactNode => (
    <div className={className} data-testid="card">
      {children}
    </div>
  ),
}));

vi.mock("@/components/common/header", () => ({
  Header: (): ReactNode => <header data-testid="header">Header</header>,
}));

vi.mock("@/components/common/footer", () => ({
  Footer: (): ReactNode => <footer data-testid="footer">Footer</footer>,
}));

describe("App Component", () => {
  const createMockStore = () =>
    configureStore({
      reducer: {
        countries: countriesReducer,
        forms: formsReducer,
      },
    });

  it("should render all main components", () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByTestId("cat-emoji")).toBeInTheDocument();
    expect(screen.getByTestId("modal-buttons")).toBeInTheDocument();
    expect(screen.getByTestId("submissions-list")).toBeInTheDocument();
  });

  it("should render welcome text", () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(screen.getByText("Welcome, meow!")).toBeInTheDocument();
    expect(
      screen.getByText("This is a demo project with forms and fluffy friends."),
    ).toBeInTheDocument();
  });

  it("should render CatEmoji with correct props", () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    const catEmoji = screen.getByTestId("cat-emoji");
    expect(catEmoji).toHaveAttribute("data-animated", "true");
    expect(catEmoji).toHaveAttribute("data-size", "xl");
    expect(catEmoji).toHaveAttribute("data-variant", "paw");
  });
});
