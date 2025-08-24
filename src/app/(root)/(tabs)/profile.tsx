import { View, ScrollView, ToastAndroid, Image } from "react-native";
import React, { useState } from "react";
import { useRouter, Link } from "expo-router";
import { useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";

import { Button, Text } from "~/components/ui";
import { logoutPatient } from "~/services/auth.service";
import Storage from "~/utils/Storage";
import { logout } from "~/store/slices/auth.slice";
import { PatientData } from "~/store/slices/types";

// Mock patient data (assumed to be fetched from Redux or Storage)
const patient: PatientData = {
  id: "12847039-9ccb-4b82-87b3-d169b679419a",
  name: "John Doe William",
  email: "john.doe@example.com",
  phone: "+911234567899",
  password: "",
  date_of_birth: "1990-01-01T00:00:00Z",
  gender: "male",
  role: "patient",
  profile_picture: "",
  wallet: 150.75,
  is_banned: false,
  banned_until: "0001-01-01T00:00:00Z",
  is_deleted: false,
  created_at: "2025-05-02T19:20:00.873983Z",
  updated_at: "2025-05-08T18:39:21.074459Z",
};

// Mock transaction data with Indian date format (DD/MM/YYYY)
const transactions = [
  {
    id: "1",
    description: "Consultation with Dr. Pawan",
    amount: -50.0,
    date: "07/05/2025",
  },
  { id: "2", description: "Wallet Top-Up", amount: 100.0, date: "06/05/2025" },
];

const ProfileScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await logoutPatient();

      if (!response) {
        ToastAndroid.show(
          response?.msg ?? "Unable to log out. Please try again.",
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

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="min-h-screen gap-6 px-8 py-12">
        {/* Branding Section */}
        <View className="flex items-center mb-8">
          <Text className="text-3xl font-bold text-primary">Alpha</Text>
        </View>

        {/* User Greeting Section */}
        <View className="flex-row items-center mb-6">
          <Image
            source={{ uri: "https://shorturl.at/DJVgc" }}
            className="w-16 h-16 rounded-full mr-4"
          />
          <View>
            <Text className="text-xl font-bold">{patient.name}</Text>
            <Text className="text-sm text-muted-foreground">Patient</Text>
          </View>
        </View>

        {/* Wallet Section */}
        <View className="bg-teal-500 rounded-lg p-4 mb-6">
          <View className="flex-row items-center mb-2">
            <Feather
              name="credit-card"
              size={24}
              color="white"
              className="mr-2"
            />
            <Text className="text-white text-lg font-bold">
              Your Wallet Balance
            </Text>
          </View>
          <Text className="text-white text-2xl font-bold mt-1">
            ₹{patient.wallet.toFixed(2)}
          </Text>
          <Button
            className="bg-white mt-4 flex-row items-center justify-center"
            onPress={() => router.push("/top-up")}
            disabled={loading}
          >
            <Feather name="plus" size={20} color="#0d9488" className="mr-2" />
            <Text className="text-teal-500">Top Up</Text>
          </Button>
        </View>

        {/* Transactions Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Feather name="list" size={20} color="black" className="mr-2" />
              <Text className="text-lg font-bold">Recent Transactions</Text>
            </View>
            <Link href="/transactions" className="flex-row items-center">
              <Text className="text-teal-500 mr-1">See All</Text>
              <Feather name="arrow-right" size={16} color="#0d9488" />
            </Link>
          </View>
          {transactions.map((transaction) => (
            <View
              key={transaction.id}
              className="bg-white rounded-lg p-4 mb-2 flex-row justify-between items-center border border-gray-200"
            >
              <View className="flex-row items-center">
                <Feather
                  name={transaction.amount < 0 ? "heart" : "plus-circle"}
                  size={20}
                  color={transaction.amount < 0 ? "#ef4444" : "#22c55e"}
                  className="mr-3"
                />
                <View>
                  <Text className="text-sm font-medium">
                    {transaction.description}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
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
          ))}
        </View>

        {/* Account Section */}
        <View>
          <View className="flex-row items-center mb-3">
            <Feather name="user" size={20} color="black" className="mr-2" />
            <Text className="text-lg font-bold">Your Account Details</Text>
          </View>
          <View className="bg-white rounded-lg p-4 border border-gray-200">
            <View className="mb-3">
              <Text className="text-sm text-muted-foreground">Name</Text>
              <Text className="text-base font-medium">{patient.name}</Text>
            </View>
            <View className="mb-3">
              <Text className="text-sm text-muted-foreground">Email</Text>
              <Text className="text-base font-medium">{patient.email}</Text>
            </View>
            <View className="mb-6">
              <Text className="text-sm text-muted-foreground">Phone</Text>
              <Text className="text-base font-medium">{patient.phone}</Text>
            </View>
            <Button
              className="bg-teal-500 mb-3 flex-row items-center justify-center"
              onPress={() => router.push("/edit-profile")}
              disabled={loading}
            >
              <Feather name="edit" size={20} color="white" className="mr-2" />
              <Text className="text-white">Edit Profile</Text>
            </Button>

            {/* Logout Button */}
            <Button
              onPress={handleLogout}
              disabled={loading}
              variant="ghost"
              className="flex-row items-center justify-center"
            >
              <Feather
                name="log-out"
                size={20}
                color="#ef4444"
                className="mr-2"
              />
              <Text className="text-red-500 font-semibold">Log Out</Text>
            </Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default React.memo(ProfileScreen);
