import { configureStore } from "@reduxjs/toolkit";
import { ocrApi } from "@/api/ocrApi";
import { chatgptApi } from "@/api/chatgptApi";
import { authApi } from "@/api/authApi";
import { userUploadsApi } from "@/api/uploadsApi";

export const store = configureStore({
  reducer: {
    [ocrApi.reducerPath]: ocrApi.reducer,
    [chatgptApi.reducerPath]: chatgptApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userUploadsApi.reducerPath]: userUploadsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ocrApi.middleware)
      .concat(chatgptApi.middleware)
      .concat(authApi.middleware)
      .concat(userUploadsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
