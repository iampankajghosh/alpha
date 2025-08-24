import { api } from "./api.config";

export const fetchCurrentUser = async () => {
  try {
    const response = await api.get("/user/current");
    return response.data;
  } catch (error) {
    throw error;
  }
};
