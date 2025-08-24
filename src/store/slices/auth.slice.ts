import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PatientData } from "./types";

// Initial state for authentication slice
const initialState = {
  isAuthenticated: false,
  patient: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Logs the patient in by setting the patient data and updating authentication status
     * @param {PatientData} action.payload - The patient data to authenticate
     */
    login: (state, action: PayloadAction<PatientData>) => {
      state.patient = action.payload;
      state.isAuthenticated = true;
    },

    updatePatient: (state, action) => {
      state.patient = { ...state.patient, ...action.payload };
    },

    /**
     * Logs the patient out by resetting authentication data
     */
    logout: (state) => {
      state.patient = null;
      state.isAuthenticated = false;
    },
  },
});

export default authSlice.reducer;
export const { login, updatePatient, logout } = authSlice.actions;
