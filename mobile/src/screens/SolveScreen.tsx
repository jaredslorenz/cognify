import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useGetChatGPTResponseMutation } from "../api/chatgptApi";
import { useGetAuthUserQuery } from "../api/authApi";
import { useStoreSolvedMutation } from "../api/uploadsApi";
import ProblemCard from "../components/ProblemCard";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface PracticeResponse {
  question: string;
  hints: string[];
  answer: string;
  fullSolution?: string;
}

export default function SolveScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [solution, setSolution] = useState<PracticeResponse | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  const [getChatGPTResponse, { isLoading: chatLoading }] =
    useGetChatGPTResponseMutation();
  const { data: authUser } = useGetAuthUserQuery();
  const [storeSolved] = useStoreSolvedMutation();

  const isLoading = ocrLoading || chatLoading;

  // ── Pick from camera ─────────────────────────────────────
  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera access is required to scan problems.",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      quality: 0.9,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setSolution(null);
    }
  };

  // ── Pick from library ────────────────────────────────────
  const handleGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Photo library access is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.9,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setSolution(null);
    }
  };

  // ── Main solve flow ──────────────────────────────────────
  const handleSolve = async () => {
    if (!imageUri) return;
    setSolution(null);
    setOcrLoading(true);

    try {
      // 1. Send image to backend (Google Vision OCR)
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "homework.jpg",
      } as any);

      const ocrRes = await axios.post(`${API_URL}ocr`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const extractedText = ocrRes.data?.ParsedResults?.[0]?.ParsedText ?? "";

      setOcrLoading(false);

      if (!extractedText.trim()) {
        Alert.alert("No text found", "Try a clearer image with visible text.");
        return;
      }

      // 2. Send to GPT
      const chatData = await getChatGPTResponse({
        text: extractedText,
      }).unwrap();
      setSolution(chatData);

      // 3. Store if logged in
      if (authUser) {
        await storeSolved({
          userId: authUser.userId,
          file_name: "homework.jpg",
          question: chatData.question,
          hints: chatData.hints,
          answer: chatData.answer,
          full_solution: chatData.fullSolution ?? "",
        });
      }
    } catch (err) {
      setOcrLoading(false);
      console.error(err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const handleReset = () => {
    setImageUri(null);
    setSolution(null);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Page header */}
        <View style={styles.pageHeader}>
          <View style={styles.rule} />
          <Text style={styles.eyebrow}>HOMEWORK SOLVER</Text>
        </View>
        <Text style={styles.title}>
          Upload it.{"\n"}
          <Text style={styles.titleAccent}>Understand it.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Take a photo or upload an image of any problem to get step-by-step
          hints and a full solution.
        </Text>

        {/* Image area */}
        {!imageUri ? (
          <View style={styles.uploadZone}>
            <Text style={styles.uploadArrow}>↑</Text>
            <Text style={styles.uploadText}>SCAN OR UPLOAD A PROBLEM</Text>
            <View style={styles.uploadButtons}>
              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={handleCamera}
                activeOpacity={0.8}
              >
                <Text style={styles.uploadBtnText}>📷 CAMERA</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.uploadBtn, styles.uploadBtnSecondary]}
                onPress={handleGallery}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.uploadBtnText, styles.uploadBtnTextSecondary]}
                >
                  🖼 GALLERY
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.preview}
              resizeMode="contain"
            />

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.solveBtn, isLoading && styles.btnDisabled]}
                onPress={handleSolve}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color="#F4EFE4" />
                ) : (
                  <Text style={styles.solveBtnText}>
                    {ocrLoading
                      ? "READING..."
                      : chatLoading
                        ? "SOLVING..."
                        : "SOLVE →"}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={handleReset}
                activeOpacity={0.8}
              >
                <Text style={styles.resetBtnText}>REMOVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Solution card */}
        {solution && (
          <ProblemCard
            problem={solution}
            isSolvePage={true}
            index={0}
            total={1}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F4EFE4",
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
    gap: 0,
  },
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  rule: {
    width: 28,
    height: 1.5,
    backgroundColor: "#3D3580",
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 3,
    color: "#3D3580",
    fontWeight: "500",
  },
  title: {
    fontSize: 40,
    fontWeight: "300",
    color: "#1A1612",
    lineHeight: 46,
    letterSpacing: -1,
    marginBottom: 12,
  },
  titleAccent: {
    color: "#3D3580",
    fontStyle: "italic",
  },
  subtitle: {
    fontSize: 13,
    color: "#8A7D6A",
    lineHeight: 22,
    marginBottom: 32,
  },
  uploadZone: {
    borderWidth: 1.5,
    borderColor: "#CEC4AE",
    borderStyle: "dashed",
    backgroundColor: "#FEFAF2",
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  uploadArrow: {
    fontSize: 28,
    color: "#CEC4AE",
  },
  uploadText: {
    fontSize: 10,
    letterSpacing: 2.5,
    color: "#8A7D6A",
    marginBottom: 8,
  },
  uploadButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  uploadBtn: {
    backgroundColor: "#1A1612",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: "#1A1612",
  },
  uploadBtnSecondary: {
    backgroundColor: "transparent",
    borderColor: "#1A1612",
  },
  uploadBtnText: {
    color: "#F4EFE4",
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: "500",
  },
  uploadBtnTextSecondary: {
    color: "#1A1612",
  },
  imageContainer: {
    gap: 12,
    marginBottom: 24,
  },
  preview: {
    width: "100%",
    height: 240,
    borderWidth: 1.5,
    borderColor: "#CEC4AE",
    backgroundColor: "#FEFAF2",
  },
  actionRow: {
    flexDirection: "row",
  },
  solveBtn: {
    flex: 1,
    backgroundColor: "#1A1612",
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#1A1612",
  },
  btnDisabled: {
    opacity: 0.5,
  },
  solveBtnText: {
    color: "#F4EFE4",
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: "500",
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#1A1612",
    borderLeftWidth: 0,
    backgroundColor: "transparent",
  },
  resetBtnText: {
    color: "#4A4035",
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: "500",
  },
});
