import { Request, Response } from "express";
import fs from "fs";
import vision from "@google-cloud/vision";
import fetch from "node-fetch";
import FormData from "form-data";

export const handleSPACEOCR = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const formData = new FormData();
    formData.append("apikey", process.env.OCR_SPACE_API_KEY!);
    formData.append("language", "eng");
    formData.append("OCREngine", "2");
    formData.append("scale", "true");
    formData.append("isOverlayRequired", "false");
    formData.append("file", fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: formData as any,
    });

    const data = await response.json();

    // console.log("OCR Response:", data);

    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });

    res.json(data);
  } catch (error) {
    console.error("Error during OCR request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

if (!process.env.GOOGLE_VISION_KEY) {
  throw new Error("GOOGLE_VISION_KEY not set");
}

const credentials = JSON.parse(process.env.GOOGLE_VISION_KEY);

// VERY IMPORTANT
credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");

const client = new vision.ImageAnnotatorClient({
  credentials,
});

export const handleOCR = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read the image file
    const imageBuffer = fs.readFileSync(req.file.path);

    // Call Google Vision API
    const [result] = await client.textDetection(imageBuffer);
    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      fs.unlinkSync(req.file.path); // Clean up
      return res.json({
        ParsedResults: [
          {
            ParsedText: "",
            ErrorMessage: "No text detected",
          },
        ],
      });
    }

    // First annotation contains all detected text
    const extractedText = detections[0].description || "";

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    // Return in OCR.Space-compatible format so frontend doesn't break
    res.json({
      ParsedResults: [
        {
          ParsedText: extractedText,
          TextOverlay: null,
          FileParseExitCode: 1,
          ErrorMessage: "",
          ErrorDetails: "",
        },
      ],
      OCRExitCode: 1,
      IsErroredOnProcessing: false,
    });
  } catch (error) {
    console.error("Error during Google Vision OCR:", error);

    // Clean up file if error
    if (req.file?.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
      });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};
