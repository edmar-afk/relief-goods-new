import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Text, View, Pressable, Image } from "react-native";
import { router } from "expo-router";
import Header from "./homepage/Header";
import logo from "../assets/images/logo.jpg";
import { getUserInfo } from "../utils/storage";
import React, { useEffect, useState } from "react";

const Topbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getUserInfo();
      setUser(storedUser);
    };
    loadUser();
  }, []);

  const headerPaddingClass = user?.is_superuser ? "pb-4 justify-between" : "-pb-16 justify-center";
  const logoPadding = user?.is_superuser ? "mt-12 -mb-12" : "mt-4 -mb-6";
  return (
    <View className="w-full z-50">
      <View className="bg-orange-500 pt-20">
        <Header />
      </View>
      <View
        className={`bg-orange-500 px-8 flex flex-row items-center ${headerPaddingClass}`}
      >
        {user?.is_superuser ? (
          <>
            <Pressable
              onPress={() => router.push("/screens/Homepage")}
              className="items-center"
            >
              <MaterialIcons name="home" size={27} color="white" />
              <Text className="text-white text-xs">Home</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/screens/Residents")}
              className="items-center"
            >
              <Ionicons name="people" size={27} color="white" />
              <Text className="text-white text-xs">Residents</Text>
            </Pressable>

            <View className="items-center bg-orange-500 p-2 rounded-full mt-12 -mb-12">
              <Image source={logo} className="w-14 h-14 rounded-full" />
            </View>

            <Pressable
              onPress={() => router.push("/screens/Profile")}
              className="items-center"
            >
              <Ionicons name="person" size={24} color="white" />
              <Text className="text-white text-xs">Profile</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/screens/Transactions")}
              className="items-center mt-1.5"
            >
              <FontAwesome5 name="box" size={20} color="white" />
              <Text className="text-white text-xs">Transactions</Text>
            </Pressable>
          </>
        ) : (
          <View className={`items-center bg-orange-500 p-2 rounded-full ${logoPadding}`}>
            <Image source={logo} className="w-14 h-14 rounded-full" />
          </View>
        )}
      </View>
    </View>
  );
};

export default Topbar;
