import { View, ScrollView } from "react-native";
import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Button, Text } from "~/components/ui";

// Mock doctor data
const doctors = [
  {
    id: "1",
    name: "Dr. Anil Sharma",
    specialty: "Sports Injury Specialist",
    fee: 400.0,
  },
  {
    id: "2",
    name: "Dr. Priya Menon",
    specialty: "Post-Surgery Rehabilitation",
    fee: 450.0,
  },
  {
    id: "3",
    name: "Dr. Sanjay Patel",
    specialty: "Pediatric Care",
    fee: 350.0,
  },
  {
    id: "4",
    name: "Dr. Meera Desai",
    specialty: "Neurological Rehabilitation",
    fee: 500.0,
  },
  {
    id: "5",
    name: "Dr. Rohit Kapoor",
    specialty: "Chronic Pain Management",
    fee: 400.0,
  },
];

const ConfirmationScreen = () => {
  const router = useRouter();
  const { id, date, time } = useLocalSearchParams(); // Passed from DoctorDetailScreen
  const { patient } = useSelector((state) => state.auth); // Mocked patient data

  // Find the doctor based on the id
  const doctor = doctors.find((doc) => doc.id === id) || doctors[0];

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="min-h-screen gap-6 px-8 py-12">
        {/* Header Section */}
        <View className="flex-row items-center justify-center mb-8">
          <Text className="text-3xl font-bold text-primary">Phynder</Text>
        </View>

        {/* Confirmation Section */}
        <View className="items-center mb-6">
          <Feather
            name="check-circle"
            size={48}
            color="#10b981"
            className="mb-4"
          />
          <Text className="text-2xl font-bold text-green-500">
            Appointment Confirmed!
          </Text>
          <Text className="text-base text-gray-500 mt-2">
            Your appointment has been successfully booked.
          </Text>
        </View>

        {/* Appointment Summary Section */}
        <View className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
          <Text className="text-lg font-bold mb-3">Appointment Summary</Text>
          <View className="flex-row items-center mb-2">
            <Feather name="user" size={20} color="#0d9488" className="mr-2" />
            <Text className="text-base">
              {doctor.name}, {doctor.specialty}
            </Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Feather
              name="calendar"
              size={20}
              color="#0d9488"
              className="mr-2"
            />
            <Text className="text-base">{date}</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Feather name="clock" size={20} color="#0d9488" className="mr-2" />
            <Text className="text-base">{time}</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Feather
              name="credit-card"
              size={20}
              color="#0d9488"
              className="mr-2"
            />
            <Text className="text-base">
              Consultation Fee: ₹{doctor.fee.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Feather name="check" size={20} color="#0d9488" className="mr-2" />
            <Text className="text-base">Paid via Wallet</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <Button
          className="bg-teal-500 flex-row items-center justify-center p-4"
          onPress={() => router.push("/appointments")}
        >
          <Feather name="calendar" size={20} color="white" className="mr-2" />
          <Text className="text-white font-bold text-xl">View Appointment</Text>
        </Button>
        <Button
          className="bg-gray-200 flex-row items-center justify-center p-4"
          onPress={() => {
            router.replace("/");
            router.dismissAll();
          }}
        >
          <Feather name="home" size={20} color="#6b7280" className="mr-2" />
          <Text className="text-gray-700 font-bold text-xl">Back to Home</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default ConfirmationScreen;
