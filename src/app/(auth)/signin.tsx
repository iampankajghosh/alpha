import { ScrollView, ToastAndroid, View } from "react-native";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";

import { Button, Input, Text } from "~/components/ui";
import { PatientLoginFormData } from "~/services/types";
import { login } from "~/store/slices/auth.slice";
import Storage from "~/utils/Storage";
import { authenticatePatient } from "~/services/auth.service";

// Regular expression patterns for validation
const IDENTIFIER_PATTERN =
  /^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\d{10})$/;

const SignInScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const response = await authenticatePatient(formData);

      if (!response?.success) {
        ToastAndroid.show(
          response?.message ?? "Unable to login.",
          ToastAndroid.LONG
        );
        return;
      }

      if (response?.data?.role !== "patient") {
        ToastAndroid.show(
          "You are not authorized to access this application.",
          ToastAndroid.LONG
        );
        return;
      }

      Storage.set("patient", response?.data);
      router.replace("/(root)");
    } catch (error) {
      console.error("Error:: handlePatientLogin: ", error);
      ToastAndroid.show(
        error?.response?.data?.message ?? "Unable to login.",
        ToastAndroid.LONG
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View className="min-h-screen justify-center gap-6 px-8 py-12">
        {/* Branding Section */}
        <View className="flex items-center mb-8">
          <Text className="text-3xl font-bold text-primary">Phynder</Text>
        </View>

        {/* Title & Subtitle */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-center">Sign In</Text>
          <Text className="text-base text-muted-foreground text-center mt-1">
            Welcome back! Please log in with your credentials to continue.
          </Text>
        </View>

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
              />
              {errors.password && (
                <Text className="text-red-500">{errors.password.message}</Text>
              )}
            </>
          )}
        />

        {/* Submit Button */}
        <Button onPress={handleSubmit(handlePatientLogin)} disabled={loading}>
          {loading ? <Text>Loading...</Text> : <Text>Login</Text>}
        </Button>

        {/* Footer Navigation */}
        <Text className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Text
            className="text-primary font-medium"
            onPress={() => router.push("/(auth)")}
          >
            Sign Up
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default React.memo(SignInScreen);
