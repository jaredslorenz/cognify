"use client";

import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { motion } from "framer-motion";
import UploadBox from "@/components/UploadBox";
import Header from "@/components/Header";
import DashboardBox from "@/components/DashboardBox";
import Footer from "@/components/Footer";

const SUBJECTS = [
  "Calculus",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Literature",
];

const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const AMOUNTS = [1, 2, 3, 5, 10] as const;

const PracticePage = () => {
  const [subject, setSubject] = useState<string | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );
  const [amount, setAmount] = useState<number>(1);

  return (
    <Provider store={store}>
      <div
        className="w-full flex flex-col"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        <Header />

        <main className="flex flex-col items-center w-full">
          {/* ── PAGE HEADER ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-4xl mb-14"
          >
            <div className="pt-6 flex items-center gap-3 mb-6">
              <span className="block w-7 h-[1.5px] bg-[#3D3580]" />
              <span className="text-[10px] tracking-[0.22em] uppercase text-[#3D3580]">
                Practice Problems
              </span>
            </div>
            <h1
              className="font-light text-[#1A1612] mb-5"
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(40px, 4vw, 60px)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              Practice makes
              <br />
              <em className="italic text-[#3D3580]">permanent.</em>
            </h1>
            <p className="text-[13px] leading-loose text-[#4A4035] max-w-lg">
              Upload notes or a topic image and receive structured practice
              problems with progressive hints and full worked solutions.
            </p>
          </motion.div>

          {/* ── SELECTORS ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="w-full max-w-4xl mb-2 flex flex-col gap-8"
          >
            {/* Row 1: Subject */}
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#3D3580] mb-3">
                Subject <span className="text-[#8A7D6A]">(optional)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubject(subject === s ? undefined : s)}
                    className="px-3 py-1.5 text-[10px] tracking-[0.1em] uppercase border-[1.5px] cursor-pointer transition-all"
                    style={
                      subject === s
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
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Difficulty + Amount side by side */}
            <div className="flex flex-col sm:flex-row gap-8">
              {/* Difficulty */}
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#3D3580] mb-3">
                  Difficulty
                </p>
                <div className="flex">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className="px-5 py-1.5 text-[10px] tracking-[0.1em] uppercase border-[1.5px] -mr-[1.5px] last:mr-0 cursor-pointer transition-all"
                      style={
                        difficulty === d
                          ? {
                              borderColor: "#3D3580",
                              color: "#3D3580",
                              background: "#F4F3FC",
                              zIndex: 1,
                            }
                          : {
                              borderColor: "#CEC4AE",
                              color: "#8A7D6A",
                              background: "transparent",
                              zIndex: 0,
                            }
                      }
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#3D3580] mb-3">
                  Number of problems
                </p>
                <div className="flex">
                  {AMOUNTS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setAmount(n)}
                      className="px-5 py-1.5 text-[10px] tracking-[0.1em] uppercase border-[1.5px] -mr-[1.5px] last:mr-0 cursor-pointer transition-all"
                      style={
                        amount === n
                          ? {
                              borderColor: "#3D3580",
                              color: "#3D3580",
                              background: "#F4F3FC",
                              zIndex: 1,
                            }
                          : {
                              borderColor: "#CEC4AE",
                              color: "#8A7D6A",
                              background: "transparent",
                              zIndex: 0,
                            }
                      }
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── UPLOAD BOX ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="w-full max-w-4xl"
          >
            <UploadBox
              subject={subject}
              difficulty={difficulty}
              amount={amount}
            />
          </motion.div>

          {/* ── HOW IT WORKS ── */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full mt-20 border-t-[1.5px] border-[#1A1612]"
            style={{ padding: "88px 56px" }}
          >
            <div className="flex items-baseline gap-6 mb-12">
              <h2
                className="font-light text-[#1A1612] whitespace-nowrap"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "28px",
                  letterSpacing: "-0.025em",
                }}
              >
                How <em className="italic text-[#3D3580]">it works</em>
              </h2>
              <div className="flex-1 h-[1.5px] bg-[#CEC4AE]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
              {[
                {
                  n: "01",
                  title: "Upload",
                  desc: "Upload notes, assignments, or a photo of any topic you want to practice.",
                },
                {
                  n: "02",
                  title: "Generate",
                  desc: "AI creates custom practice problems tailored to your material, subject, and difficulty.",
                },
                {
                  n: "03",
                  title: "Practice & Learn",
                  desc: "Work through each problem yourself, use hints when stuck, then reveal the full solution.",
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
                    className="flex items-center justify-center text-[12px] text-[#F4EFE4] mb-5"
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "#3D3580",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {step.n}
                  </div>
                  <h4
                    className="font-light text-[#1A1612] mb-2"
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: "18px",
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
          </motion.section>

          <DashboardBox />
        </main>
      </div>
      <Footer />
    </Provider>
  );
};

export default PracticePage;
