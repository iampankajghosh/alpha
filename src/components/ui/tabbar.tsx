import { View } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "./button";

// Define icon names for all patient routes in the desired order
const icons: Record<
  "index" | "chats" | "appointments" | "profile",
  "home" | "message-circle" | "calendar" | "user"
> = {
  index: "home",
  chats: "message-circle",
  appointments: "calendar",
  profile: "user",
};

const Tabbar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  // Reorder routes to match the desired UX order: Home, Chat, Appointments, Profile
  const orderedRoutes = state.routes
    .filter((route) => icons[route.name as keyof typeof icons])
    .sort((a, b) => {
      const order = ["index", "chats", "appointments", "profile"];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });

  return (
    <SafeAreaView>
      <View className="flex-row justify-center bg-gray-50 gap-10 p-3 absolute w-full bottom-0 h-[100px]">
        {orderedRoutes.map((route, index) => {
          const routeIndex = state.routes.findIndex((r) => r.key === route.key);
          const isFocused = state.index === routeIndex;

          const onPress = () => {
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
              size="icon"
              className={`${isFocused ? "bg-primary" : "bg-transparent"}`}
            >
              <Feather
                name={icons[route.name as keyof typeof icons]}
                size={24}
                color={isFocused ? "#fff" : "#888"}
              />
            </Button>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export { Tabbar };
