import api from "../api/axios";

import AsyncStorage
from "@react-native-async-storage/async-storage";

export const getRentals =
  async () => {

    const token =
      await AsyncStorage.getItem(
        "token"
      );

    const response =
      await api.get(
        "/rentals",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};

export const getRentalById =
  async (id: string) => {

    const token =
      await AsyncStorage.getItem(
        "token"
      );

    const response =
      await api.get(
        `/rentals/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};