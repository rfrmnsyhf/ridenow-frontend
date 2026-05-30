import api from "../api/axios";

import AsyncStorage
from "@react-native-async-storage/async-storage";

export const createBooking =
  async (data: any) => {

    const token =
      await AsyncStorage.getItem(
        "token"
      );

    const response =
      await api.post(
        "/rentals",
        data,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};