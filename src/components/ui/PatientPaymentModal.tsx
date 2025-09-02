import React, { useState, useEffect } from "react";
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
  onAccept: (amount: number) => void;
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
  const [amount, setAmount] = useState<string>("");
  const [paymentType, setPaymentType] = useState<"full" | "visiting" | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Calculate charges
  const fullCharge = booking?.amount || 0;
  const visitingCharge = booking?.visiting_charge || 0;

  // Set amount based on payment type or default to fullCharge
  useEffect(() => {
    if (booking) {
      if (paymentType === "full") {
        setAmount(fullCharge.toString());
      } else if (paymentType === "visiting") {
        setAmount(visitingCharge.toString());
      } else {
        setAmount(fullCharge.toString()); // Default to full charge
      }
    }
  }, [booking, fullCharge, visitingCharge, paymentType]);

  const handleAccept = async () => {
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert("Error", "Please select a payment option");
      return;
    }

    setIsSubmitting(true); // Show loader
    try {
      await onAccept(amountNum);
    } finally {
      setIsSubmitting(false); // Hide loader
    }
  };

  const handleClose = () => {
    setAmount("");
    setPaymentType(null);
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
              Payment Details
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
                disabled={loading || isSubmitting}
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
                disabled={loading || isSubmitting}
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
              Amount (₹)
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="Select payment type above"
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg p-3 text-gray-800 bg-gray-100"
              placeholderTextColor="#9ca3af"
              editable={false} // Non-editable
            />
            <Text className="text-xs text-gray-500 mt-1">
              Amount is set based on selected payment type
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <Button
              className="flex-1 bg-gray-300 rounded-lg py-3"
              onPress={handleReject}
              disabled={loading || isSubmitting}
            >
              <Text className="text-gray-700 font-semibold text-center">
                Reject
              </Text>
            </Button>
            <Button
              className="flex-1 bg-teal-600 rounded-lg py-3"
              onPress={handleAccept}
              disabled={loading || isSubmitting}
            >
              {loading || isSubmitting ? (
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
