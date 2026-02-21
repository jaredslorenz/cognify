import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

export interface StoreSolvedRequest {
  userId: string;
  file_name?: string;
  question: string;
  hints: string[];
  answer: string;
  full_solution?: string;
  subject?: string;
}

export interface StorePracticeRequest {
  userId: string;
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
  userId: string;
}

// ── API SLICE ─────────────────────────────────────────────────

export const userUploadsApi = createApi({
  reducerPath: "userUploadsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  tagTypes: ["Solved", "Practice", "Stats"], // add this
  endpoints: (builder) => ({
    storeSolved: builder.mutation<SolvedProblem, StoreSolvedRequest>({
      query: (body) => ({ url: "uploads/solved", method: "POST", body }),
      invalidatesTags: ["Solved", "Stats"], // add this
    }),

    storePractice: builder.mutation<PracticeProblem[], StorePracticeRequest>({
      query: (body) => ({ url: "uploads/practice", method: "POST", body }),
      invalidatesTags: ["Practice", "Stats"], // add this
    }),

    getSolvedProblems: builder.query<SolvedProblem[], { userId: string }>({
      query: ({ userId }) => `uploads/solved?userId=${userId}`,
      providesTags: ["Solved"], // add this
    }),

    getPracticeProblems: builder.query<PracticeProblem[], { userId: string }>({
      query: ({ userId }) => `uploads/practice?userId=${userId}`,
      providesTags: ["Practice"], // add this
    }),

    getUserStats: builder.query<UserStats, { userId: string }>({
      query: ({ userId }) => `uploads/stats?userId=${userId}`,
      providesTags: ["Stats"], // add this
    }),

    deleteProblem: builder.mutation<{ deleted: string }, DeleteProblemRequest>({
      query: (body) => ({ url: "uploads", method: "DELETE", body }),
      invalidatesTags: ["Solved", "Practice", "Stats"], // add this
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
} = userUploadsApi;
