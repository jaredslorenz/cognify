import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Animated,
  Modal,
  Alert,
  SafeAreaView as RNSafeAreaView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { useGetAuthUserQuery } from "../api/authApi";
import {
  useGetUserStatsQuery,
  useGetSolvedProblemsQuery,
  useGetPracticeProblemsQuery,
  useDeleteProblemMutation,
  SolvedProblem,
  PracticeProblem,
} from "../api/uploadsApi";
import { SkeletonCard } from "../components/SkeletonLoader";
import Skeleton from "../components/SkeletonLoader";
import AnimatedButton from "../components/AnimatedButton";
import ProblemCard from "../components/ProblemCard";
import { PracticeResponse } from "./SolveScreen";

// ── Fade-in wrapper ──────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      delay,
      useNativeDriver: true,
      speed: 14,
      bounciness: 3,
    }).start();
  }, []);
  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [12, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

// ── Problem detail modal ─────────────────────────────────
interface ModalItem {
  problem: PracticeResponse;
  label: string;
  id: number;
  type: "solved" | "practice";
}

function ProblemModal({
  item,
  onClose,
  onDelete,
  isDeleting,
}: {
  item: ModalItem;
  onClose: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <RNSafeAreaView style={styles.modalRoot}>
        <View style={styles.modalHeader}>
          <View style={styles.modalEyebrow}>
            <View style={styles.modalRule} />
            <Text style={styles.modalEyebrowText}>{item.label}</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.modalClose}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.modalScroll}>
          <ProblemCard
            problem={item.problem}
            isSolvePage={false}
            index={0}
            total={1}
          />

          <TouchableOpacity
            style={[styles.deleteBtn, isDeleting && styles.deleteBtnDisabled]}
            onPress={onDelete}
            disabled={isDeleting}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteBtnText}>
              {isDeleting ? "DELETING..." : "DELETE →"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </RNSafeAreaView>
    </Modal>
  );
}

// ── Subject color ────────────────────────────────────────
function getSubjectColor(subject?: string): string {
  if (!subject) return "#5548B0";
  const s = subject.toLowerCase();
  if (s.includes("calc") || s.includes("math")) return "#5548B0";
  if (s.includes("phys")) return "#B87333";
  if (s.includes("chem") || s.includes("bio")) return "#4A7C59";
  return "#5548B0";
}

// ── Horizontal cards ─────────────────────────────────────
function SolvedCard({
  item,
  onPress,
}: {
  item: SolvedProblem;
  onPress: () => void;
}) {
  const color = getSubjectColor(item.subject);
  return (
    <TouchableOpacity
      style={styles.hcard}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.hcardAccent, { backgroundColor: color }]} />
      <View style={styles.hcardInner}>
        <View style={styles.hcardTop}>
          {item.subject && (
            <Text
              style={[styles.hcardSubj, { color, borderColor: color + "50" }]}
            >
              {item.subject.toUpperCase()}
            </Text>
          )}
          <Text style={styles.hcardDate}>
            {new Date(item.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
        <Text style={styles.hcardQ} numberOfLines={3}>
          {item.question}
        </Text>
        {item.answer ? (
          <Text style={styles.hcardAns} numberOfLines={1}>
            → {item.answer}
          </Text>
        ) : null}
        <Text style={styles.hcardCta}>View hints →</Text>
      </View>
    </TouchableOpacity>
  );
}

function PracticeCard({
  item,
  onPress,
}: {
  item: PracticeProblem;
  onPress: () => void;
}) {
  const color = getSubjectColor(item.subject);
  return (
    <TouchableOpacity
      style={styles.hcard}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.hcardAccent, { backgroundColor: color }]} />
      <View style={styles.hcardInner}>
        <View style={styles.hcardTop}>
          {item.subject && (
            <Text
              style={[styles.hcardSubj, { color, borderColor: color + "50" }]}
            >
              {item.subject.toUpperCase()}
            </Text>
          )}
          {item.difficulty && (
            <Text style={styles.hcardDiff}>
              {item.difficulty.toUpperCase()}
            </Text>
          )}
          <Text style={styles.hcardDate}>
            {new Date(item.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
        <Text style={styles.hcardQ} numberOfLines={3}>
          {item.question}
        </Text>
        <Text style={styles.hcardCta}>View hints →</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Section header ───────────────────────────────────────
function SectionHeader({ title, accent }: { title: string; accent: string }) {
  return (
    <View style={styles.secHdr}>
      <Text style={styles.secHdrTitle}>
        {title} <Text style={styles.secHdrAccent}>{accent}</Text>
      </Text>
      <View style={styles.secHdrRule} />
    </View>
  );
}

// ── Empty row ────────────────────────────────────────────
function EmptyRow({ message }: { message: string }) {
  return (
    <View style={styles.emptyRow}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

// ── Guest view ───────────────────────────────────────────
function GuestView() {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <FadeIn>
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowRule} />
            <Text style={styles.eyebrowText}>DASHBOARD</Text>
          </View>
          <Text style={styles.guestTitle}>
            Sign in to track{"\n"}
            <Text style={styles.accent}>your progress.</Text>
          </Text>
        </FadeIn>
        <FadeIn delay={100}>
          <View style={styles.guestCard}>
            <Text style={styles.guestCardTitle}>Save your work</Text>
            <Text style={styles.guestCardSub}>
              Every solved and practice problem saved. Stats, streaks, history.
            </Text>
            <View style={{ gap: 10, marginTop: 12 }}>
              <AnimatedButton
                label="SIGN IN →"
                onPress={() =>
                  navigation.navigate("Auth", { screen: "SignIn" })
                }
                haptic="medium"
              />
              <AnimatedButton
                label="CREATE ACCOUNT →"
                onPress={() =>
                  navigation.navigate("Auth", { screen: "SignUp" })
                }
                variant="secondary"
                haptic="light"
              />
            </View>
          </View>
        </FadeIn>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Main dashboard ───────────────────────────────────────
export default function DashboardScreen() {
  const { data: user } = useGetAuthUserQuery();
  const { data: stats, isLoading: statsLoading } = useGetUserStatsQuery(
    undefined,
    { skip: !user },
  );
  const { data: solved, isLoading: solvedLoading } = useGetSolvedProblemsQuery(
    undefined,
    { skip: !user },
  );
  const { data: practiced, isLoading: practicedLoading } =
    useGetPracticeProblemsQuery(undefined, { skip: !user });
  const [deleteProblem, { isLoading: isDeleting }] = useDeleteProblemMutation();
  const [modalItem, setModalItem] = useState<ModalItem | null>(null);

  if (!user) return <GuestView />;

  const initials = user.username.slice(0, 2).toUpperCase();

  const statItems = [
    { label: "SOLVED", value: stats?.solved ?? 0, streak: false },
    { label: "PRACTICED", value: stats?.practiced ?? 0, streak: false },
    { label: "HINTS", value: stats?.hintsUsed ?? 0, streak: false },
    { label: "STREAK", value: `${stats?.streak ?? 0}d`, streak: true },
  ];

  const openSolved = (item: SolvedProblem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalItem({
      id: item.id,
      type: "solved",
      label: "SOLVED PROBLEM",
      problem: {
        question: item.question,
        hints: item.hints ?? [],
        answer: item.answer,
        fullSolution: item.full_solution,
      },
    });
  };

  const openPractice = (item: PracticeProblem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalItem({
      id: item.id,
      type: "practice",
      label: "PRACTICE PROBLEM",
      problem: {
        question: item.question,
        hints: item.hints ?? [],
        answer: item.answer,
      },
    });
  };

  const handleDelete = () => {
    if (!modalItem) return;
    Alert.alert("Delete problem", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await deleteProblem({
              id: modalItem.id,
              type: modalItem.type,
            }).unwrap();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setModalItem(null);
          } catch {
            Alert.alert("Error", "Failed to delete. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.root} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <FadeIn>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View>
              <Text style={styles.profileName}>
                Hey, <Text style={styles.accent}>{user.username}.</Text>
              </Text>
              <Text style={styles.profileHandle}>@{user.username}</Text>
            </View>
          </View>
        </FadeIn>

        <FadeIn delay={60}>
          {statsLoading ? (
            <View style={styles.statsRow}>
              <Skeleton width="100%" height={72} />
            </View>
          ) : (
            <View style={styles.statsRow}>
              {statItems.map((s, i) => (
                <View
                  key={s.label}
                  style={[
                    styles.statCell,
                    i < statItems.length - 1 && styles.statCellBorder,
                  ]}
                >
                  <View
                    style={[
                      styles.statUnderline,
                      s.streak && styles.statUnderlineStreak,
                    ]}
                  />
                  <Text
                    style={[styles.statNum, s.streak && styles.statNumStreak]}
                  >
                    {s.value}
                  </Text>
                  <Text
                    style={[styles.statLbl, s.streak && styles.statLblStreak]}
                  >
                    {s.label}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </FadeIn>

        <FadeIn delay={120}>
          <SectionHeader title="Recently" accent="solved" />
          {solvedLoading ? (
            <SkeletonCard />
          ) : !solved || solved.length === 0 ? (
            <EmptyRow message="No solved problems yet — head to Solve." />
          ) : (
            <FlatList
              data={solved.slice(0, 10)}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <SolvedCard item={item} onPress={() => openSolved(item)} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + 10}
              decelerationRate="fast"
              contentContainerStyle={styles.hlist}
            />
          )}
        </FadeIn>

        <FadeIn delay={180}>
          <SectionHeader title="Recent" accent="practice" />
          {practicedLoading ? (
            <SkeletonCard />
          ) : !practiced || practiced.length === 0 ? (
            <EmptyRow message="No practice problems yet — head to Practice." />
          ) : (
            <FlatList
              data={practiced.slice(0, 10)}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <PracticeCard item={item} onPress={() => openPractice(item)} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + 10}
              decelerationRate="fast"
              contentContainerStyle={styles.hlist}
            />
          )}
        </FadeIn>
      </ScrollView>

      {modalItem && (
        <ProblemModal
          item={modalItem}
          onClose={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setModalItem(null);
          }}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </SafeAreaView>
  );
}

const CARD_WIDTH = 264;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4EFE4" },
  scroll: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 48 },

  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  eyebrowRule: { width: 20, height: 1.5, backgroundColor: "#5548B0" },
  eyebrowText: {
    fontSize: 8,
    letterSpacing: 3,
    color: "#5548B0",
    fontWeight: "600",
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1A1612",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#F4EFE4",
    letterSpacing: -0.3,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "300",
    color: "#1A1612",
    letterSpacing: -0.3,
  },
  accent: { color: "#5548B0", fontStyle: "italic" },
  profileHandle: {
    fontSize: 10,
    color: "#8A7D6A",
    letterSpacing: 1.5,
    marginTop: 1,
  },

  statsRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#D6CEBC",
    marginBottom: 28,
    backgroundColor: "#FEFAF2",
  },
  statCell: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  statCellBorder: { borderRightWidth: 1, borderRightColor: "#D6CEBC" },
  statUnderline: {
    width: "55%",
    height: 1.5,
    backgroundColor: "#C5C0E8",
    marginBottom: 7,
  },
  statUnderlineStreak: { backgroundColor: "#B87333" },
  statNum: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1A1612",
    letterSpacing: -0.5,
    lineHeight: 26,
    marginBottom: 4,
    fontVariant: ["tabular-nums"],
  },
  statNumStreak: { color: "#B87333" },
  statLbl: {
    fontSize: 6,
    letterSpacing: 1.5,
    color: "#8A7D6A",
    fontWeight: "600",
  },
  statLblStreak: { color: "#B87333", opacity: 0.8 },

  secHdr: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  secHdrTitle: {
    fontSize: 16,
    fontWeight: "300",
    color: "#1A1612",
    letterSpacing: -0.3,
  },
  secHdrAccent: { color: "#5548B0", fontStyle: "italic" },
  secHdrRule: { flex: 1, height: 1, backgroundColor: "#D6CEBC" },

  hlist: { paddingRight: 24, gap: 10, marginBottom: 28 },

  hcard: {
    width: CARD_WIDTH,
    backgroundColor: "#FEFAF2",
    borderWidth: 1,
    borderColor: "#D6CEBC",
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#1A1612",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 0,
    elevation: 2,
  },
  hcardAccent: { width: 3 },
  hcardInner: { flex: 1, padding: 12, gap: 5 },
  hcardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
  },
  hcardSubj: {
    fontSize: 7,
    letterSpacing: 1.5,
    fontWeight: "600",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 1,
  },
  hcardDiff: {
    fontSize: 7,
    letterSpacing: 1.5,
    color: "#8A7D6A",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#D6CEBC",
  },
  hcardDate: {
    fontSize: 8,
    color: "#CEC4AE",
    letterSpacing: 1,
    marginLeft: "auto",
  },
  hcardQ: { fontSize: 12, fontWeight: "300", color: "#1A1612", lineHeight: 18 },
  hcardAns: { fontSize: 11, color: "#5548B0", letterSpacing: 0.2 },
  hcardCta: {
    fontSize: 9,
    color: "#5548B0",
    letterSpacing: 1,
    marginTop: 2,
    textDecorationLine: "underline",
  },

  emptyRow: {
    borderWidth: 1,
    borderColor: "#D6CEBC",
    borderStyle: "dashed",
    padding: 20,
    alignItems: "center",
    marginBottom: 28,
  },
  emptyText: { fontSize: 12, color: "#8A7D6A" },

  modalRoot: { flex: 1, backgroundColor: "#F4EFE4" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#D6CEBC",
  },
  modalEyebrow: { flexDirection: "row", alignItems: "center", gap: 10 },
  modalRule: { width: 16, height: 1.5, backgroundColor: "#5548B0" },
  modalEyebrowText: {
    fontSize: 8,
    letterSpacing: 3,
    color: "#5548B0",
    fontWeight: "600",
  },
  modalClose: { fontSize: 16, color: "#8A7D6A", fontWeight: "300" },
  modalScroll: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 48 },

  deleteBtn: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#C0392B",
    paddingVertical: 14,
    alignItems: "center",
  },
  deleteBtnDisabled: { opacity: 0.5 },
  deleteBtnText: {
    fontSize: 10,
    letterSpacing: 2.5,
    color: "#C0392B",
    fontWeight: "600",
  },

  guestTitle: {
    fontSize: 36,
    fontWeight: "300",
    color: "#1A1612",
    letterSpacing: -1,
    marginBottom: 24,
    lineHeight: 40,
  },
  guestCard: {
    borderWidth: 1.5,
    borderColor: "#1A1612",
    backgroundColor: "#FEFAF2",
    padding: 24,
    shadowColor: "#1A1612",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  guestCardTitle: {
    fontSize: 18,
    fontWeight: "300",
    color: "#1A1612",
    marginBottom: 8,
  },
  guestCardSub: { fontSize: 13, color: "#8A7D6A", lineHeight: 20 },
});
