import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";

/**
 * Check if the device has internet connectivity
 */
export const checkInternetConnectivity = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable;
  } catch (error) {
    console.error("Error checking internet connectivity:", error);
    return false;
  }
};

/**
 * Show network connectivity status
 */
export const showNetworkStatus = async () => {
  try {
    const state = await NetInfo.fetch();
    const isConnected = state.isConnected;
    const isInternetReachable = state.isInternetReachable;
    const connectionType = state.type;

    Alert.alert(
      "Network Status",
      `Connected: ${isConnected}\nInternet Reachable: ${isInternetReachable}\nType: ${connectionType}`,
      [{ text: "OK" }]
    );
  } catch (error) {
    console.error("Error getting network status:", error);
    Alert.alert("Network Status", "Unable to get network status", [
      { text: "OK" },
    ]);
  }
};

/**
 * Test API connectivity by making a simple request
 */
export const testApiConnectivity = async (apiUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.ok;
  } catch (error) {
    console.error("API connectivity test failed:", error);
    return false;
  }
};
