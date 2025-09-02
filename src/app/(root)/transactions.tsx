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
import { useRouter, useFocusEffect } from "expo-router";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Text } from "~/components/ui";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { fetchTransactionList } from "~/services/user.service";
import { TransactionData } from "~/services/types";
import { usePullToRefresh } from "~/hooks/usePullToRefresh";

// Helper function to format date and time
const formatDateTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();

  // Check if it's today
  const isToday = date.toDateString() === now.toDateString();

  // Format date
  const dateStr = isToday
    ? "Today"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

  // Format time
  const timeStr = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { date: dateStr, time: timeStr };
};

// Helper function to get transaction icon and color
const getTransactionInfo = (type: string, paymentStatus: string) => {
  switch (type) {
    case "wallet_topup":
      return {
        icon: "plus-circle",
        color: "#22c55e",
        label: "Wallet Top-up",
      };
    case "booking_payment":
      return {
        icon: "calendar",
        color: "#3b82f6",
        label: "Booking Payment",
      };
    case "refund":
      return {
        icon: "rotate-ccw",
        color: "#f59e0b",
        label: "Refund",
      };
    default:
      return {
        icon: "dollar-sign",
        color: "#6b7280",
        label: "Transaction",
      };
  }
};

const TransactionsScreen = () => {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: { auth: any }) => state.auth);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  // Load transactions data
  const loadTransactions = async () => {
    if (!isAuthenticated) {
      ToastAndroid.show(
        "Please sign in to view transactions.",
        ToastAndroid.LONG
      );
      router.push("/signin");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchTransactionList();

      if (!response?.success) {
        setError(response?.message || "Failed to load transactions");
        ToastAndroid.show(
          response?.message || "Failed to load transactions. Please try again.",
          ToastAndroid.LONG
        );
        return;
      }

      setTransactions(response.data || []);
    } catch (error) {
      console.error("Error loading transactions:", error);
      setError("Failed to load transactions");
      ToastAndroid.show(
        "Unable to load transactions. Please try again later.",
        ToastAndroid.LONG
      );
    } finally {
      setLoading(false);
    }
  };

  // Pull to refresh hook
  const { refreshing, onRefresh } = usePullToRefresh({
    onRefresh: loadTransactions,
  });

  // Load data on mount
  useEffect(() => {
    loadTransactions();
  }, [isAuthenticated]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (isAuthenticated) {
        loadTransactions();
      }
    }, [isAuthenticated])
  );

  if (!isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-center text-gray-500">
          Please sign in to view your transactions.{" "}
        </Text>
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Section */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()} className="p-2">
            <Feather name="arrow-left" size={24} color="#374151" />
          </Pressable>
          <Text className="text-xl font-semibold text-gray-800">
            Transaction History
          </Text>
          <Pressable
            onPress={loadTransactions}
            className="p-2"
            disabled={loading}
          >
            <Feather
              name="refresh-cw"
              size={24}
              color={loading ? "#9ca3af" : "#374151"}
            />
          </Pressable>
        </View>

        {/* Summary Banner */}
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
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-semibold text-white">
                Total Transactions
              </Text>
              <Text className="text-sm text-white/90">
                {transactions.length} transaction
                {transactions.length !== 1 ? "s" : ""}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-bold text-white">
                ₹
                {transactions
                  .reduce((sum, tx) => sum + tx.amount, 0)
                  .toLocaleString()}
              </Text>
              <Text className="text-sm text-white/90">Total Amount</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Loading State */}
        {loading && (
          <View className="flex-1 items-center justify-center py-10">
            <Text className="text-center text-gray-500">
              Loading transactions...
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
              onPress={loadTransactions}
            >
              <Text className="text-white font-semibold">Retry</Text>
            </Button>
          </View>
        )}

        {/* Transactions List */}
        {!loading && !error && transactions.length > 0 ? (
          <View>
            {transactions.map((transaction) => {
              const { date, time } = formatDateTime(transaction.timestamp);
              const transactionInfo = getTransactionInfo(
                transaction.type_of_transaction,
                transaction.payment_status
              );

              return (
                <Card
                  key={transaction.transaction_id}
                  className="bg-white rounded-xl mb-4 shadow-sm"
                >
                  <CardContent className="p-4">
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center">
                        <View
                          className="w-10 h-10 rounded-full items-center justify-center mr-3"
                          style={{
                            backgroundColor: `${transactionInfo.color}20`,
                          }}
                        >
                          <Feather
                            name={transactionInfo.icon as any}
                            size={20}
                            color={transactionInfo.color}
                          />
                        </View>
                        <View>
                          <Text className="text-base font-semibold text-gray-800">
                            {transactionInfo.label}
                          </Text>
                          <Text className="text-sm text-gray-500">
                            #{transaction.transaction_id.slice(0, 8)}
                          </Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-lg font-bold text-gray-800">
                          ₹{transaction.amount.toLocaleString()}
                        </Text>
                        <View
                          className={`rounded-full px-2 py-1 mt-1 ${
                            transaction.payment_status === "success"
                              ? "bg-green-100"
                              : transaction.payment_status === "failed"
                              ? "bg-red-100"
                              : "bg-yellow-100"
                          }`}
                        >
                          <Text
                            className={`text-xs capitalize ${
                              transaction.payment_status === "success"
                                ? "text-green-600"
                                : transaction.payment_status === "failed"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {transaction.payment_status}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Feather
                          name="calendar"
                          size={16}
                          color="#6b7280"
                          className="mr-2"
                        />
                        <Text className="text-sm text-gray-600">{date}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Feather
                          name="clock"
                          size={16}
                          color="#6b7280"
                          className="mr-2"
                        />
                        <Text className="text-sm text-gray-600">{time}</Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              );
            })}
          </View>
        ) : !loading && !error ? (
          <View className="flex-1 items-center justify-center py-10">
            <Feather
              name="file-text"
              size={40}
              color="#6b7280"
              className="mb-4"
            />
            <Text className="text-lg font-medium text-gray-500">
              No transactions found
            </Text>
            <Text className="text-sm text-gray-400 mt-2">
              Your transaction history will appear here
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </Animated.View>
  );
};

export default TransactionsScreen;
