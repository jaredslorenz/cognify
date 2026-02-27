import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useGetAuthUserQuery, useSignOutMutation } from "../api/authApi";
import AnimatedButton from "../components/AnimatedButton";

export default function SettingsScreen({ navigation }: any) {
  const { data: user } = useGetAuthUserQuery();
  const [signOut, { isLoading: signOutLoading }] = useSignOutMutation();

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "?";

  const handleSignOut = async () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await signOut();
          navigation.navigate("Auth", { screen: "SignIn" });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Back */}
        <TouchableOpacity
          onPress={() => {
            Haptics.selectionAsync();
            navigation.goBack();
          }}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>

        {/* Eyebrow */}
        <View style={styles.eyebrow}>
          <View style={styles.eyebrowRule} />
          <Text style={styles.eyebrowText}>SETTINGS</Text>
        </View>

        {/* Avatar + name */}
        {user ? (
          <View style={styles.profileBlock}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View>
              <Text style={styles.profileName}>{user.username}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.profileBlock}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>?</Text>
            </View>
            <Text style={styles.profileName}>Guest</Text>
          </View>
        )}

        {/* Account section */}
        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ACCOUNT</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Username</Text>
              <Text style={styles.rowValue}>{user.username}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Email</Text>
              <Text style={styles.rowValue} numberOfLines={1}>
                {user.email}
              </Text>
            </View>
          </View>
        )}

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>APPEARANCE</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Dark Mode</Text>
            <Switch
              value={false}
              onValueChange={() => {
                Haptics.selectionAsync();
                Alert.alert("Coming soon", "Dark mode is on its way.");
              }}
              trackColor={{ false: "#CEC4AE", true: "#5548B0" }}
              thumbColor="#F4EFE4"
            />
          </View>
        </View>

        {/* Data */}
        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DATA</Text>
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                Haptics.selectionAsync();
                Alert.alert("Coming soon", "History clearing is on its way.");
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.rowLabel}>Clear History</Text>
              <Text style={styles.rowArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Warning,
                );
                Alert.alert("Coming soon", "Account deletion is on its way.");
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.rowLabel, styles.danger]}>
                Delete Account
              </Text>
              <Text style={[styles.rowArrow, styles.danger]}>›</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sign out / Sign in */}
        <View style={{ marginTop: 8 }}>
          {user ? (
            <AnimatedButton
              label="SIGN OUT"
              onPress={handleSignOut}
              variant="ghost"
              loading={signOutLoading}
              haptic="medium"
            />
          ) : (
            <AnimatedButton
              label="SIGN IN →"
              onPress={() => navigation.navigate("Auth", { screen: "SignIn" })}
              haptic="medium"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F4EFE4" },
  scroll: { paddingHorizontal: 28, paddingTop: 16, paddingBottom: 48 },

  backBtn: { marginBottom: 24 },
  backText: {
    fontSize: 10,
    letterSpacing: 2,
    color: "#5548B0",
    fontWeight: "600",
  },

  eyebrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
  },
  eyebrowRule: { width: 20, height: 1.5, backgroundColor: "#5548B0" },
  eyebrowText: {
    fontSize: 8,
    letterSpacing: 4,
    color: "#5548B0",
    fontWeight: "600",
  },

  profileBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 32,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1A1612",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#F4EFE4",
    letterSpacing: -0.5,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "300",
    color: "#1A1612",
    letterSpacing: -0.3,
  },
  profileEmail: {
    fontSize: 11,
    color: "#8A7D6A",
    letterSpacing: 0.5,
    marginTop: 2,
  },

  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 7,
    letterSpacing: 3,
    color: "#5548B0",
    fontWeight: "600",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 14,
    backgroundColor: "#FEFAF2",
    borderWidth: 1,
    borderColor: "#D6CEBC",
    marginBottom: 4,
  },
  rowLabel: { fontSize: 13, color: "#1A1612", letterSpacing: 0.2 },
  rowValue: { fontSize: 11, color: "#8A7D6A", maxWidth: "55%" },
  rowArrow: { fontSize: 16, color: "#CEC4AE" },
  danger: { color: "#A04040" },
});
