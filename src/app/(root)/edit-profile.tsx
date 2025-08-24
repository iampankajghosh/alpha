import {
  View,
  ScrollView,
  Pressable,
  Image,
  Animated,
  Easing,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useRouter, useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Input, Button, Text } from "~/components/ui";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { updatePatient } from "~/store/slices/auth.slice";
import { updatePatientName } from "~/services/user.service";

// Default profile image
const defaultProfileImage = require("~/assets/images/default-profile.png");

interface FormData {
  name: string;
  email: string;
  phone: string;
}

const EditProfileScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { patient, isAuthenticated } = useSelector(
    (state: { auth: any }) => state.auth
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: patient?.name || "",
      email: patient?.email || "",
      phone: patient?.phone || "",
    },
  });

  // Reset form when patient data changes
  useEffect(() => {
    console.log("Patient data changed in edit profile, resetting form with:", {
      name: patient?.name || "",
      email: patient?.email || "",
      phone: patient?.phone || "",
    });
    reset({
      name: patient?.name || "",
      email: patient?.email || "",
      phone: patient?.phone || "",
    });
  }, [patient, reset]);

  // Fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  // Refresh form data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (patient) {
        console.log(
          "Edit profile screen focused, resetting form with patient data:",
          {
            name: patient?.name || "",
            email: patient?.email || "",
            phone: patient?.phone || "",
          }
        );
        reset({
          name: patient?.name || "",
          email: patient?.email || "",
          phone: patient?.phone || "",
        });
      }
    }, [patient, reset])
  );

  if (!isAuthenticated || !patient) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-center text-gray-500">
          Please sign in to edit your profile.{" "}
          <Link href="/signin">
            <Text className="text-teal-600">Sign In</Text>
          </Link>
          .
        </Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={{ opacity: fadeAnim, flex: 1, backgroundColor: "#f9fafb" }}
      className="mt-12 mb-16"
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {/* Header Section */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable
            onPress={() => router.push("/(tabs)/profile")}
            className="p-2"
          >
            <Feather name="arrow-left" size={24} color="#374151" />
          </Pressable>
          <Text className="text-xl font-semibold text-gray-800">
            Edit Profile
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

        {/* Profile Banner */}
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
          <View className="flex-row items-center">
            <Image
              source={
                patient.profile_picture
                  ? { uri: patient.profile_picture }
                  : defaultProfileImage
              }
              className="w-16 h-16 rounded-full mr-4 border border-gray-200"
              accessibilityLabel="Profile picture"
            />
            <View>
              <Text className="text-lg font-semibold text-white">
                {patient.name || "Unnamed User"}
              </Text>
              <Text className="text-sm text-white/90">Edit Your Details</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Change Profile Picture Card */}
        <Card className="bg-white rounded-xl mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Change Profile Picture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View className="items-center mb-4">
              <Image
                source={
                  patient.profile_picture
                    ? { uri: patient.profile_picture }
                    : defaultProfileImage
                }
                className="w-24 h-24 rounded-full mb-3 border border-gray-200"
                accessibilityLabel="Profile picture preview"
              />
              <Button
                className={`bg-teal-600 rounded-lg px-4 py-3 flex-row items-center justify-center ${
                  loading ? "opacity-70" : ""
                }`}
                onPress={() =>
                  ToastAndroid.show("Feature coming soon!", ToastAndroid.SHORT)
                }
                disabled={loading}
              >
                <Feather
                  name="camera"
                  size={20}
                  color="white"
                  className="mr-2"
                />
                <Text className="text-white font-semibold text-base">
                  Change Photo
                </Text>
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* Profile Form Card */}
        <Card className="bg-white rounded-xl mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Update Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View className="mb-4">
              <Controller
                control={control}
                name="name"
                rules={{
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters long",
                  },
                  pattern: {
                    value: /^[A-Za-z\s\-']+$/i,
                    message:
                      "Name can only contain letters, spaces, hyphens, and apostrophes",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Input
                      placeholder="Full Name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      className="bg-white border border-gray-200 rounded-lg px-4 py-3"
                    />
                  </View>
                )}
              />
              {errors.name && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </Text>
              )}
            </View>
            <View className="mb-4">
              <Controller
                control={control}
                name="email"
                rules={{ required: "Email is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Input
                      placeholder="Email Address"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      editable={false}
                      className="bg-white border border-gray-200 rounded-lg px-4 py-3"
                    />
                  </View>
                )}
              />
            </View>
            <View className="mb-4">
              <Controller
                control={control}
                name="phone"
                rules={{ required: "Phone number is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <Input
                      placeholder="Phone Number"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="phone-pad"
                      editable={false}
                      className="bg-white border border-gray-200 rounded-lg px-4 py-3"
                    />
                  </View>
                )}
              />
            </View>

            <Button
              className={`bg-teal-600 rounded-lg px-4 py-3 flex-row items-center justify-center ${
                loading ? "opacity-70" : ""
              }`}
              onPress={async () => {
                const currentValues = watch();
                const newName = currentValues.name?.trim();
                if (!newName) {
                  ToastAndroid.show(
                    "Name cannot be empty.",
                    ToastAndroid.SHORT
                  );
                  return;
                }

                if (newName.length < 2) {
                  ToastAndroid.show(
                    "Name must be at least 2 characters long.",
                    ToastAndroid.SHORT
                  );
                  return;
                }

                const currentName = patient?.name?.trim() || "";
                if (newName === currentName) {
                  ToastAndroid.show(
                    "No changes to name detected.",
                    ToastAndroid.SHORT
                  );
                  router.push("/(tabs)/profile");
                  return;
                }

                setLoading(true);
                try {
                  const response = await updatePatientName({ name: newName });

                  if (!response?.success) {
                    ToastAndroid.show(
                      response?.message ??
                        "Failed to update profile. Please try again.",
                      ToastAndroid.LONG
                    );
                    return;
                  }

                  // Update Redux store with new name
                  const updatedPatient = { ...patient, name: newName };
                  dispatch(updatePatient(updatedPatient));

                  // Reset form with updated name
                  reset({
                    name: newName,
                    email: patient?.email || "",
                    phone: patient?.phone || "",
                  });

                  ToastAndroid.show(
                    response.message || "Profile updated successfully!",
                    ToastAndroid.SHORT
                  );
                  router.push("/(tabs)/profile");
                } catch (error) {
                  console.error("Error:: updatePatientName: ", error);
                  const errorMessage =
                    error?.message ||
                    error?.response?.data?.message ||
                    "Something went wrong while updating your profile. Please try again.";
                  ToastAndroid.show(errorMessage, ToastAndroid.LONG);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              <Feather name="check" size={20} color="white" className="mr-2" />
              <Text className="text-white font-semibold text-base">
                {loading ? "Saving..." : "Save Changes"}
              </Text>
            </Button>
          </CardContent>
        </Card>
      </ScrollView>
    </Animated.View>
  );
};

export default React.memo(EditProfileScreen);
