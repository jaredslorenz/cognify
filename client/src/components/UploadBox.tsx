"use client";

import React, { useRef, useState } from "react";
import { useGetParsedImageMutation } from "@/api/ocrApi";
import {
  useGetChatGPTProblemsMutation,
  useGetChatGPTResponseMutation,
} from "@/api/chatgptApi";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  useUploadAndStoreMutation,
  useUploadToS3Mutation,
} from "@/api/uploadsApi";
import { useGetAuthUserQuery } from "@/api/authApi";

interface PracticeResponse {
  question: string;
  hints: string[];
  answer: string;
  fullSolution?: string;
}

interface UploadBoxProps {
  subject?: string;
  topic?: string;
  difficulty?: "easy" | "medium" | "hard";
  amount?: number;
}

// ── PROBLEM CARD ─────────────────────────────────────────────
// Extracted so each card has its own independent hint/reveal state
const ProblemCard = ({
  problem,
  index,
  total,
  isSolvePage,
}: {
  problem: PracticeResponse;
  index: number;
  total: number;
  isSolvePage: boolean;
}) => {
  const [hintStep, setHintStep] = useState(0);
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.1 }}
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
            {isSolvePage ? "Solution" : "Practice Problem"}
            {total > 1 ? ` · ${index + 1} of ${total}` : ""}
          </span>
        </div>
        {total > 1 && (
          <span
            className="text-[10px] text-[#8A7D6A]"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col gap-4">
        {/* question */}
        <p
          className="font-light leading-relaxed text-[#1A1612]"
          style={{ fontFamily: "'Fraunces', serif", fontSize: "16px" }}
        >
          {problem.question}
        </p>

        {/* hints */}
        {problem.hints.length > 0 && (
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {problem.hints.slice(0, hintStep).map((hint, i) => (
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

            {/* full walkthrough — solve page only */}
            <AnimatePresence>
              {revealed && problem.fullSolution && (
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
                  {problem.fullSolution}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* controls */}
        <div className="flex items-center justify-between mt-1">
          {!revealed ? (
            <button
              onClick={() => {
                if (hintStep < (problem.hints?.length ?? 0)) {
                  setHintStep((h) => h + 1);
                } else {
                  setRevealed(true);
                }
              }}
              className="text-[10px] tracking-[0.12em] uppercase text-[#3D3580] border-b border-[#C5C0E8] cursor-pointer hover:border-[#3D3580] transition-colors"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {hintStep === 0
                ? "Show first hint →"
                : hintStep < (problem.hints?.length ?? 0)
                  ? `Next hint (${hintStep}/${problem.hints.length}) →`
                  : "Reveal answer →"}
            </button>
          ) : (
            <button
              onClick={() => {
                setHintStep(0);
                setRevealed(false);
              }}
              className="text-[10px] tracking-[0.12em] uppercase text-[#8A7D6A] border-b border-[#CEC4AE] cursor-pointer hover:text-[#3D3580] hover:border-[#3D3580] transition-colors"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              ↺ Try again
            </button>
          )}

          {/* progress dots */}
          <div className="flex gap-1.5">
            {(problem.hints ?? []).map((_, i) => (
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
    </motion.div>
  );
};

// ── UPLOAD BOX ────────────────────────────────────────────────
const UploadBox = ({
  subject,
  topic,
  difficulty = "medium",
  amount = 1,
}: UploadBoxProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [problems, setProblems] = useState<PracticeResponse[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const [
    [parseImage, { isLoading: ocrLoading }],
    [chatGPTResponse, { isLoading: chatLoading }],
    [chatGPTProblems, { isLoading: chatProblemsLoading }],
  ] = [
    useGetParsedImageMutation(),
    useGetChatGPTResponseMutation(),
    useGetChatGPTProblemsMutation(),
  ];

  const pathname = usePathname();
  const isSolvePage = !!pathname.match(/^\/(solve)$/);
  const isPracticePage = !!pathname.match(/^\/(practice)$/);

  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const [uploadAndStore] = useUploadAndStoreMutation();
  const [uploadToS3] = useUploadToS3Mutation();

  const resetState = () => {
    setProblems([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      resetState();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      resetState();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClick = () => inputRef.current?.click();

  const handleSolve = async () => {
    if (!selectedImage) return;
    resetState();

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      // 1. OCR
      const ocrData = await parseImage(formData).unwrap();
      const extractedText = ocrData?.ParsedResults?.[0]?.ParsedText;
      if (!extractedText) {
        setProblems([
          {
            question: "No text found in image. Try a clearer image.",
            hints: [],
            answer: "",
          },
        ]);
        return;
      }

      // 2. ChatGPT
      if (isSolvePage) {
        // /solve returns a single PracticeResponse directly
        const chatData = await chatGPTResponse({
          text: extractedText,
        }).unwrap();
        setProblems([
          {
            question: chatData?.question ?? "No question returned.",
            hints: chatData?.hints ?? [],
            answer: chatData?.answer ?? "",
            fullSolution: chatData?.fullSolution,
          },
        ]);
      } else {
        // /problems returns { problems: [...] } — unwrap the array here
        const chatData = await chatGPTProblems({
          text: extractedText,
          subject: subject ?? undefined,
          topic: topic ?? undefined,
          difficulty,
          amount, // ← passed through
        }).unwrap();

        const parsed: PracticeResponse[] = (chatData?.problems ?? []).map(
          (p: any) => ({
            question: p?.question ?? "No question returned.",
            hints: p?.hints ?? [],
            answer: p?.answer ?? "",
          }),
        );

        setProblems(
          parsed.length > 0
            ? parsed
            : [
                {
                  question: "No problems returned. Try again.",
                  hints: [],
                  answer: "",
                },
              ],
        );
      }

      // 3. Upload if logged in
      if (authUser) {
        const userId = authUser.userId;
        const file_name = selectedImage?.name;
        const file_url = "exampleurl";
        const aiResponse = problems[0]?.answer ?? "";
        await uploadAndStore({
          userId,
          file_name,
          file_url,
          aiResponse,
        }).unwrap();
      }
    } catch (error) {
      console.error("Error processing image or AI request:", error);
      setProblems([
        {
          question: "Error processing image or AI request.",
          hints: [],
          answer: "",
        },
      ]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
    setPreviewUrl(null);
    resetState();
    if (inputRef.current) inputRef.current.value = "";
  };

  const isLoading = ocrLoading || chatLoading || chatProblemsLoading;

  return (
    <motion.div
      whileHover={!previewUrl ? { scale: 1.02 } : undefined}
      className="mt-12 w-full max-w-4xl border-[1.5px] border-[#1A1612] bg-[#FEFAF2]"
      style={{ boxShadow: "5px 5px 0 #1A1612" }}
      onDrop={!previewUrl ? handleDrop : undefined}
      onDragOver={!previewUrl ? handleDragOver : undefined}
    >
      {!previewUrl ? (
        /* ── DROP ZONE ── */
        <div
          className="cursor-pointer flex flex-col items-center justify-center gap-3 border-[1.5px] border-dashed border-[#CEC4AE] m-6 py-14 hover:border-[#3D3580] hover:bg-[#F4F3FC] transition-all"
          onClick={handleClick}
        >
          <span
            className="text-[32px] leading-none"
            style={{ fontFamily: "'Fraunces', serif", color: "#CEC4AE" }}
          >
            ↑
          </span>
          <p className="text-[12px] tracking-[0.1em] uppercase text-[#8A7D6A]">
            Drag & drop an image, or click to upload
          </p>
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center p-8 gap-6">
          {/* Preview */}
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-xs max-h-64 object-contain border-[1.5px] border-[#CEC4AE]"
          />
          <p className="text-[11px] tracking-[0.08em] uppercase text-[#8A7D6A]">
            {selectedImage?.name}
          </p>

          {/* Action buttons */}
          <div className="flex w-full max-w-md">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSolve();
              }}
              disabled={isLoading || authLoading}
              className="flex-1 py-4 text-[11px] tracking-[0.14em] uppercase text-[#F4EFE4] bg-[#1A1612] border-[1.5px] border-[#1A1612] hover:bg-[#3D3580] hover:border-[#3D3580] transition-colors disabled:opacity-40 cursor-pointer"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {isLoading
                ? isPracticePage
                  ? "Generating..."
                  : "Solving..."
                : isPracticePage
                  ? `Generate ${amount > 1 ? `${amount} Problems` : "Problem"}`
                  : "Solve"}
            </button>
            <button
              onClick={handleRemove}
              className="flex-1 py-4 text-[11px] tracking-[0.14em] uppercase text-[#4A4035] border-[1.5px] border-[#1A1612] border-l-0 hover:bg-[#F4F3FC] hover:text-[#3D3580] transition-colors cursor-pointer"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Remove
            </button>
          </div>

          {/* ── PROBLEM CARDS ── */}
          <AnimatePresence>
            {problems.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col gap-6"
              >
                {/* summary row when multiple */}
                {problems.length > 1 && (
                  <div className="flex items-center gap-3">
                    <span className="block w-5 h-[1.5px] bg-[#3D3580]" />
                    <span
                      className="text-[10px] tracking-[0.2em] uppercase text-[#3D3580]"
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {problems.length} problems generated
                    </span>
                  </div>
                )}

                {problems.map((problem, i) => (
                  <ProblemCard
                    key={i}
                    problem={problem}
                    index={i}
                    total={problems.length}
                    isSolvePage={isSolvePage}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default UploadBox;
