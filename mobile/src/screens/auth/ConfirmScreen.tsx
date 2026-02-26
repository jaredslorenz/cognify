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
} from "react-native";
import { useConfirmSignUpMutation } from "../../api/authApi";

export default function ConfirmScreen({ navigation, route }: any) {
  const { username } = route.params ?? {};
  const [code, setCode] = useState("");
  const [confirm, { isLoading }] = useConfirmSignUpMutation();

  const handleConfirm = async () => {
    if (!code) {
      Alert.alert("Error", "Please enter the verification code.");
      return;
    }
    const result = await confirm({ username, code });
    if ("error" in result) {
      const err = result.error as any;
      Alert.alert("Verification Failed", err?.error ?? "Invalid code.");
    } else {
      Alert.alert("Success!", "Account verified. Please sign in.", [
        { text: "OK", onPress: () => navigation.navigate("SignIn") },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRule} />
          <Text style={styles.eyebrow}>COGNIFY</Text>
        </View>

        <Text style={styles.title}>Check your{"\n"}email.</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to your email address. Enter it below to verify
          your account.
        </Text>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>VERIFICATION CODE</Text>
            <TextInput
              style={[styles.input, styles.codeInput]}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              placeholderTextColor="#8A7D6A"
              placeholder="000000"
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, isLoading && styles.btnDisabled]}
            onPress={handleConfirm}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#F4EFE4" />
            ) : (
              <Text style={styles.btnText}>VERIFY →</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("SignIn")}
          style={styles.footer}
        >
          <Text style={styles.footerText}>
            Back to <Text style={styles.footerLink}>sign in →</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F4EFE4",
  },
  container: {
    flex: 1,
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
    lineHeight: 22,
    letterSpacing: 0.3,
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
  },
  codeInput: {
    fontSize: 28,
    letterSpacing: 8,
    textAlign: "center",
    paddingVertical: 20,
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
    marginTop: "auto",
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
