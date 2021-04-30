// import { AsyncStorage } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, data);
  } catch (error) {
    console.log(error);
  }
};

export const retrieveData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.log(error);
  }
};
