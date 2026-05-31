import {
  Tabs,
} from "expo-router";

import {
  Ionicons,
} from "@expo/vector-icons";

export default function
AdminTabsLayout() {

  return (

    <Tabs

      screenOptions={{

        headerShown: false,

        tabBarStyle: {

          height: 74,

          paddingTop: 10,
          paddingBottom: 10,

          borderTopWidth: 1,

          borderTopColor:
            "#E5E7EB",
        },

        tabBarActiveTintColor:
          "#2563EB",

        tabBarInactiveTintColor:
          "#94A3B8",

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >

      <Tabs.Screen
        name="index"

        options={{

          title: "Home",

          tabBarIcon:
            ({ color, size }) => (

              <Ionicons
                name="grid"
                size={size}
                color={color}
              />

            ),
        }}
      />

      <Tabs.Screen
        name="vehicles"

        options={{

          title: "Vehicles",

          tabBarIcon:
            ({ color, size }) => (

              <Ionicons
                name="car"
                size={size}
                color={color}
              />

            ),
        }}
      />

      <Tabs.Screen
        name="rentals"

        options={{

          title: "Rentals",

          tabBarIcon:
            ({ color, size }) => (

              <Ionicons
                name="clipboard"
                size={size}
                color={color}
              />

            ),
        }}
      />

      <Tabs.Screen
        name="users"

        options={{

          title: "Users",

          tabBarIcon:
            ({ color, size }) => (

              <Ionicons
                name="people"
                size={size}
                color={color}
              />

            ),
        }}
      />

      <Tabs.Screen
        name="profile"

        options={{

          title: "Profile",

          tabBarIcon:
            ({ color, size }) => (

              <Ionicons
                name="person"
                size={size}
                color={color}
              />

            ),
        }}
      />

    </Tabs>
  );
}