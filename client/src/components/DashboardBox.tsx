"use client";

import { useGetAuthUserQuery } from "@/api/authApi";
import {
  useGetSolvedProblemsQuery,
  useGetPracticeProblemsQuery,
  SolvedProblem,
  PracticeProblem,
} from "@/api/uploadsApi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";

const MotionLink = motion(Link);

// ── TYPES ─────────────────────────────────────────────────────
type SelectedProblem = {
  type: "solved" | "practice";
  data: SolvedProblem | PracticeProblem;
};

// ── MODAL PROBLEM CARD ────────────────────────────────────────
const ModalProblemCard = ({
  problem,
  type,
}: {
  problem: SolvedProblem | PracticeProblem;
  type: "solved" | "practice";
}) => {
  const [hintStep, setHintStep] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const hints: string[] = Array.isArray(problem.hints)
    ? problem.hints
    : typeof problem.hints === "string"
      ? JSON.parse(problem.hints)
      : [];

  const fullSolution =
    "full_solution" in problem ? problem.full_solution : undefined;

  return (
    <div
      className="w-full border-[1.5px] border-[#1A1612] bg-[#FEFAF2]"
      style={{ boxShadow: "5px 5px 0 #1A1612" }}
    >
      <div className="border-b-[1.5px] border-[#1A1612] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="block w-5 h-[1.5px] bg-[#3D3580]" />
          <span
            className="text-[10px] tracking-[0.2em] uppercase text-[#3D3580]"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {type === "solved" ? "Solution" : "Practice Problem"}
          </span>
        </div>
        {problem.subject && (
          <span
            className="text-[10px] tracking-[0.12em] uppercase text-[#8A7D6A]"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {problem.subject}
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col gap-4">
        <p
          className="font-light leading-relaxed text-[#1A1612]"
          style={{ fontFamily: "'Fraunces', serif", fontSize: "16px" }}
        >
          {problem.question}
        </p>

        {hints.length > 0 && (
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {hints.slice(0, hintStep).map((hint, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.2 }}
                  className="text-[12px] leading-loose overflow-hidden"
                  style={{
                    background: "#F4F3FC",
                    border: "1px solid #C5C0E8",
                    color: "#3D3580",
                    padding: "10px 16px",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  <span className="text-[10px] tracking-[0.1em] uppercase mr-2 opacity-50">
                    hint {i + 1}
                  </span>
                  {hint}
                </motion.div>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.25 }}
                  className="text-[12px] leading-loose overflow-hidden"
                  style={{
                    background: "#EAE8F5",
                    border: "1.5px solid #3D3580",
                    color: "#3D3580",
                    padding: "10px 16px",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  <span className="text-[10px] tracking-[0.1em] uppercase mr-2 opacity-50">
                    answer
                  </span>
                  <strong>{problem.answer}</strong>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {revealed && fullSolution && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.25, delay: 0.1 }}
                  className="text-[12px] leading-loose overflow-hidden whitespace-pre-wrap"
                  style={{
                    background: "#F4EFE4",
                    border: "1.5px solid #CEC4AE",
                    color: "#4A4035",
                    padding: "14px 16px",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  <span className="text-[10px] tracking-[0.1em] uppercase mr-2 opacity-50 block mb-2">
                    full walkthrough
                  </span>
                  {fullSolution}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="flex items-start justify-between mt-1">
          <div className="flex flex-col gap-2">
            {!revealed ? (
              <>
                <button
                  onClick={() => {
                    if (hintStep < hints.length) setHintStep((h) => h + 1);
                    else setRevealed(true);
                  }}
                  className="text-[10px] tracking-[0.12em] uppercase text-[#3D3580] border-b border-[#C5C0E8] cursor-pointer hover:border-[#3D3580] transition-colors w-fit"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {hintStep === 0
                    ? "Show first hint →"
                    : hintStep < hints.length
                      ? `Next hint (${hintStep}/${hints.length}) →`
                      : "Reveal answer →"}
                </button>
                {hintStep < hints.length && (
                  <button
                    onClick={() => {
                      setHintStep(hints.length);
                      setRevealed(true);
                    }}
                    className="text-[10px] tracking-[0.12em] uppercase text-[#CEC4AE] border-b border-transparent hover:text-[#8A7D6A] hover:border-[#CEC4AE] transition-colors cursor-pointer w-fit"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    Skip hints
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => {
                  setHintStep(0);
                  setRevealed(false);
                }}
                className="text-[10px] tracking-[0.12em] uppercase text-[#8A7D6A] border-b border-[#CEC4AE] cursor-pointer hover:text-[#3D3580] hover:border-[#3D3580] transition-colors w-fit"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                ↺ Try again
              </button>
            )}
          </div>
          <div className="flex gap-1.5">
            {hints.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full border-[1.5px] transition-all duration-200"
                style={{
                  background: i < hintStep ? "#3D3580" : "transparent",
                  borderColor: "#3D3580",
                }}
              />
            ))}
            <div
              className="w-2 h-2 rounded-full border-[1.5px] transition-all duration-200"
              style={{
                background: revealed ? "#5548B0" : "transparent",
                borderColor: "#5548B0",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ── MODAL ─────────────────────────────────────────────────────
const ProblemModal = ({
  selected,
  onClose,
}: {
  selected: SelectedProblem;
  onClose: () => void;
}) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(26,22,18,0.7)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-[#1A1612] px-6 py-4 border-[1.5px] border-[#1A1612] border-b-0">
          <div className="flex items-center gap-3">
            <span className="block w-5 h-[1.5px] bg-[#3D3580]" />
            <span
              className="text-[10px] tracking-[0.2em] uppercase text-[#8A7D6A]"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {selected.type === "solved"
                ? "Solved Problem"
                : "Practice Problem"}
              {selected.data.file_name ? ` · ${selected.data.file_name}` : ""}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[10px] tracking-[0.12em] uppercase text-[#5a5045] hover:text-[#F4EFE4] transition-colors cursor-pointer"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Close ✕
          </button>
        </div>
        <ModalProblemCard problem={selected.data} type={selected.type} />
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

// ── DASHBOARD BOX ─────────────────────────────────────────────
const DashboardBox = () => {
  const [selected, setSelected] = useState<SelectedProblem | null>(null);

  const { data: user, error, isLoading } = useGetAuthUserQuery();

  // userId no longer passed — server reads it from the verified JWT
  const { data: solved, isLoading: solvedLoading } = useGetSolvedProblemsQuery(
    undefined,
    { skip: !user },
  );

  const { data: practiced, isLoading: practiceLoading } =
    useGetPracticeProblemsQuery(undefined, { skip: !user });

  const uploadsLoading = solvedLoading || practiceLoading;

  return (
    <section
      className="w-full border-b-[1.5px] border-t-[1.5px] border-[#1A1612]"
      style={{ fontFamily: "'DM Mono', monospace" }}
    >
      {selected && (
        <ProblemModal selected={selected} onClose={() => setSelected(null)} />
      )}

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
                Loading your history...
              </p>
            ) : (
              <div className="flex flex-col gap-10 mb-10">
                {/* Recent solved */}
                {solved && solved.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="block w-4 h-[1.5px] bg-[#3D3580]" />
                      <span className="text-[10px] tracking-[0.18em] uppercase text-[#3D3580]">
                        Recently Solved
                      </span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {solved.slice(0, 3).map((item) => (
                        <li
                          key={item.id}
                          onClick={() =>
                            setSelected({ type: "solved", data: item })
                          }
                          className="bg-[#FEFAF2] border-[1.5px] border-[#CEC4AE] hover:border-[#3D3580] hover:bg-[#F4F3FC] transition-all cursor-pointer"
                          style={{ padding: "20px 24px" }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            {item.subject && (
                              <p className="text-[10px] tracking-[0.12em] uppercase text-[#3D3580]">
                                {item.subject}
                              </p>
                            )}
                            <p className="text-[10px] tracking-[0.08em] uppercase text-[#8A7D6A]">
                              {new Date(item.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <p
                            className="text-[13px] font-light text-[#1A1612] mb-3 line-clamp-2"
                            style={{ fontFamily: "'Fraunces', serif" }}
                          >
                            {item.question}
                          </p>
                          <p className="text-[10px] tracking-[0.1em] uppercase text-[#3D3580]">
                            View problem →
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recent practice */}
                {practiced && practiced.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="block w-4 h-[1.5px] bg-[#3D3580]" />
                      <span className="text-[10px] tracking-[0.18em] uppercase text-[#3D3580]">
                        Recent Practice
                      </span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {practiced.slice(0, 3).map((item) => (
                        <li
                          key={item.id}
                          onClick={() =>
                            setSelected({ type: "practice", data: item })
                          }
                          className="bg-[#FEFAF2] border-[1.5px] border-[#CEC4AE] hover:border-[#3D3580] hover:bg-[#F4F3FC] transition-all cursor-pointer"
                          style={{ padding: "20px 24px" }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            {item.subject && (
                              <p className="text-[10px] tracking-[0.12em] uppercase text-[#3D3580]">
                                {item.subject}
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] tracking-[0.08em] uppercase text-[#8A7D6A]">
                                {new Date(item.created_at).toLocaleDateString()}
                              </p>
                              <p className="text-[10px] tracking-[0.08em] uppercase text-[#CEC4AE]">
                                {item.difficulty}
                              </p>
                            </div>
                          </div>
                          <p
                            className="text-[13px] font-light text-[#1A1612] mb-2 line-clamp-2"
                            style={{ fontFamily: "'Fraunces', serif" }}
                          >
                            {item.question}
                          </p>
                          <p
                            className="text-[10px] tracking-[0.1em] uppercase text-[#3D3580]"
                            style={{ fontFamily: "'DM Mono', monospace" }}
                          >
                            View problem →
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(!solved || solved.length === 0) &&
                  (!practiced || practiced.length === 0) && (
                    <p className="text-[13px] text-[#4A4035]">
                      No history yet — try solving a problem or generating a
                      practice set.
                    </p>
                  )}
              </div>
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
