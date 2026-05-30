import api from "../api/axios";

import AsyncStorage
from "@react-native-async-storage/async-storage";

const getToken = async () => {

  return await AsyncStorage.getItem(
    "token"
  );
};

export const getPayments =
  async () => {

    const token =
      await getToken();

    const response =
      await api.get(
        "/payments",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};

export const createPayment =
  async (data: any) => {

    const token =
      await getToken();

    const response =
      await api.post(
        "/payments",
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

export const deletePayment =
  async (id: number) => {

    const token =
      await getToken();

    const response =
      await api.delete(
        `/payments/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};

export const updatePayment =
  async (
    id: number,
    data: any
  ) => {

    const token =
      await getToken();

    const response =
      await api.put(
        `/payments/${id}`,
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