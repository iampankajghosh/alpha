import { View, ScrollView, Pressable, Image } from "react-native";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Input, Button, Text } from "~/components/ui";

// Mock patient data
const patientData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 9876543210",
  address: "123, Main Street, Mumbai, India",
};

const EditProfileScreen = () => {
  const router = useRouter();
  const { patient } = useSelector((state) => state.auth); // Mocked patient data

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: patientData.name,
      email: patientData.email,
      phone: patientData.phone,
      address: patientData.address,
    },
  });

  const onSubmit = (data) => {
    console.log("Updated profile:", data);
    router.push("/profile");
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="min-h-screen gap-6 px-8 py-12">
        {/* Header Section */}
        <View className="flex-row items-center justify-between mb-8">
          <Pressable onPress={() => router.push("/profile")} className="p-2">
            <Feather name="arrow-left" size={24} color="#000" />
          </Pressable>
          <Text className="text-3xl font-bold text-primary">Alpha</Text>
          <View className="w-10" /> {/* Spacer for alignment */}
        </View>

        {/* Title Section */}
        <View className="flex-row items-center mb-3">
          <Feather name="user" size={20} color="black" className="mr-2" />
          <Text className="text-lg font-bold">Edit Profile</Text>
        </View>

        {/* Profile Picture Section */}
        <View className="items-center mb-6">
          <Image
            source={{ uri: "https://shorturl.at/DJVgc" }}
            className="w-24 h-24 rounded-full mb-3"
          />

          <Button
            className="bg-teal-500 flex-row items-center justify-center"
            onPress={() => console.log("Change photo pressed")}
          >
            <Feather name="camera" size={20} color="white" className="mr-2" />
            <Text className="text-white">Change Photo</Text>
          </Button>
        </View>

        {/* Profile Form Section */}
        <View className="mb-6">
          <Input
            name="name"
            control={control}
            placeholder="Full Name"
            icon={
              <Feather name="user" size={20} color="#6b7280" className="mr-2" />
            }
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 mb-4"
            rules={{ required: "Name is required" }}
          />
          <Input
            name="email"
            control={control}
            placeholder="Email Address"
            icon={
              <Feather name="mail" size={20} color="#6b7280" className="mr-2" />
            }
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 mb-4"
            keyboardType="email-address"
            rules={{ required: "Email is required" }}
          />
          <Input
            name="phone"
            control={control}
            placeholder="Phone Number"
            icon={
              <Feather
                name="phone"
                size={20}
                color="#6b7280"
                className="mr-2"
              />
            }
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 mb-4"
            keyboardType="phone-pad"
            rules={{ required: "Phone number is required" }}
          />
          <Input
            name="address"
            control={control}
            placeholder="Address"
            icon={
              <Feather
                name="map-pin"
                size={20}
                color="#6b7280"
                className="mr-2"
              />
            }
            className="bg-white border border-gray-200 rounded-lg px-4 py-2"
            rules={{ required: "Address is required" }}
          />
        </View>

        {/* Save Button */}
        <Button
          className="bg-teal-500 flex-row items-center justify-center p-4"
          onPress={handleSubmit(onSubmit)}
        >
          <Feather name="check" size={20} color="white" className="mr-2" />
          <Text className="text-white font-bold text-xl">Save Changes</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;
