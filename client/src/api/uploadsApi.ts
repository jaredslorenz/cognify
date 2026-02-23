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

    getSolvedProblems: builder.query<SolvedProblem[], { userId: string }>({
      query: ({ userId }) => `uploads/solved?userId=${userId}`,
      providesTags: ["Solved"],
    }),

    getPracticeProblems: builder.query<PracticeProblem[], { userId: string }>({
      query: ({ userId }) => `uploads/practice?userId=${userId}`,
      providesTags: ["Practice"],
    }),

    getUserStats: builder.query<UserStats, { userId: string }>({
      query: ({ userId }) => `uploads/stats?userId=${userId}`,
      providesTags: ["Stats"],
    }),

    deleteProblem: builder.mutation<{ deleted: string }, DeleteProblemRequest>({
      query: (body) => ({ url: "uploads", method: "DELETE", body }),
      invalidatesTags: ["Solved", "Practice", "Stats"],
    }),

    deleteUserData: builder.mutation<{ deleted: boolean }, { userId: string }>({
      query: (body) => ({ url: "uploads/user", method: "DELETE", body }),
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
