import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useGetAuthUserQuery } from "../api/authApi";
import { Edit3, BookOpen, LayoutDashboard } from "lucide-react-native";

// Screens
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import ConfirmScreen from "../screens/auth/ConfirmScreen";
import SolveScreen from "../screens/SolveScreen";
import PracticeScreen from "../screens/PracticeScreen";
import DashboardScreen from "../screens/DashboardScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1A1612",
          borderTopColor: "#2a2520",
          borderTopWidth: 1.5,
          height: 80,
          paddingBottom: 16,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#F4EFE4",
        tabBarInactiveTintColor: "#5a5045",
        tabBarLabelStyle: {
          fontSize: 10,
          letterSpacing: 1.5,
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Solve")
            return <Edit3 color={color} size={size} />;
          if (route.name === "Practice")
            return <BookOpen color={color} size={size} />;
          if (route.name === "Dashboard")
            return <LayoutDashboard color={color} size={size} />;
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
    </Stack.Navigator>
  );
}
