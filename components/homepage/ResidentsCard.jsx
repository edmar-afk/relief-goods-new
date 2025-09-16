import { Image, Text, View } from "react-native";
import logo from "../../assets/images/logo.jpg";

const ResidentsCard = ({ name, profilePicture, familyMembers }) => {
  return (
    <View className="bg-gray-200 p-4 w-[150px] items-center rounded-lg h-48 mr-3 shadow-lg">
      <Image
        source={profilePicture ? { uri: profilePicture } : logo}
        className="w-[100px] h-[100px] rounded-full mb-2"
      />
      <Text className="text-gray-800 font-bold text-center">{name}</Text>
      <Text className="text-gray-800 text-center text-xs">{familyMembers} Family Members</Text>
    </View>
  );
};

export default ResidentsCard;
