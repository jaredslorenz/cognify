import React from "react";
import { TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useGetAuthUserQuery } from "../api/authApi";
import {
  Edit3,
  BookOpen,
  LayoutDashboard,
  Settings,
} from "lucide-react-native";

// Screens
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import ConfirmScreen from "../screens/auth/ConfirmScreen";
import SolveScreen from "../screens/SolveScreen";
import PracticeScreen from "../screens/PracticeScreen";
import DashboardScreen from "../screens/DashboardScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function GearButton({ navigation }: { navigation: any }) {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Settings")}
      style={{ paddingHorizontal: 16, paddingVertical: 8 }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Settings size={18} color="#CEC4AE" strokeWidth={1.6} />
    </TouchableOpacity>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: "#F4EFE4",
          shadowColor: "transparent",
          elevation: 0,
          borderBottomWidth: 0,
        },
        headerTitle: "",
        headerRight: () => <GearButton navigation={navigation} />,
        tabBarStyle: {
          backgroundColor: "#1A1612",
          borderTopColor: "#2A2420",
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 16,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#F4EFE4",
        tabBarInactiveTintColor: "#5A5045",
        tabBarLabelStyle: {
          fontSize: 9,
          letterSpacing: 1.5,
          fontWeight: "600",
        },
        tabBarIcon: ({ color }) => {
          if (route.name === "Solve")
            return <Edit3 color={color} size={20} strokeWidth={1.8} />;
          if (route.name === "Practice")
            return <BookOpen color={color} size={20} strokeWidth={1.8} />;
          if (route.name === "Dashboard")
            return (
              <LayoutDashboard color={color} size={20} strokeWidth={1.8} />
            );
          return null;
        },
      })}
    >
      <Tab.Screen name="Solve" component={SolveScreen} />
      <Tab.Screen name="Practice" component={PracticeScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Confirm" component={ConfirmScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isLoading } = useGetAuthUserQuery();
  if (isLoading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
