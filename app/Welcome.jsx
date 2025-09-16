import { Image, Pressable, SafeAreaView, Text, View } from "react-native";
import { router } from "expo-router";
import welcomebg from "../assets/images/welcome.png";

const Welcome = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Image
          source={welcomebg}
          className="w-full h-64 mb-6"
          resizeMode="cover"
        />
        <View className="bg-white/70 p-4 rounded-2xl px-12">
          <Text className="text-4xl font-bold text-red-900 text-center">
            Welcome to Relief Goods Tracker!
          </Text>
          <Text className="text-base text-gray-700 mt-2 text-center">
            Stay updated and informed on the distribution of relief goods in
            Poblacion Bayog Zamboanga del Sur.
          </Text>
        </View>
      </View>

      <View className="p-4">
        <Pressable
          onPress={() => router.push("/auth/Login")}
          className="w-full bg-red-900 py-3 rounded-xl"
        >
          <Text className="text-center text-white text-lg font-bold">
            Login
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
