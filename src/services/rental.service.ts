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

export const updateRentalStatus =
  async (
    id: number,
    status: string
  ) => {

    const token =
      await AsyncStorage.getItem(
        "token"
      );

    const response =
      await api.put(

        `/rentals/${id}`,

        { status },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};

export const deleteRental =
  async (id: number) => {

    const token =
      await AsyncStorage.getItem(
        "token"
      );

    const response =
      await api.delete(

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