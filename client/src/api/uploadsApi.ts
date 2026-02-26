import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession } from "aws-amplify/auth";

// ── TYPES ─────────────────────────────────────────────────────
export interface SolvedProblem {
  id: string;
  user_id: string;
  file_name: string | null;
  question: string;
  hints: string[];
  answer: string;
  full_solution: string | null;
  subject: string | null;
  created_at: string;
}

export interface PracticeProblem {
  id: string;
  user_id: string;
  file_name: string | null;
  question: string;
  hints: string[];
  answer: string;
  subject: string | null;
  difficulty: string;
  created_at: string;
}

export interface UserStats {
  solved: number;
  practiced: number;
  hintsUsed: number;
  streak: number;
}

// ── STORE REQUESTS ────────────────────────────────────────────
// Note: userId removed from all requests — server extracts it from JWT
export interface StoreSolvedRequest {
  file_name?: string;
  question: string;
  hints: string[];
  answer: string;
  full_solution?: string;
  subject?: string;
}

export interface StorePracticeRequest {
  file_name?: string;
  subject?: string;
  difficulty?: "easy" | "medium" | "hard";
  problems: {
    question: string;
    hints: string[];
    answer: string;
  }[];
}

export interface DeleteProblemRequest {
  id: string;
  type: "solved" | "practice";
}

// ── API SLICE ─────────────────────────────────────────────────
export const userUploadsApi = createApi({
  reducerPath: "userUploadsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: async (headers) => {
      try {
        const session = await fetchAuthSession();
        const { idToken } = session.tokens ?? {};
        if (idToken) {
          headers.set("Authorization", `Bearer ${idToken}`);
        }
      } catch {
        // Not authenticated — request will be rejected by server with 401
      }
      return headers;
    },
  }),
  tagTypes: ["Solved", "Practice", "Stats"],
  endpoints: (builder) => ({
    storeSolved: builder.mutation<SolvedProblem, StoreSolvedRequest>({
      query: (body) => ({ url: "uploads/solved", method: "POST", body }),
      invalidatesTags: ["Solved", "Stats"],
    }),
    storePractice: builder.mutation<PracticeProblem[], StorePracticeRequest>({
      query: (body) => ({ url: "uploads/practice", method: "POST", body }),
      invalidatesTags: ["Practice", "Stats"],
    }),
    getSolvedProblems: builder.query<SolvedProblem[], void>({
      query: () => "uploads/solved",
      providesTags: ["Solved"],
    }),
    getPracticeProblems: builder.query<PracticeProblem[], void>({
      query: () => "uploads/practice",
      providesTags: ["Practice"],
    }),
    getUserStats: builder.query<UserStats, void>({
      query: () => "uploads/stats",
      providesTags: ["Stats"],
    }),
    deleteProblem: builder.mutation<{ deleted: string }, DeleteProblemRequest>({
      query: (body) => ({ url: "uploads", method: "DELETE", body }),
      invalidatesTags: ["Solved", "Practice", "Stats"],
    }),
    deleteUserData: builder.mutation<{ deleted: boolean }, void>({
      query: () => ({ url: "uploads/user", method: "DELETE" }),
      invalidatesTags: ["Solved", "Practice", "Stats"],
    }),
  }),
});

export const {
  useStoreSolvedMutation,
  useStorePracticeMutation,
  useGetSolvedProblemsQuery,
  useGetPracticeProblemsQuery,
  useGetUserStatsQuery,
  useDeleteProblemMutation,
  useDeleteUserDataMutation,
} = userUploadsApi;
