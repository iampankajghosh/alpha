import {
  View,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Input, Text } from "~/components/ui";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock doctor data
const doctors = [
  { id: "1", name: "Dr. Anil Sharma", specialty: "Sports Injury Specialist" },
  {
    id: "2",
    name: "Dr. Priya Menon",
    specialty: "Post-Surgery Rehabilitation",
  },
  { id: "3", name: "Dr. Sanjay Patel", specialty: "Pediatric Care" },
  {
    id: "4",
    name: "Dr. Meera Desai",
    specialty: "Neurological Rehabilitation",
  },
];

// Mock chat messages
const messages = [
  {
    id: "1",
    text: "Hello, how are you feeling today?",
    timestamp: "10:30 AM",
    sender: "doctor",
  },
  {
    id: "2",
    text: "Hi, I’m feeling much better, thanks!",
    timestamp: "10:32 AM",
    sender: "patient",
  },
  {
    id: "3",
    text: "That’s great to hear! Any pain recently?",
    timestamp: "10:33 AM",
    sender: "doctor",
  },
  {
    id: "4",
    text: "A little in my knee, but it’s manageable.",
    timestamp: "10:34 AM",
    sender: "patient",
  },
  {
    id: "5",
    text: "Let’s discuss that in our next session.",
    timestamp: "10:35 AM",
    sender: "doctor",
  },
  {
    id: "6",
    text: "Sounds good, see you then!",
    timestamp: "10:36 AM",
    sender: "patient",
  },
];

const ChatScreen = () => {
  const router = useRouter();
  const { doctorId } = useLocalSearchParams();

  // Find the doctor based on the id
  const doctor = doctors.find((doc) => doc.id === doctorId) || doctors[0];

  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const renderMessage = ({ item }) => {
    const isPatient = item.sender === "patient";
    return (
      <View
        className={`flex-row ${
          isPatient ? "justify-end" : "justify-start"
        } mb-3`}
      >
        <View
          className={`max-w-[70%] rounded-lg p-3 ${
            isPatient ? "bg-teal-500" : "bg-gray-100"
          }`}
        >
          <Text
            className={`text-sm ${isPatient ? "text-white" : "text-gray-700"}`}
          >
            {item.text}
          </Text>
          <Text
            className={`text-xs mt-1 ${
              isPatient ? "text-teal-100" : "text-gray-500"
            } ${isPatient ? "text-right" : "text-left"}`}
          >
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Header Section */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="p-2">
            <Feather name="arrow-left" size={24} color="#000" />
          </Pressable>
          <View className="flex-row items-center">
            <Image
              source={{ uri: "https://shorturl.at/DJVgc" }}
              className="w-10 h-10 rounded-full mr-4"
            />
            <Text className="text-lg font-bold">{doctor.name}</Text>
          </View>
          <View className="w-10" /> {/* Spacer for alignment */}
        </View>

        {/* Chat Messages Section */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
        />

        {/* Message Input Section */}
        <View className="px-4 pb-4 bg-white border-t border-gray-200 py-3">
          <View className="flex-row items-center justify-between py-2 bg-gray-100 rounded-lg">
            <Input
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              className="flex-1 border-0 bg-transparent px-4 py-2"
              multiline
            />
            <Pressable
              onPress={handleSend}
              className="p-2 bg-teal-500 rounded-full mr-2"
              disabled={!newMessage.trim()}
            >
              <Feather name="send" size={20} color="white" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
