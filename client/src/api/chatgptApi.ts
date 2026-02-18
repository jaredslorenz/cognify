import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Structured response returned from the updated backend controller
 */
export interface PracticeResponse {
  question: string;
  hints: string[];
  answer: string;
  fullSolution?: string; // only returned from /solve
}

export interface PracticeProblem {
  question: string;
  hints: string[];
  answer: string;
}

export interface PracticeProblemsResponse {
  problems: PracticeProblem[];
}

/**
 * Request body for solve endpoint
 */
export interface SolveRequest {
  text: string;
}

/**
 * Request body for practice endpoint
 */
export interface PracticeRequest {
  text: string;
  subject?: string;
  topic?: string;
  difficulty?: "easy" | "medium" | "hard";
  amount?: number;
}

export const chatgptApi = createApi({
  reducerPath: "chatgptApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    /**
     * Solve endpoint
     * POST /openai/solve
     */
    getChatGPTResponse: builder.mutation<PracticeResponse, SolveRequest>({
      query: (body) => ({
        url: "openai/solve",
        method: "POST",
        body,
      }),
    }),

    /**
     * Practice generation endpoint
     * POST /openai/problems
     */
    getChatGPTProblems: builder.mutation<
      PracticeProblemsResponse,
      PracticeRequest
    >({
      query: (body) => ({
        url: "openai/problems",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetChatGPTResponseMutation, useGetChatGPTProblemsMutation } =
  chatgptApi;
