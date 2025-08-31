import { View, ToastAndroid, Animated, Easing } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "./button";
import React, { useEffect, useRef } from "react";

// Define icon names for patient routes in desired order
const icons: Record<
  "index" | "chats" | "appointments" | "profile",
  { icon: "home" | "message-circle" | "calendar" | "user" }
> = {
  index: { icon: "home" },
  chats: { icon: "message-circle" },
  appointments: { icon: "calendar" },
  profile: { icon: "user" },
};

const Tabbar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  // Reorder routes to match UX order: Home, Chat, Appointments, Profile
  const orderedRoutes = state.routes
    .filter((route) => icons[route.name as keyof typeof icons])
    .sort((a, b) => {
      const order = ["index", "chats", "appointments", "profile"];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });

  // Fade-in animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView edges={["bottom"]}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View className="flex-row justify-between items-center px-2 py-2 bg-white border-t border-gray-200">
          {orderedRoutes.map((route, index) => {
            const routeIndex = state.routes.findIndex(
              (r) => r.key === route.key
            );
            const isFocused = state.index === routeIndex;
            const { icon } = icons[route.name as keyof typeof icons];

            const onPress = () => {
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
                className={`flex-col items-center justify-center p-3 rounded-full ${
                  isFocused ? "bg-gray-100" : "bg-transparent"
                }`}
                style={{ flex: 1 }}
              >
                <Feather
                  name={icon}
                  size={24}
                  color={isFocused ? "#000" : "#6b7280"}
                />
              </Button>
            );
          })}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export { Tabbar };
