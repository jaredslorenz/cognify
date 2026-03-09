import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../utils/getAuthToken";

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
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: async (headers) => {
      const token = await getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Solved", "Practice", "Stats"],
  endpoints: (builder) => ({
    getSolvedProblems: builder.query<SolvedProblem[], void>({
      query: () => `uploads/solved`,
      providesTags: ["Solved"],
    }),

    getPracticeProblems: builder.query<PracticeProblem[], void>({
      query: () => `uploads/practice`,
      providesTags: ["Practice"],
    }),

    getUserStats: builder.query<UserStats, void>({
      query: () => `uploads/stats`,
      providesTags: ["Stats"],
    }),

    storeSolved: builder.mutation<
      void,
      {
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

    deleteProblem: builder.mutation<
      { deleted: string },
      { id: number; type: "solved" | "practice" }
    >({
      query: (body) => ({
        url: "uploads",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Solved", "Practice", "Stats"],
    }),
  }),
});

export const {
  useGetSolvedProblemsQuery,
  useGetPracticeProblemsQuery,
  useGetUserStatsQuery,
  useStoreSolvedMutation,
  useStorePracticeMutation,
  useDeleteProblemMutation,
} = uploadsApi;
