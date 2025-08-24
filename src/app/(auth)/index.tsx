import { ScrollView, ToastAndroid, View } from "react-native";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { Button, Input, Text } from "~/components/ui";
import {
  PatientRegisterFormData,
  PatientLoginFormData,
} from "~/services/types";
import Storage from "~/utils/Storage";
import { registerPatient, authenticatePatient } from "~/services/auth.service";

// Regular expression patterns for validation
const IDENTIFIER_PATTERN =
  /^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|\d{10})$/;
const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const SignUpScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientRegisterFormData>({
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const handlePatientSignup = async (formData: PatientRegisterFormData) => {
    setLoading(true);

    try {
      // Step 1: Register the patient
      const registerResponse = await registerPatient(formData);

      if (!registerResponse?.success) {
        ToastAndroid.show(
          registerResponse?.message ?? "Unable to sign up.",
          ToastAndroid.LONG
        );
        return;
      }

      // Step 2: Authenticate the patient
      const loginPayload: PatientLoginFormData = {
        email_or_phone: formData.identifier,
        password: formData.password,
      };
      const authResponse = await authenticatePatient(loginPayload);

      if (!authResponse?.success) {
        ToastAndroid.show(
          authResponse?.message ?? "Unable to login after signup.",
          ToastAndroid.LONG
        );
        return;
      }

      // Store patient data and navigate
      await Storage.set("patient", authResponse?.data);
      router.replace("/(root)");
    } catch (error: any) {
      console.error("Error:: handlePatientSignup: ", error);
      ToastAndroid.show(
        error?.response?.data?.message ?? "Unable to sign up.",
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
          <Text className="text-3xl font-bold text-primary">Alpha</Text>
        </View>

        {/* Title & Subtitle */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-center">Sign Up</Text>
          <Text className="text-base text-muted-foreground text-center mt-1">
            Create an account to start your journey with Alpha.
          </Text>
        </View>

        {/* Email or Phone Input */}
        <Controller
          control={control}
          name="identifier"
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
                editable={!loading}
              />
              {errors.identifier && (
                <Text className="text-red-500">
                  {errors.identifier.message}
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
            pattern: {
              value: PASSWORD_PATTERN,
              message:
                "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <>
              <Input
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                editable={!loading}
              />
              {errors.password && (
                <Text className="text-red-500">{errors.password.message}</Text>
              )}
            </>
          )}
        />

        {/* Submit Button */}
        <Button onPress={handleSubmit(handlePatientSignup)} disabled={loading}>
          {loading ? (
            <Text>Loading...</Text> // Placeholder for loading icon
          ) : (
            <Text>Create Account</Text>
          )}
        </Button>

        {/* Footer Navigation */}
        <Text className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Text
            className="text-primary font-medium"
            onPress={() => router.push("/signin")}
          >
            Sign In
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default React.memo(SignUpScreen);
