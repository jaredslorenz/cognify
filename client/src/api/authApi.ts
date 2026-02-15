import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export type User = {
  userId: string;
  username: string;
  email?: string; // map from signInDetails.loginId
};

export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
      return headers;
    },
  }),
  reducerPath: "authApi",
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession();
          const user = await getCurrentUser();

          // Map Amplify user object to your User type
          const mappedUser: User = {
            userId: user.userId,
            username: user.username,
            email: user.signInDetails?.loginId,
          };

          return { data: mappedUser };
        } catch (err: any) {
          console.error("Failed to get current user:", err);
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: err.message || "Failed to get user",
              data: null,
            } as FetchBaseQueryError,
          };
        }
      },
    }),
  }),
});

export const { useGetAuthUserQuery } = authApi;
