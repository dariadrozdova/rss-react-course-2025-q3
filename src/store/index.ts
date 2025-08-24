import countriesReducer from "@/store/slices/countries-slice";
import formsReducer from "@/store/slices/form-slice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    countries: countriesReducer,
    forms: formsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
