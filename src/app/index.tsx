import React, { useEffect } from "react";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import checkStoredAuthSession from "~/helpers/checkStoredAuthSession";
import { login, logout, setInitialized } from "~/store/slices/auth.slice";
import Storage from "~/utils/Storage";
import { checkInternetConnectivity } from "~/utils/network";

// Prevent the splash screen from auto-hiding on app load
SplashScreen.preventAutoHideAsync();

const App = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Check network connectivity first
        const isConnected = await checkInternetConnectivity();
        console.log("[APP] Network connectivity:", isConnected);

        if (!isConnected) {
          console.warn("[APP] No internet connectivity detected");
        }

        const res = await checkStoredAuthSession();

        if (!res?.patient) {
          dispatch(logout());
          await Storage.remove("patient");
        } else {
          dispatch(login(res.patient));
          await Storage.set("patient", res.patient);
        }
      } catch (e) {
        console.error("Auth check failed:", e);
        dispatch(logout());
      } finally {
        dispatch(setInitialized());
        await SplashScreen.hideAsync(); // Hide splash screen only when ready
      }
    };

    prepareApp();
  }, [dispatch]);

  // Show loading until auth state is initialized
  if (!isInitialized) return null;

  return <Redirect href={isAuthenticated ? "/(root)" : "/(auth)/signin"} />;
};

export default App;
