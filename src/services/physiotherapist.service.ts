import { api } from "./api.config";

export const fetchPhysiotherapists = async () => {
  try {
    const response = await api.get("/partners/physiotherapists");
    return response.data;
  } catch (error) {
    throw error;
  }
};
