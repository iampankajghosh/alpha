import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useDispatch, useSelector } from "react-redux";
import checkStoredAuthSession from "~/helpers/checkStoredAuthSession";
import { login, logout } from "~/store/slices/auth.slice";
import Storage from "~/utils/Storage";

// Prevent the splash screen from auto-hiding on app load
SplashScreen.preventAutoHideAsync();

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
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
        setIsReady(true);
        await SplashScreen.hideAsync(); // Hide splash screen only when ready
      }
    };

    prepareApp();
  }, [dispatch]);

  if (!isReady) return null;

  return <Redirect href={isAuthenticated ? "/(root)" : "/(auth)"} />;
};

export default App;
