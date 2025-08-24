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

  const toggleFilter = (filterKey) => {
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

        {/* User Greeting (if authenticated) */}
        {isAuthenticated && patient && (
          <LinearGradient
            colors={["#14b8a6", "#0f766e"]}
            className="p-5 mb-6"
            style={{ borderRadius: 8, elevation: 4 }}
          >
            <View className="flex-row items-center mb-3">
              <Feather name="heart" size={24} color="white" className="mr-2" />
              <Text className="text-lg font-semibold text-white">
                Hello, {patient.name?.split(" ")[0] || "User"}!
              </Text>
            </View>
            <Text className="text-sm text-white/90">
              Find the perfect physiotherapist for your needs.
            </Text>
          </LinearGradient>
        )}

        {/* Search and Filter Section */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <View className="flex-1 mr-3">
              <Input
                name="search"
                control={control}
                placeholder="Search Physiotherapists"
                icon={
                  <Feather
                    name="search"
                    size={20}
                    color="#6b7280"
                    className="mr-2"
                  />
                }
                className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm"
              />
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
              <Feather name="filter" size={18} color="white" className="mr-2" />
              <Text className="text-white font-medium">Filter</Text>
            </Button>
          </View>

          {/* Filter Chips */}
          <View className="flex-row justify-start gap-2">
            <Pressable
              onPress={() => toggleFilter("topRated")}
              className={`flex-row items-center border border-gray-200 rounded-full px-3 py-1 ${
                filters.topRated ? "bg-teal-100" : "bg-white"
              } shadow-sm`}
            >
              <Feather
                name="award"
                size={16}
                color="#0f766e"
                className="mr-1"
              />
              <Text className="text-sm text-gray-700">Top Rated</Text>
            </Pressable>
            <Pressable
              onPress={() => toggleFilter("nearby")}
              className={`flex-row items-center border border-gray-200 rounded-full px-3 py-1 ${
                filters.nearby ? "bg-teal-100" : "bg-white"
              } shadow-sm`}
            >
              <Feather
                name="map-pin"
                size={16}
                color="#0f766e"
                className="mr-1"
              />
              <Text className="text-sm text-gray-700">Nearby</Text>
            </Pressable>
            <Pressable
              onPress={() => toggleFilter("availableNow")}
              className={`flex-row items-center border border-gray-200 rounded-full px-3 py-1 ${
                filters.availableNow ? "bg-teal-100" : "bg-white"
              } shadow-sm`}
            >
              <Feather
                name="clock"
                size={16}
                color="#0f766e"
                className="mr-1"
              />
              <Text className="text-sm text-gray-700">Available Now</Text>
            </Pressable>
          </View>
        </View>

        {/* Physiotherapists List */}
        {loading ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-center text-gray-500">
              Fetching physiotherapists for you...
            </Text>
          </View>
        ) : filteredPhysiotherapists.length === 0 ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-center text-gray-500">
              No physiotherapists match your filters. Try adjusting your search
              or filters.
            </Text>
          </View>
        ) : (
          filteredPhysiotherapists.map((physio) => (
            <Card
              key={physio.id}
              className="bg-white rounded-xl mb-4 shadow-sm border border-gray-200"
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
              <CardFooter className="justify-between p-4">
                <View className="flex-row items-center">
                  <Feather
                    name="star"
                    size={16}
                    color="#f59e0b"
                    className="mr-1"
                  />
                  <Text className="text-sm text-gray-700">{physio.rating}</Text>
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
      </ScrollView>
    </Animated.View>
  );
};

export default React.memo(AllDoctorsScreen);
