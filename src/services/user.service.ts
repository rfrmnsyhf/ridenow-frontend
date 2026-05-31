import api from "../api/axios";

import AsyncStorage
from "@react-native-async-storage/async-storage";

export const getUsers =
  async () => {

    const token =
      await AsyncStorage.getItem(
        "token"
      );

    const response =
      await api.get(

        "/users",

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};

export const deleteUser =
  async (id: number) => {

    const token =
      await AsyncStorage.getItem(
        "token"
      );

    const response =
      await api.delete(

        `/users/${id}`,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};