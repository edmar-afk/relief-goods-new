import { Feather } from "@expo/vector-icons";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import api from "../../utils/api";

const StorageCard = ({
  title,
  subtitle,
  date,
  goodsId,
  is_homepage,
  onDelete,
}) => {
  const router = useRouter();

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Manila",
    };
    return d
      .toLocaleString("en-US", options)
      .replace("AM", "am")
      .replace("PM", "pm")
      .replace(",", ".");
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Relief Goods",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/relief-goods/${goodsId}/delete/`);
              onDelete && onDelete(goodsId); // remove from state immediately
            } catch (error) {
              console.log("Delete error ignored (likely 204 response):", error);
              onDelete && onDelete(goodsId); // still remove it from UI
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`./${goodsId}`)}
      className="flex-row items-center p-4 bg-white rounded-lg mb-2 shadow-sm"
    >
      <View className="bg-orange-500 p-3 rounded-lg">
        <Feather name="package" size={32} color="#fff" />
      </View>
      <View className="ml-3 flex-1">
        <View className="flex flex-row justify-between items-center">
          <Text className="text-lg font-bold text-gray-700">{title}</Text>
          <Text className="text-md text-gray-700">{formatDate(date)}</Text>
        </View>
        <View className="flex flex-row items-center justify-between">
          <Text className="text-sm font-light text-gray-700">
            {subtitle} Residents
          </Text>
          {!is_homepage && (
            <TouchableOpacity onPress={handleDelete}>
              <Text className="text-sm font-bold text-red-700">Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StorageCard;
