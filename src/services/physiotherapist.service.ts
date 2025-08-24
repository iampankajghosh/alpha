import { api } from "./api.config";

export const fetchPhysiotherapists = async () => {
  try {
    const response = await api.get("/partners/physiotherapists");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPhysiotherapistById = async (physioId) => {
  try {
    const response = await api.get(`/user/physiotherapist?id=${physioId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const bookAppointment = async (payload) => {
  try {
    const response = await api.post("/booking/soft", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};


