/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Axios, { AxiosRequestConfig } from "axios";
import { notifications } from "@mantine/notifications";
import { API_URL } from "@/config/env";
import storage from "@/utils/storage";

function authRequestInterceptor(config: AxiosRequestConfig) {
  const token = storage.getToken();
  if (token) {
    // @ts-ignore
    config.headers.authorization = `${token}`;
  }
  // @ts-ignore
  config.headers.Accept = "application/json";

  return config as any;
}

export const axios = Axios.create({
  baseURL: API_URL,
});

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    notifications.show({
      message,
      title: "Erro!",
      color: "red",
    });

    return Promise.reject(error);
  }
);
