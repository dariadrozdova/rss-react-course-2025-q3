import type { Middleware } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import type {
  Api,
  BaseQueryFn,
  EndpointDefinitions,
} from '@reduxjs/toolkit/query';

export function setupApiStore<
  BaseQuery extends BaseQueryFn,
  Definitions extends EndpointDefinitions,
  ReducerPath extends string,
  TagTypes extends string,
>(api: Api<BaseQuery, Definitions, ReducerPath, TagTypes>) {
  return configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware as Middleware),
    reducer: {
      [api.reducerPath]: api.reducer,
    },
  });
}
