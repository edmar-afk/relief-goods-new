import { Text, View, ScrollView, Pressable } from "react-native";
import ResidentsCard from "./ResidentsCard";
import { useRouter } from "expo-router";
import api from "../../utils/api";
import React, { useEffect, useState } from "react";

const Upcoming = () => {
  const router = useRouter();
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await api.get("/users/"); // your endpoint for all users
        setResidents(response.data);
      } catch (error) {
        console.error("Error fetching residents:", error);
      }
    };

    fetchResidents();
  }, []);

  return (
    <>
      <View className="px-4 mt-12 flex flex-row items-center justify-between">
        <Text className="font-bold text-lg text-gray-700">
          New Registered Residents
        </Text>
        <Pressable onPress={() => router.push("/screens/Residents")}>
          <Text className="text-blue-600 font-semibold">See More</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pt-4 mx-4 flex-row"
      >
        {residents.map((resident) => (
          <ResidentsCard
            key={resident.id}
            name={`${resident.first_name} ${resident.last_name}`}
            username={resident.username}
            purok={resident.profile?.purok || "-"}
            address={resident.profile?.address || "-"}
            profilePicture={resident.profile?.profile_picture}
            familyMembers={resident.profile?.family_members || 0}
          />
        ))}
      </ScrollView>
    </>
  );
};

export default Upcoming;
