import {
  View,
  ScrollView,
  Pressable,
  Image,
  ToastAndroid,
  Animated,
  Easing,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Text } from "~/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  bookAppointment,
  fetchPhysiotherapistById,
} from "~/services/physiotherapist.service";

// Default profile image
const defaultProfileImage = require("~/assets/images/default-profile.png");

// Generate dates starting from current date (August 24, 2025) for 6 days
const currentDateTime = new Date("2025-08-24T19:47:00+05:30"); // Current IST time
const dates = [];
for (let i = 0; i < 6; i++) {
  const date = new Date(currentDateTime);
  date.setDate(date.getDate() + i);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  dates.push({
    formatted: formattedDate,
    iso: date.toISOString().split("T")[0],
  });
}

// Generate time slots from 12:00 PM to 5:00 PM
const generateTimeSlots = (selectedDate) => {
  const timeSlots = [];
  const isToday = selectedDate === currentDateTime.toISOString().split("T")[0];
  const currentHour = currentDateTime.getHours();
  const currentMinute = currentDateTime.getMinutes();

  for (let i = 0; i < 6; i++) {
    const hour = 12 + i;
    const period = hour >= 12 && hour < 24 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    const formattedTime = `${displayHour
      .toString()
      .padStart(2, "0")}:00 ${period}`;
    const isoHour = hour.toString().padStart(2, "0");
    const isoTime = `${isoHour}:00:00+05:30`;

    if (isToday) {
      if (hour > currentHour || (hour === currentHour && currentMinute < 59)) {
        timeSlots.push({ formatted: formattedTime, iso: isoTime });
      }
    } else {
      timeSlots.push({ formatted: formattedTime, iso: isoTime });
    }
  }
  return timeSlots;
};

const DoctorDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { patient, isAuthenticated } = useSelector(
    (state: { auth: any }) => state.auth
  );
  const [physiotherapist, setPhysiotherapist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dates[0].formatted);
  const [selectedIsoDate, setSelectedIsoDate] = useState(dates[0].iso);
  const [timeSlots, setTimeSlots] = useState(generateTimeSlots(dates[0].iso));
  const [selectedTime, setSelectedTime] = useState(
    timeSlots[0]?.formatted || ""
  );
  const [selectedIsoTime, setSelectedIsoTime] = useState(
    timeSlots[0]?.iso || ""
  );
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  // Update time slots when selected date changes
  useEffect(() => {
    const newTimeSlots = generateTimeSlots(selectedIsoDate);
    setTimeSlots(newTimeSlots);
    if (newTimeSlots.length > 0) {
      setSelectedTime(newTimeSlots[0].formatted);
      setSelectedIsoTime(newTimeSlots[0].iso);
    } else {
      setSelectedTime("");
      setSelectedIsoTime("");
    }
  }, [selectedIsoDate]);

  // Fetch physiotherapist details
  useEffect(() => {
    const loadPhysiotherapist = async () => {
      // Validate id
      if (!id || typeof id !== "string" || id.trim() === "") {
        ToastAndroid.show(
          "Invalid physiotherapist ID. Please try again.",
          ToastAndroid.LONG
        );
        router.replace("/all-doctors");
        return;
      }

      setFetchLoading(true);
      try {
        console.log("Fetching physiotherapist with ID:", id); // Debug log
        const response = await fetchPhysiotherapistById(id);
        if (!response?.success) {
          const errorMessage =
            response?.message === "physiotherapist not found"
              ? "Physiotherapist not found. Please select another expert."
              : response?.message ??
                "Oops! We couldn't fetch physiotherapist details right now. Please try again later.";
          ToastAndroid.show(errorMessage, ToastAndroid.LONG);
          router.replace("/all-doctors"); // Redirect to browse experts
          return;
        }
        const physio = response.data;
        if (physio.is_banned) {
          ToastAndroid.show(
            "This physiotherapist is not available.",
            ToastAndroid.LONG
          );
          router.back();
          return;
        }
        setPhysiotherapist({
          id: physio.id,
          name: physio.name || `Physiotherapist ${physio.id.slice(0, 4)}`,
          specialty: physio.specialization || "General Physiotherapy",
          details: physio.qualification || "Not specified",
          rating: 4.5, // Default rating as API doesn't provide it
          fee: physio.visiting_fee || 0,
          physiotherapist_user_id: physio.id,
          isTopRated: physio.experience >= 10,
        });
      } catch (error) {
        console.error("Error:: loadPhysiotherapist: ", error);
        const errorMessage =
          error?.response?.data?.message === "physiotherapist not found"
            ? "Physiotherapist not found. Please select another expert."
            : error?.response?.data?.message ??
              "Something went wrong while fetching physiotherapist details. Please try again.";
        ToastAndroid.show(errorMessage, ToastAndroid.LONG);
        router.replace("/all-doctors"); // Redirect to browse experts
      } finally {
        setFetchLoading(false);
      }
    };
    loadPhysiotherapist();
  }, [id]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      ToastAndroid.show(
        "Please sign in to book an appointment.",
        ToastAndroid.SHORT
      );
      router.push("/login");
      return;
    }

    if (!physiotherapist) {
      ToastAndroid.show(
        "Physiotherapist details not loaded. Please try again.",
        ToastAndroid.SHORT
      );
      return;
    }

    // Validate that the selected date and time are not in the past
    const selectedDateTime = new Date(`${selectedIsoDate}T${selectedIsoTime}`);
    if (selectedDateTime <= currentDateTime) {
      ToastAndroid.show(
        "Cannot book an appointment in the past. Please select a future date or time.",
        ToastAndroid.LONG
      );
      return;
    }

    setLoading(true);
    try {
      const dateTime = `${selectedIsoDate}T${selectedIsoTime}`;
      const payload = {
        physiotherapist_user_id: physiotherapist.physiotherapist_user_id,
        date_time: dateTime,
      };

      const response = await bookAppointment(payload);
      if (!response?.success) {
        ToastAndroid.show(
          response?.message ??
            "Oops! We couldn't book the appointment right now. Please try again later.",
          ToastAndroid.LONG
        );
        return;
      }

      ToastAndroid.show(
        response?.message ?? "Appointment request created successfully!",
        ToastAndroid.SHORT
      );

      router.push({
        pathname: "/confirmation",
        params: {
          id: physiotherapist.id,
          date: selectedDate,
          time: selectedTime,
          bookingId: response.data.id,
          physiotherapistName: physiotherapist.name,
          specialty: physiotherapist.specialty,
          fee: physiotherapist.fee,
        },
      });
    } catch (error) {
      console.error("Error:: bookAppointment: ", error);
      ToastAndroid.show(
        error?.response?.data?.message ??
          "Something went wrong while booking the appointment. Please try again.",
        ToastAndroid.LONG
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShareProfile = () => {
    ToastAndroid.show(
      `Feature coming soon: Share ${
        physiotherapist?.name || "physiotherapist"
      }'s profile!`,
      ToastAndroid.SHORT
    );
  };

  const handleChat = () => {
    ToastAndroid.show(
      `Chat with ${
        physiotherapist?.name || "physiotherapist"
      } will be available soon!`,
      ToastAndroid.SHORT
    );
  };

  const handleCall = () => {
    ToastAndroid.show(
      `Call feature for ${
        physiotherapist?.name || "physiotherapist"
      } coming soon!`,
      ToastAndroid.SHORT
    );
  };

  const handleVideo = () => {
    ToastAndroid.show(
      `Video consultation with ${
        physiotherapist?.name || "physiotherapist"
      } coming soon!`,
      ToastAndroid.SHORT
    );
  };

  if (fetchLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-center text-gray-500">
          Fetching physiotherapist details...
        </Text>
      </View>
    );
  }

  if (!physiotherapist) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-center text-gray-500">
          Unable to load physiotherapist details.{" "}
          <Link href="/all-doctors">
            <Text className="text-teal-600">Browse all experts</Text>
          </Link>
          .
        </Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={{ opacity: fadeAnim, flex: 1, backgroundColor: "#f9fafb" }}
      className="mb-16 mt-12"
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
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
            onPress={() =>
              ToastAndroid.show(
                "Notifications coming soon!",
                ToastAndroid.SHORT
              )
            }
            className="p-2"
            accessibilityLabel="Notifications"
          >
            <Feather name="bell" size={24} color="#374151" />
          </Pressable>
        </View>

        {/* Doctor Profile Banner */}
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
          <View className="flex-row items-center">
            <Image
              source={defaultProfileImage}
              className="w-16 h-16 rounded-full mr-4 border border-gray-200"
              accessibilityLabel="Physiotherapist profile image"
            />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-white">
                {physiotherapist.name}
              </Text>
              <Text className="text-sm text-white/90">
                {physiotherapist.specialty}
              </Text>
              <View className="flex-row items-center mt-1">
                <Feather
                  name="star"
                  size={16}
                  color="#f59e0b"
                  className="mr-1"
                />
                <Text className="text-sm text-white">
                  {physiotherapist.rating}
                </Text>
                {physiotherapist.isTopRated && (
                  <View className="ml-2 flex-row items-center bg-yellow-100 rounded-full px-2 py-1">
                    <Feather
                      name="award"
                      size={12}
                      color="#f59e0b"
                      className="mr-1"
                    />
                    <Text className="text-xs text-yellow-700">Top Rated</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        <Card className="bg-white rounded-xl mb-6 shadow-sm">
          <CardContent className="flex-row justify-between p-4">
            <Pressable
              onPress={handleShareProfile}
              className="flex-col items-center p-3"
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Feather name="share-2" size={24} color="#0f766e" />
              <Text className="text-xs text-gray-700 mt-1">Share</Text>
            </Pressable>
            <Pressable
              onPress={handleChat}
              className="flex-col items-center p-3"
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Feather name="message-circle" size={24} color="#0f766e" />
              <Text className="text-xs text-gray-700 mt-1">Chat</Text>
            </Pressable>
            <Pressable
              onPress={handleCall}
              className="flex-col items-center p-3"
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Feather name="phone" size={24} color="#0f766e" />
              <Text className="text-xs text-gray-700 mt-1">Call</Text>
            </Pressable>
            <Pressable
              onPress={handleVideo}
              className="flex-col items-center p-3"
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Feather name="video" size={24} color="#0f766e" />
              <Text className="text-xs text-gray-700 mt-1">Video</Text>
            </Pressable>
          </CardContent>
        </Card>

        {/* Details Section */}
        <Card className="bg-white rounded-xl mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">About</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-sm text-gray-600 mb-4">
              {physiotherapist.details}
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Feather
                  name="credit-card"
                  size={20}
                  color="#0f766e"
                  className="mr-2"
                />
                <Text className="text-sm font-medium text-gray-800">
                  Consultation Fee
                </Text>
              </View>
              <Text className="text-sm font-semibold text-teal-600">
                ₹{physiotherapist.fee.toFixed(2)}
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Date Selection */}
        <Card className="bg-white rounded-xl mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {dates.map((date) => (
                <Pressable
                  key={date.formatted}
                  onPress={() => {
                    setSelectedDate(date.formatted);
                    setSelectedIsoDate(date.iso);
                  }}
                  className={`rounded-lg p-3 mr-3 items-center justify-center ${
                    selectedDate === date.formatted
                      ? "bg-teal-600"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedDate === date.formatted
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    {date.formatted}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </CardContent>
        </Card>

        {/* Time Slots Selection */}
        <Card className="bg-white rounded-xl mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Select Time</CardTitle>
          </CardHeader>
          <CardContent>
            {timeSlots.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {timeSlots.map((time) => (
                  <Pressable
                    key={time.formatted}
                    onPress={() => {
                      setSelectedTime(time.formatted);
                      setSelectedIsoTime(time.iso);
                    }}
                    className={`rounded-lg p-3 mr-3 items-center justify-center ${
                      selectedTime === time.formatted
                        ? "bg-teal-600"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedTime === time.formatted
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                      {time.formatted}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              <Text className="text-sm text-gray-600">
                No available time slots for today.
              </Text>
            )}
          </CardContent>
        </Card>

        {/* Booking Button */}
        <Button
          className={`bg-teal-600 rounded-lg px-4 py-3 flex-row items-center justify-center ${
            loading || timeSlots.length === 0 ? "opacity-70" : ""
          }`}
          onPress={handleBooking}
          disabled={loading || timeSlots.length === 0}
        >
          <Feather name="calendar" size={20} color="white" className="mr-2" />
          <Text className="text-white font-semibold text-base">
            {loading ? "Booking..." : "Book Appointment"}
          </Text>
        </Button>
      </ScrollView>
    </Animated.View>
  );
};

export default DoctorDetailScreen;
