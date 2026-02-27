import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import axios from "axios";
import { useGetChatGPTProblemsMutation } from "../api/chatgptApi";
import { useGetAuthUserQuery } from "../api/authApi";
import { useStorePracticeMutation } from "../api/uploadsApi";
import ProblemCard from "../components/ProblemCard";
import { PracticeResponse } from "./SolveScreen";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 48; // full width minus padding

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

export default function PracticeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [problems, setProblems] = useState<PracticeResponse[]>([]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [subject, setSubject] = useState<string | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );
  const [amount, setAmount] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setImageUri(result.assets[0].uri);
      setProblems([]);
    }
  };

  const handleGenerate = async () => {
    if (!imageUri) return;
    setProblems([]);
    setActiveIndex(0);
    setOcrLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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
      const final =
        parsed.length > 0
          ? parsed
          : [{ question: "No problems returned.", hints: [], answer: "" }];
      setProblems(final);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // userId removed — server extracts from JWT
      if (authUser) {
        await storePractice({
          problems: final.map((p) => ({
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  // ── Problem card swiper ──────────────────────────────
  if (problems.length > 0) {
    return (
      <SafeAreaView style={styles.root} edges={["bottom"]}>
        {/* Progress track */}
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${((activeIndex + 1) / problems.length) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {activeIndex + 1} OF {problems.length}
          </Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={problems}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={SCREEN_WIDTH}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
            );
            setActiveIndex(index);
            Haptics.selectionAsync();
          }}
          renderItem={({ item, index }) => (
            <View
              style={{
                width: SCREEN_WIDTH,
                paddingHorizontal: 24,
                paddingTop: 8,
                paddingBottom: 48,
              }}
            >
              <ProblemCard
                problem={item}
                isSolvePage={false}
                index={index}
                total={problems.length}
              />
            </View>
          )}
        />

        {/* Page bars */}
        <View style={styles.pageBars}>
          {problems.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                flatListRef.current?.scrollToIndex({
                  index: i,
                  animated: true,
                });
                setActiveIndex(i);
                Haptics.selectionAsync();
              }}
            >
              <View
                style={[
                  styles.pageBar,
                  i === activeIndex && styles.pageBarActive,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Back to setup */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setProblems([]);
            setImageUri(null);
          }}
        >
          <Text style={styles.backBtnText}>← NEW SESSION</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Setup screen ─────────────────────────────────────
  return (
    <SafeAreaView style={styles.root} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.pageHeader}>
          <View style={styles.rule} />
          <Text style={styles.eyebrow}>PRACTICE</Text>
        </View>
        <Text style={styles.title}>
          Practice makes{"\n"}
          <Text style={styles.titleAccent}>permanent.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Upload notes to generate practice problems with hints and solutions.
        </Text>

        {/* Subject */}
        <Text style={styles.selLabel}>
          SUBJECT <Text style={styles.optional}>(OPTIONAL)</Text>
        </Text>
        <View style={styles.chipRow}>
          {SUBJECTS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, subject === s && styles.chipActive]}
              onPress={() => {
                Haptics.selectionAsync();
                setSubject(subject === s ? undefined : s);
              }}
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
        <View style={styles.selRow}>
          <View style={styles.selGroup}>
            <Text style={styles.selLabel}>DIFFICULTY</Text>
            <View style={styles.segmented}>
              {DIFFICULTIES.map((d, i) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.seg,
                    difficulty === d && styles.segActive,
                    i < DIFFICULTIES.length - 1 && styles.segBorderR,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setDifficulty(d);
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.segText,
                      difficulty === d && styles.segTextActive,
                    ]}
                  >
                    {d.slice(0, 3).toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.selGroup}>
            <Text style={styles.selLabel}>AMOUNT</Text>
            <View style={styles.segmented}>
              {AMOUNTS.map((n, i) => (
                <TouchableOpacity
                  key={n}
                  style={[
                    styles.seg,
                    amount === n && styles.segActive,
                    i < AMOUNTS.length - 1 && styles.segBorderR,
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setAmount(n);
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.segText,
                      amount === n && styles.segTextActive,
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
            <View style={styles.uploadBtns}>
              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={handleCamera}
                activeOpacity={0.8}
              >
                <Text style={styles.uploadBtnText}>CAMERA</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.uploadBtn, styles.uploadBtnGhost]}
                onPress={handleGallery}
                activeOpacity={0.8}
              >
                <Text style={[styles.uploadBtnText, styles.uploadBtnGhostText]}>
                  GALLERY
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.imageBlock}>
            <Image
              source={{ uri: imageUri }}
              style={styles.preview}
              resizeMode="contain"
            />
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.genBtn, isLoading && styles.btnDisabled]}
                onPress={handleGenerate}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color="#F4EFE4" />
                ) : (
                  <Text style={styles.genBtnText}>
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
    marginBottom: 14,
  },
  rule: { width: 16, height: 1.5, backgroundColor: "#5548B0" },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 3,
    color: "#5548B0",
    fontWeight: "600",
  },
  title: {
    fontSize: 36,
    fontWeight: "300",
    color: "#1A1612",
    lineHeight: 42,
    letterSpacing: -1,
    marginBottom: 10,
  },
  titleAccent: { color: "#5548B0", fontStyle: "italic" },
  subtitle: {
    fontSize: 12,
    color: "#8A7D6A",
    lineHeight: 20,
    marginBottom: 24,
  },

  selLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: "#5548B0",
    fontWeight: "600",
    marginBottom: 9,
  },
  optional: { color: "#8A7D6A" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 22 },
  chip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#CEC4AE",
  },
  chipActive: { borderColor: "#5548B0", backgroundColor: "#EEEDF8" },
  chipText: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: "#8A7D6A",
    fontWeight: "500",
  },
  chipTextActive: { color: "#5548B0" },

  selRow: { flexDirection: "row", gap: 20, marginBottom: 24 },
  selGroup: { flex: 1 },
  segmented: { flexDirection: "row" },
  seg: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CEC4AE",
  },
  segActive: { borderColor: "#5548B0", backgroundColor: "#EEEDF8" },
  segBorderR: { borderRightWidth: 0 },
  segText: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: "#8A7D6A",
    fontWeight: "500",
  },
  segTextActive: { color: "#5548B0" },

  uploadZone: {
    borderWidth: 1.5,
    borderColor: "#CEC4AE",
    borderStyle: "dashed",
    backgroundColor: "#FEFAF2",
    paddingVertical: 44,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  uploadArrow: { fontSize: 24, color: "#CEC4AE" },
  uploadText: { fontSize: 9, letterSpacing: 2.5, color: "#8A7D6A" },
  uploadBtns: { flexDirection: "row", gap: 10, marginTop: 8 },
  uploadBtn: {
    backgroundColor: "#1A1612",
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#1A1612",
  },
  uploadBtnGhost: { backgroundColor: "transparent", borderColor: "#1A1612" },
  uploadBtnText: {
    color: "#F4EFE4",
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: "600",
  },
  uploadBtnGhostText: { color: "#1A1612" },

  imageBlock: { gap: 10, marginBottom: 24 },
  preview: {
    width: "100%",
    height: 220,
    borderWidth: 1.5,
    borderColor: "#CEC4AE",
    backgroundColor: "#FEFAF2",
  },
  actionRow: { flexDirection: "row" },
  genBtn: {
    flex: 1,
    backgroundColor: "#1A1612",
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#1A1612",
  },
  btnDisabled: { opacity: 0.5 },
  genBtnText: {
    color: "#F4EFE4",
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: "600",
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#1A1612",
    borderLeftWidth: 0,
    backgroundColor: "transparent",
  },
  resetBtnText: {
    color: "#4A4035",
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: "500",
  },

  // Swiper
  progressWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  progressTrack: {
    flex: 1,
    height: 1.5,
    backgroundColor: "#D6CEBC",
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#5548B0" },
  progressLabel: { fontSize: 8, letterSpacing: 1.5, color: "#8A7D6A" },

  pageBars: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 8,
  },
  pageBar: {
    height: 2,
    width: 16,
    backgroundColor: "#D6CEBC",
    borderRadius: 1,
  },
  pageBarActive: { width: 24, backgroundColor: "#5548B0" },

  backBtn: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  backBtnText: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: "#8A7D6A",
    fontWeight: "600",
  },
});
