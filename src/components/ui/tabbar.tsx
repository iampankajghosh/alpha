import { View, ToastAndroid, Animated, Easing } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Text } from "~/components/ui";
import React, { useEffect, useRef } from "react";

// Define icon names and labels for all patient routes in the desired order
const icons: Record<
  "index" | "chats" | "appointments" | "profile",
  { icon: "home" | "message-circle" | "calendar" | "user"; label: string }
> = {
  index: { icon: "home", label: "Home" },
  chats: { icon: "message-circle", label: "Chat" },
  appointments: { icon: "calendar", label: "Appointments" },
  profile: { icon: "user", label: "Profile" },
};

const Tabbar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  // Reorder routes to match the desired UX order: Home, Chat, Appointments, Profile
  const orderedRoutes = state.routes
    .filter((route) => icons[route.name as keyof typeof icons])
    .sort((a, b) => {
      const order = ["index", "chats", "appointments", "profile"];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });

  // Fade-in animation consistent with DoctorDetailScreen
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView edges={["bottom"]}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <LinearGradient
          colors={["#14b8a6", "#0f766e"]}
          className="flex-row justify-between items-center px-4 py-3 w-full"
          style={{
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          {orderedRoutes.map((route, index) => {
            const routeIndex = state.routes.findIndex(
              (r) => r.key === route.key
            );
            const isFocused = state.index === routeIndex;
            const { icon, label } = icons[route.name as keyof typeof icons];

            const onPress = () => {
              // Show toast for "chats" tab
              if (route.name === "chats") {
                ToastAndroid.show(
                  "Chat feature coming soon! Stay tuned!",
                  ToastAndroid.SHORT
                );
                return;
              }

              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <Button
                key={route.key}
                onPress={onPress}
                className={`flex-col items-center justify-center py-2 px-4 rounded-lg ${
                  isFocused ? "bg-white/20" : "bg-transparent"
                }`}
                style={{ flex: 1 }}
              >
                <Feather
                  name={icon}
                  size={24}
                  color={isFocused ? "#fff" : "#ffffff90"}
                />
              </Button>
            );
          })}
        </LinearGradient>
      </Animated.View>
    </SafeAreaView>
  );
};

export { Tabbar };
