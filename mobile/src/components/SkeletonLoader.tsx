import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, ViewStyle } from "react-native";

interface Props {
  width?: number | string;
  height?: number;
  style?: ViewStyle;
}

export default function Skeleton({
  width = "100%",
  height = 20,
  style,
}: Props) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          backgroundColor: "#DDD8CC",
          borderRadius: 2,
        },
        { opacity },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Skeleton width={8} height={8} style={{ borderRadius: 4 }} />
        <Skeleton width={80} height={10} />
      </View>
      <Skeleton width="100%" height={14} style={{ marginTop: 10 }} />
      <Skeleton width="70%" height={14} style={{ marginTop: 6 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderColor: "#CEC4AE",
    padding: 16,
    marginBottom: 10,
    backgroundColor: "#FEFAF2",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
});
