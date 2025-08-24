import { ControlledForm } from "@/components/forms/controlled-form/controlled-form";
import * as fileUtils from "@/utils/file-to-base-64";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

const mockStore = configureStore();
let onSuccess: Mock;
let store: ReturnType<typeof mockStore>;

vi.mock("@/components/forms/controlled-form/controlled-form-fields", () => ({
  ControlledFormFields: () => (
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
      <input
        name="picture"
        type="file"
        data-testid="file-input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            require("@/utils/file-to-base-64").fileToBase64(file);
          }
        }}
      />
      <input type="checkbox" name="acceptTerms" />
      <button type="submit">Submit</button>
    </div>
  ),
}));

describe("ControlledForm", () => {
  beforeEach(() => {
    store = mockStore({
      countries: { countries: ["Portugal", "Spain"] },
      form: { submissions: [] },
    });
    store.dispatch = vi.fn();
    onSuccess = vi.fn();
    vi.spyOn(fileUtils, "fileToBase64").mockResolvedValue("base64string");
  });

  it("renders all form fields", () => {
    render(
      <Provider store={store}>
        <ControlledForm onSuccess={onSuccess} />
      </Provider>,
    );

    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Age")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Country")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Gender")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });
});
