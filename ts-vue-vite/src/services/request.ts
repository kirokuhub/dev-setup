import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const TIMEOUT = 30 * 1000;

export default function request(options: AxiosRequestConfig) {
  const headers = {
    "Content-Type": "application/json",
  };
  return new Promise((resolve, reject) => {
    const args = {
      headers,
      timeout: TIMEOUT * 1,
    };
    const instance = axios.create(args);
    instance.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error),
    );
    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => Promise.reject(error),
    );
    instance(options)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
