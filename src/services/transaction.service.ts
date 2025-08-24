import { api } from "./api.config";

export const fetchTransactions = async () => {
  try {
    const response = await api.get(`/transaction/currentuser`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
