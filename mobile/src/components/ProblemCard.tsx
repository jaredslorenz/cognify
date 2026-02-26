import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { PracticeResponse } from "../screens/SolveScreen";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface Props {
  problem: PracticeResponse;
  index: number;
  total: number;
  isSolvePage: boolean;
}

export default function ProblemCard({
  problem,
  index,
  total,
  isSolvePage,
}: Props) {
  const [hintStep, setHintStep] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const handleNext = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (hintStep < problem.hints.length) {
      setHintStep((h) => h + 1);
    } else {
      setRevealed(true);
    }
  };

  const handleReset = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setHintStep(0);
    setRevealed(false);
  };

  return (
    <View style={styles.card}>
      {/* Card header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.headerRule} />
          <Text style={styles.cardLabel}>
            {isSolvePage ? "SOLUTION" : "PRACTICE PROBLEM"}
            {total > 1 ? ` · ${index + 1} OF ${total}` : ""}
          </Text>
        </View>
        {total > 1 && (
          <Text style={styles.cardCounter}>
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </Text>
        )}
      </View>

      <View style={styles.cardBody}>
        {/* Question */}
        <Text style={styles.question}>{problem.question}</Text>

        {/* Hints */}
        {problem.hints.slice(0, hintStep).map((hint, i) => (
          <View key={i} style={styles.hintBox}>
            <Text style={styles.hintLabel}>HINT {i + 1}</Text>
            <Text style={styles.hintText}>{hint}</Text>
          </View>
        ))}

        {/* Answer */}
        {revealed && (
          <View style={styles.answerBox}>
            <Text style={styles.answerLabel}>ANSWER</Text>
            <Text style={styles.answerText}>{problem.answer}</Text>
          </View>
        )}

        {/* Full solution (solve page only) */}
        {revealed && problem.fullSolution && (
          <View style={styles.solutionBox}>
            <Text style={styles.solutionLabel}>FULL WALKTHROUGH</Text>
            <Text style={styles.solutionText}>{problem.fullSolution}</Text>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          {!revealed ? (
            <TouchableOpacity onPress={handleNext} activeOpacity={0.7}>
              <Text style={styles.controlBtn}>
                {hintStep === 0
                  ? "Show first hint →"
                  : hintStep < problem.hints.length
                    ? `Next hint (${hintStep}/${problem.hints.length}) →`
                    : "Reveal answer →"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleReset} activeOpacity={0.7}>
              <Text style={styles.controlBtnMuted}>↺ Try again</Text>
            </TouchableOpacity>
          )}

          {/* Progress dots */}
          <View style={styles.dots}>
            {problem.hints.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i < hintStep && styles.dotActive]}
              />
            ))}
            <View
              style={[
                styles.dot,
                styles.dotAnswer,
                revealed && styles.dotAnswerActive,
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderColor: "#1A1612",
    backgroundColor: "#FEFAF2",
    marginTop: 8,
    shadowColor: "#1A1612",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1.5,
    borderBottomColor: "#1A1612",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerRule: {
    width: 20,
    height: 1.5,
    backgroundColor: "#3D3580",
  },
  cardLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: "#3D3580",
    fontWeight: "500",
  },
  cardCounter: {
    fontSize: 10,
    color: "#8A7D6A",
    letterSpacing: 1,
  },
  cardBody: {
    padding: 16,
    gap: 12,
  },
  question: {
    fontSize: 15,
    fontWeight: "300",
    color: "#1A1612",
    lineHeight: 24,
    marginBottom: 4,
  },
  hintBox: {
    backgroundColor: "#F4F3FC",
    borderWidth: 1,
    borderColor: "#C5C0E8",
    padding: 12,
  },
  hintLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: "#3D3580",
    opacity: 0.6,
    marginBottom: 4,
    fontWeight: "500",
  },
  hintText: {
    fontSize: 12,
    color: "#3D3580",
    lineHeight: 20,
  },
  answerBox: {
    backgroundColor: "#EAE8F5",
    borderWidth: 1.5,
    borderColor: "#3D3580",
    padding: 12,
  },
  answerLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: "#3D3580",
    opacity: 0.6,
    marginBottom: 4,
    fontWeight: "500",
  },
  answerText: {
    fontSize: 13,
    color: "#3D3580",
    fontWeight: "600",
    lineHeight: 20,
  },
  solutionBox: {
    backgroundColor: "#F4EFE4",
    borderWidth: 1.5,
    borderColor: "#CEC4AE",
    padding: 12,
  },
  solutionLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: "#4A4035",
    opacity: 0.6,
    marginBottom: 6,
    fontWeight: "500",
  },
  solutionText: {
    fontSize: 12,
    color: "#4A4035",
    lineHeight: 20,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  controlBtn: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: "#3D3580",
    textDecorationLine: "underline",
    fontWeight: "500",
  },
  controlBtnMuted: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: "#8A7D6A",
    textDecorationLine: "underline",
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#3D3580",
    backgroundColor: "transparent",
  },
  dotActive: {
    backgroundColor: "#3D3580",
  },
  dotAnswer: {
    borderColor: "#5548B0",
  },
  dotAnswerActive: {
    backgroundColor: "#5548B0",
  },
});
