"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileText, BookOpen } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useGetAuthUserQuery } from "@/api/authApi";
import DashboardBox from "./DashboardBox";

const MotionLink = motion(Link);

/* ── SUBJECTS DATA ─────────────────────────────────────────── */
const SUBJECTS = [
  {
    label: "Calculus",
    question: "Evaluate the integral using integration by parts: ∫ x · eˣ dx",
    hints: [
      "Let u = x and dv = eˣ dx",
      "Then du = dx and v = eˣ",
      "Apply: ∫ u dv = uv − ∫ v du",
    ],
    answer: "eˣ(x − 1) + C",
  },
  {
    label: "Physics",
    question:
      "A 2 kg block slides down a frictionless incline at 30°. What is its acceleration?",
    hints: [
      "Draw a free body diagram — only gravity acts along the slope",
      "The component of gravity along the incline is mg·sin(θ)",
      "Apply Newton's second law: F = ma",
    ],
    answer: "a = g·sin(30°) = 4.9 m/s²",
  },
  {
    label: "Chemistry",
    question: "Balance the equation: Fe + O₂ → Fe₂O₃",
    hints: [
      "Count atoms on each side — Fe: 1 left, 2 right. O: 2 left, 3 right",
      "Try multiplying Fe₂O₃ by 2, giving 4 Fe and 6 O on the right",
      "Now balance the left: 4 Fe and 3 O₂ gives 6 O",
    ],
    answer: "4 Fe + 3 O₂ → 2 Fe₂O₃",
  },
  {
    label: "Biology",
    question: "Why is DNA replication described as 'semi-conservative'?",
    hints: [
      "The double helix unwinds and each strand acts as a template for a new strand",
      "Two new double helices are produced — each containing one old and one new strand",
      "This was proven experimentally by Meselson and Stahl using nitrogen isotope labeling",
    ],
    answer:
      "Each new DNA molecule keeps one original (conserved) strand paired with one newly synthesized strand — hence 'semi-conservative.'",
  },
  {
    label: "History",
    question: "What were the three main long-term causes of World War I?",
    hints: [
      "Think about the tensions between European empires in the late 1800s",
      "Consider the system of alliances that meant one conflict could drag in all powers",
      "Recall the arms race and rising nationalist movements across Europe",
    ],
    answer:
      "Militarism, Alliance systems, and Imperialism/Nationalism (M.A.I.N.)",
  },
  {
    label: "Literature",
    question:
      "What does Hamlet's 'To be or not to be' soliloquy reveal about his state of mind?",
    hints: [
      "Consider what he's really asking — it's about existence itself, not just his circumstances",
      "Look at the tension between 'suffering' and 'taking arms' — action vs. paralysis",
      "His fear of the afterlife ('the undiscovered country') is key to why he cannot act",
    ],
    answer:
      "Hamlet contemplates suicide but is paralyzed by fear of the unknown — revealing his philosophical nature and the play's central theme of inaction.",
  },
];

/* ── COMPONENT ─────────────────────────────────────────────── */
const HeroSection = () => {
  const { data: user, error, isLoading } = useGetAuthUserQuery();
  const [activeTab, setActiveTab] = useState<"homework" | "practice">(
    "homework",
  );
  const [activeSubject, setActiveSubject] = useState("Calculus");
  const [hintStep, setHintStep] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const currentSubject =
    SUBJECTS.find((s) => s.label === activeSubject) ?? SUBJECTS[0];

  return (
    <div
      className="w-full flex flex-col"
      style={{ fontFamily: "'DM Mono', monospace" }}
    >
      {/* ── HERO ── */}
      <section
        className="w-full grid grid-cols-1 lg:grid-cols-2 border-b-[1.5px] border-[#1A1612]"
        style={{ minHeight: "calc(100vh - 68px)" }}
      >
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col justify-between border-r-[1.5px] border-[#1A1612]"
          style={{ padding: "72px 56px" }}
        >
          <div>
            <div className="flex items-center gap-3 mb-10">
              <span className="block w-7 h-[1.5px] bg-[#3D3580]" />
              <span className="text-[10px] tracking-[0.22em] uppercase text-[#3D3580]">
                AI Study Companion
              </span>
            </div>

            <h1
              className="font-light leading-none mb-8 text-[#1A1612]"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(52px, 5vw, 78px)",
                letterSpacing: "-0.03em",
              }}
            >
              Study smarter,
              <br />
              <em className="italic" style={{ color: "#3D3580" }}>
                not harder.
              </em>
            </h1>

            <p className="text-[13px] leading-loose text-[#4A4035] max-w-sm mb-12">
              Cognify generates practice problems tailored to what you're
              learning — with hints, worked solutions, and explanations that
              actually click.
            </p>

            <div className="flex">
              <MotionLink
                href="/solve"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-8 py-4 text-[11px] tracking-[0.14em] uppercase text-[#F4EFE4] bg-[#1A1612] border-[1.5px] border-[#1A1612] hover:bg-[#3D3580] hover:border-[#3D3580] transition-colors cursor-pointer"
              >
                Start Practicing →
              </MotionLink>
              <MotionLink
                href="#how-it-works"
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center px-8 py-4 text-[11px] tracking-[0.14em] uppercase text-[#4A4035] border-[1.5px] border-[#1A1612] border-l-0 hover:text-[#3D3580] hover:bg-[#F4F3FC] transition-colors cursor-pointer"
              >
                See how it works
              </MotionLink>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-12">
            <span className="block w-5 h-px bg-[#8A7D6A]" />
            <span className="text-[10px] tracking-[0.1em] text-[#8A7D6A]">
              No account required · Free for students
            </span>
          </div>
        </motion.div>

        {/* RIGHT: interactive lined paper panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="relative overflow-hidden flex flex-col justify-center"
          style={{ background: "#EDE5D4" }}
        >
          {/* lined paper texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 31px, #CEC4AE 31px, #CEC4AE 32.5px)",
              opacity: 0.5,
            }}
          />
          {/* margin line */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{
              left: "72px",
              width: "1.5px",
              background: "rgba(180,120,120,0.28)",
            }}
          />

          <div
            className="relative z-10 flex flex-col gap-6"
            style={{ padding: "56px 48px 56px 96px" }}
          >
            {/* subject pills */}
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#3D3580] mb-3">
                Choose a subject
              </p>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => {
                      setActiveSubject(s.label);
                      setHintStep(0);
                      setRevealed(false);
                    }}
                    className="px-3 py-1.5 text-[10px] tracking-[0.1em] uppercase border-[1.5px] cursor-pointer transition-all"
                    style={
                      activeSubject === s.label
                        ? {
                            borderColor: "#3D3580",
                            color: "#3D3580",
                            background: "#F4F3FC",
                          }
                        : {
                            borderColor: "#CEC4AE",
                            color: "#8A7D6A",
                            background: "transparent",
                          }
                    }
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* problem card — animates on subject switch */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSubject}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#3D3580] mb-3">
                  Practice Problem · {activeSubject}
                </p>
                <div
                  className="bg-[#FEFAF2] border-[1.5px] border-[#1A1612]"
                  style={{
                    boxShadow: "5px 5px 0 #1A1612",
                    padding: "28px 32px",
                  }}
                >
                  {/* question */}
                  <p
                    className="font-light leading-relaxed text-[#1A1612] mb-5"
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: "15px",
                    }}
                  >
                    {currentSubject.question}
                  </p>

                  {/* hints — each one slides in */}
                  <div className="flex flex-col gap-2 mb-4">
                    <AnimatePresence>
                      {currentSubject.hints
                        .slice(0, hintStep)
                        .map((hint, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.2 }}
                            className="text-[12px] leading-loose overflow-hidden"
                            style={{
                              background: "#F4F3FC",
                              border: "1px solid #C5C0E8",
                              color: "#3D3580",
                              padding: "10px 16px",
                            }}
                          >
                            <span
                              className="text-[10px] tracking-[0.1em] uppercase mr-2"
                              style={{ opacity: 0.5 }}
                            >
                              hint {i + 1}
                            </span>
                            {hint}
                          </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* answer */}
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
                          }}
                        >
                          <span
                            className="text-[10px] tracking-[0.1em] uppercase mr-2"
                            style={{ opacity: 0.5 }}
                          >
                            answer
                          </span>
                          <strong>{currentSubject.answer}</strong>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* controls */}
                  <div className="flex items-center justify-between mt-2">
                    {!revealed ? (
                      <button
                        onClick={() => {
                          if (hintStep < currentSubject.hints.length) {
                            setHintStep((h) => h + 1);
                          } else {
                            setRevealed(true);
                          }
                        }}
                        className="text-[10px] tracking-[0.12em] uppercase text-[#3D3580] border-b border-[#C5C0E8] cursor-pointer hover:border-[#3D3580] transition-colors"
                      >
                        {hintStep === 0
                          ? "Show first hint →"
                          : hintStep < currentSubject.hints.length
                            ? `Next hint (${hintStep}/${currentSubject.hints.length}) →`
                            : "Reveal answer →"}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setHintStep(0);
                          setRevealed(false);
                        }}
                        className="text-[10px] tracking-[0.12em] uppercase text-[#8A7D6A] border-b border-[#CEC4AE] cursor-pointer hover:text-[#3D3580] hover:border-[#3D3580] transition-colors"
                      >
                        ↺ Try again
                      </button>
                    )}

                    {/* progress dots */}
                    <div className="flex gap-1.5">
                      {currentSubject.hints.map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full border-[1.5px] transition-all duration-200"
                          style={{
                            background:
                              i < hintStep ? "#3D3580" : "transparent",
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
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* ── FEATURES STRIP ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="w-full grid grid-cols-1 sm:grid-cols-3 border-b-[1.5px] border-[#1A1612]"
      >
        {[
          {
            num: "i.",
            icon: <FileText className="w-7 h-7 text-[#3D3580] mb-5" />,
            title: (
              <>
                Homework
                <br />
                Solver
              </>
            ),
            desc: "Upload any assignment and get a clear, step-by-step AI solution instantly.",
            href: "/solve",
          },
          {
            num: "ii.",
            icon: <BookOpen className="w-7 h-7 text-[#3D3580] mb-5" />,
            title: (
              <>
                Practice
                <br />
                Problems
              </>
            ),
            desc: "Generate tailored practice sets at any difficulty. Hints included.",
            href: "/practice",
          },
          {
            num: "iii.",
            icon: (
              <span
                className="block text-[28px] font-light text-[#3D3580] mb-5 leading-none"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                ∗
              </span>
            ),
            title: (
              <>
                Step-by-step
                <br />
                Walkthroughs
              </>
            ),
            desc: "Unlock full explanations after each attempt. Learn the why, not just the what.",
            href: "/solve",
          },
        ].map((f, i) => (
          <MotionLink
            key={i}
            href={f.href}
            whileHover={{ backgroundColor: "#F4F3FC" }}
            className="block transition-colors cursor-pointer"
            style={{
              padding: "48px 56px",
              borderRight: i < 2 ? "1.5px solid #1A1612" : "none",
            }}
          >
            <div
              className="text-[11px] italic text-[#3D3580] mb-5"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {f.num}
            </div>
            {f.icon}
            <h3
              className="font-light text-[#1A1612] mb-3 leading-snug"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "22px",
                letterSpacing: "-0.02em",
              }}
            >
              {f.title}
            </h3>
            <p className="text-[12px] leading-loose text-[#4A4035]">{f.desc}</p>
          </MotionLink>
        ))}
      </motion.section>

      {/* ── STATS BAR ── */}
      <section className="w-full grid grid-cols-2 lg:grid-cols-4 bg-[#1A1612]">
        {[
          { num: "40+", label: "Subjects supported" },
          { num: "∞", label: "Problems generated" },
          { num: "3s", label: "Avg. response time" },
          { num: "Free", label: "For students, always" },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              padding: "40px 56px",
              borderRight: i < 3 ? "1px solid #2a2520" : "none",
            }}
          >
            <div
              className="leading-none mb-2"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "44px",
                fontWeight: 300,
                fontStyle: "italic",
                letterSpacing: "-0.03em",
                color: "#F4EFE4",
              }}
            >
              {stat.num}
            </div>
            <div
              className="text-[10px] tracking-[0.15em] uppercase"
              style={{ color: "#5a5045" }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        className="w-full border-[#1A1612]"
        style={{ padding: "88px 56px" }}
      >
        <div className="flex items-baseline gap-6 mb-16">
          <h2
            className="font-light text-[#1A1612] whitespace-nowrap"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "36px",
              letterSpacing: "-0.025em",
            }}
          >
            How <em className="italic text-[#3D3580]">it works</em>
          </h2>
          <div className="flex-1 h-[1.5px] bg-[#1A1612]" />
          <span className="text-[10px] tracking-[0.15em] uppercase text-[#8A7D6A] whitespace-nowrap">
            03 steps
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
          {[
            {
              n: "01",
              title: "Pick your topic",
              desc: "Choose a subject and topic, or paste in a problem directly from your homework or textbook.",
            },
            {
              n: "02",
              title: "Work through it",
              desc: "Attempt the problem yourself. Use hints when you're stuck. Cognify guides you without short-circuiting the learning.",
            },
            {
              n: "03",
              title: "Review & repeat",
              desc: "Unlock the full walkthrough, then move on. Build real fluency through repetition, not rereading.",
            },
          ].map((step, i) => (
            <div
              key={i}
              style={{
                paddingRight: i < 2 ? "40px" : "0",
                marginRight: i < 2 ? "40px" : "0",
                borderRight: i < 2 ? "1px dashed #CEC4AE" : "none",
              }}
            >
              <div
                className="flex items-center justify-center text-[12px] text-[#F4EFE4] mb-6"
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#3D3580",
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "0.05em",
                }}
              >
                {step.n}
              </div>
              <h4
                className="font-light text-[#1A1612] mb-3"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "20px",
                  letterSpacing: "-0.02em",
                }}
              >
                {step.title}
              </h4>
              <p className="text-[12px] leading-loose text-[#4A4035]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DASHBOARD / SIGN IN ── */}
      <DashboardBox />
    </div>
  );
};

export default HeroSection;
