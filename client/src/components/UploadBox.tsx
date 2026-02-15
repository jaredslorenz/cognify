"use client";

import React, { useRef, useState } from "react";
import { useGetParsedImageMutation } from "@/api/ocrApi";
import {
  useGetChatGPTProblemsMutation,
  useGetChatGPTResponseMutation,
} from "@/api/chatgptApi";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

import {
  useUploadAndStoreMutation,
  useUploadToS3Mutation,
} from "@/api/uploadsApi";

import { useGetAuthUserQuery } from "@/api/authApi";

const UploadBox = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [solution, setSolution] = useState<string | null>(null);

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

  //Page check
  const pathname = usePathname();
  const isSolvePage = pathname.match(/^\/(solve)$/);
  const isPracticePage = pathname.match(/^\/(practice)$/);

  //Grab auth user
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();

  const [uploadAndStore] = useUploadAndStoreMutation();
  const [uploadToS3] = useUploadToS3Mutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setSolution(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setSolution(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleSolve = async () => {
    if (!selectedImage) return;
    setSolution(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      // 1️ OCR
      const ocrData = await parseImage(formData).unwrap();
      const extractedText = ocrData?.ParsedResults?.[0]?.ParsedText;
      if (!extractedText) {
        setSolution("No text found in image. Try a clearer image.");
        return;
      }

      // 2️ ChatGPT
      const chatData = isSolvePage
        ? await chatGPTResponse({ text: extractedText }).unwrap()
        : await chatGPTProblems({ text: extractedText }).unwrap();
      const aiResponse = chatData?.content || "No response from AI.";
      setSolution(aiResponse);

      // 3️ Only upload if user is logged in

      if (authUser) {
        const userId = authUser.userId;

        console.log("Uploading image to S3 for user:", authUser.userId);

        //const s3Data = await uploadToS3(formData).unwrap();
        //const imageUrl = s3Data.url;

        const file_name = selectedImage?.name;
        const file_url = "exampleurl";

        console.log("Storing image and AI response in DB...");
        await uploadAndStore({
          userId,
          file_name,
          file_url,
          aiResponse,
        }).unwrap();
        console.log("Upload and storage successful");
      } else {
        console.log("User not logged in — skipping S3 and DB upload");
      }
    } catch (error) {
      console.error("Error processing image or AI request:", error);
      setSolution("Error processing image or AI request.");
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
    setPreviewUrl(null);
    setSolution(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <motion.div
      whileHover={!previewUrl ? { scale: 1.02 } : undefined}
      className="mt-12 w-full p-6 max-w-4xl bg-white rounded-2xl shadow-xl text-center"
      onDrop={!previewUrl ? handleDrop : undefined}
      onDragOver={!previewUrl ? handleDragOver : undefined}
    >
      {!previewUrl ? (
        <div className="cursor-pointer" onClick={handleClick}>
          <p className="text-black opacity-60 text-lg">
            Drag & drop an image here, or click to upload
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
        <div className="flex flex-col items-center space-y-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-xs max-h-64 object-contain rounded-lg"
          />
          <p className="text-black opacity-70">{selectedImage?.name}</p>

          <div className="flex gap-4 mt-4 w-full justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSolve();
              }}
              disabled={
                ocrLoading || chatLoading || chatProblemsLoading || authLoading
              }
              className="flex-1 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-[#de2160] via-[#8e21de] to-[#3e21de] shadow-lg hover:opacity-50 transition disabled:opacity-50 cursor-pointer"
            >
              {ocrLoading || chatLoading || chatProblemsLoading
                ? isPracticePage
                  ? "Generating..."
                  : "Solving..."
                : isPracticePage
                ? "Generate Practice"
                : "Solve"}
            </button>

            <button
              onClick={handleRemove}
              className="flex-1 px-4 py-2 rounded-xl text-white bg-red-500 hover:bg-red-400 shadow-lg transition cursor-pointer"
            >
              Remove
            </button>
          </div>

          {solution && (
            <div className="w-full bg-white/80 dark:bg-zinc-100 p-4 rounded-lg mt-4 text-left text-black whitespace-pre-wrap shadow-inner">
              <h4 className="font-semibold mb-1">Response:</h4>
              <p>{solution}</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default UploadBox;
