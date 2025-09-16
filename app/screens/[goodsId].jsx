import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  Button,
  Alert,
  FlatList,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import api from "../../utils/api";
import Topbar from "../../components/Topbar";
import logo from "../../assets/images/logo.jpg";
const GoodsDetails = () => {
  const { goodsId } = useLocalSearchParams();
  const [goods, setGoods] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [scannedId, setScannedId] = useState(null);

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
    const formatted = d.toLocaleString("en-US", options);
    return formatted.replace("AM", "am").replace("PM", "pm").replace(",", ".");
  };

  const fetchGoods = async () => {
    try {
      const res = await api.get(`/relief-goods/${goodsId}/`);
      setGoods(res.data);
    } catch (error) {
      console.log("Error fetching goods:", error);
    } finally {
      setLoading(false);
    }
  };

  const claimReliefGoods = async (userIdFromQR) => {
    if (!goodsId || claiming) return;
    try {
      setClaiming(true);
      await api.post(`/reliefgoods/${goodsId}/claim/`, {
        user_id: userIdFromQR,
      });
      await fetchGoods();
      Alert.alert("✅ Success", "Relief goods successfully claimed!");
    } catch (error) {
      const msg =
        error.response?.data?.detail ||
        "Something went wrong while claiming goods.";
      Alert.alert("⚠️ This Resident Already Claimed the Relief Goods");

      //console.log("Error claiming goods:", error.response?.data || error);
    } finally {
      setClaiming(false);
      setScanning(true);
    }
  };

  const handleScan = ({ data }) => {
    if (!scanning) return;
    setScanning(false);

    //console.log("📷 Raw QR Data:", data); // <-- log full QR content

    let userId = null;
    const match = data.match(/User ID:\s*(\d+)/);
    if (match) {
      userId = match[1];
    }
    if (!match && /^\d+$/.test(data)) {
      userId = data;
    }

    if (userId) {
      //console.log("✅ Extracted User ID:", userId); // <-- log extracted ID
      setScannedId(userId);
      setTimeout(() => {
        claimReliefGoods(userId);
      }, 5000);
    } else {
      console.log("⚠️ No valid User ID found in QR"); // <-- log parsing issue
      Alert.alert("⚠️ Invalid QR", "Could not extract user ID from QR code.");
      setScanning(true);
    }
  };

  useEffect(() => {
    if (goodsId) fetchGoods();
  }, [goodsId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!goods) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No goods found</Text>
      </View>
    );
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="mb-4">We need your permission to use the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <>
      <Topbar />
      <View>
        <View className="px-4 mt-8">
          <Text className="text-2xl font-bold text-gray-800">{goods.name}</Text>
        </View>
        <SafeAreaView className="items-center justify-center mt-8">
          {Platform.OS === "android" ? <StatusBar hidden /> : null}

          <CameraView
            style={{ width: "100%", height: 300 }}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={handleScan}
          />
        </SafeAreaView>
        <View className="p-4">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-gray-600 mt-2">
              Claimed by:{" "}
              <Text className="font-bold">{goods.claimed_by.length}</Text>{" "}
              residents
            </Text>
            <Text className="text-gray-600 mt-2">
              Issued: {formatDate(goods.date_issued)}
            </Text>
          </View>
        </View>
        <View className="mt-4">
          <FlatList
            data={goods.claimed_by}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="mb-3 flex-row items-center bg-white shadow-sm p-4">
                <Image
                  source={
                    item.profile?.profile_picture
                      ? { uri: item.profile.profile_picture }
                      : logo
                  }
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    marginRight: 10,
                  }}
                />
                <View>
                  <Text className="text-gray-800 font-bold">
                    {item.first_name}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Purok: {item.profile?.purok}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Address: {item.profile?.address}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Family Members: {item.profile?.family_members}
                  </Text>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-gray-500 text-center mt-24">No residents yet</Text>
            }
          />
        </View>
      </View>
    </>
  );
};

export default GoodsDetails;
