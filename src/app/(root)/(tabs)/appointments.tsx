import { View, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";
import { useRouter, Link } from "expo-router";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Text, Button } from "~/components/ui";

// Mock appointment data
const appointmentsData = {
  upcoming: [
    {
      id: "1",
      doctorId: "1",
      doctorName: "Dr. Anil Sharma",
      specialty: "Sports Injury Specialist",
      date: "Sat, 10 May",
      time: "12:00 PM",
      status: "Confirmed",
      isVideoCallAvailable: true,
    },
    {
      id: "2",
      doctorId: "2",
      doctorName: "Dr. Priya Menon",
      specialty: "Post-Surgery Rehabilitation",
      date: "Sun, 11 May",
      time: "02:00 PM",
      status: "Confirmed",
      isVideoCallAvailable: false,
    },
    {
      id: "3",
      doctorId: "3",
      doctorName: "Dr. Sanjay Patel",
      specialty: "Pediatric Care",
      date: "Mon, 12 May",
      time: "10:00 AM",
      status: "Confirmed",
      isVideoCallAvailable: false,
    },
  ],
  past: [
    {
      id: "4",
      doctorId: "4",
      doctorName: "Dr. Meera Desai",
      specialty: "Neurological Rehabilitation",
      date: "Fri, 9 May",
      time: "11:00 AM",
      status: "Completed",
    },
    {
      id: "5",
      doctorId: "5",
      doctorName: "Dr. Rohit Kapoor",
      specialty: "Chronic Pain Management",
      date: "Thu, 8 May",
      time: "03:00 PM",
      status: "Completed",
    },
  ],
};

const AppointmentsScreen = () => {
  const router = useRouter();
  const { patient } = useSelector((state) => state.auth); // Mocked patient data
  const [activeTab, setActiveTab] = useState("upcoming");

  const appointments = appointmentsData[activeTab];

  const handleCancel = (id) => {
    console.log(`Cancel appointment with ID: ${id}`);
  };

  const handleJoinCall = (id) => {
    console.log(`Join video call for appointment with ID: ${id}`);
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="min-h-screen gap-6 px-8 py-12">
        {/* Header Section */}
        <View className="flex-row items-center justify-between mb-8">
          <Pressable onPress={() => router.push("/profile")} className="p-2">
            <Feather name="arrow-left" size={24} color="#000" />
          </Pressable>
          <Text className="text-3xl font-bold text-primary">Phynder</Text>
          <View className="w-10" /> {/* Spacer for alignment */}
        </View>

        {/* Title Section */}
        <View className="flex-row items-center mb-3">
          <Feather name="calendar" size={20} color="black" className="mr-2" />
          <Text className="text-lg font-bold">Your Appointments</Text>
        </View>

        {/* Tabs Section */}
        <View className="flex-row mb-6">
          <Pressable
            onPress={() => setActiveTab("upcoming")}
            className={`flex-1 pb-2 border-b-2 ${
              activeTab === "upcoming" ? "border-teal-500" : "border-gray-200"
            }`}
          >
            <Text
              className={`text-center text-base font-medium ${
                activeTab === "upcoming" ? "text-teal-500" : "text-gray-500"
              }`}
            >
              Upcoming
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("past")}
            className={`flex-1 pb-2 border-b-2 ${
              activeTab === "past" ? "border-teal-500" : "border-gray-200"
            }`}
          >
            <Text
              className={`text-center text-base font-medium ${
                activeTab === "past" ? "text-teal-500" : "text-gray-500"
              }`}
            >
              Past
            </Text>
          </Pressable>
        </View>

        {/* Appointment List Section */}
        {appointments.length > 0 ? (
          <View>
            {appointments.map((appointment) => (
              <View key={appointment.id} className="mb-4">
                {/* Doctor Name and Status Header */}
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-shrink w-[70%]">
                    <Link href={`/doctor/${appointment.doctorId}`}>
                      <Text
                        className="text-base font-bold"
                        style={{ flexWrap: "wrap" }}
                      >
                        {appointment.doctorName}, {appointment.specialty}
                      </Text>
                    </Link>
                  </View>
                  <View
                    className={`rounded-full px-3 py-1 ${
                      appointment.status === "Confirmed"
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        appointment.status === "Confirmed"
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {appointment.status}
                    </Text>
                  </View>
                </View>

                {/* Appointment Card */}
                <View className="bg-white rounded-lg p-4 border border-gray-200">
                  <View className="flex-row items-center mb-2">
                    <Feather
                      name="calendar"
                      size={20}
                      color="#0d9488"
                      className="mr-2"
                    />
                    <Text className="text-sm">{appointment.date}</Text>
                  </View>
                  <View className="flex-row items-center mb-2">
                    <Feather
                      name="clock"
                      size={20}
                      color="#0d9488"
                      className="mr-2"
                    />
                    <Text className="text-sm">{appointment.time}</Text>
                  </View>
                  {activeTab === "upcoming" && (
                    <View className="flex-row justify-end gap-3 mt-2">
                      {appointment.isVideoCallAvailable && (
                        <Button
                          className="bg-teal-500 flex-row items-center justify-center p-2"
                          onPress={() => handleJoinCall(appointment.id)}
                        >
                          <Feather
                            name="video"
                            size={16}
                            color="white"
                            className="mr-1"
                          />
                          <Text className="text-white text-sm">Join Call</Text>
                        </Button>
                      )}
                      <Button
                        className="bg-red-100 flex-row items-center justify-center p-2"
                        onPress={() => handleCancel(appointment.id)}
                      >
                        <Feather
                          name="x-circle"
                          size={16}
                          color="#ef4444"
                          className="mr-1"
                        />
                        <Text className="text-red-500 text-sm">Cancel</Text>
                      </Button>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-10">
            <Feather
              name="calendar"
              size={40}
              color="#6b7280"
              className="mb-4"
            />
            <Text className="text-lg font-medium text-gray-500">
              No {activeTab} appointments
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default AppointmentsScreen;
