"use client";

import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useGetAuthUserQuery } from "@/api/authApi";
import {
  useGetSolvedProblemsQuery,
  useGetPracticeProblemsQuery,
  useGetUserStatsQuery,
  useDeleteProblemMutation,
  SolvedProblem,
  PracticeProblem,
} from "@/api/uploadsApi";

// ── TYPES ─────────────────────────────────────────────────────
type SelectedProblem = {
  type: "solved" | "practice";
  data: SolvedProblem | PracticeProblem;
};

// ── INLINE PROBLEM CARD (for modal) ──────────────────────────
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
      {/* header */}
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

        {/* Controls */}
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
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{
          background: "rgba(26,22,18,0.7)",
          backdropFilter: "blur(2px)",
        }}
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
};

// ── STAT CARD ─────────────────────────────────────────────────
const StatCard = ({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) => (
  <div
    className="flex flex-col gap-2 border-[1.5px] border-[#1A1612] bg-[#FEFAF2] p-6"
    style={{ boxShadow: "4px 4px 0 #1A1612" }}
  >
    <span
      className="text-[36px] font-light text-[#1A1612]"
      style={{
        fontFamily: "'Fraunces', serif",
        letterSpacing: "-0.03em",
        lineHeight: 1,
      }}
    >
      {value}
    </span>
    <span
      className="text-[10px] tracking-[0.15em] uppercase text-[#8A7D6A]"
      style={{ fontFamily: "'DM Mono', monospace" }}
    >
      {label}
    </span>
  </div>
);

// ── SUMMARY CARDS (clickable) ─────────────────────────────────
const SolvedCard = ({
  item,
  onOpen,
  onDelete,
  placeholder = false,
}: {
  item:
    | SolvedProblem
    | {
        id: number;
        file_name: string;
        question: string;
        date: string;
        subject: string;
      };
  onOpen?: () => void;
  onDelete?: (id: string) => void;
  placeholder?: boolean;
}) => (
  <div
    onClick={!placeholder ? onOpen : undefined}
    className={`border-[1.5px] border-[#1A1612] bg-[#FEFAF2] transition-all ${placeholder ? "opacity-30 pointer-events-none select-none" : "hover:shadow-none hover:bg-[#F4F3FC] cursor-pointer"}`}
    style={{ boxShadow: placeholder ? "none" : "4px 4px 0 #1A1612" }}
  >
    <div className="border-b-[1.5px] border-[#CEC4AE] px-5 py-3 flex items-center justify-between">
      <span
        className="text-[10px] tracking-[0.12em] uppercase text-[#3D3580]"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        {"subject" in item ? (item.subject ?? "—") : "—"}
      </span>
      <div className="flex items-center gap-3">
        <span
          className="text-[10px] text-[#8A7D6A]"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {"created_at" in item
            ? new Date(item.created_at).toLocaleDateString()
            : (item as any).date}
        </span>
        {!placeholder && onDelete && "created_at" in item && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id as string);
            }}
            className="text-[10px] text-[#CEC4AE] hover:text-red-400 transition-colors cursor-pointer"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
    <div className="px-5 py-4">
      {"file_name" in item && item.file_name && (
        <p
          className="text-[11px] text-[#8A7D6A] mb-2 truncate"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {item.file_name}
        </p>
      )}
      <p
        className="text-[13px] font-light text-[#1A1612] leading-snug line-clamp-2"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        {item.question}
      </p>
      {!placeholder && (
        <p
          className="text-[10px] tracking-[0.1em] uppercase text-[#3D3580] mt-3"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          View problem →
        </p>
      )}
    </div>
  </div>
);

const PracticeCard = ({
  item,
  onOpen,
  onDelete,
  placeholder = false,
}: {
  item:
    | PracticeProblem
    | {
        id: number;
        question: string;
        date: string;
        subject: string;
        difficulty: string;
      };
  onOpen?: () => void;
  onDelete?: (id: string) => void;
  placeholder?: boolean;
}) => (
  <div
    onClick={!placeholder ? onOpen : undefined}
    className={`border-[1.5px] border-[#1A1612] bg-[#FEFAF2] transition-all ${placeholder ? "opacity-30 pointer-events-none select-none" : "hover:shadow-none hover:bg-[#F4F3FC] cursor-pointer"}`}
    style={{ boxShadow: placeholder ? "none" : "4px 4px 0 #1A1612" }}
  >
    <div className="border-b-[1.5px] border-[#CEC4AE] px-5 py-3 flex items-center justify-between">
      <span
        className="text-[10px] tracking-[0.12em] uppercase text-[#3D3580]"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        {"subject" in item ? (item.subject ?? "—") : "—"}
      </span>
      <div className="flex items-center gap-3">
        <span
          className="text-[10px] tracking-[0.1em] uppercase text-[#CEC4AE]"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {item.difficulty}
        </span>
        <span
          className="text-[10px] text-[#8A7D6A]"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {"created_at" in item
            ? new Date(item.created_at).toLocaleDateString()
            : (item as any).date}
        </span>
        {!placeholder && onDelete && "created_at" in item && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id as string);
            }}
            className="text-[10px] text-[#CEC4AE] hover:text-red-400 transition-colors cursor-pointer"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
    <div className="px-5 py-4">
      <p
        className="text-[13px] font-light text-[#1A1612] leading-snug line-clamp-2"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        {item.question}
      </p>
      {!placeholder && (
        <p
          className="text-[10px] tracking-[0.1em] uppercase text-[#3D3580] mt-3"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          View problem →
        </p>
      )}
    </div>
  </div>
);

const SectionHeader = ({
  label,
  href,
  linkLabel,
}: {
  label: string;
  href: string;
  linkLabel: string;
}) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-3">
      <span className="block w-5 h-[1.5px] bg-[#3D3580]" />
      <span
        className="text-[10px] tracking-[0.2em] uppercase text-[#3D3580]"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        {label}
      </span>
    </div>
    <Link
      href={href}
      className="text-[10px] tracking-[0.12em] uppercase text-[#8A7D6A] border-b border-[#CEC4AE] hover:text-[#3D3580] hover:border-[#3D3580] transition-colors"
      style={{ fontFamily: "'DM Mono', monospace", textDecoration: "none" }}
    >
      {linkLabel} →
    </Link>
  </div>
);

// ── PLACEHOLDER DATA (logged out preview only) ────────────────
const PLACEHOLDER_SOLVED = [
  {
    id: 1,
    file_name: "calculus_hw3.jpg",
    question: "Find the derivative of f(x) = x³ sin(x) using the product rule.",
    date: "Feb 17",
    subject: "Calculus",
  },
  {
    id: 2,
    file_name: "physics_exam.jpg",
    question:
      "A 5kg block slides down a frictionless incline at 30°. Find the acceleration.",
    date: "Feb 15",
    subject: "Physics",
  },
  {
    id: 3,
    file_name: "chem_worksheet.jpg",
    question: "Balance the equation: Fe + O₂ → Fe₂O₃",
    date: "Feb 14",
    subject: "Chemistry",
  },
];
const PLACEHOLDER_PRACTICE = [
  {
    id: 1,
    question:
      "A coin is flipped 4 times. What's the probability of getting exactly 3 heads?",
    date: "Feb 17",
    subject: "Statistics",
    difficulty: "medium",
  },
  {
    id: 2,
    question: "What does Hamlet's soliloquy reveal about his state of mind?",
    date: "Feb 16",
    subject: "Literature",
    difficulty: "hard",
  },
  {
    id: 3,
    question: "Why is DNA replication described as 'semi-conservative'?",
    date: "Feb 15",
    subject: "Biology",
    difficulty: "easy",
  },
];

// ── LOGGED OUT STATE ─────────────────────────────────────────
const LoggedOutDashboard = () => (
  <div className="w-full" style={{ padding: "72px 56px" }}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full border-[1.5px] border-[#1A1612] bg-[#FEFAF2] mb-14"
      style={{ boxShadow: "5px 5px 0 #1A1612" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="border-r-[1.5px] border-[#CEC4AE] p-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-5 h-[1.5px] bg-[#3D3580]" />
            <span
              className="text-[10px] tracking-[0.2em] uppercase text-[#3D3580]"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Your Dashboard
            </span>
          </div>
          <h2
            className="font-light text-[#1A1612] mb-4"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "32px",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
            }}
          >
            Track your progress,
            <br />
            <em className="italic text-[#3D3580]">own your learning.</em>
          </h2>
          <p className="text-[12px] leading-loose text-[#4A4035] mb-8">
            Sign in to save your solved problems and practice history, track
            your progress over time, and pick up right where you left off.
          </p>
          <div className="flex">
            <Link
              href="/signin"
              className="inline-flex items-center px-7 py-3.5 text-[10px] tracking-[0.14em] uppercase text-[#F4EFE4] bg-[#1A1612] border-[1.5px] border-[#1A1612] hover:bg-[#3D3580] hover:border-[#3D3580] transition-colors"
              style={{
                textDecoration: "none",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center px-7 py-3.5 text-[10px] tracking-[0.14em] uppercase text-[#4A4035] border-[1.5px] border-[#1A1612] border-l-0 hover:text-[#3D3580] hover:bg-[#F4F3FC] transition-colors"
              style={{
                textDecoration: "none",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              Create Account
            </Link>
          </div>
        </div>
        <div className="p-10">
          <p
            className="text-[10px] tracking-[0.18em] uppercase text-[#8A7D6A] mb-5"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            What you'll see here
          </p>
          {[
            "History of every problem you've solved",
            "All your generated practice problems",
            "Stats — streak, hints used, total solved",
            "Quick access to continue where you left off",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 mb-3">
              <div
                className="w-5 h-5 flex-shrink-0 flex items-center justify-center border-[1.5px] border-[#3D3580]"
                style={{ marginTop: "1px" }}
              >
                <div className="w-2 h-2 bg-[#3D3580]" />
              </div>
              <p
                className="text-[12px] leading-loose text-[#4A4035]"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <p
        className="text-[10px] tracking-[0.18em] uppercase text-[#CEC4AE] mb-6 text-center"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        Preview — sign in to see your real data
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 opacity-25 pointer-events-none select-none blur-[2px]">
        {[
          ["12", "Problems Solved"],
          ["34", "Practice Done"],
          ["47", "Hints Used"],
          ["5d", "Day Streak"],
        ].map(([v, l], i) => (
          <StatCard key={i} value={v} label={l} />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 blur-[2px]">
        {PLACEHOLDER_SOLVED.map((item) => (
          <SolvedCard key={item.id} item={item} placeholder />
        ))}
      </div>
    </motion.div>
  </div>
);

// ── LOGGED IN STATE ──────────────────────────────────────────
const LoggedInDashboard = ({ username }: { username: string }) => {
  const [selected, setSelected] = useState<SelectedProblem | null>(null);

  // userId no longer needed — server reads it from the verified JWT
  const { data: solved, isLoading: solvedLoading } =
    useGetSolvedProblemsQuery();
  const { data: practiced, isLoading: practiceLoading } =
    useGetPracticeProblemsQuery();
  const { data: stats, isLoading: statsLoading } = useGetUserStatsQuery();
  const [deleteProblem] = useDeleteProblemMutation();

  const handleDelete = async (id: string, type: "solved" | "practice") => {
    await deleteProblem({ id, type });
  };

  return (
    <div className="w-full" style={{ padding: "72px 56px" }}>
      {selected && (
        <ProblemModal selected={selected} onClose={() => setSelected(null)} />
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-14"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="block w-7 h-[1.5px] bg-[#3D3580]" />
          <span
            className="text-[10px] tracking-[0.22em] uppercase text-[#3D3580]"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Dashboard
          </span>
        </div>
        <h1
          className="font-light text-[#1A1612]"
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(36px, 4vw, 52px)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          Welcome back, <em className="italic text-[#3D3580]">{username}.</em>
        </h1>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14"
      >
        {[
          {
            href: "/solve",
            label: "Solve Homework",
            desc: "Upload a photo of any problem and get a step-by-step solution.",
            cta: "Go to Solve →",
          },
          {
            href: "/practice",
            label: "Practice Problems",
            desc: "Generate custom practice problems from your notes or topics.",
            cta: "Go to Practice →",
          },
        ].map((action, i) => (
          <Link
            key={i}
            href={action.href}
            className="block border-[1.5px] border-[#1A1612] bg-[#FEFAF2] p-7 hover:bg-[#F4F3FC] transition-all group"
            style={{ boxShadow: "4px 4px 0 #1A1612", textDecoration: "none" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="block w-4 h-[1.5px] bg-[#3D3580]" />
              <span
                className="text-[10px] tracking-[0.15em] uppercase text-[#3D3580]"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {action.label}
              </span>
            </div>
            <p
              className="text-[12px] leading-loose text-[#4A4035] mb-4"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {action.desc}
            </p>
            <span
              className="text-[10px] tracking-[0.12em] uppercase text-[#3D3580] border-b border-[#C5C0E8] group-hover:border-[#3D3580] transition-colors"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {action.cta}
            </span>
          </Link>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-14"
      >
        <SectionHeader
          label="Your Stats"
          href="/dashboard"
          linkLabel="Refresh"
        />
        {statsLoading ? (
          <p
            className="text-[12px] text-[#8A7D6A]"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Loading stats...
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard value={stats?.solved ?? 0} label="Problems Solved" />
            <StatCard value={stats?.practiced ?? 0} label="Practice Done" />
            <StatCard value={stats?.hintsUsed ?? 0} label="Hints Used" />
            <StatCard value={`${stats?.streak ?? 0}d`} label="Current Streak" />
          </div>
        )}
      </motion.div>

      {/* Recent solved */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-14"
      >
        <SectionHeader
          label="Recently Solved"
          href="/solve"
          linkLabel="Solve new"
        />
        {solvedLoading ? (
          <p
            className="text-[12px] text-[#8A7D6A]"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Loading...
          </p>
        ) : solved && solved.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {solved.slice(0, 6).map((item) => (
              <SolvedCard
                key={item.id}
                item={item}
                onOpen={() => setSelected({ type: "solved", data: item })}
                onDelete={(id) => handleDelete(id, "solved")}
              />
            ))}
          </div>
        ) : (
          <p
            className="text-[12px] text-[#8A7D6A]"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            No solved problems yet —{" "}
            <Link href="/solve" style={{ color: "#3D3580" }}>
              try solving one
            </Link>
            .
          </p>
        )}
      </motion.div>

      {/* Recent practice */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <SectionHeader
          label="Recent Practice"
          href="/practice"
          linkLabel="Practice more"
        />
        {practiceLoading ? (
          <p
            className="text-[12px] text-[#8A7D6A]"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Loading...
          </p>
        ) : practiced && practiced.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {practiced.slice(0, 6).map((item) => (
              <PracticeCard
                key={item.id}
                item={item}
                onOpen={() => setSelected({ type: "practice", data: item })}
                onDelete={(id) => handleDelete(id, "practice")}
              />
            ))}
          </div>
        ) : (
          <p
            className="text-[12px] text-[#8A7D6A]"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            No practice problems yet —{" "}
            <Link href="/practice" style={{ color: "#3D3580" }}>
              generate some
            </Link>
            .
          </p>
        )}
      </motion.div>
    </div>
  );
};

// ── PAGE ─────────────────────────────────────────────────────
const DashboardContent = () => {
  const { data: user, isLoading } = useGetAuthUserQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span
          className="text-[11px] tracking-[0.15em] uppercase text-[#8A7D6A]"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Loading...
        </span>
      </div>
    );
  }

  return user ? (
    <LoggedInDashboard username={user.username ?? "there"} />
  ) : (
    <LoggedOutDashboard />
  );
};

const DashboardPage = () => {
  return (
    <Provider store={store}>
      <div
        className="w-full flex flex-col min-h-screen"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        <Header />
        <main className="flex-1 w-full border-b-[1.5px] border-[#1A1612]">
          <DashboardContent />
        </main>
        <Footer />
      </div>
    </Provider>
  );
};

export default DashboardPage;
