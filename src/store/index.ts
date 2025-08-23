import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import countriesReducer from "@/store/slices/countries-slice";
import formsReducer from "@/store/slices/form-slice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["forms"],
};

const formsPersistConfig = {
  key: "forms",
  storage,
  whitelist: ["draftRhf", "draftUncontrolled"],
};

const rootReducer = combineReducers({
  countries: countriesReducer,
  forms: persistReducer(formsPersistConfig, formsReducer),
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
