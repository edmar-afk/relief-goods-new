import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TextInput, View } from "react-native";
import Topbar from "../../components/Topbar";
import ResidentsCard from "../../components/residents/ResidentsCard";
import api from "../../utils/api";
import { useEffect, useState } from "react";

const Residents = () => {
  const [residents, setResidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const res = await api.get("/residents/");
        setResidents(res.data);
      } catch (error) {
        console.error("Error fetching residents:", error);
      }
    };

    fetchResidents();
  }, []);

  const filteredResidents = residents.filter((resident) =>
    `${resident.first_name} ${resident.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 bg-white">
      <Topbar />
      <View className="px-4 flex flex-row justify-between items-center mt-10 mb-4">
        <Text className="font-bold text-lg text-gray-700">Residents</Text>

        <View className="flex-row items-center border border-gray-300 rounded-lg px-2 py-1 w-64">
          <Ionicons name="search" size={18} color="gray" />
          <TextInput
            placeholder="Search Name..."
            className="ml-2 text-sm flex-1"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {filteredResidents.length > 0 ? (
          filteredResidents.map((resident) => (
            <ResidentsCard
              key={resident.id}
              residentId={resident.id}
              name={`${resident.first_name} ${resident.last_name}`}
              username={resident.username}
              purok={resident.profile?.purok}
              address={resident.profile?.address}
              familyMembers={resident.profile?.family_members}
              profilePicture={resident.profile?.profile_picture}
            />
          ))
        ) : (
          <View className="items-center mt-10">
            <Text className="text-gray-500">No residents found by that name</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Residents;
