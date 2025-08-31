import {
  View,
  ScrollView,
  Pressable,
  ToastAndroid,
  Animated,
  Easing,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, Link, useFocusEffect } from "expo-router";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Text, Button } from "~/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { fetchBookingList, makeBookingDecision } from "~/services/user.service";
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
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Categorize bookings into upcoming and past
  const categorizedBookings = categorizeBookings(bookings);
  const appointments =
    categorizedBookings[activeTab as keyof typeof categorizedBookings];

  // Animation for fade-in effect
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

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

  const handleAccept = async (bookingId: string, amount: number) => {
    try {
      const payload = {
        booking_id: bookingId,
        decision: "accept" as "accept",
        payment_type: "wallet",
        amount: amount,
      };

      const response = await makeBookingDecision(payload);

      if (response.success) {
        ToastAndroid.show("Booking accepted successfully!", ToastAndroid.SHORT);
        await loadBookings(); // Refresh bookings
      } else {
        ToastAndroid.show(
          response?.message || "Failed to accept booking",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.error("Error accepting booking:", error);
      ToastAndroid.show(
        "Failed to accept booking. Please try again.",
        ToastAndroid.SHORT
      );
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      const payload = {
        booking_id: bookingId,
        decision: "reject" as "reject",
        payment_type: "wallet",
        amount: 0,
      };

      const response = await makeBookingDecision(payload);

      if (response.success) {
        ToastAndroid.show("Booking rejected successfully!", ToastAndroid.SHORT);
        await loadBookings(); // Refresh bookings
      } else {
        ToastAndroid.show(
          response?.message || "Failed to reject booking",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.error("Error rejecting booking:", error);
      ToastAndroid.show(
        "Failed to reject booking. Please try again.",
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <Animated.View
      style={{ opacity: fadeAnim }}
      className="flex-1 bg-gray-50 pt-12"
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadBookings} />
        }
      >
        {/* Header Section */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()} className="p-2">
            <Feather name="arrow-left" size={24} color="#374151" />
          </Pressable>
          <Text className="text-xl font-semibold text-gray-800">Alpha</Text>
          <Pressable onPress={loadBookings} className="p-2" disabled={loading}>
            <Feather
              name="refresh-cw"
              size={24}
              color={loading ? "#9ca3af" : "#374151"}
            />
          </Pressable>
        </View>

        {/* Title Section */}
        <View className="flex-row items-center mb-4">
          <Feather name="calendar" size={20} color="#0f766e" className="mr-2" />
          <Text className="text-lg font-semibold text-gray-800">
            Your Appointments
          </Text>
        </View>

        {/* Tabs Section */}
        <View className="flex-row mb-6">
          <Pressable
            onPress={() => setActiveTab("upcoming")}
            className={`flex-1 pb-2 border-b-2 ${
              activeTab === "upcoming" ? "border-teal-600" : "border-gray-200"
            }`}
          >
            <Text
              className={`text-center text-lg font-semibold ${
                activeTab === "upcoming" ? "text-teal-600" : "text-gray-500"
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
          <View className="items-center justify-center py-10">
            <Text className="text-center text-gray-500">
              Loading appointments...
            </Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <View className="items-center justify-center py-10">
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
          appointments.map((booking) => {
            const { date, time } = formatDateTime(booking.date_time);
            const isUpcoming = activeTab === "upcoming";

            return (
              <Card
                key={booking.booking_id}
                className="bg-white rounded-xl mb-4 shadow-sm"
              >
                <CardHeader className="flex-row items-baseline justify-between">
                  <View className="flex-1">
                    <CardTitle className="text-base text-gray-800">
                      Booking #{booking.booking_id.slice(0, 8).toUpperCase()}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      Physiotherapist ID:{" "}
                      {booking.physiotherapist_user_id
                        .slice(0, 8)
                        .toUpperCase()}
                    </CardDescription>
                  </View>
                  <View
                    className={`rounded-full px-3 py-1 ${
                      booking.status === "confirmed"
                        ? "bg-green-100"
                        : booking.status === "soft"
                        ? "bg-yellow-100"
                        : booking.status === "hard"
                        ? "bg-yellow-100"
                        : booking.status === "cancelled"
                        ? "bg-red-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-sm capitalize ${
                        booking.status === "confirmed"
                          ? "text-green-500"
                          : booking.status === "soft"
                          ? "text-orange-600"
                          : booking.status === "hard"
                          ? "text-orange-600"
                          : booking.status === "cancelled"
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {booking.status === "soft" || booking.status === "hard"
                        ? "pending"
                        : booking.status}
                    </Text>
                  </View>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <View className="flex-row items-center gap-5">
                    <View className="flex-row items-center mb-2 w-1/2">
                      <Feather
                        name="calendar"
                        size={20}
                        color="#0f766e"
                        className="mr-2"
                      />
                      <Text className="text-sm text-gray-800">{date}</Text>
                    </View>
                    <View className="flex-row items-center mb-2 w-1/2">
                      <Feather
                        name="clock"
                        size={20}
                        color="#0f766e"
                        className="mr-2"
                      />
                      <Text className="text-sm text-gray-800">{time}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-5">
                    <View className="flex-row items-center mb-2 w-1/2">
                      <Feather
                        name="dollar-sign"
                        size={20}
                        color="#0f766e"
                        className="mr-2"
                      />
                      <Text className="text-sm text-gray-800">
                        ₹{booking.amount}
                      </Text>
                    </View>
                    <View className="flex-row items-center mb-2 w-1/2">
                      <Feather
                        name="credit-card"
                        size={20}
                        color="#0f766e"
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
                  </View>
                </CardContent>
                {booking.status === "hard" && (
                  <CardFooter className="flex-row justify-between p-4 gap-3">
                    <Button
                      className="bg-green-600 rounded-lg px-4 py-2 flex-1"
                      onPress={() =>
                        handleAccept(booking.booking_id, booking.amount)
                      }
                    >
                      <Text className="text-white font-semibold text-center">
                        Accept
                      </Text>
                    </Button>
                    <Button
                      className="bg-red-600 rounded-lg px-4 py-2 flex-1"
                      onPress={() => handleReject(booking.booking_id)}
                    >
                      <Text className="text-white font-semibold text-center">
                        Reject
                      </Text>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            );
          })
        ) : !loading && !error ? (
          <View className="items-center justify-center py-10">
            <Feather
              name="calendar"
              size={40}
              color="#6b7280"
              className="mb-4"
            />
            <Text className="text-center text-gray-500">
              No {activeTab} appointments available.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </Animated.View>
  );
};

export default React.memo(AppointmentsScreen);
