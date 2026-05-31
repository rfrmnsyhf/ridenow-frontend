import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useEffect,
  useState,
} from "react";

import AsyncStorage
from "@react-native-async-storage/async-storage";

import {
  router,
} from "expo-router";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  getUsers,
} from "../../../src/services/user.service";

import {
  getVehicles,
} from "../../../src/services/vehicle.service";

import {
  getRentals,
} from "../../../src/services/rental.service";

export default function
AdminProfileScreen() {

  const [user, setUser] =
    useState<any>(null);

  const [stats, setStats] =
    useState({

      vehicles: 0,
      rentals: 0,
      users: 0,

    });

  const fetchData =
    async () => {

      try {

        const storedUser =
          await AsyncStorage.getItem(
            "user"
          );

        if (storedUser) {

          setUser(
            JSON.parse(
              storedUser
            )
          );
        }

        const [

          vehiclesResult,
          rentalsResult,
          usersResult,

        ] = await Promise.all([

          getVehicles(),
          getRentals(),
          getUsers(),

        ]);

        setStats({

          vehicles:
            vehiclesResult.data.length,

          rentals:
            rentalsResult.data.length,

          users:
            usersResult.data.length,

        });

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchData();

  }, []);

  const handleLogout =
    () => {

      Alert.alert(

        "Logout",

        "Are you sure want to logout?",

        [

          {
            text: "Cancel",
            style: "cancel",
          },

          {

            text: "Logout",

            style: "destructive",

            onPress:
              async () => {

                await AsyncStorage.removeItem(
                  "token"
                );

                await AsyncStorage.removeItem(
                  "user"
                );

                router.replace(
                  "/" as any
                );
              },
          },
        ]
      );
    };

  const sections = [

    {

      title: "Preferences",

      items: [

        {
          icon: "notifications-outline",
          label: "Notifications",
          value: "On",
        },

        {
          icon: "moon-outline",
          label: "Dark mode",
          value: "Off",
        },

        {
          icon: "settings-outline",
          label: "App settings",
        },
      ],
    },

    {

      title: "Account",

      items: [

        {
          icon: "shield-checkmark-outline",
          label: "Security & privacy",
        },

        {
          icon: "card-outline",
          label: "Billing",
        },

        {
          icon: "help-circle-outline",
          label: "Help & support",
        },
      ],
    },
  ];

  return (

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      <Text style={styles.header}>
        Profile
      </Text>

      <View style={styles.profileCard}>

        <View style={styles.avatar}>

          <Text style={styles.avatarText}>

            {user?.fullname
              ?.charAt(0)
              ?.toUpperCase() || "A"}

          </Text>

        </View>

        <View style={{
          flex: 1
        }}>

          <Text style={styles.name}>
            {user?.fullname}
          </Text>

          <Text style={styles.email}>
            {user?.email}
          </Text>

          <View style={styles.roleBadge}>

            <Text style={styles.roleText}>
              Administrator
            </Text>

          </View>

        </View>

      </View>

      <View style={styles.statsRow}>

        <View style={styles.statsCard}>

          <Text style={styles.statsValue}>
            {stats.vehicles}
          </Text>

          <Text style={styles.statsLabel}>
            Vehicles
          </Text>

        </View>

        <View style={styles.statsCard}>

          <Text style={styles.statsValue}>
            {stats.rentals}
          </Text>

          <Text style={styles.statsLabel}>
            Rentals
          </Text>

        </View>

        <View style={styles.statsCard}>

          <Text style={styles.statsValue}>
            {stats.users}
          </Text>

          <Text style={styles.statsLabel}>
            Users
          </Text>

        </View>

      </View>

      {sections.map((section) => (

        <View
          key={section.title}
          style={styles.section}
        >

          <Text style={styles.sectionTitle}>
            {section.title}
          </Text>

          <View style={styles.menuCard}>

            {section.items.map(
              (item, index) => (

              <TouchableOpacity
                key={item.label}

                style={[

                  styles.menuItem,

                  index !==
                  section.items.length - 1 && {

                    borderBottomWidth: 1,
                    borderBottomColor:
                      "#F1F5F9",
                  },
                ]}
              >

                <View style={styles.menuLeft}>

                  <View style={styles.iconBox}>

                    <Ionicons
                      name={item.icon as any}
                      size={18}
                      color="#64748B"
                    />

                  </View>

                  <Text style={styles.menuLabel}>
                    {item.label}
                  </Text>

                </View>

                <View style={styles.menuRight}>

                  {item.value && (

                    <Text style={styles.menuValue}>
                      {item.value}
                    </Text>

                  )}

                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#CBD5E1"
                  />

                </View>

              </TouchableOpacity>
            ))}
          </View>

        </View>
      ))}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >

        <Ionicons
          name="log-out-outline"
          size={18}
          color="#EF4444"
        />

        <Text style={styles.logoutText}>
          Log out
        </Text>

      </TouchableOpacity>

      <Text style={styles.version}>
        RideNow Admin · v1.0.0
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 60,
  },

  header: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0F172A",
    paddingHorizontal: 20,
  },

  profileCard: {
    marginTop: 24,
    marginHorizontal: 20,

    backgroundColor: "#fff",

    borderRadius: 28,

    borderWidth: 1,
    borderColor: "#F1F5F9",

    padding: 20,

    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 22,

    backgroundColor: "#DBEAFE",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 16,
  },

  avatarText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2563EB",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },

  email: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748B",
  },

  roleBadge: {
    alignSelf: "flex-start",

    marginTop: 10,

    backgroundColor: "#F5F3FF",

    paddingHorizontal: 10,
    paddingVertical: 4,

    borderRadius: 999,
  },

  roleText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#7C3AED",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginTop: 20,
    paddingHorizontal: 20,
  },

  statsCard: {
    width: "31%",

    backgroundColor: "#fff",

    borderRadius: 22,

    borderWidth: 1,
    borderColor: "#F1F5F9",

    paddingVertical: 18,

    alignItems: "center",
  },

  statsValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  statsLabel: {
    marginTop: 4,
    fontSize: 11,
    color: "#64748B",
  },

  section: {
    marginTop: 28,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    marginLeft: 4,
    marginBottom: 10,

    fontSize: 12,
    fontWeight: "600",

    color: "#94A3B8",

    textTransform: "uppercase",
  },

  menuCard: {
    backgroundColor: "#fff",

    borderRadius: 24,

    borderWidth: 1,
    borderColor: "#F1F5F9",

    overflow: "hidden",
  },

  menuItem: {
    height: 68,

    paddingHorizontal: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,

    backgroundColor: "#F8FAFC",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  menuLabel: {
    fontSize: 14,
    color: "#1E293B",
  },

  menuRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuValue: {
    marginRight: 8,
    fontSize: 12,
    color: "#94A3B8",
  },

  logoutButton: {
    marginTop: 28,
    marginHorizontal: 20,

    height: 54,

    borderRadius: 22,

    borderWidth: 1,
    borderColor: "#FEE2E2",

    backgroundColor: "#fff",

    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    marginLeft: 8,
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 14,
  },

  version: {
    textAlign: "center",

    marginTop: 18,
    marginBottom: 40,

    fontSize: 11,
    color: "#94A3B8",
  },

});