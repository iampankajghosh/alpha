import { View, ScrollView, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Text } from "~/components/ui";

// Mock transaction data
const transactions = [
  {
    id: "1",
    type: "Top Up",
    amount: 500.0,
    date: "May 8, 2025",
    description: "Wallet Top Up via UPI",
  },
  {
    id: "2",
    type: "Payment",
    amount: -400.0,
    date: "May 7, 2025",
    description: "Appointment with Dr. Anil Sharma",
  },
  {
    id: "3",
    type: "Top Up",
    amount: 1000.0,
    date: "May 5, 2025",
    description: "Wallet Top Up via Credit Card",
  },
  {
    id: "4",
    type: "Payment",
    amount: -350.0,
    date: "May 3, 2025",
    description: "Appointment with Dr. Sanjay Patel",
  },
  {
    id: "5",
    type: "Top Up",
    amount: 200.0,
    date: "May 1, 2025",
    description: "Wallet Top Up via Net Banking",
  },
];

const TransactionsScreen = () => {
  const router = useRouter();
  const { patient } = useSelector((state) => state.auth); // Mocked patient data

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="min-h-screen gap-6 px-8 py-12">
        {/* Header Section */}
        <View className="flex-row items-center justify-between mb-8">
          <Pressable onPress={() => router.push("/wallet")} className="p-2">
            <Feather name="arrow-left" size={24} color="#000" />
          </Pressable>
          <Text className="text-3xl font-bold text-primary">Alpha</Text>
          <View className="w-10" /> {/* Spacer for alignment */}
        </View>

        {/* Title Section */}
        <View className="flex-row items-center mb-3">
          <Feather
            name="credit-card"
            size={20}
            color="black"
            className="mr-2"
          />
          <Text className="text-lg font-bold">Transaction History</Text>
        </View>

        {/* Transaction List Section */}
        {transactions.length > 0 ? (
          <View>
            {transactions.map((transaction) => (
              <View
                key={transaction.id}
                className="bg-white rounded-lg p-4 border border-gray-200 mb-4"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <Feather
                      name={
                        transaction.type === "Top Up"
                          ? "credit-card"
                          : "calendar"
                      }
                      size={20}
                      color={
                        transaction.type === "Top Up" ? "#10b981" : "#ef4444"
                      }
                      className="mr-2"
                    />
                    <Text className="text-base font-medium">
                      {transaction.type}
                    </Text>
                  </View>
                  <Text
                    className={`text-base font-bold ${
                      transaction.type === "Top Up"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : ""}₹
                    {Math.abs(transaction.amount).toFixed(2)}
                  </Text>
                </View>
                <Text className="text-sm text-muted-foreground">
                  {transaction.description}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  {transaction.date}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-10">
            <Feather
              name="credit-card"
              size={40}
              color="#6b7280"
              className="mb-4"
            />
            <Text className="text-lg font-medium text-gray-500">
              No transactions yet
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default TransactionsScreen;
