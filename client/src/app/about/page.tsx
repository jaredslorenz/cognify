"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const AboutPage = () => {
  return (
    <Provider store={store}>
      <div
        className="w-full flex flex-col min-h-screen"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        <Header />

        <main className="flex-1 w-full">
          {/* ── HERO ── */}
          <section className="w-full border-b-[1.5px] border-[#1A1612]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              style={{ padding: "88px 56px" }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="block w-7 h-[1.5px] bg-[#3D3580]" />
                <span className="text-[10px] tracking-[0.22em] uppercase text-[#3D3580]">
                  About Cognify
                </span>
              </div>

              <h1
                className="font-light text-[#1A1612] mb-8 max-w-3xl"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "clamp(48px, 5vw, 72px)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                Built for students who want to{" "}
                <em className="italic text-[#3D3580]">actually learn.</em>
              </h1>

              <p className="text-[14px] leading-loose text-[#4A4035] max-w-xl">
                Cognify isn't a shortcut. It's a study tool that meets you where
                you are — giving you just enough help to keep moving, without
                doing the thinking for you.
              </p>
            </motion.div>
          </section>

          {/* ── MISSION + STORY ── */}
          <section className="w-full grid grid-cols-1 lg:grid-cols-2 border-b-[1.5px] border-[#1A1612]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="border-r-[1.5px] border-[#1A1612]"
              style={{ padding: "64px 56px" }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span
                  className="text-[11px] italic text-[#3D3580]"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  i.
                </span>
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#8A7D6A]">
                  Mission
                </span>
              </div>
              <h2
                className="font-light text-[#1A1612] mb-6"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "28px",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.2,
                }}
              >
                Understanding over answers
              </h2>
              <p className="text-[13px] leading-loose text-[#4A4035] mb-5">
                Most AI tools hand you the answer. That's useful for getting
                homework done, but not for actually understanding the material —
                which is what shows up on the exam.
              </p>
              <p className="text-[13px] leading-loose text-[#4A4035]">
                Cognify is built around a simple idea: hints first, answer last.
                You work through the problem, get nudged in the right direction,
                and only reveal the full solution once you've genuinely tried.
                That's how learning sticks.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{ padding: "64px 56px" }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span
                  className="text-[11px] italic text-[#3D3580]"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  ii.
                </span>
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#8A7D6A]">
                  The story
                </span>
              </div>
              <h2
                className="font-light text-[#1A1612] mb-6"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "28px",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.2,
                }}
              >
                Started out of frustration
              </h2>
              <p className="text-[13px] leading-loose text-[#4A4035] mb-5">
                Cognify started as a personal project — a way to explore what
                AI-powered studying could look like if it was designed around
                the learner rather than just the answer.
              </p>
              <p className="text-[13px] leading-loose text-[#4A4035]">
                The tools that existed were either too passive (here's the
                answer, good luck) or too rigid (follow this exact curriculum).
                The goal was something in between — flexible enough to work
                across any subject, structured enough to actually help you
                improve.
              </p>
            </motion.div>
          </section>

          {/* ── VALUES ── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full border-b-[1.5px] border-[#1A1612]"
            style={{ padding: "72px 56px" }}
          >
            <div className="flex items-baseline gap-6 mb-14">
              <h2
                className="font-light text-[#1A1612] whitespace-nowrap"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "28px",
                  letterSpacing: "-0.025em",
                }}
              >
                What we <em className="italic text-[#3D3580]">believe</em>
              </h2>
              <div className="flex-1 h-[1.5px] bg-[#CEC4AE]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
              {[
                {
                  n: "01",
                  title: "Struggle is part of learning",
                  desc: "Getting stuck isn't a failure — it's where the learning actually happens. Cognify gives you hints, not answers, because the effort matters.",
                },
                {
                  n: "02",
                  title: "Any subject, any level",
                  desc: "Math, biology, history, literature — understanding has the same shape regardless of subject. Cognify works across all of them.",
                },
                {
                  n: "03",
                  title: "Free for students, full stop",
                  desc: "Education tools shouldn't be paywalled. Cognify's core features are free and will stay that way.",
                },
              ].map((v, i) => (
                <div
                  key={i}
                  style={{
                    paddingRight: i < 2 ? "48px" : "0",
                    marginRight: i < 2 ? "48px" : "0",
                    borderRight: i < 2 ? "1px dashed #CEC4AE" : "none",
                  }}
                >
                  <div
                    className="flex items-center justify-center text-[12px] text-[#F4EFE4] mb-6"
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "#3D3580",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {v.n}
                  </div>
                  <h3
                    className="font-light text-[#1A1612] mb-3"
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: "20px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {v.title}
                  </h3>
                  <p className="text-[12px] leading-loose text-[#4A4035]">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── CTA ── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="w-full grid grid-cols-1 lg:grid-cols-2"
          >
            <div
              style={{ padding: "72px 56px" }}
              className="border-r-[1.5px] border-[#1A1612]"
            >
              <h2
                className="font-light text-[#1A1612] mb-6"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "36px",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                }}
              >
                Ready to study
                <br />
                <em className="italic text-[#3D3580]">smarter?</em>
              </h2>
              <div className="flex">
                <Link
                  href="/practice"
                  className="inline-flex items-center px-8 py-4 text-[11px] tracking-[0.14em] uppercase text-[#F4EFE4] bg-[#1A1612] border-[1.5px] border-[#1A1612] hover:bg-[#3D3580] hover:border-[#3D3580] transition-colors cursor-pointer"
                  style={{ textDecoration: "none" }}
                >
                  Start Practicing →
                </Link>
                <Link
                  href="/solve"
                  className="inline-flex items-center px-8 py-4 text-[11px] tracking-[0.14em] uppercase text-[#4A4035] border-[1.5px] border-[#1A1612] border-l-0 hover:text-[#3D3580] hover:bg-[#F4F3FC] transition-colors cursor-pointer"
                  style={{ textDecoration: "none" }}
                >
                  Solve Homework
                </Link>
              </div>
            </div>

            {/* Lined paper decorative panel */}
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
                  Supported subjects
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Calculus",
                    "Physics",
                    "Chemistry",
                    "Biology",
                    "History",
                    "Literature",
                    "Statistics",
                    "Linear Algebra",
                    "Economics",
                    "Computer Science",
                  ].map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 text-[10px] tracking-[0.1em] uppercase"
                      style={{
                        border: "1.5px solid #CEC4AE",
                        color: "#8A7D6A",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        </main>

        <Footer />
      </div>
    </Provider>
  );
};

export default AboutPage;
