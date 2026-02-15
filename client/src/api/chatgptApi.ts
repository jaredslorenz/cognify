import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatgptApi = createApi({
  reducerPath: "chatgptApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  endpoints: (builder) => ({
    getChatGPTResponse: builder.mutation<{ content: string }, { text: string }>(
      {
        query: (body) => ({
          url: "openai/solve",
          method: "POST",
          body,
        }),
      },
    ),
    getChatGPTProblems: builder.mutation<{ content: string }, { text: string }>(
      {
        query: (body) => ({
          url: "openai/problems",
          method: "POST",
          body,
        }),
      },
    ),
  }),
});

export const { useGetChatGPTResponseMutation, useGetChatGPTProblemsMutation } =
  chatgptApi;
