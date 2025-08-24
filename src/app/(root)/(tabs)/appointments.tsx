import { View, ScrollView, Pressable, ToastAndroid } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter, Link, useFocusEffect } from "expo-router";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Text, Button } from "~/components/ui";
import { fetchBookingList } from "~/services/user.service";
import { BookingData } from "~/services/types";

// Helper function to format date and time
const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  const now = new Date();

  // Check if it's today
  const isToday = date.toDateString() === now.toDateString();

  // Format date
  const dateStr = isToday
    ? "Today"
    : date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });

  // Format time
  const timeStr = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { date: dateStr, time: timeStr };
};

// Helper function to categorize bookings
const categorizeBookings = (bookings: BookingData[]) => {
  const now = new Date();

  return bookings.reduce(
    (acc, booking) => {
      const bookingDate = new Date(booking.date_time);

      if (bookingDate >= now) {
        acc.upcoming.push(booking);
      } else {
        acc.past.push(booking);
      }

      return acc;
    },
    { upcoming: [] as BookingData[], past: [] as BookingData[] }
  );
};

const AppointmentsScreen = () => {
  const router = useRouter();
  const { patient, isAuthenticated } = useSelector(
    (state: { auth: any }) => state.auth
  );
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Categorize bookings into upcoming and past
  const categorizedBookings = categorizeBookings(bookings);
  const appointments =
    categorizedBookings[activeTab as keyof typeof categorizedBookings];

  // Load bookings data
  const loadBookings = async () => {
    if (!isAuthenticated) {
      ToastAndroid.show(
        "Please sign in to view your appointments.",
        ToastAndroid.LONG
      );
      router.push("/signin");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchBookingList();

      if (!response?.success) {
        setError(response?.message || "Failed to load appointments");
        ToastAndroid.show(
          response?.message || "Failed to load appointments. Please try again.",
          ToastAndroid.LONG
        );
        return;
      }

      setBookings(response.data || []);
    } catch (error) {
      console.error("Error loading bookings:", error);
      setError("Failed to load appointments");
      ToastAndroid.show(
        "Unable to load appointments. Please try again later.",
        ToastAndroid.LONG
      );
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadBookings();
  }, [isAuthenticated]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (isAuthenticated) {
        loadBookings();
      }
    }, [isAuthenticated])
  );

  const handleCancel = (bookingId: string) => {
    console.log(`Cancel appointment with ID: ${bookingId}`);
    ToastAndroid.show("Cancel feature coming soon!", ToastAndroid.SHORT);
  };

  const handleJoinCall = (bookingId: string) => {
    console.log(`Join video call for appointment with ID: ${bookingId}`);
    ToastAndroid.show("Video call feature coming soon!", ToastAndroid.SHORT);
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
          <Text className="text-3xl font-bold text-primary">Alpha</Text>
          <Pressable onPress={loadBookings} className="p-2" disabled={loading}>
            <Feather
              name="refresh-cw"
              size={24}
              color={loading ? "#9ca3af" : "#000"}
            />
          </Pressable>
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

        {/* Loading State */}
        {loading && (
          <View className="flex-1 items-center justify-center py-10">
            <Text className="text-lg font-medium text-gray-500">
              Loading appointments...
            </Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <View className="flex-1 items-center justify-center py-10">
            <Feather
              name="alert-circle"
              size={40}
              color="#ef4444"
              className="mb-4"
            />
            <Text className="text-lg font-medium text-red-500 mb-4">
              {error}
            </Text>
            <Button
              className="bg-teal-600 rounded-lg px-4 py-3"
              onPress={loadBookings}
            >
              <Text className="text-white font-semibold">Retry</Text>
            </Button>
          </View>
        )}

        {/* Appointment List Section */}
        {!loading && !error && appointments.length > 0 ? (
          <View>
            {appointments.map((booking) => {
              const { date, time } = formatDateTime(booking.date_time);
              const isUpcoming = activeTab === "upcoming";

              return (
                <View key={booking.booking_id} className="mb-4">
                  {/* Booking ID and Status Header */}
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-shrink w-[70%]">
                      <Text className="text-base font-bold">
                        Booking #{booking.booking_id.slice(0, 8)}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        Physiotherapist ID:{" "}
                        {booking.physiotherapist_user_id.slice(0, 8)}
                      </Text>
                    </View>
                    <View
                      className={`rounded-full px-3 py-1 ${
                        booking.status === "confirmed" ||
                        booking.status === "soft"
                          ? "bg-green-100"
                          : booking.status === "cancelled"
                          ? "bg-red-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <Text
                        className={`text-sm capitalize ${
                          booking.status === "confirmed" ||
                          booking.status === "soft"
                            ? "text-green-500"
                            : booking.status === "cancelled"
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {booking.status}
                      </Text>
                    </View>
                  </View>

                  {/* Booking Card */}
                  <View className="bg-white rounded-lg p-4 border border-gray-200">
                    <View className="flex-row items-center mb-2">
                      <Feather
                        name="calendar"
                        size={20}
                        color="#0d9488"
                        className="mr-2"
                      />
                      <Text className="text-sm">{date}</Text>
                    </View>
                    <View className="flex-row items-center mb-2">
                      <Feather
                        name="clock"
                        size={20}
                        color="#0d9488"
                        className="mr-2"
                      />
                      <Text className="text-sm">{time}</Text>
                    </View>
                    <View className="flex-row items-center mb-2">
                      <Feather
                        name="dollar-sign"
                        size={20}
                        color="#0d9488"
                        className="mr-2"
                      />
                      <Text className="text-sm">₹{booking.amount}</Text>
                    </View>
                    <View className="flex-row items-center mb-2">
                      <Feather
                        name="credit-card"
                        size={20}
                        color="#0d9488"
                        className="mr-2"
                      />
                      <Text
                        className={`text-sm capitalize ${
                          booking.payment_status === "paid"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {booking.payment_status}
                      </Text>
                    </View>
                    {isUpcoming && (
                      <View className="flex-row justify-end gap-3 mt-2">
                        <Button
                          className="bg-teal-500 flex-row items-center justify-center p-2"
                          onPress={() => handleJoinCall(booking.booking_id)}
                        >
                          <Feather
                            name="video"
                            size={16}
                            color="white"
                            className="mr-1"
                          />
                          <Text className="text-white text-sm">Join Call</Text>
                        </Button>
                        <Button
                          className="bg-red-100 flex-row items-center justify-center p-2"
                          onPress={() => handleCancel(booking.booking_id)}
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
              );
            })}
          </View>
        ) : !loading && !error ? (
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
        ) : null}
      </View>
    </ScrollView>
  );
};

export default AppointmentsScreen;
