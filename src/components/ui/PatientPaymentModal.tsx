import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Button } from "./button";
import { Text } from "./text";
import { BookingData } from "~/services/types";

interface PatientPaymentModalProps {
  isVisible: boolean;
  onClose: () => void;
  booking: BookingData | null;
  onAccept: (paymentType: "full" | "visiting", amount: number) => void;
  onReject: () => void;
  loading?: boolean;
}

export const PatientPaymentModal: React.FC<PatientPaymentModalProps> = ({
  isVisible,
  onClose,
  booking,
  onAccept,
  onReject,
  loading = false,
}) => {
  const [paymentType, setPaymentType] = useState<"full" | "visiting" | null>(
    null
  );
  const [amount, setAmount] = useState<string>("");

  // Calculate charges - if visiting_charge is not available, use a default ratio
  const fullCharge = booking?.amount || 0;
  const visitingCharge =
    booking?.visiting_charge || Math.round(booking?.amount * 0.3) || 0;

  const handleAccept = () => {
    if (!paymentType) {
      Alert.alert("Error", "Please select a payment type");
      return;
    }

    const amountNum = parseFloat(amount);
    const expectedAmount = paymentType === "full" ? fullCharge : visitingCharge;

    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (amountNum !== expectedAmount) {
      Alert.alert(
        "Error",
        `Amount must be ₹${expectedAmount} for ${
          paymentType === "full" ? "full payment" : "visiting charge"
        }`
      );
      return;
    }

    onAccept(paymentType, amountNum);
  };

  const handleClose = () => {
    setPaymentType(null);
    setAmount("");
    onClose();
  };

  const handleReject = () => {
    onReject();
  };

  if (!booking) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/20 justify-center items-center px-4">
        <View className="bg-white rounded-2xl w-full max-w-sm p-6">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-semibold text-gray-800">
              Make Payment
            </Text>
            <TouchableOpacity onPress={handleClose} className="p-2">
              <Feather name="x" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Booking ID */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-600 mb-2">
              Booking ID
            </Text>
            <Text className="text-sm text-gray-800 bg-gray-100 p-3 rounded-lg uppercase">
              #{booking.booking_id.split("-")[0]}
            </Text>
          </View>

          {/* Charge Summary */}
          <View className="mb-4 bg-gray-50 p-3 rounded-lg">
            <Text className="text-sm font-medium text-gray-600 mb-2">
              Available Payment Options
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Full Payment:</Text>
                <Text className="text-sm font-semibold text-gray-800">
                  ₹{fullCharge}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Visiting Charge:</Text>
                <Text className="text-sm font-semibold text-gray-800">
                  ₹{visitingCharge}
                </Text>
              </View>
            </View>
          </View>

          {/* Payment Type Selection */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-600 mb-2">
              Select Payment Type
            </Text>
            <View className="flex-row gap-3">
              <Button
                className={`flex-1 rounded-lg py-3 ${
                  paymentType === "full" ? "bg-teal-600" : "bg-gray-300"
                }`}
                onPress={() => {
                  setPaymentType("full");
                  setAmount(fullCharge.toString());
                }}
                disabled={loading}
              >
                <Text
                  className={`text-center font-semibold ${
                    paymentType === "full" ? "text-white" : "text-gray-700"
                  }`}
                >
                  Full Payment (₹{fullCharge})
                </Text>
              </Button>
              <Button
                className={`flex-1 rounded-lg py-3 ${
                  paymentType === "visiting" ? "bg-teal-600" : "bg-gray-300"
                }`}
                onPress={() => {
                  setPaymentType("visiting");
                  setAmount(visitingCharge.toString());
                }}
                disabled={loading}
              >
                <Text
                  className={`text-center font-semibold ${
                    paymentType === "visiting" ? "text-white" : "text-gray-700"
                  }`}
                >
                  Visiting Charge (₹{visitingCharge})
                </Text>
              </Button>
            </View>
          </View>

          {/* Amount Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-600 mb-2">
              Amount (₹) - Auto-set based on selection
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="Select payment type above"
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg p-3 text-gray-800 bg-gray-100"
              placeholderTextColor="#9ca3af"
              editable={false}
            />
            <Text className="text-xs text-gray-500 mt-1">
              Amount is automatically set and cannot be modified
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <Button
              className="flex-1 bg-gray-300 rounded-lg py-3"
              onPress={handleReject}
              disabled={loading}
            >
              <Text className="text-gray-700 font-semibold text-center">
                Reject
              </Text>
            </Button>
            <Button
              className="flex-1 bg-teal-600 rounded-lg py-3"
              onPress={handleAccept}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-semibold text-center">
                  Accept
                </Text>
              )}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};
