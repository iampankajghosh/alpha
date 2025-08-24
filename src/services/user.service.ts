import { api } from "./api.config";
import { PatientNameUpdateData, BookingListResponse } from "./types";

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
