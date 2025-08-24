import React from "react";
import { Tabs } from "expo-router";
import { Tabbar } from "~/components/ui";

const TabLayout = () => {
  return (
    <Tabs
      tabBar={(props) => <Tabbar {...props} />}
      screenOptions={{ headerShown: false, animation: "fade" }}
    />
  );
};

export default TabLayout;
