import axios from "axios";

import Storage from "~/utils/Storage";
import store from "~/store/store";
import { logout } from "~/store/slices/auth.slice";
import config from "~/config/config";

// Create an Axios instance with base config
export const api = axios.create({
  baseURL: config.backendUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor: Attach Bearer token from stored user session.
 */
api.interceptors.request.use(async (config) => {
  const patient = (await Storage.get("patient")) as {
    token: string;
  } | null;

  if (patient) {
    config.headers.Authorization = `Bearer ${patient?.token}`;
  }

  return config;
});

/**
 * Response Interceptor: Handle 401 and 403 Invalid token responses by logging out the user.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if ([401, 403].includes(error?.response?.status)) {
      await Storage.remove("patient");
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);

/**
 * Request Logger: Log request details in development mode.
 */
api.interceptors.request.use((request) => {
  if (__DEV__) {
    console.log("[API REQUEST]", {
      url: request.url,
      method: request.method,
      data: request.data,
      headers: request.headers,
    });
  }
  return request;
});

/**
 * Response Interceptor: Log responses in development mode.
 */
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log("[API RESPONSE]", {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },

  /**
   * Error Handler: Logs API errors for debugging.
   */
  (error) => {
    if (__DEV__) {
      console.log("[API ERROR]", {
        url: error?.config?.url,
        message: error.message,
        response: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);
