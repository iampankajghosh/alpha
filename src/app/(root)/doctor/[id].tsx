import { View, ScrollView, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Button, Text } from "~/components/ui";

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

// Current date: May 10, 2025, 12:00 PM
const currentDate = new Date("2025-05-10T12:00:00Z");

// Generate dates starting from May 10, 2025, to May 15, 2025
const dates = [];
for (let i = 0; i < 6; i++) {
  const date = new Date("2025-05-10T00:00:00Z");
  date.setDate(date.getDate() + i);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  dates.push(formattedDate);
}

// Generate time slots starting from 12:00 PM to 05:00 PM
const timeSlots = [];
for (let i = 0; i < 6; i++) {
  const hour = 12 + i; // Start from 12 PM
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
  const { patient } = useSelector((state) => state.auth);

  // Find the doctor based on the id
  const doctor = doctors.find((doc) => doc.id === id) || doctors[0];

  const [selectedTime, setSelectedTime] = useState(timeSlots[0]); // Default to 12:00 PM
  const [selectedDate, setSelectedDate] = useState(dates[0]); // Default to May 10, 2025

  const handleBooking = async () => {
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
    console.log(`Sharing profile for ${doctor.name}`);
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="min-h-screen gap-6 px-8 py-12">
        {/* Header Section */}
        <View className="flex-row items-center justify-between mb-8">
          <Pressable onPress={() => router.back()} className="p-2">
            <Feather name="arrow-left" size={24} color="#000" />
          </Pressable>
          <Text className="text-3xl font-bold text-primary">Phynder</Text>
          <View className="w-10" /> {/* Spacer for alignment */}
        </View>

        {/* Doctor Info Section */}
        <View className="flex-row items-center mb-6">
          <Image
            source={{ uri: "https://shorturl.at/DJVgc" }}
            className="w-16 h-16 rounded-full mr-4"
          />
          <View className="flex-1">
            <Text className="text-xl font-bold">{doctor.name}</Text>
            <Text className="text-sm text-muted-foreground">
              {doctor.specialty}
            </Text>
            <View className="flex-row items-center mt-1">
              <Feather name="star" size={16} color="#f59e0b" className="mr-1" />
              <Text className="text-sm">{doctor.rating}</Text>
              {doctor.isTopRated && (
                <View className="ml-2 flex-row items-center bg-yellow-100 rounded-full px-2 py-1">
                  <Feather
                    name="award"
                    size={14}
                    color="#f59e0b"
                    className="mr-1"
                  />
                  <Text className="text-xs text-yellow-700">Top Rated</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between gap-3 mb-6">
          <Pressable
            onPress={handleShareProfile}
            className="flex-col items-center border border-teal-200 rounded-full p-3"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Feather name="share-2" size={28} color="#0d9488" />
            <Text className="text-xs text-gray-700 mt-1">Share</Text>
          </Pressable>
          <View className="flex-1" />{" "}
          {/* Spacer to push action buttons to the right */}
          <Pressable
            className="flex-col items-center border border-teal-200 rounded-full p-3"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Feather name="message-circle" size={28} color="#0d9488" />
            <Text className="text-xs text-gray-700 mt-1">Chat</Text>
          </Pressable>
          <Pressable
            className="flex-col items-center border border-teal-200 rounded-full p-3"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Feather name="phone" size={28} color="#0d9488" />
            <Text className="text-xs text-gray-700 mt-1">Call</Text>
          </Pressable>
          <Pressable
            className="flex-col items-center border border-teal-200 rounded-full p-3"
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Feather name="video" size={28} color="#0d9488" />
            <Text className="text-xs text-gray-700 mt-1">Video</Text>
          </Pressable>
        </View>

        {/* Details Section */}
        <View className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
          <View className="mb-3">
            <Text className="text-lg font-bold">Details</Text>
          </View>
          <Text className="text-sm text-muted-foreground">
            {doctor.details}
          </Text>
          <View className="flex-row items-center justify-between mt-4">
            <View className="flex-row items-center">
              <Feather
                name="credit-card"
                size={20}
                color="#0d9488"
                className="mr-2"
              />
              <Text className="text-base font-medium">Consultation Fee</Text>
            </View>
            <Text className="text-base font-bold text-teal-500">
              ₹{doctor.fee.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Working Hours Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Feather name="clock" size={20} color="black" className="mr-2" />
              <Text className="text-lg font-bold">Working Hours</Text>
            </View>
            <Link
              href={`/doctor/${id}/hours`}
              className="flex-row items-center"
              disabled
            >
              <Text className="text-teal-500 mr-1">See All</Text>
              <Feather name="arrow-right" size={16} color="#0d9488" />
            </Link>
          </View>
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
                  selectedTime === time ? "bg-teal-500" : "bg-teal-50"
                }`}
              >
                <Text
                  className={`text-base ${
                    selectedTime === time ? "text-white" : "text-gray-700"
                  }`}
                >
                  {time}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Date Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Feather
                name="calendar"
                size={20}
                color="black"
                className="mr-2"
              />
              <Text className="text-lg font-bold">Date</Text>
            </View>
            <Link
              href={`/doctor/${id}/dates`}
              className="flex-row items-center"
              disabled
            >
              <Text className="text-teal-500 mr-1">See All</Text>
              <Feather name="arrow-right" size={16} color="#0d9488" />
            </Link>
          </View>
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
                  selectedDate === date ? "bg-teal-500" : "bg-teal-50"
                }`}
              >
                <Text
                  className={`text-base ${
                    selectedDate === date ? "text-white" : "text-gray-700"
                  }`}
                >
                  {date}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Booking Button */}
        <Button
          className="bg-teal-500 flex-row items-center justify-center p-4"
          onPress={handleBooking}
        >
          <Feather name="calendar" size={20} color="white" className="mr-2" />
          <Text className="text-white font-bold text-xl">
            Book an Appointment
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default DoctorDetailScreen;
