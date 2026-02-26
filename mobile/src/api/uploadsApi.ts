import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface SolvedProblem {
  id: number;
  file_name: string;
  question: string;
  hints: string[];
  answer: string;
  full_solution: string;
  subject?: string;
  created_at: string;
}

export interface PracticeProblem {
  id: number;
  file_name: string;
  question: string;
  hints: string[];
  answer: string;
  subject?: string;
  difficulty?: string;
  created_at: string;
}

export interface UserStats {
  solved: number;
  practiced: number;
  hintsUsed: number;
  streak: number;
}

export const uploadsApi = createApi({
  reducerPath: "uploadsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Solved", "Practice", "Stats"],
  endpoints: (builder) => ({
    getSolvedProblems: builder.query<SolvedProblem[], string>({
      query: (userId) => `uploads/solved?userId=${userId}`,
      providesTags: ["Solved"],
    }),

    getPracticeProblems: builder.query<PracticeProblem[], string>({
      query: (userId) => `uploads/practice?userId=${userId}`,
      providesTags: ["Practice"],
    }),

    getUserStats: builder.query<UserStats, string>({
      query: (userId) => `uploads/stats?userId=${userId}`,
      providesTags: ["Stats"],
    }),

    storeSolved: builder.mutation<
      void,
      {
        userId: string;
        file_name?: string;
        question: string;
        hints: string[];
        answer: string;
        full_solution?: string;
        subject?: string;
      }
    >({
      query: (body) => ({
        url: "uploads/solved",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Solved", "Stats"],
    }),

    storePractice: builder.mutation<
      void,
      {
        userId: string;
        file_name?: string;
        problems: { question: string; hints: string[]; answer: string }[];
        subject?: string;
        difficulty?: string;
      }
    >({
      query: (body) => ({
        url: "uploads/practice",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Practice", "Stats"],
    }),
  }),
});

export const {
  useGetSolvedProblemsQuery,
  useGetPracticeProblemsQuery,
  useGetUserStatsQuery,
  useStoreSolvedMutation,
  useStorePracticeMutation,
} = uploadsApi;
