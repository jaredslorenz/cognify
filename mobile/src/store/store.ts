import { configureStore } from "@reduxjs/toolkit";
import { chatgptApi } from "../api/chatgptApi";
import { uploadsApi } from "../api/uploadsApi";
import { authApi } from "../api/authApi";

export const store = configureStore({
  reducer: {
    [chatgptApi.reducerPath]: chatgptApi.reducer,
    [uploadsApi.reducerPath]: uploadsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(chatgptApi.middleware)
      .concat(uploadsApi.middleware)
      .concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
