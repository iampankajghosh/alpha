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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";

// Default profile image
const defaultProfileImage = require("~/assets/images/default-profile.png");

// Mock doctor data
const doctors = [
  {
    id: "1",
    name: "Dr. Anil Sharma",
    specialty: "Sports Injury Specialist",
    details:
      "Expert in treating sports-related injuries with over 10 years of experience.",
    rating: 4.8,
    fee: 400.0,
  },
  {
    id: "2",
    name: "Dr. Priya Menon",
    specialty: "Post-Surgery Rehabilitation",
    details: "Specializes in post-operative physiotherapy for faster recovery.",
    rating: 4.9,
    fee: 450.0,
    isTopRated: true,
  },
  {
    id: "3",
    name: "Dr. Sanjay Patel",
    specialty: "Pediatric Care",
    details: "Focused on physiotherapy for children with developmental needs.",
    rating: 4.7,
    fee: 350.0,
  },
  {
    id: "4",
    name: "Dr. Meera Desai",
    specialty: "Neurological Rehabilitation",
    details: "Specializes in rehab for neurological conditions like stroke.",
    rating: 4.6,
    fee: 500.0,
  },
  {
    id: "5",
    name: "Dr. Rohit Kapoor",
    specialty: "Chronic Pain Management",
    details:
      "Helps patients manage chronic pain through tailored physiotherapy.",
    rating: 4.5,
    fee: 400.0,
  },
];

// Generate dates starting from current date (August 24, 2025) for 6 days
const currentDate = new Date("2025-08-24T12:00:00Z");
const dates = [];
for (let i = 0; i < 6; i++) {
  const date = new Date(currentDate);
  date.setDate(date.getDate() + i);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  dates.push(formattedDate);
}

// Generate time slots from 12:00 PM to 5:00 PM
const timeSlots = [];
for (let i = 0; i < 6; i++) {
  const hour = 12 + i;
  const period = hour >= 12 && hour < 24 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour;
  const formattedTime = `${displayHour
    .toString()
    .padStart(2, "0")}:00 ${period}`;
  timeSlots.push(formattedTime);
}

const DoctorDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { patient, isAuthenticated } = useSelector((state) => state.auth);
  const doctor = doctors.find((doc) => doc.id === id) || doctors[0];
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
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

  const handleBooking = () => {
    if (!isAuthenticated) {
      ToastAndroid.show(
        "Please sign in to book an appointment.",
        ToastAndroid.SHORT
      );
      router.push("/login");
      return;
    }
    router.push({
      pathname: "/confirmation",
      params: {
        id: doctor.id,
        date: selectedDate,
        time: selectedTime,
      },
    });
  };

  const handleShareProfile = () => {
    ToastAndroid.show(
      `Feature coming soon: Share ${doctor.name}'s profile!`,
      ToastAndroid.SHORT
    );
  };

  const handleChat = () => {
    ToastAndroid.show(
      `Chat with ${doctor.name} will be available soon!`,
      ToastAndroid.SHORT
    );
  };

  const handleCall = () => {
    ToastAndroid.show(
      `Call feature for ${doctor.name} coming soon!`,
      ToastAndroid.SHORT
    );
  };

  const handleVideo = () => {
    ToastAndroid.show(
      `Video consultation with ${doctor.name} coming soon!`,
      ToastAndroid.SHORT
    );
  };

  return (
    <Animated.View
      style={{ opacity: fadeAnim, flex: 1, backgroundColor: "#f9fafb" }}
      className="mt-12 mb-16"
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
            overflow: "hidden",
            borderRadius: 16,
          }}
        >
          <View className="flex-row items-center">
            <Image
              source={defaultProfileImage}
              className="w-16 h-16 rounded-full mr-4 border border-gray-200"
              accessibilityLabel="Doctor profile image"
            />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-white">
                {doctor.name}
              </Text>
              <Text className="text-sm text-white/90">{doctor.specialty}</Text>
              <View className="flex-row items-center mt-1">
                <Feather
                  name="star"
                  size={16}
                  color="#f59e0b"
                  className="mr-1"
                />
                <Text className="text-sm text-white">{doctor.rating}</Text>
                {doctor.isTopRated && (
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
            <Text className="text-sm text-gray-600 mb-4">{doctor.details}</Text>
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
                ₹{doctor.fee.toFixed(2)}
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
                  key={date}
                  onPress={() => setSelectedDate(date)}
                  className={`rounded-lg p-3 mr-3 items-center justify-center ${
                    selectedDate === date ? "bg-teal-600" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedDate === date ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {date}
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
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {timeSlots.map((time) => (
                <Pressable
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  className={`rounded-lg p-3 mr-3 items-center justify-center ${
                    selectedTime === time ? "bg-teal-600" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedTime === time ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {time}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </CardContent>
        </Card>

        {/* Booking Button */}
        <Button
          className="bg-teal-600 rounded-lg px-4 py-3 flex-row items-center justify-center"
          onPress={handleBooking}
        >
          <Feather name="calendar" size={20} color="white" className="mr-2" />
          <Text className="text-white font-semibold text-base">
            Book Appointment
          </Text>
        </Button>
      </ScrollView>
    </Animated.View>
  );
};

export default DoctorDetailScreen;
