import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {
  fetchAuthSession,
  getCurrentUser,
  updateUserAttribute,
  updatePassword,
  deleteUser,
  confirmUserAttribute,
} from "aws-amplify/auth";

export type User = {
  userId: string;
  username: string;
  email?: string;
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
  tagTypes: ["AuthUser"],
  endpoints: (build) => ({
    // ── GET CURRENT USER ────────────────────────────────────
    getAuthUser: build.query<User, void>({
      queryFn: async () => {
        try {
          const user = await getCurrentUser();
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
      providesTags: ["AuthUser"],
    }),

    // ── UPDATE EMAIL ────────────────────────────────────────
    // Step 1: request the change (Cognito sends a verification code)
    updateEmail: build.mutation<void, { newEmail: string }>({
      queryFn: async ({ newEmail }) => {
        try {
          await updateUserAttribute({
            userAttribute: { attributeKey: "email", value: newEmail },
          });
          return { data: undefined };
        } catch (err: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: err.message || "Failed to update email",
              data: null,
            } as FetchBaseQueryError,
          };
        }
      },
    }),

    // Step 2: confirm the verification code Cognito sends
    confirmEmailUpdate: build.mutation<void, { code: string }>({
      queryFn: async ({ code }) => {
        try {
          await confirmUserAttribute({
            userAttributeKey: "email",
            confirmationCode: code,
          });
          return { data: undefined };
        } catch (err: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: err.message || "Failed to confirm email",
              data: null,
            } as FetchBaseQueryError,
          };
        }
      },
      invalidatesTags: ["AuthUser"],
    }),

    // ── UPDATE PASSWORD ─────────────────────────────────────
    updatePassword: build.mutation<
      void,
      { oldPassword: string; newPassword: string }
    >({
      queryFn: async ({ oldPassword, newPassword }) => {
        try {
          await updatePassword({ oldPassword, newPassword });
          return { data: undefined };
        } catch (err: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: err.message || "Failed to update password",
              data: null,
            } as FetchBaseQueryError,
          };
        }
      },
    }),

    // ── DELETE ACCOUNT ──────────────────────────────────────
    // Deletes from Cognito — call your backend to wipe Supabase data first
    deleteAccount: build.mutation<void, void>({
      queryFn: async () => {
        try {
          await deleteUser();
          return { data: undefined };
        } catch (err: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: err.message || "Failed to delete account",
              data: null,
            } as FetchBaseQueryError,
          };
        }
      },
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useUpdateEmailMutation,
  useConfirmEmailUpdateMutation,
  useUpdatePasswordMutation,
  useDeleteAccountMutation,
} = authApi;
