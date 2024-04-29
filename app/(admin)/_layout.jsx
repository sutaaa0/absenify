import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { icons } from "../../constants";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image source={icon} resizeMode="contain" tintColor={color} className="w-6 h-6" />
      <Text className={`${focused ? "font-psemibold text-white" : "font-pregular"} text-xs`} style={{ color: "#fefefe" }}>
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#3636e0",
          tabBarInactiveTintColor: "#cdcde0",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="all"
          options={{
            title: "All",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => <TabIcon icon={icons.home} color={color} name="All" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: "Users",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => <TabIcon icon={icons.profile} color={color} name="Users" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="profileAdmin"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => <TabIcon icon={icons.izin} color={color} name="Profile" focused={focused} />,
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
