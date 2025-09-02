import {
  View,
  ScrollView,
  Pressable,
  Animated,
  Easing,
  RefreshControl,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Text } from "~/components/ui";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { usePullToRefresh } from "~/hooks/usePullToRefresh";

const ConfirmationScreen = () => {
  const router = useRouter();
  const { id, date, time, bookingId, physiotherapistName, specialty, fee } =
    useLocalSearchParams(); // Parameters passed from DoctorDetailScreen
  const { patient, isAuthenticated } = useSelector(
    (state: { auth: any }) => state.auth
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Refresh data function
  const refreshData = async () => {
    // For confirmation screen, we don't need to fetch additional data
    // The confirmation data is passed via route params
    // This is just for consistency with other screens
  };

  // Pull to refresh hook
  const { refreshing, onRefresh } = usePullToRefresh({
    onRefresh: refreshData,
  });

  // Fade-in animation consistent with DoctorDetailScreen
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{ opacity: fadeAnim, flex: 1, backgroundColor: "#f9fafb" }}
      className="mb-16 mt-12"
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Section */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()} className="p-2">
            <Feather name="arrow-left" size={24} color="#374151" />
          </Pressable>
          <Text className="text-xl font-semibold text-gray-800">
            {isAuthenticated
              ? `Hello, ${patient?.name?.split(" ")[0] || "User"}!`
              : "Alpha Physio"}
          </Text>
          <Pressable
            onPress={() => {
              alert("Notifications coming soon!");
            }}
            className="p-2"
            accessibilityLabel="Notifications"
          >
            <Feather name="bell" size={24} color="#374151" />
          </Pressable>
        </View>

        {/* Confirmation Banner */}
        <LinearGradient
          colors={["#14b8a6", "#0f766e"]}
          className="p-5 mb-6 rounded-xl"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            borderRadius: 16,
          }}
        >
          <View className="items-center">
            <Feather
              name="check-circle"
              size={48}
              color="white"
              className="mb-4"
            />
            <Text className="text-2xl font-bold text-white text-center">
              Appointment Confirmed!
            </Text>
            <Text className="text-sm text-white/90 mt-2 text-center">
              Your appointment with{" "}
              {physiotherapistName || "the physiotherapist"} is booked.
            </Text>
          </View>
        </LinearGradient>

        {/* Appointment Summary Card */}
        <Card className="bg-white rounded-xl mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Appointment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center mb-3">
              <Feather name="user" size={20} color="#0f766e" className="mr-2" />
              <Text className="text-base text-gray-800">
                {physiotherapistName || "Physiotherapist"},{" "}
                {specialty || "General Physiotherapy"}
              </Text>
            </View>
            <View className="flex-row items-center mb-3">
              <Feather
                name="calendar"
                size={20}
                color="#0f766e"
                className="mr-2"
              />
              <Text className="text-base text-gray-800">{date}</Text>
            </View>
            <View className="flex-row items-center mb-3">
              <Feather
                name="clock"
                size={20}
                color="#0f766e"
                className="mr-2"
              />
              <Text className="text-base text-gray-800">{time}</Text>
            </View>
            <View className="flex-row items-center mb-3">
              <Feather
                name="credit-card"
                size={20}
                color="#0f766e"
                className="mr-2"
              />
              <Text className="text-base text-gray-800">
                Consultation Fee: ₹
                {parseFloat(
                  Array.isArray(fee) ? fee[0] || "0" : fee || "0"
                ).toFixed(2)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="hash" size={20} color="#0f766e" className="mr-2" />
              <Text className="text-base text-gray-800">
                Booking ID: {bookingId}
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Button
          className={`bg-teal-600 rounded-lg px-4 py-3 flex-row items-center justify-center mb-4`}
          onPress={() => router.push("/appointments")}
        >
          <Feather name="calendar" size={20} color="white" className="mr-2" />
          <Text className="text-white font-semibold text-base">
            View Appointment
          </Text>
        </Button>
        <Button
          className={`bg-gray-200 rounded-lg px-4 py-3 flex-row items-center justify-center`}
          onPress={() => {
            router.replace("/");
            router.dismissAll();
          }}
        >
          <Feather name="home" size={20} color="#6b7280" className="mr-2" />
          <Text className="text-gray-700 font-semibold text-base">
            Back to Home
          </Text>
        </Button>
      </ScrollView>
    </Animated.View>
  );
};

export default ConfirmationScreen;
