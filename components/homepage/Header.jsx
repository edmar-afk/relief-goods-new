import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
// import { getUserInfo, removeUserInfo } from "../../utils/storage";

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = 'await getUserInfo();'
      //console.log("Loaded userInfo from storage:", storedUser); // ✅ see what we get
      setUser(storedUser);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await removeUserInfo();
    //console.log("User logged out, storage cleared ✅");
    router.push("/auth/Login");
  };

  const displayName =
    user?.first_name?.trim()
      ? user.first_name + (user.last_name ? " " + user.last_name : "")
      : user?.username;

  return (
    <View className="px-4 flex flex-row justify-between">
      <Text className="text-white font-bold">
        {displayName ? `Welcome, ${displayName}` : "Welcome, Guest"}
      </Text>
      <Pressable onPress={handleLogout}>
        <Text className="text-white font-semibold">Logout</Text>
      </Pressable>
    </View>
  );
};

export default Header;
