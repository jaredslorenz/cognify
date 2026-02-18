"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { motion } from "framer-motion";
import UploadBox from "@/components/UploadBox";
import Header from "@/components/Header";
import DashboardBox from "@/components/DashboardBox";
import Footer from "@/components/Footer";

const SolvePage = () => {
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
            className="w-full max-w-4xl mb-2"
          >
            <div className="pt-6 flex items-center gap-3 mb-6">
              <span className="block w-7 h-[1.5px] bg-[#3D3580]" />
              <span className="text-[10px] tracking-[0.22em] uppercase text-[#3D3580]">
                Homework Solver
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
              Upload it.
              <br />
              <em className="italic text-[#3D3580]">Understand it.</em>
            </h1>
            <p className="text-[13px] leading-loose text-[#4A4035] max-w-lg">
              Take a photo of any homework problem and get a step-by-step
              solution with hints — so you actually learn, not just copy.
            </p>
          </motion.div>

          {/* ── UPLOAD BOX ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full max-w-4xl"
          >
            <UploadBox />
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
                  desc: "Drag & drop or take a photo of your homework problem — any subject, any format.",
                },
                {
                  n: "02",
                  title: "AI Processing",
                  desc: "OCR extracts the text and the AI analyzes the problem in full context.",
                },
                {
                  n: "03",
                  title: "Step-by-step Solution",
                  desc: "Work through hints first, then reveal the full walkthrough when you're ready.",
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

export default SolvePage;
