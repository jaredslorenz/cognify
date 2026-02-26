import React, { useRef } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";

interface Props {
  onPress: () => void;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: "light" | "medium" | "heavy";
}

export default function AnimatedButton({
  onPress,
  label,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  textStyle,
  haptic = "light",
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const handlePress = () => {
    if (haptic === "light")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    else if (haptic === "medium")
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[
          styles.base,
          variant === "primary" && styles.primary,
          variant === "secondary" && styles.secondary,
          variant === "ghost" && styles.ghost,
          (disabled || loading) && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === "primary" ? "#F4EFE4" : "#1A1612"}
          />
        ) : (
          <Text
            style={[
              styles.label,
              variant === "primary" && styles.labelPrimary,
              variant === "secondary" && styles.labelSecondary,
              variant === "ghost" && styles.labelGhost,
              textStyle,
            ]}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  primary: {
    backgroundColor: "#1A1612",
    borderWidth: 1.5,
    borderColor: "#1A1612",
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#1A1612",
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#CEC4AE",
  },
  disabled: { opacity: 0.5 },
  label: { fontSize: 12, letterSpacing: 2.5, fontWeight: "600" },
  labelPrimary: { color: "#F4EFE4" },
  labelSecondary: { color: "#1A1612" },
  labelGhost: { color: "#8A7D6A" },
});
