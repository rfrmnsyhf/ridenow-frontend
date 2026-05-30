import api from "../api/axios";

import AsyncStorage
from "@react-native-async-storage/async-storage";

export const getDashboardStats =
  async () => {

    const token =
      await AsyncStorage.getItem(
        "token"
      );

    const response =
      await api.get(
        "/dashboard",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};