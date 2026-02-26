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
import { useGetChatGPTProblemsMutation } from "../api/chatgptApi";
import { useGetAuthUserQuery } from "../api/authApi";
import { useStorePracticeMutation } from "../api/uploadsApi";
import ProblemCard from "../components/ProblemCard";
import { PracticeResponse } from "./SolveScreen";

const SUBJECTS = [
  "Calculus",
  "Physics",
  "Chemistry",
  "History",
  "Statistics",
  "Literature",
  "Biology",
];
const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const AMOUNTS = [1, 2, 3, 5] as const;

export default function PracticeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [problems, setProblems] = useState<PracticeResponse[]>([]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [subject, setSubject] = useState<string | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );
  const [amount, setAmount] = useState(1);

  const [getChatGPTProblems, { isLoading: chatLoading }] =
    useGetChatGPTProblemsMutation();
  const { data: authUser } = useGetAuthUserQuery();
  const [storePractice] = useStorePracticeMutation();

  const isLoading = ocrLoading || chatLoading;

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera access required.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      quality: 0.9,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setProblems([]);
    }
  };

  const handleGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Photo library access required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.9,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setProblems([]);
    }
  };

  const handleGenerate = async () => {
    if (!imageUri) return;
    setProblems([]);
    setOcrLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "notes.jpg",
      } as any);

      const ocrRes = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}ocr`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      const extractedText = ocrRes.data?.ParsedResults?.[0]?.ParsedText ?? "";
      setOcrLoading(false);

      if (!extractedText.trim()) {
        Alert.alert("No text found", "Try a clearer image.");
        return;
      }

      const chatData = await getChatGPTProblems({
        text: extractedText,
        subject,
        difficulty,
        amount,
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
          : [{ question: "No problems returned.", hints: [], answer: "" }],
      );

      if (authUser) {
        await storePractice({
          userId: authUser.userId,
          problems: parsed.map((p) => ({
            question: p.question,
            hints: p.hints,
            answer: p.answer,
          })),
          subject,
          difficulty,
        });
      }
    } catch (err) {
      setOcrLoading(false);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.pageHeader}>
          <View style={styles.rule} />
          <Text style={styles.eyebrow}>PRACTICE PROBLEMS</Text>
        </View>
        <Text style={styles.title}>
          Practice makes{"\n"}
          <Text style={styles.titleAccent}>permanent.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Upload notes to generate practice problems with hints and solutions.
        </Text>

        {/* Subject selector */}
        <Text style={styles.selectorLabel}>
          SUBJECT <Text style={styles.optional}>(OPTIONAL)</Text>
        </Text>
        <View style={styles.chipRow}>
          {SUBJECTS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, subject === s && styles.chipActive]}
              onPress={() => setSubject(subject === s ? undefined : s)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  subject === s && styles.chipTextActive,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Difficulty + Amount */}
        <View style={styles.selectorRow}>
          <View style={styles.selectorGroup}>
            <Text style={styles.selectorLabel}>DIFFICULTY</Text>
            <View style={styles.segmented}>
              {DIFFICULTIES.map((d, i) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.segment,
                    difficulty === d && styles.segmentActive,
                    i < DIFFICULTIES.length - 1 && styles.segmentBorderRight,
                  ]}
                  onPress={() => setDifficulty(d)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      difficulty === d && styles.segmentTextActive,
                    ]}
                  >
                    {d.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.selectorGroup}>
            <Text style={styles.selectorLabel}>AMOUNT</Text>
            <View style={styles.segmented}>
              {AMOUNTS.map((n, i) => (
                <TouchableOpacity
                  key={n}
                  style={[
                    styles.segment,
                    amount === n && styles.segmentActive,
                    i < AMOUNTS.length - 1 && styles.segmentBorderRight,
                  ]}
                  onPress={() => setAmount(n)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      amount === n && styles.segmentTextActive,
                    ]}
                  >
                    {n}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Upload zone */}
        {!imageUri ? (
          <View style={styles.uploadZone}>
            <Text style={styles.uploadArrow}>↑</Text>
            <Text style={styles.uploadText}>UPLOAD NOTES OR TOPIC IMAGE</Text>
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
                onPress={handleGenerate}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color="#F4EFE4" />
                ) : (
                  <Text style={styles.solveBtnText}>
                    {`GENERATE ${amount > 1 ? `${amount} PROBLEMS` : "PRACTICE"} →`}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setImageUri(null);
                  setProblems([]);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.resetBtnText}>REMOVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Problem cards */}
        {problems.length > 1 && (
          <View style={styles.summaryRow}>
            <View style={styles.rule} />
            <Text style={styles.summaryText}>
              {problems.length} PROBLEMS GENERATED
            </Text>
          </View>
        )}
        {problems.map((problem, i) => (
          <ProblemCard
            key={i}
            problem={problem}
            index={i}
            total={problems.length}
            isSolvePage={false}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4EFE4" },
  scroll: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 48, gap: 0 },
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  rule: { width: 28, height: 1.5, backgroundColor: "#3D3580" },
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
  titleAccent: { color: "#3D3580", fontStyle: "italic" },
  subtitle: {
    fontSize: 13,
    color: "#8A7D6A",
    lineHeight: 22,
    marginBottom: 28,
  },
  selectorLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: "#3D3580",
    fontWeight: "500",
    marginBottom: 10,
  },
  optional: { color: "#8A7D6A" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: "#CEC4AE",
  },
  chipActive: { borderColor: "#3D3580", backgroundColor: "#F4F3FC" },
  chipText: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: "#8A7D6A",
    fontWeight: "500",
  },
  chipTextActive: { color: "#3D3580" },
  selectorRow: { flexDirection: "row", gap: 24, marginBottom: 28 },
  selectorGroup: { flex: 1 },
  segmented: { flexDirection: "row" },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#CEC4AE",
  },
  segmentActive: { borderColor: "#3D3580", backgroundColor: "#F4F3FC" },
  segmentBorderRight: { borderRightWidth: 0 },
  segmentText: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: "#8A7D6A",
    fontWeight: "500",
  },
  segmentTextActive: { color: "#3D3580" },
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
    fontSize: 10,
    letterSpacing: 2.5,
    color: "#8A7D6A",
    marginBottom: 8,
  },
  uploadButtons: { flexDirection: "row", gap: 12, marginTop: 8 },
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
  uploadBtnTextSecondary: { color: "#1A1612" },
  imageContainer: { gap: 12, marginBottom: 24 },
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
    fontWeight: "500",
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#1A1612",
    borderLeftWidth: 0,
  },
  resetBtnText: {
    color: "#4A4035",
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: "500",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 10,
    letterSpacing: 2,
    color: "#3D3580",
    fontWeight: "500",
  },
});
