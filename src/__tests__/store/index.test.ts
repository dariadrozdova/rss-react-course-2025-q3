import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, it } from "vitest";

import type { AppDispatch, RootState } from "@/store";
import { store } from "@/store";
import countriesReducer from "@/store/slices/countries-slice";
import formsReducer from "@/store/slices/form-slice";

describe("Store Configuration", () => {
  let testStore: ReturnType<typeof configureStore>;

  beforeEach(() => {
    testStore = configureStore({
      reducer: {
        countries: countriesReducer,
        forms: formsReducer,
      },
    });
  });

  it("should have correct initial state structure", () => {
    const state = testStore.getState();

    expect(state).toHaveProperty("countries");
    expect(state).toHaveProperty("forms");
  });

  it("should export store with dispatch method", () => {
    expect(store).toBeDefined();
    expect(store.dispatch).toBeDefined();
    expect(typeof store.dispatch).toBe("function");
  });

  it("should export store with getState method", () => {
    expect(store.getState).toBeDefined();
    expect(typeof store.getState).toBe("function");
  });

  it("should have AppDispatch type matching store dispatch", () => {
    const dispatch: AppDispatch = store.dispatch;
    expect(typeof dispatch).toBe("function");
  });

  it("should have RootState type matching store state", () => {
    const state: RootState = store.getState();
    expect(state).toHaveProperty("countries");
    expect(state).toHaveProperty("forms");
  });

  it("should allow subscribing to store changes", () => {
    const unsubscribe = store.subscribe(() => {});
    expect(typeof unsubscribe).toBe("function");
    unsubscribe();
  });

  it("should maintain state consistency across multiple getState calls", () => {
    const state1 = store.getState();
    const state2 = store.getState();

    expect(state1).toEqual(state2);
  });
});
