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
import * as Haptics from "expo-haptics";
import axios from "axios";
import { useGetChatGPTResponseMutation } from "../api/chatgptApi";
import { useGetAuthUserQuery } from "../api/authApi";
import { useStoreSolvedMutation } from "../api/uploadsApi";
import { getAuthToken } from "../utils/getAuthToken";
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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setImageUri(result.assets[0].uri);
      setSolution(null);
    }
  };

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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setImageUri(result.assets[0].uri);
      setSolution(null);
    }
  };

  const handleSolve = async () => {
    if (!imageUri) return;
    setSolution(null);
    setOcrLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Attach auth token to OCR call
      const token = await getAuthToken();
      const authHeaders: Record<string, string> = {
        "Content-Type": "multipart/form-data",
      };
      if (token) authHeaders["Authorization"] = `Bearer ${token}`;

      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "homework.jpg",
      } as any);

      const ocrRes = await axios.post(`${API_URL}ocr`, formData, {
        headers: authHeaders,
      });

      const extractedText = ocrRes.data?.ParsedResults?.[0]?.ParsedText ?? "";
      setOcrLoading(false);

      if (!extractedText.trim()) {
        Alert.alert("No text found", "Try a clearer image with visible text.");
        return;
      }

      const chatData = await getChatGPTResponse({
        text: extractedText,
      }).unwrap();
      setSolution(chatData);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (authUser) {
        await storeSolved({
          file_name: "homework.jpg",
          question: chatData.question,
          hints: chatData.hints,
          answer: chatData.answer,
          full_solution: chatData.fullSolution ?? "",
        });
      }
    } catch (err: any) {
      setOcrLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      // Surface the real error — axios wraps server responses in err.response.data
      const message = err?.response?.data
        ? JSON.stringify(err.response.data)
        : (err?.message ?? "Unknown error");
      Alert.alert("Error", message);
    }
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setImageUri(null);
    setSolution(null);
  };

  return (
    <SafeAreaView style={styles.root} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.pageHeader}>
          <View style={styles.rule} />
          <Text style={styles.eyebrow}>SOLVE</Text>
        </View>
        <Text style={styles.title}>
          Upload it.{"\n"}
          <Text style={styles.titleAccent}>Understand it.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Scan any problem for step-by-step hints and a full solution.
        </Text>

        {!imageUri ? (
          <View style={styles.uploadZone}>
            <Text style={styles.uploadArrow}>↑</Text>
            <Text style={styles.uploadText}>SCAN OR UPLOAD A PROBLEM</Text>
            <View style={styles.btnPair}>
              <TouchableOpacity
                style={styles.btn}
                onPress={handleCamera}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>CAMERA</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnGhost]}
                onPress={handleGallery}
                activeOpacity={0.8}
              >
                <Text style={[styles.btnText, styles.btnGhostText]}>
                  GALLERY
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.imageBlock}>
            <View style={styles.scannedBadge}>
              <Text style={styles.scannedCheck}>✓</Text>
              <Text style={styles.scannedLabel}>SCANNED · homework.jpg</Text>
            </View>
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
  root: { flex: 1, backgroundColor: "#F4EFE4" },
  scroll: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 48 },

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  rule: { width: 16, height: 1.5, backgroundColor: "#5548B0" },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 3,
    color: "#5548B0",
    fontWeight: "600",
  },

  title: {
    fontSize: 40,
    fontWeight: "300",
    color: "#1A1612",
    lineHeight: 46,
    letterSpacing: -1,
    marginBottom: 10,
  },
  titleAccent: { color: "#5548B0", fontStyle: "italic" },
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
  uploadArrow: { fontSize: 28, color: "#CEC4AE" },
  uploadText: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: "#8A7D6A",
    marginBottom: 8,
  },

  btnPair: { flexDirection: "row", gap: 10, marginTop: 4 },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#1A1612",
    borderWidth: 1.5,
    borderColor: "#1A1612",
  },
  btnGhost: { backgroundColor: "transparent", borderColor: "#1A1612" },
  btnText: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: "#F4EFE4",
    fontWeight: "600",
  },
  btnGhostText: { color: "#1A1612" },

  imageBlock: { gap: 10, marginBottom: 24 },
  scannedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEFAF2",
    borderWidth: 1,
    borderColor: "#D6CEBC",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  scannedCheck: { fontSize: 10, color: "#5548B0" },
  scannedLabel: { fontSize: 8, letterSpacing: 1.5, color: "#8A7D6A" },

  preview: {
    width: "100%",
    height: 240,
    borderWidth: 1.5,
    borderColor: "#CEC4AE",
    backgroundColor: "#FEFAF2",
  },
  actionRow: { flexDirection: "row" },
  solveBtn: {
    flex: 1,
    backgroundColor: "#1A1612",
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#1A1612",
  },
  btnDisabled: { opacity: 0.5 },
  solveBtnText: {
    color: "#F4EFE4",
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: "600",
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
