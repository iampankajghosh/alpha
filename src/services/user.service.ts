import { api } from "./api.config";
import { PatientNameUpdateData, BookingListResponse, WalletTopUpData, WalletTopUpResponse, TransactionListResponse } from "./types";

export const fetchCurrentUser = async () => {
  try {
    const response = await api.get("/user/current");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates the patient's name
 * @param {PatientNameUpdateData} data - The name update data
 * @returns {Promise<any>} The response data from the API
 */
export const updatePatientName = async (data: PatientNameUpdateData) => {
  try {
    const response = await api.put("/myaccount/name", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Helper function to update patient name with validation
 * @param {string} name - The new name to set
 * @returns {Promise<any>} The response data from the API
 */
export const updatePatientNameHelper = async (name: string) => {
  // Validate name
  if (!name || typeof name !== 'string') {
    throw new Error('Name is required and must be a string');
  }
  
  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    throw new Error('Name must be at least 2 characters long');
  }
  
  if (trimmedName.length > 50) {
    throw new Error('Name must be less than 50 characters');
  }
  
  return updatePatientName({ name: trimmedName });
};

/**
 * Fetches the booking list for the current user
 * @returns {Promise<BookingListResponse>} The booking list response
 */
export const fetchBookingList = async (): Promise<BookingListResponse> => {
  try {
    const response = await api.get("/booking/list");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Top up the wallet with the specified amount
 * @param {WalletTopUpData} data - The top-up amount
 * @returns {Promise<WalletTopUpResponse>} The top-up response
 */
export const topUpWallet = async (data: WalletTopUpData): Promise<WalletTopUpResponse> => {
  try {
    const response = await api.post("/wallet/topup", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches the transaction list for the current user
 * @returns {Promise<TransactionListResponse>} The transaction list response
 */
export const fetchTransactionList = async (): Promise<TransactionListResponse> => {
  try {
    const response = await api.get("/transaction/currentuser");
    return response.data;
  } catch (error) {
    throw error;
  }
};
