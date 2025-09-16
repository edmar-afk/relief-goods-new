import { useState, useEffect } from "react";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import logo from "../../assets/images/logo.jpg";
import api from "../../utils/api";

const ResidentsCard = ({
  residentId,
  name,
  profilePicture,
  hasQrCode,
  onDelete,
}) => {
  const [qrGenerated, setQrGenerated] = useState(Boolean(hasQrCode));
  const [qrUrl, setQrUrl] = useState(hasQrCode || null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const checkQr = async () => {
    try {
      const response = await api.get(`check-qr/${residentId}/`);
      if (response.data.has_qr) {
        setQrGenerated(true);
        setQrUrl(response.data.qr);
      }
    } catch (error) {
      console.log("Failed to check QR:", error);
    }
  };
  checkQr();
}, [residentId]);

  const handleGenerateQr = async () => {
    if (qrGenerated) {
      Alert.alert("Notice", "This resident already has a QR code.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`generate-qr/${residentId}/`);
      if (response.status === 201 || response.status === 200) {
        const qrData = response.data.qr || response.data.qr; // depends on your API
        setQrUrl(qrData);
        setQrGenerated(true);
        Alert.alert("Success", "QR code generated successfully!");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to generate QR code.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowQr = async () => {
    if (!qrUrl) {
      try {
        const response = await api.get(`generate-qr/${residentId}/`);
        setQrUrl(response.data.qr);
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Failed to load QR code.");
        return;
      }
    }
    setModalVisible(true);
  };

  return (
    <View className="w-fit flex-row items-center p-4 bg-white mb-5 shadow-lg mx-3 rounded-lg">
      <Image
        source={profilePicture ? { uri: profilePicture } : logo}
        className="w-20 h-20 rounded-full"
      />

      <View className="flex-1 ml-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-gray-700">{name}</Text>
          <TouchableOpacity onPress={onDelete}>
            <Text className="text-md text-red-500">Delete</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center mt-1">
          {qrGenerated ? (
            <TouchableOpacity onPress={handleShowQr}>
              <Text className="text-sm font-light text-green-500">
                QR code issued (Tap to view)
              </Text>
            </TouchableOpacity>
          ) : (
            <Text className="text-sm font-light text-gray-700">
              No QR code Generated
            </Text>
          )}
          {!qrGenerated && (
            <TouchableOpacity onPress={handleGenerateQr} disabled={loading}>
              <Text
                className={`text-sm font-light ${loading ? "text-gray-400" : "text-blue-500"}`}
              >
                {loading ? "Generating..." : "Generate QR"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg items-center">
            {qrUrl && (
              <Image
                source={{ uri: qrUrl }}
                className="w-64 h-64"
                resizeMode="contain"
              />
            )}
            <TouchableOpacity
              className="mt-4 px-4 py-2 bg-blue-500 rounded"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ResidentsCard;
