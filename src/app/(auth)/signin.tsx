import { ScrollView, ToastAndroid, View } from "react-native";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "~/store/hooks";

import { Button, Input, Text } from "~/components/ui";
import { PatientLoginFormData } from "~/services/types";
import {
  login,
  setLoading,
  setError,
  clearError,
} from "~/store/slices/auth.slice";
import Storage from "~/utils/Storage";
import { authenticatePatient } from "~/services/auth.service";

// Regular expression patterns for validation
const IDENTIFIER_PATTERN =
  /^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\d{10})$/;

const SignInScreen = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientLoginFormData>({
    defaultValues: {
      email_or_phone: "",
      password: "",
    },
  });

  const handlePatientLogin = async (formData: PatientLoginFormData) => {
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const response = await authenticatePatient(formData);

      if (!response?.success) {
        const errorMessage = response?.message ?? "Unable to login.";
        dispatch(setError(errorMessage));
        ToastAndroid.show(errorMessage, ToastAndroid.LONG);
        return;
      }

      if (response?.data?.role !== "patient") {
        const errorMessage =
          "You are not authorized to access this application.";
        dispatch(setError(errorMessage));
        ToastAndroid.show(errorMessage, ToastAndroid.LONG);
        return;
      }

      // Store patient data and update Redux state
      await Storage.set("patient", response?.data);
      dispatch(login(response?.data));
      router.replace("/(root)");
    } catch (error: any) {
      console.error("Error:: handlePatientLogin: ", error);
      const errorMessage = error?.response?.data?.message ?? "Unable to login.";
      dispatch(setError(errorMessage));
      ToastAndroid.show(errorMessage, ToastAndroid.LONG);
    }
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View className="min-h-screen justify-center gap-6 px-8 py-12">
        {/* Branding Section */}
        <View className="flex items-center mb-8">
          <Text className="text-3xl font-bold text-primary">Alpha</Text>
        </View>

        {/* Title & Subtitle */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-center">Sign In</Text>
          <Text className="text-base text-muted-foreground text-center mt-1">
            Welcome back! Please log in with your credentials to continue.
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <Text className="text-red-600 text-center">{error}</Text>
          </View>
        )}

        {/* Email or Phone Input */}
        <Controller
          control={control}
          name="email_or_phone"
          rules={{
            required: "Email or phone is required",
            pattern: {
              value: IDENTIFIER_PATTERN,
              message: "Must be a valid email or 10-digit phone number",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <Input
                placeholder="Email or phone"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                editable={!isLoading}
              />
              {errors.email_or_phone && (
                <Text className="text-red-500">
                  {errors.email_or_phone.message}
                </Text>
              )}
            </>
          )}
        />

        {/* Password Input */}
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <Input
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                editable={!isLoading}
              />
              {errors.password && (
                <Text className="text-red-500">{errors.password.message}</Text>
              )}
            </>
          )}
        />

        {/* Submit Button */}
        <Button onPress={handleSubmit(handlePatientLogin)} disabled={isLoading}>
          {isLoading ? <Text>Signing In...</Text> : <Text>Sign In</Text>}
        </Button>

        {/* Footer Navigation */}
        <Text className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Text
            className="text-primary font-medium"
            onPress={() => router.push("/(auth)/signup")}
          >
            Sign Up
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default React.memo(SignInScreen);
