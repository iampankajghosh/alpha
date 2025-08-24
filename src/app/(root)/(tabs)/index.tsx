import { View, ScrollView, Pressable, Image } from "react-native";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter, Link } from "expo-router";
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

// Mock data for featured physiotherapists
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
];

// Mock patient data (for greeting)
const patient = {
  name: "John Doe William",
  role: "patient",
};

// Mock announcements
const announcements = [
  {
    id: "1",
    title: "Video Consultations Now Available!",
    description:
      "Connect with your physiotherapist from the comfort of your home.",
    icon: "video",
    link: "/video-consultations",
  },
  {
    id: "2",
    title: "Stay Active: Tips for Back Pain Relief",
    description: "Learn simple exercises to manage and prevent back pain.",
    icon: "info",
    link: "/tips/back-pain",
  },
];

const HomeScreen = () => {
  const { control } = useForm();
  const router = useRouter();

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="min-h-screen gap-6 px-8 py-12">
        {/* Branding Section */}
        <View className="flex items-center mb-8">
          <Text className="text-3xl font-bold text-primary">Phynder</Text>
        </View>

        {/* User Greeting Section */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <Image
              source={{ uri: "https://shorturl.at/DJVgc" }}
              className="w-16 h-16 rounded-full mr-4"
            />
            <View>
              <Text className="text-xl font-bold">
                Welcome Back, {patient.name.split(" ")[0]}
              </Text>
              <Text className="text-sm text-muted-foreground">Patient</Text>
            </View>
          </View>
          <Pressable className="p-2 relative">
            <Feather name="bell" size={24} color="#000" />
            <View className="w-3 h-3 bg-red-500 rounded-full absolute top-1 right-2" />
          </Pressable>
        </View>

        {/* Search Section */}
        <View className="mb-6 flex-row w-full justify-between border border-gray-200 rounded-lg">
          <Input
            name="search"
            control={control}
            placeholder="Search Physiotherapists"
            className="bg-white px-4 py-2 border-0"
          />
          <Button variant="secondary">
            <Feather name="search" size={20} color="#6b7280" />
          </Button>
        </View>

        {/* Banner Section with Gradient */}
        <LinearGradient
          colors={["#0d9488", "#115e59"]}
          className="rounded-lg p-4 mb-6 overflow-hidden"
        >
          <View className="flex-row items-center mb-2">
            <Feather name="heart" size={24} color="white" className="mr-2" />
            <Text className="text-white text-lg font-bold">
              Book Your Physiotherapist Today
            </Text>
          </View>
          <Text className="text-white text-sm mb-4">
            Find the best physiotherapists for your needs with Phynder.
          </Text>
          <Button
            className="bg-white flex-row items-center justify-center"
            onPress={() => router.push("/all-doctors")}
          >
            <Feather
              name="arrow-right"
              size={20}
              color="#0d9488"
              className="mr-2"
            />
            <Text className="text-teal-500">Browse Now</Text>
          </Button>
        </LinearGradient>

        {/* Quick Tips Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Feather
                name="activity"
                size={20}
                color="black"
                className="mr-2"
              />
              <Text className="text-lg font-bold">Quick Tips</Text>
            </View>
            <Link href="/tips" className="flex-row items-center" disabled>
              <Text className="text-teal-500 mr-1">View More Tips</Text>
              <Feather name="arrow-right" size={16} color="#0d9488" />
            </Link>
          </View>
          <View className="bg-white rounded-lg p-4 flex-row items-center border border-gray-200">
            <Feather
              name="activity"
              size={20}
              color="#0d9488"
              className="mr-3"
            />
            <View className="flex-1">
              <Text className="text-sm font-medium">
                Daily Stretch: Improve Your Posture
              </Text>
              <Text className="text-xs text-muted-foreground">
                Try a 5-minute stretch routine to enhance your posture.
              </Text>
            </View>
          </View>
        </View>

        {/* Categories Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <Feather name="list" size={20} color="black" className="mr-2" />
              <Text className="text-lg font-bold">
                Physiotherapy Categories
              </Text>
            </View>
            <Link href="/categories" className="flex-row items-center" disabled>
              <Text className="text-teal-500 mr-1">See All</Text>
              <Feather name="arrow-right" size={16} color="#0d9488" />
            </Link>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            <Pressable className="bg-white rounded-lg p-4 mr-3 flex-row items-center border border-gray-200">
              <Feather
                name="activity"
                size={20}
                color="#0d9488"
                className="mr-3"
              />
              <Text className="text-sm font-medium">Sports Injury</Text>
            </Pressable>
            <Pressable className="bg-white rounded-lg p-4 mr-3 flex-row items-center border border-gray-200">
              <Feather
                name="scissors"
                size={20}
                color="#0d9488"
                className="mr-3"
              />
              <Text className="text-sm font-medium">Post-Surgery</Text>
            </Pressable>
            <Pressable className="bg-white rounded-lg p-4 mr-3 flex-row items-center border border-gray-200">
              <Feather
                name="alert-circle"
                size={20}
                color="#0d9488"
                className="mr-3"
              />
              <Text className="text-sm font-medium">Chronic Pain</Text>
            </Pressable>
            <Pressable className="bg-white rounded-lg p-4 mr-3 flex-row items-center border border-gray-200">
              <Feather name="baby" size={20} color="#0d9488" className="mr-3" />
              <Text className="text-sm font-medium">Pediatric Care</Text>
            </Pressable>
            <Pressable className="bg-white rounded-lg p-4 mr-3 flex-row items-center border border-gray-200">
              <Feather
                name="users"
                size={20}
                color="#0d9488"
                className="mr-3"
              />
              <Text className="text-sm font-medium">Geriatric Care</Text>
            </Pressable>
            <Pressable className="bg-white rounded-lg p-4 mr-3 flex-row items-center border border-gray-200">
              <Feather
                name="activity"
                size={20}
                color="#0d9488"
                className="mr-3"
              />
              <Text className="text-sm font-medium">Neurological Rehab</Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Announcements Section */}
        <View className="mb-6">
          <View className="flex-row items-center mb-3">
            <Feather name="bell" size={20} color="black" className="mr-2" />
            <Text className="text-lg font-bold">Announcements</Text>
          </View>
          {announcements.map((announcement) => (
            <LinearGradient
              key={announcement.id}
              colors={["#dbeafe", "#bfdbfe"]}
              className="rounded-lg p-4 mb-2 flex-row items-center border border-gray-200"
            >
              <Feather
                name={announcement.icon}
                size={20}
                color="#0d9488"
                className="mr-3"
              />
              <View className="flex-1">
                <Text className="text-sm font-medium">
                  {announcement.title}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  {announcement.description}
                </Text>
              </View>
              <Link
                href={announcement.link}
                className="flex-row items-center"
                disabled
              >
                <Text className="text-teal-500 mr-1">Learn More</Text>
                <Feather name="arrow-right" size={16} color="#0d9488" />
              </Link>
            </LinearGradient>
          ))}
        </View>

        {/* Featured Physiotherapists Section */}
        <View>
          <View className="flex-row items-center mb-3">
            <Feather name="user" size={20} color="black" className="mr-2" />
            <Text className="text-lg font-bold">
              Your Featured Physiotherapists
            </Text>
          </View>
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

export default HomeScreen;
