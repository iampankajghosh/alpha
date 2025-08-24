import {
  View,
  ScrollView,
  ToastAndroid,
  Image,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, Link, useFocusEffect } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Text } from "~/components/ui";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { logoutPatient } from "~/services/auth.service";
import { fetchCurrentUser } from "~/services/user.service";
import { fetchTransactions } from "~/services/transaction.service";
import Storage from "~/utils/Storage";
import { login, logout } from "~/store/slices/auth.slice";
// Default profile image
const defaultProfileImage = require("~/assets/images/default-profile.png");

const ProfileScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, patient } = useSelector(
    (state: { auth: any }) => state.auth
  );
  const [transactions, setTransactions] = useState([]);
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

  // Load data function
  const loadData = async () => {
    if (!isAuthenticated || !patient) {
      ToastAndroid.show(
        "Please sign in to view your profile.",
        ToastAndroid.LONG
      );
      router.push("/signin");
      return;
    }

    setFetchLoading(true);
    try {
      // If patient data is missing profile fields, fetch it
      if (!patient.name || !patient.email) {
        console.log(
          "Patient data missing profile fields, fetching user data..."
        );
        const userResponse = await fetchCurrentUser();
        if (userResponse?.success && userResponse?.data) {
          const updatedPatient = { ...patient, ...userResponse.data };
          dispatch(login(updatedPatient));
          console.log(
            "Updated patient data with profile info:",
            updatedPatient
          );
        }
      }

      // Fetch transactions
      const transactionResponse = await fetchTransactions();
      if (!transactionResponse?.success) {
        ToastAndroid.show(
          transactionResponse?.message ??
            "Failed to load transactions. Please try again.",
          ToastAndroid.LONG
        );
        setTransactions([]);
      } else if (transactionResponse.count === 0 || !transactionResponse.data) {
        setTransactions([]);
      } else {
        setTransactions(
          transactionResponse.data.map((tx) => ({
            id: tx.id,
            description: tx.description,
            amount: tx.amount,
            date: new Date(tx.created_at).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
          }))
        );
      }
    } catch (error) {
      console.error("Error:: loadData: ", error);
      ToastAndroid.show(
        "Unable to load profile data. Please try again later.",
        ToastAndroid.LONG
      );
      router.push("/signin");
    } finally {
      setFetchLoading(false);
    }
  };

  // Fetch transactions on mount
  useEffect(() => {
    loadData();
  }, [isAuthenticated, patient]);

  // Debug: Log patient data changes
  useEffect(() => {
    console.log("Patient data changed:", patient);
  }, [patient]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (isAuthenticated && patient) {
        console.log("Profile screen focused, patient data:", patient);
        loadData();
      }
    }, [isAuthenticated, patient])
  );

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await logoutPatient();
      if (!response?.success) {
        ToastAndroid.show(
          response?.message ?? "Unable to log out. Please try again.",
          ToastAndroid.LONG
        );
        return;
      }
      await Storage.remove("patient");
      dispatch(logout());
      router.push("/signin");
    } catch (error) {
      console.error("Error:: Logout: ", error);
      ToastAndroid.show(
        "Unable to log out. Please check your connection or try again later.",
        ToastAndroid.LONG
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-center text-gray-500">
          Please sign in to view your profile.{" "}
          <Link href="/signin">
            <Text className="text-teal-600">Sign In</Text>
          </Link>
          .
        </Text>
      </View>
    );
  }

  if (fetchLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-center text-gray-500">Loading profile...</Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={{ opacity: fadeAnim, flex: 1, backgroundColor: "#f9fafb" }}
      className="mt-12"
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
            Hello, {patient?.name?.split(" ")[0] || "User"}!
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

        {/* Profile Banner */}
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
              source={
                patient?.profile_picture
                  ? { uri: patient.profile_picture }
                  : defaultProfileImage
              }
              className="w-16 h-16 rounded-full mr-4 border border-gray-200"
              accessibilityLabel="Profile picture"
            />
            <View>
              <Text className="text-lg font-semibold text-white">
                {patient?.name || "Unnamed User"}
              </Text>
              <Text className="text-sm text-white/90">Patient</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Wallet Card */}
        <Card className="bg-white rounded-xl mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center mb-4">
              <Feather
                name="credit-card"
                size={20}
                color="#0f766e"
                className="mr-2"
              />
              <Text className="text-2xl font-bold text-gray-800">
                ₹{(patient?.wallet || 0).toFixed(2)}
              </Text>
            </View>
            <Button
              className="bg-teal-600 rounded-lg px-4 py-3 flex-row items-center justify-center"
              onPress={() => router.push("/top-up")}
              disabled={loading}
            >
              <Feather name="plus" size={20} color="white" className="mr-2" />
              <Text className="text-white font-semibold text-base">Top Up</Text>
            </Button>
          </CardContent>
        </Card>

        {/* Transactions Card */}
        <Card className="bg-white rounded-xl mb-6 shadow-sm">
          <CardHeader>
            <View className="flex-row justify-between items-center">
              <CardTitle className="text-lg text-gray-800">
                Recent Transactions
              </CardTitle>
              <Pressable
                onPress={() =>
                  ToastAndroid.show("Coming soon!", ToastAndroid.SHORT)
                }
                className="flex-row items-center"
              >
                <Text className="text-teal-600 text-sm font-medium mr-1">
                  See All
                </Text>
                <Feather name="arrow-right" size={16} color="#0f766e" />
              </Pressable>
            </View>
          </CardHeader>
          <CardContent>
            {fetchLoading ? (
              <Text className="text-sm text-gray-600">
                Loading transactions...
              </Text>
            ) : transactions.length === 0 ? (
              <Text className="text-sm text-gray-600">
                No recent transactions.
              </Text>
            ) : (
              transactions.map((transaction) => (
                <View
                  key={transaction.id}
                  className="flex-row justify-between items-center mb-3"
                >
                  <View className="flex-row items-center">
                    <Feather
                      name={transaction.amount < 0 ? "heart" : "plus-circle"}
                      size={20}
                      color={transaction.amount < 0 ? "#ef4444" : "#22c55e"}
                      className="mr-3"
                    />
                    <View>
                      <Text className="text-sm font-medium text-gray-800">
                        {transaction.description}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {transaction.date}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className={`text-sm font-bold ${
                      transaction.amount < 0 ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {transaction.amount < 0 ? "-" : "+"}₹
                    {Math.abs(transaction.amount).toFixed(2)}
                  </Text>
                </View>
              ))
            )}
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card className="bg-white rounded-xl mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View className="mb-3">
              <Text className="text-sm text-gray-500">Name</Text>
              <Text className="text-base font-medium text-gray-800">
                {patient?.name || "Unnamed User"}
              </Text>
            </View>
            <View className="mb-3">
              <Text className="text-sm text-gray-500">Email</Text>
              <Text className="text-base font-medium text-gray-800">
                {patient?.email || "Not provided"}
              </Text>
            </View>
            <View className="mb-3">
              <Text className="text-sm text-gray-500">Phone</Text>
              <Text className="text-base font-medium text-gray-800">
                {patient?.phone || "Not provided"}
              </Text>
            </View>
            <View className="mb-6">
              <Text className="text-sm text-gray-500">Account Created</Text>
              <Text className="text-base font-medium text-gray-800">
                {patient?.created_at
                  ? new Date(patient.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "Not available"}
              </Text>
            </View>
            <Button
              className="bg-teal-600 rounded-lg px-4 py-3 flex-row items-center justify-center mb-4"
              onPress={() => router.push("/edit-profile")}
              disabled={loading}
            >
              <Feather name="edit" size={20} color="white" className="mr-2" />
              <Text className="text-white font-semibold text-base">
                Edit Profile
              </Text>
            </Button>
            <Button
              className="bg-gray-200 rounded-lg px-4 py-3 flex-row items-center justify-center"
              onPress={handleLogout}
              disabled={loading}
            >
              <Feather
                name="log-out"
                size={20}
                color="#ef4444"
                className="mr-2"
              />
              <Text className="text-red-500 font-semibold text-base">
                Log Out
              </Text>
            </Button>
          </CardContent>
        </Card>
      </ScrollView>
    </Animated.View>
  );
};

export default React.memo(ProfileScreen);
