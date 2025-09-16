import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_INFO_KEY = "userInfo";

export const setUserInfo = async (data) => {
  try {
    await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving userInfo:", error);
  }
};

export const getUserInfo = async () => {
  try {
    const value = await AsyncStorage.getItem(USER_INFO_KEY);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error reading userInfo:", error);
    return null;
  }
};

export const removeUserInfo = async () => {
  try {
    await AsyncStorage.removeItem(USER_INFO_KEY);
  } catch (error) {
    console.error("Error removing userInfo:", error);
  }
};
