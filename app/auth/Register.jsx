import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

import logo from "../../assets/images/logo.jpg";
import { router } from "expo-router";
import api from "../../utils/api"; // ✅ using your custom api instance

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [purok, setPurok] = useState("1");
  const [address, setAddress] = useState("");
  const [familyMembers, setFamilyMembers] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isPasswordMatch = password !== "" && password === repeatPassword;
  const isMobileValid = /^09\d{9}$/.test(mobileNumber);

  const handleRegister = async () => {
    if (!isPasswordMatch || !isMobileValid) return;
    setLoading(true);
    try {
      const response = await api.post("/register/", {
        username: mobileNumber,
        first_name: fullName,
        last_name: familyMembers,
        password: password,
        profile: {
          purok: purok,
          address: address,
          family_members: familyMembers,
        },
      });
      console.log("✅ Registration success:", response.data);
      alert("Registration successful!");
      router.push("/auth/Login");
    } catch (err) {
      console.log("❌ Registration error:", err.response?.data || err.message);
      alert("Registration failed. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 pt-20">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View className="w-full max-w-md self-center">
            <Image
              source={logo}
              className="h-32 w-32 self-center rounded-full"
            />
            <Text className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </Text>
          </View>

          <View className="mt-8 w-full max-w-md self-center">
            <View className="bg-white py-8 px-6 shadow rounded-lg">
              {/* Full Name */}
              <Text className="text-sm font-medium text-gray-700">
                Full Name
              </Text>
              <TextInput
                placeholder="John Doe"
                value={fullName}
                onChangeText={setFullName}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />

              {/* Mobile Number */}
              <View className="mt-4">
                <Text className="text-sm font-medium text-gray-700">
                  Mobile Number
                </Text>
                <TextInput
                  placeholder="09XXXXXXXXX"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  keyboardType="phone-pad"
                  maxLength={11}
                  className={`mt-1 px-3 py-2 border rounded-md text-sm ${
                    isMobileValid || mobileNumber === ""
                      ? "border-gray-300"
                      : "border-red-500"
                  }`}
                />
                {mobileNumber !== "" && !isMobileValid && (
                  <Text className="text-red-500 text-xs mt-1">
                    Mobile number must start with 09 and be 11 digits long.
                  </Text>
                )}
              </View>

              {/* Purok */}
              <View className="mt-4">
                <Text className="text-sm font-medium text-gray-700">Purok</Text>
                <View className="mt-1 border border-gray-300 rounded-sm">
                  <Picker
                    selectedValue={purok}
                    onValueChange={(val) => setPurok(val)}
                    style={{ color: "#000" }}
                  >
                    <Picker.Item label="Purok 1" value="1" />
                    <Picker.Item label="Purok 2" value="2" />
                    <Picker.Item label="Purok 3" value="3" />
                    <Picker.Item label="Purok 4" value="4" />
                    <Picker.Item label="Purok 5" value="5" />
                  </Picker>
                </View>
              </View>

              {/* Address */}
              <View className="mt-4">
                <Text className="text-sm font-medium text-gray-700">
                  Address
                </Text>
                <TextInput
                  placeholder="Poblacion Bayog, Zamboanga del Sur"
                  value={address}
                  onChangeText={setAddress}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </View>

              {/* Family Members */}
              <View className="mt-4">
                <Text className="text-sm font-medium text-gray-700">
                  Family Members
                </Text>
                <TextInput
                  placeholder="e.g. 4"
                  value={familyMembers}
                  onChangeText={setFamilyMembers}
                  keyboardType="numeric"
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  style={{ color: "#000" }}
                />
              </View>

              {/* Password */}
              <View className="mt-4">
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

              {/* Repeat Password */}
              <View className="mt-4">
                <Text className="text-sm font-medium text-gray-700">
                  Repeat Password
                </Text>
                <TextInput
                  placeholder="********"
                  value={repeatPassword}
                  onChangeText={setRepeatPassword}
                  secureTextEntry
                  className="mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  style={{ color: "#000" }}
                />
                {repeatPassword !== "" && !isPasswordMatch && (
                  <Text className="text-red-500 text-xs mt-1">
                    Passwords do not match
                  </Text>
                )}
              </View>

              {/* Submit */}
              <TouchableOpacity
                disabled={!isPasswordMatch || !isMobileValid || loading}
                onPress={handleRegister}
                className={`mt-6 py-2 rounded-md ${
                  isPasswordMatch && isMobileValid
                    ? "bg-blue-500"
                    : "bg-gray-400"
                }`}
              >
                <Text className="text-center text-white font-medium text-sm">
                  {loading ? "Registering..." : "Register"}
                </Text>
              </TouchableOpacity>

              <View className="flex flex-row items-center mt-4">
                <Text className="text-gray-600 mr-1">
                  Already Have an Account?
                </Text>
                <Text
                  className="font-bold text-blue-700"
                  onPress={() => router.push("/auth/Login")}
                >
                  Login
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
