import api from "../api/axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const getVehicles =
  async () => {

    const token =
      await AsyncStorage.getItem(
        "token"
      );

    const response = await api.get(
      "/vehicles",
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    return response.data;
};

export const getVehicleById =
  async (id: string) => {

    const token =
      await AsyncStorage.getItem(
        "token"
      );

    const response = await api.get(
      `/vehicles/${id}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    return response.data;
};

export const createVehicle =
  async (data: any) => {

    const token =
      await AsyncStorage.getItem(
        "token"
      );

    const response =
      await api.post(
        "/vehicles",
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

export const updateVehicle =
  async (
    id: number,
    data: any
  ) => {

    const token =
      await AsyncStorage.getItem(
        "token"
      );

    const response =
      await api.put(
        `/vehicles/${id}`,
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

export const deleteVehicle =
  async (id: number) => {

    const token =
      await AsyncStorage.getItem(
        "token"
      );

    const response =
      await api.delete(
        `/vehicles/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};