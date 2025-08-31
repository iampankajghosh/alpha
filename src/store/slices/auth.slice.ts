import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PatientData } from "./types";

// Initial state for authentication slice
const initialState = {
  isAuthenticated: false,
  patient: null as PatientData | null,
  isLoading: false,
  error: null as string | null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Sets loading state for authentication operations
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null; // Clear error when starting new operation
      }
    },

    /**
     * Sets error message
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    /**
     * Logs the patient in by setting the patient data and updating authentication status
     * @param {PatientData} action.payload - The patient data to authenticate
     */
    login: (state, action: PayloadAction<PatientData>) => {
      state.patient = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    /**
     * Updates patient data
     */
    updatePatient: (state, action: PayloadAction<Partial<PatientData>>) => {
      if (state.patient) {
        state.patient = { ...state.patient, ...action.payload };
      }
    },

    /**
     * Logs the patient out by resetting authentication data
     */
    logout: (state) => {
      // Reset to initial state
      state.patient = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      // Note: isInitialized remains true to prevent re-initialization
    },

    /**
     * Marks the auth state as initialized (after checking stored session)
     */
    setInitialized: (state) => {
      state.isInitialized = true;
    },

    /**
     * Clears any error messages
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Completely resets the auth state (for force logout scenarios)
     */
    resetAuth: (state) => {
      return initialState;
    },
  },
});

export default authSlice.reducer;
export const { 
  login, 
  updatePatient, 
  logout, 
  setLoading, 
  setError, 
  setInitialized,
  clearError,
  resetAuth
} = authSlice.actions;
