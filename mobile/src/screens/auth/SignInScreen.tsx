import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useSignInMutation } from "../../api/authApi";
import AnimatedButton from "../../components/AnimatedButton";

export default function SignInScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signIn, { isLoading }] = useSignInMutation();

  const headerAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.spring(headerAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 14,
        bounciness: 4,
      }),
      Animated.spring(formAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 14,
        bounciness: 4,
      }),
    ]).start();
  }, []);

  const headerStyle = {
    opacity: headerAnim,
    transform: [
      {
        translateY: headerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-16, 0],
        }),
      },
    ],
  };

  const formStyle = {
    opacity: formAnim,
    transform: [
      {
        translateY: formAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
    ],
  };

  const handleSignIn = async () => {
    if (!username || !password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    const result = await signIn({ username, password });
    if ("error" in result) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const err = result.error as any;
      Alert.alert(
        "Sign In Failed",
        err?.error ?? "Check your username and password.",
      );
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.getParent()?.navigate("Main");
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Animated.View style={headerStyle}>
          <View style={styles.header}>
            <View style={styles.rule} />
            <Text style={styles.eyebrow}>COGNIFY</Text>
          </View>
          <Text style={styles.title}>Welcome{"\n"}back.</Text>
          <Text style={styles.subtitle}>Sign in to save your progress</Text>
        </Animated.View>

        <Animated.View style={[styles.form, formStyle]}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>USERNAME</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#8A7D6A"
              placeholder="your username"
              onFocus={() => Haptics.selectionAsync()}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#8A7D6A"
              placeholder="••••••••"
              onFocus={() => Haptics.selectionAsync()}
            />
          </View>

          <AnimatedButton
            label="SIGN IN →"
            onPress={handleSignIn}
            loading={isLoading}
            haptic="medium"
            style={{ marginTop: 8 }}
          />
          <AnimatedButton
            label="Continue without account →"
            onPress={() => navigation.getParent()?.navigate("Main")}
            variant="ghost"
            haptic="light"
          />
        </Animated.View>

        <TouchableOpacity
          onPress={() => {
            Haptics.selectionAsync();
            navigation.navigate("SignUp");
          }}
          style={styles.footer}
        >
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text style={styles.footerLink}>Create one →</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4EFE4" },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 40,
  },
  rule: { width: 28, height: 1.5, backgroundColor: "#3D3580" },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 4,
    color: "#3D3580",
    fontWeight: "600",
  },
  title: {
    fontSize: 56,
    fontWeight: "300",
    color: "#1A1612",
    lineHeight: 60,
    letterSpacing: -2,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#8A7D6A",
    letterSpacing: 0.3,
    marginBottom: 48,
    lineHeight: 22,
  },
  form: { gap: 20 },
  fieldGroup: { gap: 8 },
  label: {
    fontSize: 10,
    letterSpacing: 2.5,
    color: "#3D3580",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#CEC4AE",
    backgroundColor: "#FEFAF2",
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#1A1612",
    minHeight: 56,
  },
  footer: { marginTop: "auto", alignItems: "center", paddingVertical: 16 },
  footerText: { fontSize: 13, color: "#8A7D6A" },
  footerLink: { color: "#3D3580", fontWeight: "600" },
});
