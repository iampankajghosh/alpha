import { View, ScrollView, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Input, Button, Text } from "~/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";

// Mock data for all physiotherapists
const physiotherapists = [
  {
    id: "1",
    name: "Dr. Anil Sharma",
    specialty: "Sports Injury Specialist",
    details:
      "Expert in treating sports-related injuries with over 10 years of experience.",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Dr. Priya Menon",
    specialty: "Post-Surgery Rehabilitation",
    details: "Specializes in post-operative physiotherapy for faster recovery.",
    rating: 4.9,
    isTopRated: true,
  },
  {
    id: "3",
    name: "Dr. Sanjay Patel",
    specialty: "Pediatric Care",
    details: "Focused on physiotherapy for children with developmental needs.",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Dr. Meera Desai",
    specialty: "Neurological Rehabilitation",
    details: "Specializes in rehab for neurological conditions like stroke.",
    rating: 4.6,
  },
  {
    id: "5",
    name: "Dr. Rohit Kapoor",
    specialty: "Chronic Pain Management",
    details:
      "Helps patients manage chronic pain through tailored physiotherapy.",
    rating: 4.5,
  },
];

const AllDoctorsScreen = () => {
  const { control } = useForm();
  const router = useRouter();
  const [filters, setFilters] = useState({
    topRated: false,
    nearby: false,
    availableNow: false,
  });

  const toggleFilter = (filterKey) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="min-h-screen gap-6 px-8 py-12">
        {/* Header Section */}
        <View className="flex-row items-center justify-between mb-8">
          <Pressable onPress={() => router.push("/")} className="p-2">
            <Feather name="arrow-left" size={24} color="#000" />
          </Pressable>
          <Text className="text-3xl font-bold text-primary">Phynder</Text>
          <View className="w-10" /> {/* Spacer for alignment */}
        </View>

        {/* Title Section */}
        <View className="flex-row items-center mb-3">
          <Feather name="users" size={20} color="black" className="mr-2" />
          <Text className="text-lg font-bold">All Physiotherapists</Text>
        </View>

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
                className="bg-white border border-gray-200 rounded-lg px-4 py-2"
              />
            </View>
            <Button
              className="bg-teal-500 flex-row items-center justify-center"
              onPress={() => router.push("/filter")}
            >
              <Feather name="filter" size={20} color="white" className="mr-2" />
              <Text className="text-white">Filter</Text>
            </Button>
          </View>

          {/* Filter Chips */}
          <View className="flex-row justify-start gap-2">
            <Pressable
              onPress={() => toggleFilter("topRated")}
              className={`flex-row items-center border border-gray-200 rounded-full px-3 py-1 ${
                filters.topRated ? "bg-teal-100" : "bg-white"
              }`}
            >
              <Feather
                name="award"
                size={16}
                color="#0d9488"
                className="mr-1"
              />
              <Text className="text-sm text-gray-700">Top Rated</Text>
            </Pressable>
            <Pressable
              onPress={() => toggleFilter("nearby")}
              className={`flex-row items-center border border-gray-200 rounded-full px-3 py-1 ${
                filters.nearby ? "bg-teal-100" : "bg-white"
              }`}
            >
              <Feather
                name="map-pin"
                size={16}
                color="#0d9488"
                className="mr-1"
              />
              <Text className="text-sm text-gray-700">Nearby</Text>
            </Pressable>
            <Pressable
              onPress={() => toggleFilter("availableNow")}
              className={`flex-row items-center border border-gray-200 rounded-full px-3 py-1 ${
                filters.availableNow ? "bg-teal-100" : "bg-white"
              }`}
            >
              <Feather
                name="clock"
                size={16}
                color="#0d9488"
                className="mr-1"
              />
              <Text className="text-sm text-gray-700">Available Now</Text>
            </Pressable>
          </View>
        </View>

        {/* Divider */}
        <View className="border-b border-gray-200 mb-4" />

        {/* Physiotherapists List */}
        <View>
          {physiotherapists.map((physio) => (
            <Card key={physio.id} className="mb-4">
              <CardHeader className="flex-row items-center">
                <Image
                  source={{ uri: "https://shorturl.at/DJVgc" }}
                  className="w-14 h-14 rounded-full mr-4"
                />
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <CardTitle>{physio.name}</CardTitle>
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
                  <CardDescription>{physio.specialty}</CardDescription>
                </View>
              </CardHeader>
              <CardContent>
                <Text className="text-sm text-muted-foreground">
                  {physio.details}
                </Text>
              </CardContent>
              <CardFooter className="justify-between">
                <View className="flex-row items-center">
                  <Feather
                    name="star"
                    size={16}
                    color="#f59e0b"
                    className="mr-1"
                  />
                  <Text className="text-sm">{physio.rating}</Text>
                </View>
                <Button
                  className="bg-teal-500 flex-row items-center justify-center"
                  onPress={() => router.push(`/doctor/${physio.id}`)}
                >
                  <Feather
                    name="calendar"
                    size={20}
                    color="white"
                    className="mr-2"
                  />
                  <Text className="text-white">Book Now</Text>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default React.memo(AllDoctorsScreen);
