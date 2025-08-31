import {
  View,
  ScrollView,
  Pressable,
  Image,
  ToastAndroid,
  Animated,
  Easing,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Input, Button, Text } from "~/components/ui";
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

// Default profile image
const defaultProfileImage = require("~/assets/images/default-profile.png");

const AllDoctorsScreen = () => {
  const { control } = useForm();
  const router = useRouter();
  const [physiotherapists, setPhysiotherapists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    topRated: false,
    nearby: false,
    availableNow: false,
  });
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

  // Fetch physiotherapists
  useEffect(() => {
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
            rating: physio.rating || 4.5, // Default rating if not provided
            isTopRated: physio.experience > 5, // Example logic for top-rated
          }));
        setPhysiotherapists(validPhysios);
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
    loadPhysiotherapists();
  }, []);

  // Filter physiotherapists based on active filters
  const filteredPhysiotherapists = physiotherapists.filter((physio) => {
    if (filters.topRated && !physio.isTopRated) return false;
    if (filters.nearby) {
      ToastAndroid.show(
        "Nearby filter is coming soon! Showing all physiotherapists for now.",
        ToastAndroid.SHORT
      );
      return true; // Placeholder: no actual filtering for nearby
    }
    if (filters.availableNow) {
      ToastAndroid.show(
        "Available Now filter is coming soon! Showing all physiotherapists for now.",
        ToastAndroid.SHORT
      );
      return true; // Placeholder: no actual filtering for availability
    }
    return true;
  });

  const toggleFilter = (filterKey: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  return (
    <Animated.View
      style={{ opacity: fadeAnim }}
      className="flex-1 bg-gray-50 mt-12 mb-16"
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {/* Header Section */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.push("/")} className="p-2">
            <Feather name="arrow-left" size={24} color="#374151" />
          </Pressable>
          <Text className="text-xl font-semibold text-gray-800">
            All Physiotherapists
          </Text>
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

        {/* User Greeting Banner */}
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
              {isAuthenticated && patient
                ? `Hello, ${patient.name?.split(" ")[0] || "User"}!`
                : "Explore Our Experts"}
            </Text>
          </View>
          <Text className="text-sm text-white/90 mb-4">
            Find the perfect physiotherapist tailored to your unique needs.
          </Text>
          <Button
            className="bg-white rounded-lg px-4 py-2 flex-row items-center"
            onPress={() => {
              ToastAndroid.show("Start your search below!", ToastAndroid.SHORT);
            }}
          >
            <Text className="text-teal-600 font-medium mr-2">
              Find Your Expert
            </Text>
            <Feather name="search" size={18} color="#0f766e" />
          </Button>
        </LinearGradient>

        {/* Search and Filter Section */}
        <Card className="bg-white rounded-xl shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex-row items-center mb-4">
              <View className="flex-1 mr-3">
                <View className="relative flex-1">
                  <Input
                    placeholder="Search"
                    className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm pr-10"
                  />
                  <View className="absolute right-3 top-[50%] -translate-y-1/2">
                    <Feather
                      name="search"
                      size={20}
                      color="#6b7280"
                    />
                  </View>
                </View>
              </View>
              <Button
                className="bg-teal-600 rounded-lg px-4 py-2 flex-row items-center"
                onPress={() => {
                  ToastAndroid.show(
                    "Advanced filters coming soon!",
                    ToastAndroid.SHORT
                  );
                }}
              >
                <Feather
                  name="filter"
                  size={18}
                  color="white"
                  className="mr-2"
                />
                <Text className="text-white font-medium">Filter</Text>
              </Button>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {[
                { key: "topRated", label: "Top Rated", icon: "award" as const },
                { key: "nearby", label: "Nearby", icon: "map-pin" as const },
                { key: "availableNow", label: "Available Now", icon: "clock" as const },
              ].map((filter) => (
                <Pressable
                  key={filter.key}
                  onPress={() => toggleFilter(filter.key)}
                  className={`flex-row items-center bg-white rounded-xl p-3 mr-3 shadow-sm border ${
                    filters[filter.key] ? "border-teal-500" : "border-gray-200"
                  }`}
                >
                  <Feather
                    name={filter.icon}
                    size={16}
                    color="#0f766e"
                    className="mr-1"
                  />
                  <Text
                    className={`text-sm font-medium ${
                      filters[filter.key] ? "text-teal-600" : "text-gray-800"
                    }`}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </CardContent>
        </Card>

        {/* Physiotherapists List */}
        <View>
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Our Experts
          </Text>
          {loading ? (
            <Card className="bg-white rounded-xl shadow-sm">
              <CardContent className="py-8">
                <Text className="text-center text-gray-500">
                  Fetching physiotherapists for you...
                </Text>
              </CardContent>
            </Card>
          ) : filteredPhysiotherapists.length === 0 ? (
            <Card className="bg-white rounded-xl shadow-sm">
              <CardContent className="py-8">
                <Text className="text-center text-gray-500">
                  No physiotherapists match your filters. Try adjusting your
                  search or filters.
                </Text>
              </CardContent>
            </Card>
          ) : (
            filteredPhysiotherapists.map((physio) => (
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
                    <View className="flex-row items-center">
                      <CardTitle className="text-base text-gray-800">
                        {physio.name}
                      </CardTitle>
                      {physio.isTopRated && (
                        <View className="ml-2 flex-row items-center bg-yellow-100 rounded-full px-2 py-1">
                          <Feather
                            name="award"
                            size={14}
                            color="#f59e0b"
                            className="mr-1"
                          />
                          <Text className="text-xs text-yellow-700">
                            Top Rated
                          </Text>
                        </View>
                      )}
                    </View>
                    <CardDescription className="text-sm text-gray-500">
                      {physio.specialization}
                    </CardDescription>
                  </View>
                </CardHeader>
                <CardContent>
                  <Text className="text-sm text-gray-600">
                    {physio.qualification}
                  </Text>
                </CardContent>
                <CardFooter className="flex-row justify-between p-4">
                  <View className="flex-row items-center">
                    <Feather
                      name="star"
                      size={16}
                      color="#f59e0b"
                      className="mr-1"
                    />
                    <Text className="text-sm text-gray-700">
                      {physio.rating}
                    </Text>
                  </View>
                  <Button
                    className="bg-teal-600 rounded-lg px-4 py-2 flex-row items-center"
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

export default React.memo(AllDoctorsScreen);
