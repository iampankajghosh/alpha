import axios from "axios";
import { router } from "expo-router";

import Storage from "~/utils/Storage";
import store from "~/store/store";
import { logout } from "~/store/slices/auth.slice";
import config from "~/config/config";
import { forceLogout } from "~/utils/auth";

// Create an Axios instance with base config
export const api = axios.create({
  baseURL: config.backendUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor: Attach Bearer token and log requests in development mode.
 */
api.interceptors.request.use(async (config) => {
  const patient = (await Storage.get("patient")) as {
    token: string;
  } | null;

  if (patient?.token) {
    config.headers.Authorization = `Bearer ${patient.token}`;
  }

  // Log request details in development mode
  if (__DEV__) {
    console.log("[API REQUEST]", {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
    });
  }

  return config;
});

/**
 * Response Interceptor: Handle 401/403 responses and log responses in development mode.
 */
api.interceptors.response.use(
  (response) => {
    // Log response details in development mode
    if (__DEV__) {
      console.log("[API RESPONSE]", {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  async (error) => {
    // Handle authentication errors
    if ([401, 403].includes(error?.response?.status)) {
      console.log("[API] Authentication error detected, logging out user");
      
      // Use the utility function for consistent logout handling
      await forceLogout();
    }

    // Log error details in development mode
    if (__DEV__) {
      console.log("[API ERROR]", {
        url: error?.config?.url,
        status: error?.response?.status,
        message: error.message,
        response: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);
