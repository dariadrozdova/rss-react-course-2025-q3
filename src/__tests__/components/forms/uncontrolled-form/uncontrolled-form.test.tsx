import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

import { UncontrolledForm } from "@/components/forms/uncontrolled-form/uncontrolled-form";
import * as fileUtils from "@/utils/file-to-base-64";

vi.mock("@/components/forms/uncontrolled-form/form-fileds", () => ({
  FormFields: vi.fn(({}) => (
    <div>
      <input name="name" placeholder="Name" />
      <input name="email" placeholder="Email" />
      <input name="age" placeholder="Age" type="number" />
      <input name="password" placeholder="Password" type="password" />
      <input
        name="confirmPassword"
        placeholder="Confirm Password"
        type="password"
      />
      <input name="country" placeholder="Country" />
      <input name="gender" placeholder="Gender" />
      <input name="picture" type="file" data-testid="file-input" />
      <input type="checkbox" name="acceptTerms" />
      <button type="submit">Submit</button>
    </div>
  )),
}));

const mockStore = configureStore();
let onSuccess: Mock;
let store: ReturnType<typeof mockStore>;

describe("UncontrolledForm", () => {
  beforeEach(() => {
    store = mockStore({
      countries: { countries: ["Portugal", "Spain"] },
      form: { submissions: [] },
    });
    store.dispatch = vi.fn();
    onSuccess = vi.fn();

    vi.spyOn(fileUtils, "fileToBase64").mockResolvedValue("base64string");
  });

  it("renders all form fields and submit button", () => {
    render(
      <Provider store={store}>
        <UncontrolledForm onSuccess={onSuccess} />
      </Provider>,
    );

    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByTestId("file-input")).toBeInTheDocument();
  });

  it("handles empty picture field correctly", async () => {
    render(
      <Provider store={store}>
        <UncontrolledForm onSuccess={onSuccess} />
      </Provider>,
    );

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Age"), {
      target: { value: "25" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "Password123" },
    });
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(fileUtils.fileToBase64).not.toHaveBeenCalled();
    });
  });
});
