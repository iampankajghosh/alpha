import { View, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Input, Button, Text } from "~/components/ui";

const TopUpScreen = () => {
  const router = useRouter();
  const { patient } = useSelector((state) => state.auth);

  // Mocked wallet balance
  const currentBalance = 500.0;

  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit/Debit Card");

  const predefinedAmounts = [200, 500, 1000];
  const paymentMethods = ["Credit/Debit Card", "UPI", "Net Banking"];

  const handleCustomAmountChange = (value) => {
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

  const handleTopUp = () => {
    if (selectedAmount > 0) {
      router.push("/payment");
    }
  };

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
          <Text className="text-lg font-bold">Top Up Wallet</Text>
        </View>

        {/* Current Balance Section */}
        <View className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Feather
                name="credit-card"
                size={20}
                color="#0d9488"
                className="mr-2"
              />
              <Text className="text-base font-medium">Current Balance</Text>
            </View>
            <Text className="text-base font-bold text-teal-500">
              ₹{currentBalance.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Amount Selection Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3">Select Amount</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row mb-4"
          >
            {predefinedAmounts.map((amount) => (
              <Pressable
                key={amount}
                onPress={() => {
                  setSelectedAmount(amount);
                  setCustomAmount(amount.toString());
                }}
                className={`rounded-lg p-3 mr-3 items-center justify-center ${
                  selectedAmount === amount ? "bg-teal-500" : "bg-teal-100"
                }`}
              >
                <Text
                  className={`text-base ${
                    selectedAmount === amount ? "text-white" : "text-gray-700"
                  }`}
                >
                  ₹{amount}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Custom Amount Input */}
          <View className="flex-row items-center justify-between border border-gray-200 rounded-lg p-3">
            <Pressable onPress={decrementAmount} className="p-2">
              <Feather name="minus" size={20} color="#0d9488" />
            </Pressable>
            <Input
              value={customAmount}
              onChangeText={handleCustomAmountChange}
              placeholder="Enter Amount"
              keyboardType="numeric"
              className="flex-1 text-center border-0"
            />
            <Pressable onPress={incrementAmount} className="p-2">
              <Feather name="plus" size={20} color="#0d9488" />
            </Pressable>
          </View>
        </View>

        {/* Payment Method Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3">Payment Method</Text>
          <View className="bg-white rounded-lg border border-gray-200 p-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Feather
                  name="credit-card"
                  size={20}
                  color="#0d9488"
                  className="mr-2"
                />
                <Text className="text-base">{paymentMethod}</Text>
              </View>
              <Feather name="chevron-down" size={20} color="#6b7280" />
            </View>
            {/* Mock dropdown options */}
            <View className="mt-2">
              {paymentMethods.map((method) => (
                <Pressable
                  key={method}
                  onPress={() => setPaymentMethod(method)}
                  className="py-2"
                >
                  <Text
                    className={`text-base ${
                      paymentMethod === method
                        ? "text-teal-500"
                        : "text-gray-700"
                    }`}
                  >
                    {method}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Confirm Button */}
        <Button
          className="bg-teal-500 flex-row items-center justify-center p-4"
          onPress={handleTopUp}
          disabled={selectedAmount <= 0}
        >
          <Feather name="check" size={20} color="white" className="mr-2" />
          <Text className="text-white font-bold text-xl">
            Proceed to Top Up
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default TopUpScreen;
