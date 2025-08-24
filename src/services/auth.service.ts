import { api } from "./api.config";
import { PatientLoginFormData, PatientRegisterFormData } from "./types";

/**
 * Authenticates the patient and logs them in with the provided login credentials.
 * @param {PatientLoginFormData} data - The login credentials for the patient.
 * @returns {Promise<any>} The response data from the API.
 */
export const authenticatePatient = async (data: PatientLoginFormData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

/**
 * Registers a new patient with the provided registration data.
 * Constructs payload based on whether the identifier is a phone number (digits only) or email.
 * @param {PatientRegisterFormData} data - The registration data with a single identifier field.
 * @returns {Promise<any>} The response data from the API.
 * @throws {Error} If identifier is missing or invalid.
 */
export const registerPatient = async (data: PatientRegisterFormData) => {
  const { identifier, password } = data;

  // Validate that identifier is provided
  if (!identifier) {
    throw new Error("Identifier (phone or email) is required.");
  }

  // Determine if identifier is an email or phone number
  const isEmail = identifier.includes("@") && identifier.includes(".");
  const isPhone = /^\d+$/.test(identifier);

  // Validate that identifier is either a valid email or phone number
  if (!isEmail && !isPhone) {
    throw new Error(
      "Identifier must be a valid email or a phone number containing only digits."
    );
  }

  // Construct payload based on identifier type
  const payload = {
    ...(isEmail ? { email: identifier } : { phone: `+91${identifier}` }),
    password,
    role: "patient",
  };

  const response = await api.post("/auth/signup", payload);
  return response.data;
};

/**
 * Logs out the patient.
 * @returns {Promise<any>} The response data from the API.
 */
export const logoutPatient = async () => {
  const response = await api.get("/auth/logout");
  return response.data;
};

/**
 * Fetches the patient data by the specified patient ID.
 * @param {string} patientId - The unique identifier for the patient.
 * @returns {Promise<any>} The response data from the API containing the patient's data.
 */
export const fetchCurrentUser = async () => {
  const response = await api.get("/user/current");
  return response.data;
};
