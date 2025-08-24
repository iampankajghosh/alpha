import { ToastAndroid } from "react-native";

import Storage from "../utils/Storage";
import { PatientData } from "../store/slices/types";
import { fetchCurrentUser } from "~/services/user.service";

/**
 * Checks for a stored patient authentication session and validates it.
 * @returns {Promise<{ patient: PatientData | null }>} The patient data if valid, or null if no valid session exists.
 */
const checkStoredAuthSession = async () => {
  const patient = (await Storage.get("patient")) as PatientData | null;

  if (!patient) {
    return { patient: null };
  }

  try {
    const response = await fetchCurrentUser();

    if (!response) {
      ToastAndroid.show(
        response?.message ?? "Patient not found. Please login again.",
        ToastAndroid.LONG
      );
      return { patient: null };
    }

    return { patient: { ...patient, ...response?.data } };
  } catch (error) {
    console.log("Error:: checkStoredAuthSession: ", error);
    return { patient: null };
  }
};

export default checkStoredAuthSession;
