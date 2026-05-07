import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const chatApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_CHAT_API_URL,
  timeout: 120000,
});

chatApi.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default chatApi;