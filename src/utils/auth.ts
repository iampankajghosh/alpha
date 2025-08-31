import { ToastAndroid } from "react-native";
import { router } from "expo-router";
import Storage from "./Storage";
import { logout, resetAuth } from "~/store/slices/auth.slice";
import store from "~/store/store";
import { logoutPatient } from "~/services/auth.service";

/**
 * Handles user logout by clearing all data and redirecting to signin screen
 * @param showMessage - Whether to show a success message (default: true)
 * @param redirect - Whether to redirect to signin screen (default: true)
 */
export const handleLogout = async (
  showMessage: boolean = true,
  redirect: boolean = true
) => {
  try {
    // Try to call logout API (but don't fail if it doesn't work)
    try {
      const response = await logoutPatient();
      if (!response?.success) {
        console.warn("Logout API failed:", response?.message);
      }
    } catch (apiError) {
      console.warn("Logout API error:", apiError);
    }

    // Clear all storage
    await Storage.remove("patient");
    await Storage.remove("token");
    await Storage.remove("user");
    await Storage.remove("auth");

    // Clear Redux state
    store.dispatch(logout());

    // Show success message if requested
    if (showMessage) {
      ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT);
    }

    // Redirect to signin screen if requested
    if (redirect) {
      try {
        router.replace("/(auth)/signin");
      } catch (redirectError) {
        console.error("Error redirecting to signin:", redirectError);
      }
    }
  } catch (error) {
    console.error("Error in handleLogout:", error);
    ToastAndroid.show(
      "Unable to log out. Please check your connection or try again later.",
      ToastAndroid.LONG
    );
  }
};

/**
 * Clears all authentication data without calling logout API
 * Used for force logout scenarios like 401/403 errors
 */
export const forceLogout = async () => {
  try {
    // Clear all storage
    await Storage.remove("patient");
    await Storage.remove("token");
    await Storage.remove("user");
    await Storage.remove("auth");

    // Completely reset Redux state
    store.dispatch(resetAuth());

    // Redirect to signin screen
    try {
      router.replace("/(auth)/signin");
    } catch (redirectError) {
      console.error("Error redirecting to signin:", redirectError);
    }
  } catch (error) {
    console.error("Error in forceLogout:", error);
  }
};
