"use client";

import { useGetAuthUserQuery } from "@/api/authApi";
import { useGetUserUploadsQuery } from "@/api/uploadsApi";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

const MotionLink = motion(Link);

const DashboardBox = () => {
  const { data: user, error, isLoading } = useGetAuthUserQuery();

  const {
    data: uploads,
    isLoading: uploadsLoading,
    error: uploadsError,
  } = useGetUserUploadsQuery(
    { userId: user?.userId as string },
    { skip: !user },
  );

  return (
    <section
      className="w-full border-b-[1.5px] border-t-[1.5px] border-[#1A1612]"
      style={{ fontFamily: "'DM Mono', monospace" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        {isLoading ? (
          <div style={{ padding: "64px 56px" }}>
            <p className="text-[13px] text-[#4A4035]">Loading...</p>
          </div>
        ) : error || !user ? (
          /* ── NOT SIGNED IN ── */
          <div className="grid grid-cols-1 lg:grid-cols-2 border-[#1A1612]">
            <div
              className="border-r-[1.5px] border-[#1A1612]"
              style={{ padding: "72px 56px" }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="block w-7 h-[1.5px] bg-[#3D3580]" />
                <span className="text-[10px] tracking-[0.22em] uppercase text-[#3D3580]">
                  Get started
                </span>
              </div>
              <h3
                className="font-light text-[#1A1612] mb-4"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "clamp(32px, 3vw, 48px)",
                  letterSpacing: "-0.025em",
                }}
              >
                Track your progress,
                <br />
                <em className="italic text-[#3D3580]">own your learning.</em>
              </h3>
              <p className="text-[13px] leading-loose text-[#4A4035] max-w-sm mb-10">
                Create a free account to save your practice history, revisit
                solved problems, and watch your understanding grow over time.
              </p>
              <div className="flex">
                <MotionLink
                  href="/signup"
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center px-8 py-4 text-[11px] tracking-[0.14em] uppercase text-[#F4EFE4] bg-[#1A1612] border-[1.5px] border-[#1A1612] hover:bg-[#3D3580] hover:border-[#3D3580] transition-colors cursor-pointer"
                >
                  Sign Up — it's free
                </MotionLink>
                <MotionLink
                  href="/signin"
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center px-8 py-4 text-[11px] tracking-[0.14em] uppercase text-[#4A4035] border-[1.5px] border-[#1A1612] border-l-0 hover:text-[#3D3580] hover:bg-[#F4F3FC] transition-colors cursor-pointer"
                >
                  Sign In
                </MotionLink>
              </div>
            </div>

            {/* Right: decorative lined panel */}
            <div
              className="relative overflow-hidden hidden lg:block"
              style={{ background: "#EDE5D4" }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(transparent, transparent 31px, #CEC4AE 31px, #CEC4AE 32.5px)",
                  opacity: 0.5,
                }}
              />
              <div
                className="absolute top-0 bottom-0 pointer-events-none"
                style={{
                  left: "72px",
                  width: "1.5px",
                  background: "rgba(180,120,120,0.28)",
                }}
              />
              <div
                className="relative z-10 flex flex-col justify-center h-full"
                style={{ padding: "56px 48px 56px 96px" }}
              >
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#3D3580] mb-4">
                  Why sign up?
                </p>
                {[
                  "Save and revisit all solved problems",
                  "Track which topics need more work",
                  "Pick up exactly where you left off",
                  "Completely free, always",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 mb-4">
                    <span
                      className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-[10px] text-[#F4EFE4] mt-0.5"
                      style={{ background: "#3D3580" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[12px] leading-relaxed text-[#4A4035]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── SIGNED IN ── */
          <div style={{ padding: "56px 56px" }}>
            <div className="flex items-baseline gap-6 mb-10">
              <h3
                className="font-light text-[#1A1612] whitespace-nowrap"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "32px",
                  letterSpacing: "-0.025em",
                }}
              >
                Recent work,{" "}
                <em className="italic text-[#3D3580]">{user.username}</em>
              </h3>
              <div className="flex-1 h-[1.5px] bg-[#CEC4AE]" />
            </div>

            {uploadsLoading ? (
              <p className="text-[13px] text-[#4A4035]">
                Loading your uploads...
              </p>
            ) : uploadsError ? (
              <p className="text-[13px] text-[#4A4035]">
                Failed to load uploads.
              </p>
            ) : uploads && uploads.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {uploads.slice(0, 5).map((upload) => (
                  <li
                    key={upload.id}
                    className="bg-[#FEFAF2] border-[1.5px] border-[#CEC4AE] hover:border-[#3D3580] hover:bg-[#F4F3FC] transition-all cursor-pointer"
                    style={{ padding: "20px 24px" }}
                  >
                    <p className="text-[13px] text-[#1A1612] mb-1 truncate">
                      {upload.file_name.split("/").pop() || "Untitled File"}
                    </p>
                    <p className="text-[11px] text-[#8A7D6A] mb-2 truncate">
                      {upload.file_url.split("/").pop() || "Untitled Upload"}
                    </p>
                    <p className="text-[10px] tracking-[0.08em] uppercase text-[#8A7D6A] mb-3">
                      {new Date(upload.created_at).toLocaleDateString()}
                    </p>
                    {upload.ai_response && (
                      <p className="text-[12px] leading-relaxed text-[#4A4035] line-clamp-2">
                        {upload.ai_response}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-[#4A4035] mb-10">
                No uploads yet — try solving a problem or generating a practice
                set.
              </p>
            )}

            <MotionLink
              href="/dashboard"
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center px-8 py-4 text-[11px] tracking-[0.14em] uppercase text-[#F4EFE4] bg-[#1A1612] border-[1.5px] border-[#1A1612] hover:bg-[#3D3580] hover:border-[#3D3580] transition-colors cursor-pointer"
            >
              View Full Dashboard →
            </MotionLink>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default DashboardBox;
