"use client";

import { useGetAuthUserQuery } from "@/api/authApi";
import { useGetUserUploadsQuery } from "@/api/uploadsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { motion } from "framer-motion";
import { Provider } from "react-redux";
import { store } from "../store";
import Header from "@/components/Header";

const DashboardPage = () => {
  const { data: user, isLoading: authLoading } = useGetAuthUserQuery();

  // only fetch uploads if user is signed in
  const {
    data: uploads,
    isLoading: uploadsLoading,
    error: uploadsError,
  } = useGetUserUploadsQuery(user ? { userId: user.userId } : skipToken);

  if (authLoading) {
    return <p className="text-center mt-10">Loading user...</p>;
  }

  if (!user) {
    return (
      <Provider store={store}>
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold">
            Please sign in to view your dashboard
          </h2>
        </div>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <Header />
      <div className="max-w-6xl mx-auto px-4 mt-10 space-y-16">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6">
          Your Dashboard, {user.username}
        </h1>

        {/* Quick Stats Section */}
        <section className="bg-gradient-to-r  from-[#ffe9f6] to-[#ece9ff] rounded-2xl p-8 shadow-inner">
          <h2 className="text-xl font-semibold mb-6 border-l-4 border-[#de2160] pl-3">
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white shadow-md rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Uploads
              </h3>
              <p className="text-2xl font-bold text-gray-600">
                {uploads?.length ?? 0}
              </p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-700">
                Latest Upload
              </h3>
              <p className="text-sm text-gray-600">
                {uploads?.[0]
                  ? new Date(uploads[0].created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-700">
                AI Responses
              </h3>
              <p className="text-2xl font-bold text-gray-600">
                {uploads?.length ?? 0}
              </p>
            </div>
          </div>
        </section>

        {/* Recent Uploads Section */}
        <section className="bg-gradient-to-r from-[#ffe9f6] to-[#ece9ff] rounded-2xl p-8 shadow-inner">
          <h2 className="text-xl font-semibold mb-6 border-l-4 border-[#8e21de] pl-3">
            Recent Uploads
          </h2>
          {uploadsLoading ? (
            <p>Loading your uploads...</p>
          ) : uploadsError ? (
            <p className="text-red-500">Error loading uploads</p>
          ) : uploads && uploads.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploads.map((upload) => (
                <motion.div
                  key={upload.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition"
                >
                  <img
                    src={upload.file_url}
                    alt={upload.file_name}
                    className="rounded-md max-h-48 object-contain w-full"
                  />
                  <p className="mt-2 font-semibold">{upload.file_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(upload.created_at).toLocaleString()}
                  </p>
                  <div className="mt-3 bg-gray-100 rounded-md p-2 text-sm text-black whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {upload.ai_response}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                You haven’t uploaded anything yet.
              </p>
              <a
                href="/practice"
                className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#de2160] via-[#8e21de] to-[#3e21de] text-white font-medium shadow-md hover:shadow-lg transition"
              >
                Upload Your First Notes
              </a>
            </div>
          )}
        </section>

        {/* Suggested Next Steps Section */}
        <section className="bg-gradient-to-r from-[#ffe9f6] to-[#ece9ff] rounded-2xl p-8 shadow-inner">
          <h2 className="text-xl font-semibold mb-6 border-l-4 border-[#3e21de] pl-3">
            Suggested Next Steps
          </h2>
          <ul className="space-y-3">
            <li className="p-4 bg-white shadow-md rounded-xl">
              Try searching your notes for key concepts
            </li>
            <li className="p-4 bg-white shadow-md rounded-xl">
              Generate practice problems from your latest upload
            </li>
            <li className="p-4 bg-white shadow-md rounded-xl">
              Track progress over time in the Practice section
            </li>
          </ul>
        </section>
      </div>
    </Provider>
  );
};

export default DashboardPage;
