import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { auth } from "./slices/auth";
import userReducer from "./slices/userSlice";

const errorTransform = createTransform(
  (inboundState: any) => ({
    ...inboundState,
    error:
      inboundState?.error instanceof Error
        ? inboundState?.error.message
        : inboundState.error,
  }),

  (outboundState) => outboundState
);

const persistConfig = {
  key: "root",
  storage, // Storage method
  // whitelist: ["auth"],
  transforms: [errorTransform],
};

const rootReducer: any = combineReducers({
  user: userReducer,
  [auth.reducerPath]: auth.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(auth.middleware),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
