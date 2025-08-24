import {
  View,
  ScrollView,
  Pressable,
  ToastAndroid,
  Animated,
  Easing,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Input, Button, Text } from "~/components/ui";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { topUpWallet } from "~/services/user.service";
import { updatePatient } from "~/store/slices/auth.slice";

const TopUpScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { patient, isAuthenticated } = useSelector(
    (state: { auth: any }) => state.auth
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit/Debit Card");
  const [loading, setLoading] = useState(false);

  const predefinedAmounts = [200, 500, 1000, 2000, 5000];
  const paymentMethods = ["Credit/Debit Card", "UPI", "Net Banking"];

  // Current wallet balance from Redux store
  const currentBalance = patient?.wallet || 0;

  // Fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (!isAuthenticated) {
        ToastAndroid.show(
          "Please sign in to access wallet.",
          ToastAndroid.LONG
        );
        router.push("/signin");
      }
    }, [isAuthenticated])
  );

  const handleCustomAmountChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setCustomAmount(numValue.toString());
    setSelectedAmount(numValue);
  };

  const incrementAmount = () => {
    const newAmount = (parseInt(customAmount) || 0) + 100;
    setCustomAmount(newAmount.toString());
    setSelectedAmount(newAmount);
  };

  const decrementAmount = () => {
    const newAmount = Math.max((parseInt(customAmount) || 0) - 100, 0);
    setCustomAmount(newAmount.toString());
    setSelectedAmount(newAmount);
  };

  const handleTopUp = async () => {
    if (selectedAmount <= 0) {
      ToastAndroid.show(
        "Please select an amount to top up.",
        ToastAndroid.SHORT
      );
      return;
    }

    if (selectedAmount < 100) {
      ToastAndroid.show("Minimum top-up amount is ₹100.", ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    try {
      const response = await topUpWallet({ amount: selectedAmount });

      if (!response?.success) {
        ToastAndroid.show(
          response?.message ?? "Failed to top up wallet. Please try again.",
          ToastAndroid.LONG
        );
        return;
      }

      // Update Redux store with new wallet balance
      const updatedPatient = {
        ...patient,
        wallet: response.data.wallet_balance,
      };
      dispatch(updatePatient(updatedPatient));

      ToastAndroid.show(
        response.message || "Wallet topped up successfully!",
        ToastAndroid.SHORT
      );

      // Navigate back to profile screen
      router.push("/(tabs)/profile");
    } catch (error) {
      console.error("Error:: topUpWallet: ", error);
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Something went wrong while topping up your wallet. Please try again.";
      ToastAndroid.show(errorMessage, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !patient) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-center text-gray-500">
          Please sign in to access your wallet.{" "}
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
      >
        {/* Header Section */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()} className="p-2">
            <Feather name="arrow-left" size={24} color="#374151" />
          </Pressable>
          <Text className="text-xl font-semibold text-gray-800">
            Top Up Wallet
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

        {/* Wallet Banner */}
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
                Current Balance
              </Text>
              <Text className="text-sm text-white/90">Your wallet balance</Text>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-bold text-white">
                ₹{currentBalance.toFixed(2)}
              </Text>
              <Text className="text-sm text-white/90">Available</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Amount Selection Card */}
        <Card className="bg-white rounded-xl mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Select Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Predefined Amounts */}
            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-3">Quick Select</Text>
              <View className="flex-row flex-wrap gap-2">
                {predefinedAmounts.map((amount) => (
                  <Pressable
                    key={amount}
                    onPress={() => {
                      setSelectedAmount(amount);
                      setCustomAmount(amount.toString());
                    }}
                    className={`rounded-lg px-4 py-3 items-center justify-center border ${
                      selectedAmount === amount
                        ? "bg-teal-600 border-teal-600"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-base font-medium ${
                        selectedAmount === amount
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      ₹{amount.toLocaleString()}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Custom Amount Input */}
            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-3">Custom Amount</Text>
              <View className="flex-row items-center justify-between border border-gray-200 rounded-lg p-3 bg-gray-50">
                <Pressable onPress={decrementAmount} className="p-2">
                  <Feather name="minus" size={20} color="#0d9488" />
                </Pressable>
                <Input
                  value={customAmount}
                  onChangeText={handleCustomAmountChange}
                  placeholder="Enter Amount"
                  keyboardType="numeric"
                  className="flex-1 text-center border-0 bg-transparent"
                />
                <Pressable onPress={incrementAmount} className="p-2">
                  <Feather name="plus" size={20} color="#0d9488" />
                </Pressable>
              </View>
              <Text className="text-xs text-gray-500 mt-2">
                Minimum amount: ₹100
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Payment Method Card */}
        <Card className="bg-white rounded-xl mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View className="space-y-2">
              {paymentMethods.map((method) => (
                <Pressable
                  key={method}
                  onPress={() => setPaymentMethod(method)}
                  className={`flex-row items-center justify-between p-3 rounded-lg border ${
                    paymentMethod === method
                      ? "border-teal-600 bg-teal-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <View className="flex-row items-center">
                    <Feather
                      name={
                        method.includes("Credit")
                          ? "credit-card"
                          : method === "UPI"
                          ? "smartphone"
                          : "globe"
                      }
                      size={20}
                      color={paymentMethod === method ? "#0d9488" : "#6b7280"}
                      className="mr-3"
                    />
                    <Text
                      className={`text-base font-medium ${
                        paymentMethod === method
                          ? "text-teal-600"
                          : "text-gray-700"
                      }`}
                    >
                      {method}
                    </Text>
                  </View>
                  {paymentMethod === method && (
                    <Feather name="check" size={20} color="#0d9488" />
                  )}
                </Pressable>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* Summary Card */}
        {selectedAmount > 0 && (
          <Card className="bg-white rounded-xl mb-6 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Top-up Amount</Text>
                  <Text className="font-semibold">
                    ₹{selectedAmount.toLocaleString()}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Payment Method</Text>
                  <Text className="font-semibold">{paymentMethod}</Text>
                </View>
                <View className="border-t border-gray-200 pt-3">
                  <View className="flex-row justify-between">
                    <Text className="text-lg font-semibold">Total</Text>
                    <Text className="text-lg font-bold text-teal-600">
                      ₹{selectedAmount.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        )}

        {/* Confirm Button */}
        <Button
          className={`bg-teal-600 rounded-lg px-4 py-3 flex-row items-center justify-center ${
            loading ? "opacity-70" : ""
          }`}
          onPress={handleTopUp}
          disabled={selectedAmount <= 0 || loading}
        >
          <Feather name="check" size={20} color="white" className="mr-2" />
          <Text className="text-white font-semibold text-base">
            {loading
              ? "Processing..."
              : `Top Up ₹${selectedAmount.toLocaleString()}`}
          </Text>
        </Button>
      </ScrollView>
    </Animated.View>
  );
};

export default TopUpScreen;
