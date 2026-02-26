import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useSignUpMutation } from "../../api/authApi";

export default function SignUpScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUp, { isLoading }] = useSignUpMutation();

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters.");
      return;
    }
    const result = await signUp({ username, email, password });
    if ("error" in result) {
      const err = result.error as any;
      Alert.alert("Sign Up Failed", err?.error ?? "Something went wrong.");
    } else {
      navigation.navigate("Confirm", { username });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRule} />
          <Text style={styles.eyebrow}>COGNIFY</Text>
        </View>

        <Text style={styles.title}>Create{"\n"}account.</Text>
        <Text style={styles.subtitle}>Start learning smarter today</Text>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>USERNAME</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#8A7D6A"
              placeholder="choose a username"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#8A7D6A"
              placeholder="you@example.com"
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
              placeholder="min. 8 characters"
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, isLoading && styles.btnDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#F4EFE4" />
            ) : (
              <Text style={styles.btnText}>CREATE ACCOUNT →</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <TouchableOpacity
          onPress={() => navigation.navigate("SignIn")}
          style={styles.footer}
        >
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text style={styles.footerLink}>Sign in →</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F4EFE4",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 48,
  },
  headerRule: {
    width: 28,
    height: 1.5,
    backgroundColor: "#3D3580",
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 4,
    color: "#3D3580",
    fontWeight: "500",
  },
  title: {
    fontSize: 52,
    fontWeight: "300",
    color: "#1A1612",
    lineHeight: 56,
    letterSpacing: -1.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 13,
    color: "#8A7D6A",
    letterSpacing: 0.5,
    marginBottom: 48,
  },
  form: {
    gap: 24,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 10,
    letterSpacing: 2,
    color: "#3D3580",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#CEC4AE",
    backgroundColor: "#FEFAF2",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#1A1612",
    letterSpacing: 0.3,
  },
  btn: {
    backgroundColor: "#1A1612",
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: "#1A1612",
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: "#F4EFE4",
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: "500",
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#8A7D6A",
  },
  footerLink: {
    color: "#3D3580",
    fontWeight: "500",
  },
});
