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
  endpoints: (builder) => ({
    // Store a solved homework problem
    storeSolved: builder.mutation<SolvedProblem, StoreSolvedRequest>({
      query: (body) => ({
        url: "uploads/solved",
        method: "POST",
        body,
      }),
    }),

    // Store practice problems (array)
    storePractice: builder.mutation<PracticeProblem[], StorePracticeRequest>({
      query: (body) => ({
        url: "uploads/practice",
        method: "POST",
        body,
      }),
    }),

    // Fetch solved problems for a user
    getSolvedProblems: builder.query<SolvedProblem[], { userId: string }>({
      query: ({ userId }) => `uploads/solved?userId=${userId}`,
    }),

    // Fetch practice problems for a user
    getPracticeProblems: builder.query<PracticeProblem[], { userId: string }>({
      query: ({ userId }) => `uploads/practice?userId=${userId}`,
    }),

    // Fetch user stats
    getUserStats: builder.query<UserStats, { userId: string }>({
      query: ({ userId }) => `uploads/stats?userId=${userId}`,
    }),

    // Delete a problem
    deleteProblem: builder.mutation<{ deleted: string }, DeleteProblemRequest>({
      query: (body) => ({
        url: "uploads",
        method: "DELETE",
        body,
      }),
    }),

    // Delete all data for a user (called before account deletion)
    deleteUserData: builder.mutation<{ deleted: boolean }, { userId: string }>({
      query: (body) => ({
        url: "uploads/user",
        method: "DELETE",
        body,
      }),
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
