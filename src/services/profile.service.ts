import api from "../api/axios";

import AsyncStorage
from "@react-native-async-storage/async-storage";

export const getProfile =
  async () => {

    const token =
      await AsyncStorage.getItem(
        "token"
      );

    const response =
      await api.get(
        "/auth/me",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};

export const updateProfile =
  async (data: any) => {

    const token =
      await AsyncStorage.getItem(
        "token"
      );

    const response =
      await api.put(
        "/auth/profile",
        data,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    await AsyncStorage.setItem(
      "user",
      JSON.stringify(
        response.data.data
      )
    );

    return response.data;
};