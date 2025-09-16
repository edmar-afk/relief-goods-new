import { View, Text, Image, Pressable } from "react-native";
import React from "react";

const Greetings = () => {
  return (
    <Pressable className="mx-4 flex flex-row items-center bg-white border border-gray-200 rounded-lg shadow-sm">
      <Image
        source={{ uri: "https://flowbite.com/docs/images/blog/image-4.jpg" }}
        className="object-cover w-44 h-44 rounded-t-lg "
      />
      <View className="flex flex-col justify-between p-4 leading-normal">
        <Text className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          Good morning!
        </Text>
        <Text className="mb-3 font-normal text-gray-700">
          Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
        </Text>
      </View>
    </Pressable>
  );
};

export default Greetings;
