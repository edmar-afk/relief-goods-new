import { View, Text, ScrollView, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import Topbar from "../../components/Topbar";
import StorageCard from "../../components/homepage/StorageCard";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";
import AddReliefGoods from "../../components/reliefgoods/AddReliefGoods";

const Transactions = () => {
  const [reliefGoods, setReliefGoods] = useState([]);
  const [search, setSearch] = useState("");

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

  const filteredGoods = reliefGoods.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-white">
      <Topbar />
      <View className="px-4 mt-10">
        <View className="flex flex-row items-center mb-4 justify-between">
          <Text className="font-bold text-lg text-gray-700">
            Relief Goods Lists
          </Text>

          <AddReliefGoods
            onAdd={(newGood) => setReliefGoods([newGood, ...reliefGoods])}
          />
        </View>
        <View className="flex-row items-center border border-gray-300 rounded-lg px-2 py-1 w-full">
          <Ionicons name="search" size={18} color="gray" />
          <TextInput
            placeholder="Search Name..."
            className="ml-2 text-sm flex-1"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="mt-4 space-y-4 px-4">
          {filteredGoods.length > 0 ? (
            filteredGoods.map((item) => (
              <StorageCard
                key={item.id}
                goodsId={item.id}
                title={item.name}
                subtitle={`Claimed by: ${item.claimed_by.length}`}
                date={item.date_issued}
                is_homepage={false}
                onDelete={(deletedId) =>
                  setReliefGoods((prev) =>
                    prev.filter((g) => g.id !== deletedId)
                  )
                }
              />
            ))
          ) : (
            <Text className="text-center text-gray-500 mt-10">
              No relief goods found by that name
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Transactions;
