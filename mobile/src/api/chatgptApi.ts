import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface PracticeResponse {
  question: string;
  hints: string[];
  answer: string;
  fullSolution?: string;
}

export interface PracticeProblemsResponse {
  problems: PracticeResponse[];
}

export const chatgptApi = createApi({
  reducerPath: "chatgptApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    getChatGPTResponse: builder.mutation<PracticeResponse, { text: string }>({
      query: (body) => ({
        url: "openai/solve",
        method: "POST",
        body,
      }),
    }),

    getChatGPTProblems: builder.mutation<
      PracticeProblemsResponse,
      {
        text: string;
        subject?: string;
        topic?: string;
        difficulty?: "easy" | "medium" | "hard";
        amount?: number;
      }
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
