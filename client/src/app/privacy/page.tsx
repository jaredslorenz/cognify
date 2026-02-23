"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sections = [
  {
    n: "01",
    title: "What we collect",
    content: `When you create an account, we collect your email address and username through AWS Cognito, our authentication provider. When you use Cognify, we store the problems you solve and practice problems you generate, including the questions, hints, and answers. We also store basic usage stats such as your study streak and the number of hints you've used.`,
  },
  {
    n: "02",
    title: "What we don't collect",
    content: `We do not store the images you upload. Images are processed for text extraction and discarded immediately after. We do not collect payment information, location data, or any information beyond what is needed to run the app. We do not use cookies for tracking or advertising.`,
  },
  {
    n: "03",
    title: "How we use your data",
    content: `Your data is used exclusively to provide the Cognify service — saving your problem history, showing your dashboard, and tracking your study progress. We do not sell your data to third parties. We do not use your data for advertising. We do not share your data with anyone outside of the infrastructure providers listed below.`,
  },
  {
    n: "04",
    title: "Third-party services",
    content: `Cognify uses the following third-party services to operate: AWS Cognito for authentication and account management, Supabase (PostgreSQL) for database storage, Google Cloud Vision for OCR text extraction from images, and OpenAI for generating hints and solutions. Each of these providers has their own privacy policy governing how they handle data.`,
  },
  {
    n: "05",
    title: "Data retention",
    content: `Your account data and problem history are stored for as long as your account is active. You can delete individual problems from your dashboard at any time. If you would like your account and all associated data deleted, contact us and we will remove it within 30 days.`,
  },
  {
    n: "06",
    title: "Security",
    content: `All data is transmitted over HTTPS. Passwords are never stored by Cognify — they are managed entirely by AWS Cognito. Database access is restricted to the Cognify backend and is not publicly accessible.`,
  },
  {
    n: "07",
    title: "Children's privacy",
    content: `Cognify is intended for students of all ages. We do not knowingly collect personal information from children under 13 without parental consent. If you believe a child under 13 has created an account, please contact us and we will delete it promptly.`,
  },
  {
    n: "08",
    title: "Changes to this policy",
    content: `We may update this privacy policy as the app evolves. If we make significant changes, we will update the date at the bottom of this page. Continued use of Cognify after changes constitutes acceptance of the updated policy.`,
  },
];

const PrivacyPage = () => {
  return (
    <Provider store={store}>
      <div
        className="w-full flex flex-col min-h-screen"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        <Header />

        <main className="flex-1 w-full">
          {/* ── HERO ── */}
          <section
            className="w-full border-b-[1.5px] border-[#1A1612]"
            style={{ padding: "88px 56px" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="block w-7 h-[1.5px] bg-[#3D3580]" />
                <span className="text-[10px] tracking-[0.22em] uppercase text-[#3D3580]">
                  Legal
                </span>
              </div>
              <h1
                className="font-light text-[#1A1612] mb-6 max-w-2xl"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "clamp(40px, 5vw, 64px)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                Privacy <em className="italic text-[#3D3580]">Policy</em>
              </h1>
              <p className="text-[13px] leading-loose text-[#4A4035] max-w-lg">
                We built Cognify to help students learn, not to collect data.
                This policy explains exactly what we store, why, and how you can
                remove it.
              </p>
            </motion.div>
          </section>

          {/* ── SECTIONS ── */}
          <section className="w-full" style={{ padding: "72px 56px" }}>
            <div className="max-w-3xl flex flex-col gap-0">
              {sections.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  className="grid grid-cols-[64px_1fr] border-b-[1.5px] border-[#CEC4AE]"
                  style={{ padding: "40px 0" }}
                >
                  {/* Number */}
                  <div className="pt-1">
                    <span
                      className="text-[11px] tracking-[0.1em] text-[#3D3580]"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {section.n}
                    </span>
                  </div>

                  {/* Content */}
                  <div>
                    <h2
                      className="font-light text-[#1A1612] mb-4"
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: "22px",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {section.title}
                    </h2>
                    <p className="text-[13px] leading-loose text-[#4A4035]">
                      {section.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Last updated */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-[10px] tracking-[0.15em] uppercase text-[#8A7D6A] mt-12"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Last updated: February 2026
            </motion.p>
          </section>
        </main>

        <Footer />
      </div>
    </Provider>
  );
};

export default PrivacyPage;
