import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

const getUserPool = () =>
  new CognitoUserPool({
    UserPoolId: process.env.EXPO_PUBLIC_AWS_COGNITO_USER_POOL_ID ?? "",
    ClientId: process.env.EXPO_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID ?? "",
  });

// Store current user session in memory
let currentCognitoUser: CognitoUser | null = null;

export interface AuthUser {
  userId: string;
  username: string;
  email: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getAuthUser: builder.query<AuthUser | null, void>({
      queryFn: async () => {
        return new Promise((resolve) => {
          try {
            const pool = getUserPool();
            const cognitoUser = pool.getCurrentUser();
            if (!cognitoUser) {
              resolve({ data: null });
              return;
            }
            cognitoUser.getSession((err: any, session: any) => {
              if (err || !session?.isValid()) {
                resolve({ data: null });
                return;
              }
              cognitoUser.getUserAttributes((attrErr, attrs) => {
                if (attrErr || !attrs) {
                  resolve({ data: null });
                  return;
                }
                const email =
                  attrs.find((a) => a.getName() === "email")?.getValue() ?? "";
                const sub =
                  attrs.find((a) => a.getName() === "sub")?.getValue() ?? "";
                currentCognitoUser = cognitoUser;
                resolve({
                  data: {
                    userId: sub,
                    username: cognitoUser.getUsername(),
                    email,
                  },
                });
              });
            });
          } catch (e: any) {
            resolve({ data: null });
          }
        });
      },
      providesTags: ["User"],
    }),

    signIn: builder.mutation<AuthUser, { username: string; password: string }>({
      queryFn: async ({ username, password }) => {
        return new Promise((resolve) => {
          const pool = getUserPool();
          const cognitoUser = new CognitoUser({
            Username: username,
            Pool: pool,
          });
          const authDetails = new AuthenticationDetails({
            Username: username,
            Password: password,
          });

          cognitoUser.authenticateUser(authDetails, {
            onSuccess: (session) => {
              cognitoUser.getUserAttributes((err, attrs) => {
                const email =
                  attrs?.find((a) => a.getName() === "email")?.getValue() ?? "";
                const sub =
                  attrs?.find((a) => a.getName() === "sub")?.getValue() ?? "";
                currentCognitoUser = cognitoUser;
                resolve({
                  data: {
                    userId: sub,
                    username: cognitoUser.getUsername(),
                    email,
                  },
                });
              });
            },
            onFailure: (err) => {
              console.log("Sign in error:", err.message);
              resolve({
                error: { status: "CUSTOM_ERROR", error: err.message },
              });
            },
            newPasswordRequired: () => {
              resolve({
                error: {
                  status: "CUSTOM_ERROR",
                  error:
                    "New password required. Please use the web app to complete setup.",
                },
              });
            },
          });
        });
      },
      invalidatesTags: ["User"],
    }),

    signUp: builder.mutation<
      void,
      { username: string; email: string; password: string }
    >({
      queryFn: async ({ username, email, password }) => {
        return new Promise((resolve) => {
          const pool = getUserPool();
          const attributeList = [
            new CognitoUserAttribute({ Name: "email", Value: email }),
          ];
          pool.signUp(username, password, attributeList, [], (err, result) => {
            if (err) {
              resolve({
                error: { status: "CUSTOM_ERROR", error: err.message },
              });
            } else {
              resolve({ data: null as any });
            }
          });
        });
      },
    }),

    confirmSignUp: builder.mutation<void, { username: string; code: string }>({
      queryFn: async ({ username, code }) => {
        return new Promise((resolve) => {
          const pool = getUserPool();
          const cognitoUser = new CognitoUser({
            Username: username,
            Pool: pool,
          });
          cognitoUser.confirmRegistration(code, true, (err, result) => {
            if (err) {
              resolve({
                error: { status: "CUSTOM_ERROR", error: err.message },
              });
            } else {
              resolve({ data: null as any });
            }
          });
        });
      },
    }),

    signOut: builder.mutation<void, void>({
      queryFn: async () => {
        return new Promise((resolve) => {
          try {
            const pool = getUserPool();
            const cognitoUser = pool.getCurrentUser();
            if (cognitoUser) {
              cognitoUser.signOut(() => {
                currentCognitoUser = null;
                resolve({ data: null as any });
              });
            } else {
              resolve({ data: null as any });
            }
          } catch (e: any) {
            resolve({ error: { status: "CUSTOM_ERROR", error: e.message } });
          }
        });
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useSignInMutation,
  useSignUpMutation,
  useConfirmSignUpMutation,
  useSignOutMutation,
} = authApi;
