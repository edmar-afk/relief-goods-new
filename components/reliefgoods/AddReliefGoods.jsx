import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import api from "../../utils/api";

const AddReliefGoods = ({ onAdd }) => {
  // ✅ receive onAdd as a prop
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddReliefGoods = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const response = await api.post("/relief-goods/", { name });
      if (onAdd) onAdd(response.data); // ✅ update parent list
      setName("");
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TouchableOpacity
        className="flex-row items-center"
        onPress={() => setModalVisible(true)}
      >
        <Feather name="plus-circle" size={20} color="blue" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-lg font-bold mb-4">Add Relief Good</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded mb-4"
              placeholder="Enter relief good name"
              value={name}
              onChangeText={setName}
            />
            <View className="flex-row justify-end">
              <TouchableOpacity
                className="mr-2 p-2"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-gray-600">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 p-2 rounded"
                onPress={handleAddReliefGoods}
                disabled={loading}
              >
                <Text className="text-white">
                  {loading ? "Adding..." : "Add"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddReliefGoods;
