import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Topbar from "../../components/Topbar";
import logo from "../../assets/images/logo.jpg";
// import { getUserInfo } from "../../utils/storage";
import api from "../../utils/api";
import React, { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = async () => {
    try {
      const storedUser = 'sample';
      if (storedUser?.id) {
        const res = await api.get(`/profile/${storedUser.id}/`);
        setUser(res.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUploadProfilePic = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please allow access to your gallery."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled) return;

      const storedUser = await getUserInfo();
      const formData = new FormData();
      formData.append("profile_picture", {
        uri: result.assets[0].uri,
        name: "profile.jpg",
        type: "image/jpeg",
      });

      setUploading(true);

      await api.put(`/profile/${storedUser.id}/upload-picture/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Success", "Profile picture updated!");
      fetchProfile();
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-200">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-200">
        <Text className="text-gray-700">No profile data found</Text>
      </View>
    );
  }

  return (
    <>
      <Topbar />
      <ScrollView className="flex-1 bg-gray-200 h-screen">
        <View className="w-full pt-12 mx-auto bg-white h-screen rounded-lg overflow-hidden ">
          <View className="px-4 pb-6">
            <View className="text-center my-4">
              <Image
                className="h-32 w-32 rounded-full border-4 border-white mx-auto my-4"
                source={
                  user.profile?.profile_picture
                    ? { uri: user.profile.profile_picture }
                    : logo
                }
              />

              <TouchableOpacity
                onPress={handleUploadProfilePic}
                disabled={uploading}
                className="bg-blue-600 px-4 py-2 rounded-full mx-auto "
              >
                <Text className="text-white font-bold text-xs">
                  {uploading ? "Uploading..." : "Upload Profile Picture"}
                </Text>
              </TouchableOpacity>

              <View className="py-2">
                <Text className="text-center font-bold text-2xl text-gray-800 mb-1">
                  {user.first_name}
                </Text>
                <View className="flex-row items-center justify-center text-gray-700">
                  <Ionicons
                    name="location-sharp"
                    size={20}
                    color="#9ca3af"
                    style={{ marginRight: 4 }}
                  />
                  <Text className="text-gray-700">
                    {user.profile?.address || "No address"}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row gap-2 px-2">
              <TouchableOpacity className="flex-1 rounded-full bg-blue-600">
                <Text className="text-white text-center font-bold py-2">
                  {user.profile?.family_members || 0} Family Members
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 rounded-full border-2 border-gray-400">
                <Text className="text-black text-center font-semibold py-2">
                  {user.username}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="px-4 py-4 items-center">
            {user.qr_code ? (
              <>
                <Image
                  source={{ uri: user.qr_code }}
                  className="w-96 h-96"
                  resizeMode="contain"
                />
                <TouchableOpacity
                  className="mt-4 bg-blue-600 px-6 py-3 rounded-full"
                  onPress={async () => {
                    try {
                      const { status } =
                        await MediaLibrary.requestPermissionsAsync();
                      if (status !== "granted") {
                        Alert.alert(
                          "Permission required",
                          "Please allow media access."
                        );
                        return;
                      }

                      const fileUri =
                        FileSystem.documentDirectory + "qr_code.jpg";
                      const downloadResumable = await FileSystem.downloadAsync(
                        user.qr_code,
                        fileUri
                      );

                      await MediaLibrary.saveToLibraryAsync(
                        downloadResumable.uri
                      );
                      Alert.alert(
                        "Success",
                        "QR Code has been saved to your gallery!"
                      );
                    } catch (err) {
                      console.error(err);
                      Alert.alert("Error", "Failed to download QR Code.");
                    }
                  }}
                >
                  <Text className="text-white font-bold text-center">
                    Download QR Code
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text className="text-gray-500 text-lg text-center">
                No code has been issued
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
