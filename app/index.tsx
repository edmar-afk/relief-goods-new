import { SafeAreaView } from "react-native";
import "./global.css";
import Welcome from "./Welcome";
export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Welcome />
    </SafeAreaView>
  );
}
