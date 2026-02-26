import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useGetAuthUserQuery, useSignOutMutation } from "../api/authApi";
import {
  useGetUserStatsQuery,
  useGetSolvedProblemsQuery,
  useGetPracticeProblemsQuery,
} from "../api/uploadsApi";
import { SkeletonCard } from "../components/SkeletonLoader";
import Skeleton from "../components/SkeletonLoader";
import AnimatedButton from "../components/AnimatedButton";

function FadeInView({
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
              outputRange: [16, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

function StatCard({
  label,
  value,
  delay,
}: {
  label: string;
  value: any;
  delay: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      delay,
      useNativeDriver: true,
      speed: 16,
      bounciness: 8,
    }).start();
  }, []);
  return (
    <Animated.View
      style={[
        styles.statCardInner,
        {
          opacity: anim,
          transform: [
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.85, 1],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { data: user } = useGetAuthUserQuery();
  const { data: stats, isLoading: statsLoading } = useGetUserStatsQuery(
    user?.userId ?? "",
    { skip: !user },
  );
  const { data: solved, isLoading: solvedLoading } = useGetSolvedProblemsQuery(
    user?.userId ?? "",
    { skip: !user },
  );
  const { data: practiced, isLoading: practicedLoading } =
    useGetPracticeProblemsQuery(user?.userId ?? "", { skip: !user });
  const [signOut, { isLoading: signOutLoading }] = useSignOutMutation();

  if (!user) {
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <FadeInView>
            <View style={styles.pageHeader}>
              <View style={styles.rule} />
              <Text style={styles.eyebrow}>DASHBOARD</Text>
            </View>
            <Text style={styles.title}>
              Your{"\n"}
              <Text style={styles.titleAccent}>progress.</Text>
            </Text>
          </FadeInView>

          <FadeInView delay={100}>
            <View style={styles.guestCard}>
              <Text style={styles.guestTitle}>
                Sign in to track your progress
              </Text>
              <Text style={styles.guestSubtitle}>
                Save every problem you solve, track hints used, and build a
                daily streak.
              </Text>
              <View style={{ gap: 12, marginTop: 8 }}>
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
          </FadeInView>

          {[
            {
              label: "Problem history",
              desc: "Every solved and practice problem saved.",
            },
            {
              label: "Stats & streaks",
              desc: "Track how many problems you've solved daily.",
            },
            {
              label: "Hint tracking",
              desc: "See how many hints you needed over time.",
            },
          ].map((item, i) => (
            <FadeInView key={i} delay={200 + i * 80}>
              <View style={styles.featureItem}>
                <View style={styles.featureDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureLabel}>{item.label}</Text>
                  <Text style={styles.featureDesc}>{item.desc}</Text>
                </View>
              </View>
            </FadeInView>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  const statCards = [
    { label: "SOLVED", value: stats?.solved ?? 0 },
    { label: "PRACTICED", value: stats?.practiced ?? 0 },
    { label: "HINTS USED", value: stats?.hintsUsed ?? 0 },
    { label: "STREAK", value: `${stats?.streak ?? 0}d` },
  ];

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <FadeInView>
          <View style={styles.titleRow}>
            <View>
              <View style={styles.pageHeader}>
                <View style={styles.rule} />
                <Text style={styles.eyebrow}>DASHBOARD</Text>
              </View>
              <Text style={styles.title}>
                Your{"\n"}
                <Text style={styles.titleAccent}>progress.</Text>
              </Text>
              <Text style={styles.username}>@{user.username}</Text>
            </View>
            <AnimatedButton
              label="SIGN OUT"
              onPress={async () => {
                await signOut();
              }}
              variant="secondary"
              loading={signOutLoading}
              haptic="medium"
              style={{ alignSelf: "flex-start", marginTop: 8 }}
            />
          </View>
        </FadeInView>

        <FadeInView delay={80}>
          <View style={styles.statsGrid}>
            {statsLoading ? (
              <View style={{ padding: 20, width: "100%", gap: 12 }}>
                <Skeleton width="60%" height={40} />
                <Skeleton width="40%" height={12} />
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  width: "100%",
                }}
              >
                {statCards.map((s, i) => (
                  <View
                    key={s.label}
                    style={[
                      styles.statCardOuter,
                      i % 2 === 0 && { borderRightWidth: 1.5 },
                      i < 2 && { borderBottomWidth: 1.5 },
                    ]}
                  >
                    <StatCard label={s.label} value={s.value} delay={i * 60} />
                  </View>
                ))}
              </View>
            )}
          </View>
        </FadeInView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Recent <Text style={styles.sectionAccent}>solved</Text>
          </Text>
          <View style={styles.sectionRule} />
        </View>

        {solvedLoading ? (
          [0, 1, 2].map((i) => <SkeletonCard key={i} />)
        ) : !solved || solved.length === 0 ? (
          <FadeInView>
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No solved problems yet</Text>
              <Text style={styles.emptySubtext}>
                Head to the Solve tab to get started.
              </Text>
            </View>
          </FadeInView>
        ) : (
          solved.slice(0, 5).map((item, i) => (
            <FadeInView key={item.id} delay={i * 60}>
              <TouchableOpacity
                style={styles.historyCard}
                activeOpacity={0.75}
                onPress={() => Haptics.selectionAsync()}
              >
                <View style={styles.historyCardHeader}>
                  <View style={styles.historyDot} />
                  <Text style={styles.historyDate}>
                    {new Date(item.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>
                <Text style={styles.historyQuestion} numberOfLines={2}>
                  {item.question}
                </Text>
                {item.answer ? (
                  <Text style={styles.historyAnswer} numberOfLines={1}>
                    → {item.answer}
                  </Text>
                ) : null}
              </TouchableOpacity>
            </FadeInView>
          ))
        )}

        <View style={[styles.sectionHeader, { marginTop: 32 }]}>
          <Text style={styles.sectionTitle}>
            Recent <Text style={styles.sectionAccent}>practiced</Text>
          </Text>
          <View style={styles.sectionRule} />
        </View>

        {practicedLoading ? (
          [0, 1, 2].map((i) => <SkeletonCard key={i} />)
        ) : !practiced || practiced.length === 0 ? (
          <FadeInView>
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No practice problems yet</Text>
              <Text style={styles.emptySubtext}>
                Head to the Practice tab to get started.
              </Text>
            </View>
          </FadeInView>
        ) : (
          practiced.slice(0, 5).map((item, i) => (
            <FadeInView key={item.id} delay={i * 60}>
              <TouchableOpacity
                style={styles.historyCard}
                activeOpacity={0.75}
                onPress={() => Haptics.selectionAsync()}
              >
                <View style={styles.historyCardHeader}>
                  <View
                    style={[styles.historyDot, { backgroundColor: "#8A7D6A" }]}
                  />
                  <Text style={styles.historyDate}>
                    {new Date(item.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                  {item.subject && (
                    <Text style={styles.tag}>{item.subject}</Text>
                  )}
                  {item.difficulty && (
                    <Text style={styles.tag}>{item.difficulty}</Text>
                  )}
                </View>
                <Text style={styles.historyQuestion} numberOfLines={2}>
                  {item.question}
                </Text>
              </TouchableOpacity>
            </FadeInView>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4EFE4" },
  scroll: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 64 },
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  rule: { width: 28, height: 1.5, backgroundColor: "#3D3580" },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 3,
    color: "#3D3580",
    fontWeight: "600",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  title: {
    fontSize: 48,
    fontWeight: "300",
    color: "#1A1612",
    lineHeight: 52,
    letterSpacing: -1.5,
  },
  titleAccent: { color: "#3D3580", fontStyle: "italic" },
  username: { fontSize: 12, color: "#8A7D6A", letterSpacing: 1, marginTop: 8 },
  statsGrid: { borderWidth: 1.5, borderColor: "#1A1612", marginBottom: 40 },
  statCardOuter: { width: "50%", borderColor: "#1A1612" },
  statCardInner: { padding: 20, alignItems: "center" },
  statValue: {
    fontSize: 40,
    fontWeight: "200",
    color: "#1A1612",
    letterSpacing: -1.5,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 9,
    letterSpacing: 2.5,
    color: "#8A7D6A",
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "300",
    color: "#1A1612",
    letterSpacing: -0.5,
  },
  sectionAccent: { color: "#3D3580", fontStyle: "italic" },
  sectionRule: { flex: 1, height: 1.5, backgroundColor: "#CEC4AE" },
  emptyState: {
    borderWidth: 1.5,
    borderColor: "#CEC4AE",
    borderStyle: "dashed",
    padding: 32,
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  emptyText: { fontSize: 14, color: "#4A4035", fontWeight: "300" },
  emptySubtext: { fontSize: 12, color: "#8A7D6A" },
  historyCard: {
    borderWidth: 1.5,
    borderColor: "#CEC4AE",
    backgroundColor: "#FEFAF2",
    padding: 16,
    marginBottom: 10,
    gap: 8,
  },
  historyCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  historyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3D3580",
  },
  historyDate: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: "#8A7D6A",
    fontWeight: "500",
  },
  historyQuestion: {
    fontSize: 14,
    color: "#1A1612",
    lineHeight: 22,
    fontWeight: "300",
  },
  historyAnswer: { fontSize: 12, color: "#3D3580", letterSpacing: 0.3 },
  tag: {
    fontSize: 9,
    color: "#8A7D6A",
    letterSpacing: 1.5,
    borderWidth: 1,
    borderColor: "#CEC4AE",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  guestCard: {
    borderWidth: 1.5,
    borderColor: "#1A1612",
    backgroundColor: "#FEFAF2",
    padding: 24,
    marginBottom: 32,
    gap: 12,
    shadowColor: "#1A1612",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  guestTitle: {
    fontSize: 20,
    fontWeight: "300",
    color: "#1A1612",
    letterSpacing: -0.5,
  },
  guestSubtitle: { fontSize: 13, color: "#8A7D6A", lineHeight: 22 },
  featureItem: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EDE8DF",
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#3D3580",
    marginTop: 6,
  },
  featureLabel: {
    fontSize: 14,
    color: "#1A1612",
    fontWeight: "400",
    marginBottom: 2,
  },
  featureDesc: { fontSize: 12, color: "#8A7D6A", lineHeight: 18 },
});
