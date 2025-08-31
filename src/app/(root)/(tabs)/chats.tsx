import { View, ScrollView, Pressable } from "react-native";
import React from "react";
import { useRouter, Link } from "expo-router";
import { useAppSelector } from "~/store/hooks";
import { Feather } from "@expo/vector-icons";
import { Text } from "~/components/ui";

// Mock chat data
const chats = [
  {
    doctorId: "1",
    doctorName: "Dr. Anil Sharma",
    specialty: "Sports Injury Specialist",
    lastMessage: "Looking forward to our session!",
    timestamp: "10:30 AM",
    unreadCount: 2,
  },
  {
    doctorId: "2",
    doctorName: "Dr. Priya Menon",
    specialty: "Post-Surgery Rehabilitation",
    lastMessage: "Please bring your medical reports.",
    timestamp: "Yesterday",
    unreadCount: 0,
  },
  {
    doctorId: "3",
    doctorName: "Dr. Sanjay Patel",
    specialty: "Pediatric Care",
    lastMessage: "How is your child feeling today?",
    timestamp: "May 8",
    unreadCount: 1,
  },
  {
    doctorId: "4",
    doctorName: "Dr. Meera Desai",
    specialty: "Neurological Rehabilitation",
    lastMessage: "Let’s discuss your progress.",
    timestamp: "May 7",
    unreadCount: 0,
  },
];

const AllChatsScreen = () => {
  const router = useRouter();
  const { patient } = useAppSelector((state) => state.auth); // Mocked patient data

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
          <Feather
            name="message-circle"
            size={20}
            color="black"
            className="mr-2"
          />
          <Text className="text-lg font-bold">Your Chats</Text>
        </View>

        {/* Chat List Section */}
        {chats.length > 0 ? (
          <View className="gap-5">
            {chats.map((chat) => (
              <Link key={chat.doctorId} href={`/chat/${chat.doctorId}`}>
                <View className="bg-white rounded-lg p-4 border border-gray-200 mb-4 w-full">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-row items-center flex-shrink w-[70%]">
                      <Feather
                        name="user"
                        size={20}
                        color="#0d9488"
                        className="mr-2"
                      />
                      <Text
                        className="text-base font-medium"
                        style={{ flexWrap: "wrap" }}
                      >
                        {chat.doctorName}, {chat.specialty}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-500">
                      {chat.timestamp}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text
                      className="text-sm text-muted-foreground"
                      numberOfLines={1}
                    >
                      {chat.lastMessage}
                    </Text>
                    {chat.unreadCount > 0 && (
                      <View className="bg-teal-100 rounded-full px-2 py-1">
                        <Text className="text-xs text-teal-500">
                          {chat.unreadCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </Link>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-10">
            <Feather
              name="message-circle"
              size={40}
              color="#6b7280"
              className="mb-4"
            />
            <Text className="text-lg font-medium text-gray-500">
              No chats yet
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default AllChatsScreen;
