import {
  View,
  ScrollView,
  Pressable,
  Image,
  ToastAndroid,
  Animated,
  Easing,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, Link } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Text } from "~/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { fetchPhysiotherapists } from "~/services/physiotherapist.service";
import { useSelector } from "react-redux";
import { PatientData } from "~/store/slices/types";
import { usePullToRefresh } from "~/hooks/usePullToRefresh";

// Default profile image
const defaultProfileImage = require("~/assets/images/default-profile.png");

// Mock announcements
const announcements = [
  {
    id: "1",
    title: "Discover Video Consultations!",
    description: "Consult with expert physiotherapists from anywhere, anytime.",
    icon: "video" as const,
    link: "/video-consultations",
  },
  {
    id: "2",
    title: "Ease Back Pain with Simple Tips",
    description:
      "Explore easy exercises to relieve and prevent back discomfort.",
    icon: "info" as const,
    link: "/tips/back-pain",
  },
];

// Categories data
const categories = [
  { name: "Sports Injury", icon: "activity" as const },
  { name: "Post-Surgery", icon: "scissors" as const },
  { name: "Chronic Pain", icon: "alert-circle" as const },
  { name: "Pediatric Care", icon: "smile" as const },
  { name: "Geriatric Care", icon: "heart" as const },
  { name: "Neurological Rehab", icon: "headphones" as const },
];

const HomeScreen = () => {
  const router = useRouter();
  const [physiotherapists, setPhysiotherapists] = useState([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Access patient data from Redux store
  const patient = useSelector(
    (state: { auth: { patient: PatientData } }) => state.auth.patient
  );
  const isAuthenticated = useSelector(
    (state: { auth: { isAuthenticated: boolean } }) =>
      state.auth.isAuthenticated
  );

  // Animation for fade-in effect
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  // Load physiotherapists function
  const loadPhysiotherapists = async () => {
    setLoading(true);
    try {
      const response = await fetchPhysiotherapists();
      if (!response?.success) {
        ToastAndroid.show(
          response?.message ??
            "Oops! We couldn't fetch physiotherapists right now. Please try again later.",
          ToastAndroid.LONG
        );
        return;
      }
      const validPhysios = response.data
        .filter((physio) => !physio.is_banned)
        .map((physio) => ({
          ...physio,
          name: physio.name || `Physiotherapist ${physio.id.slice(0, 4)}`,
          specialization: physio.specialization || "General Physiotherapy",
          qualification: physio.qualification || "Not specified",
        }));
      setPhysiotherapists(validPhysios.slice(0, 3));
    } catch (error) {
      console.error("Error:: loadPhysiotherapists: ", error);
      ToastAndroid.show(
        error?.response?.data?.message ??
          "Something went wrong while fetching physiotherapists. Please try again.",
        ToastAndroid.LONG
      );
    } finally {
      setLoading(false);
    }
  };

  // Pull to refresh hook
  const { refreshing, onRefresh } = usePullToRefresh({
    onRefresh: loadPhysiotherapists,
  });

  // Fetch physiotherapists on mount
  useEffect(() => {
    loadPhysiotherapists();
  }, []);

  return (
    <Animated.View
      style={{ opacity: fadeAnim }}
      className="flex-1 bg-gray-50 pt-12"
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* User Greeting Section */}
        <View className="flex-row items-center justify-between mb-6">
          {isAuthenticated && patient ? (
            <View className="flex-row items-center">
              <Image
                source={defaultProfileImage}
                className="w-12 h-12 rounded-full mr-3 border border-gray-200"
                accessibilityLabel="User profile image"
              />
              <View>
                <Text className="text-xl font-semibold text-gray-800">
                  Hello, {patient.name?.split(" ")[0] || "User"}!
                </Text>
                <Text className="text-sm text-gray-500">Welcome back</Text>
              </View>
            </View>
          ) : (
            <View className="flex-row items-center">
              <Text className="text-xl font-semibold text-gray-800">
                Welcome to Alpha Physio
              </Text>
            </View>
          )}
          <Pressable
            className="p-2"
            onPress={() => {
              ToastAndroid.show(
                "Notifications will be available soon. Stay tuned!",
                ToastAndroid.SHORT
              );
            }}
            accessibilityLabel="Notifications"
          >
            <Feather name="bell" size={24} color="#374151" />
          </Pressable>
        </View>

        {/* Banner Section */}
        <LinearGradient
          colors={["#14b8a6", "#0f766e"]}
          className="p-5 mb-6"
          style={{
            borderRadius: 16,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <View className="flex-row items-center mb-3">
            <Feather name="heart" size={24} color="white" className="mr-2" />
            <Text className="text-lg font-semibold text-white">
              Your Journey to Recovery
            </Text>
          </View>
          <Text className="text-sm text-white/90 mb-4">
            Connect with expert physiotherapists tailored to your unique needs.
          </Text>
          <Button
            className="bg-white rounded-lg px-4 py-2 flex-row items-center"
            onPress={() => router.push("/all-doctors")}
          >
            <Text className="text-teal-600 font-medium mr-2">
              Explore Experts
            </Text>
            <Feather name="arrow-right" size={18} color="#0f766e" />
          </Button>
        </LinearGradient>

        {/* Quick Tips Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">
              Health Tips
            </Text>
            <Pressable
              onPress={() =>
                ToastAndroid.show(
                  "More health tips are on the way. Check back soon!",
                  ToastAndroid.SHORT
                )
              }
              className="flex-row items-center"
            >
              <Text className="text-teal-600 font-medium mr-1">
                Explore More
              </Text>
              <Feather name="chevron-right" size={16} color="#0f766e" />
            </Pressable>
          </View>
          <Card className="bg-white rounded-xl shadow-sm">
            <CardContent className="flex-row items-center p-4">
              <Feather
                name="activity"
                size={20}
                color="#0f766e"
                className="mr-3"
              />
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-800">
                  Boost Your Posture Today
                </Text>
                <Text className="text-xs text-gray-500">
                  Try a quick 5-minute stretch to enhance posture and ease
                  tension.
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Categories Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">
              Browse by Specialty
            </Text>
            <Pressable
              onPress={() =>
                ToastAndroid.show("Stay tuned!", ToastAndroid.SHORT)
              }
              className="flex-row items-center"
            >
              <Text className="text-teal-600 font-medium mr-1">View All</Text>
              <Feather name="chevron-right" size={16} color="#0f766e" />
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {categories.map((category, index) => (
              <Pressable
                key={index}
                className="bg-white rounded-xl p-4 mr-3 shadow-sm border border-gray-200"
                onPress={() =>
                  ToastAndroid.show(
                    `Coming soon: ${category.name} resources and experts!`,
                    ToastAndroid.SHORT
                  )
                }
              >
                <Feather
                  name={category.icon}
                  size={20}
                  color="#0f766e"
                  className="mb-2"
                />
                <Text className="text-sm font-medium text-gray-800">
                  {category.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Announcements Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            What's New
          </Text>
          {announcements.map((announcement) => (
            <Card
              key={announcement.id}
              className="bg-white rounded-xl mb-3 shadow-sm"
            >
              <CardContent className="flex-row items-center p-4">
                <Feather
                  name={announcement.icon}
                  size={20}
                  color="#0f766e"
                  className="mr-3"
                />
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-800">
                    {announcement.title}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {announcement.description}
                  </Text>
                </View>
                <Pressable
                  onPress={() =>
                    ToastAndroid.show(
                      "Feature coming soon — you'll be able to explore details here!",
                      ToastAndroid.SHORT
                    )
                  }
                  className="flex-row items-center"
                >
                  <Text className="text-teal-600 font-medium mr-1">
                    Learn More
                  </Text>
                  <Feather name="chevron-right" size={16} color="#0f766e" />
                </Pressable>
              </CardContent>
            </Card>
          ))}
        </View>

        {/* Featured Physiotherapists Section */}
        <View>
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Top Physiotherapists
          </Text>
          {loading ? (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-center text-gray-500">
                Fetching top physiotherapists for you...
              </Text>
            </View>
          ) : physiotherapists.length === 0 ? (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-center text-gray-500">
                No physiotherapists available at the moment.{" "}
                <Link href="/all-doctors">
                  <Text className="text-teal-600">Browse all experts</Text>
                </Link>
                .
              </Text>
            </View>
          ) : (
            physiotherapists.map((physio) => (
              <Card
                key={physio.id}
                className="bg-white rounded-xl mb-4 shadow-sm"
              >
                <CardHeader className="flex-row items-center">
                  <Image
                    source={defaultProfileImage}
                    className="w-12 h-12 rounded-full mr-3 border border-gray-200"
                    accessibilityLabel="Physiotherapist profile image"
                  />
                  <View className="flex-1">
                    <CardTitle className="text-base text-gray-800">
                      {physio.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {physio.specialization}
                    </CardDescription>
                  </View>
                </CardHeader>
                <CardFooter className="p-4">
                  <Button
                    className="bg-teal-600 rounded-lg px-4 py-2 flex-row items-center w-full justify-center"
                    onPress={() => router.push(`/doctor/${physio.id}`)}
                  >
                    <Feather
                      name="calendar"
                      size={18}
                      color="white"
                      className="mr-2"
                    />
                    <Text className="text-white font-medium">
                      Schedule a Session
                    </Text>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default HomeScreen;
