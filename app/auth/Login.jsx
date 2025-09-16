import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/api"; // ✅ import centralized api
import logo from "../../assets/images/logo.jpg";

const Login = () => {
  const [username, setUsername] = useState(""); // number username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in both username and password");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/login/", {
        username: username,
        password: password,
      });

      await AsyncStorage.setItem("userInfo", JSON.stringify(data));
      Alert.alert("Success", "Login successful!");

      if (data.is_superuser) {
        router.push("/screens/Homepage");
      } else {
        router.push("/screens/Profile");
      }
    } catch (error) {
      if (error.response) {
        Alert.alert(
          "Error",
          error.response.data.detail || "Invalid credentials"
        );
      } else {
        Alert.alert("Error", "Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 py-44">
      <ScrollView>
        <View className="w-full max-w-md self-center">
          <Image source={logo} className="h-32 w-32 self-center rounded-full" />
          <Text className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </Text>
        </View>

        <View className="mt-8 w-full max-w-md self-center">
          <View className="bg-white py-8 px-6 shadow rounded-lg">
            <View>
              <Text className="text-sm font-medium text-gray-700">
                Mobile Number
              </Text>
              <TextInput
                placeholder="09XXXXXXXXX"
                value={username}
                onChangeText={setUsername}
                keyboardType="numeric"
                autoCapitalize="none"
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </View>

            <View className="mt-6">
              <Text className="text-sm font-medium text-gray-700">
                Password
              </Text>
              <TextInput
                placeholder="********"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                style={{ color: "#000" }}
              />
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className={`mt-6 py-2 rounded-md ${
                loading ? "bg-gray-400" : "bg-blue-500"
              }`}
            >
              <Text className="text-center text-white font-medium text-sm">
                {loading ? "Signing in..." : "Sign in"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-2 text-gray-400 text-sm">OR</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            <TouchableOpacity
              onPress={() => router.push("/auth/Register")}
              className="border border-blue-500 py-2 rounded-md"
            >
              <Text className="text-center text-blue-500 font-medium text-sm">
                Create a new account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
