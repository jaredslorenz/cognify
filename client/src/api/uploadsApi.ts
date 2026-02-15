import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userUploadsApi = createApi({
  reducerPath: "userUploadsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    // Upload file to S3
    uploadToS3: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: "uploads/s3",
        method: "POST",
        body: formData,
      }),
    }),

    // Store the record in DB
    uploadAndStore: builder.mutation<
      {
        id: number;
        user_id: string;
        file_name: string;
        file_url: string;
        ai_response: string;
      },
      {
        userId: string;
        file_name: string;
        file_url: string;
        aiResponse: string;
      }
    >({
      query: (body) => ({
        url: "uploads/store",
        method: "POST",
        body,
      }),
    }),

    // Fetch user uploads
    getUserUploads: builder.query<
      {
        id: number;
        file_name: string;
        file_url: string;
        ai_response: string;
        created_at: string;
      }[],
      { userId: string }
    >({
      query: ({ userId }) => `uploads?userId=${userId}`,
    }),
  }),
});

export const {
  useUploadAndStoreMutation,
  useGetUserUploadsQuery,
  useUploadToS3Mutation,
} = userUploadsApi;
