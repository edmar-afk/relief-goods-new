import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import Upcoming from "../../components/homepage/Upcoming";
import StorageCard from "../../components/homepage/StorageCard";
import api from "../../utils/api";

const Homepage = () => {
  const router = useRouter();
  const [reliefGoods, setReliefGoods] = useState([]);

  useEffect(() => {
    const fetchReliefGoods = async () => {
      try {
        const response = await api.get("/relief-goods/");
        setReliefGoods(response.data);
      } catch (error) {
        console.error("Error fetching relief goods:", error);
      }
    };

    fetchReliefGoods();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <Topbar />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Upcoming />
        <View className="flex flex-row items-center justify-between px-8">
          <Text className="text-gray-700 font-bold text-xl py-8">
            Distribution Lists
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/screens/Transactions")}
          >
            <Text className="text-blue-600 font-semibold">View More</Text>
          </TouchableOpacity>
        </View>
        <View className="space-y-4 px-4">
          {reliefGoods.length > 0 ? (
            reliefGoods.map((item) => (
              <StorageCard
                key={item.id}
                goodsId={item.id}
                title={item.name}
                subtitle={`Claimed by: ${item.claimed_by.length}`}
                date={item.date_issued}
                is_homepage={true}
              />
            ))
          ) : (
            <Text className="text-center text-gray-500 mt-10">
              No relief goods stored
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Homepage;
