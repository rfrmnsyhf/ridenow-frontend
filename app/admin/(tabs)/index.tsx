import {
  FlatList,
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

import {
  router,
} from "expo-router";

import AsyncStorage
from "@react-native-async-storage/async-storage";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  getVehicles,
} from "../../../src/services/vehicle.service";

import {
  getRentals,
} from "../../../src/services/rental.service";

import {
  getUsers,
} from "../../../src/services/user.service";

export default function
AdminDashboardScreen() {

  const [user, setUser] =
    useState<any>(null);

  const [stats, setStats] =
    useState({

      vehicles: 0,
      rentals: 0,
      users: 0,
      activeRentals: 0,
      revenue: 0,

    });

  const [recentRentals,
    setRecentRentals] =
      useState<any[]>([]);

  const fetchDashboard =
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

        const vehicles =
          vehiclesResult.data;

        const rentals =
          rentalsResult.data;

        const users =
          usersResult.data;

        const activeRentals =
          rentals.filter(
            (item: any) =>
              item.status !==
              "completed"
          );

        const revenue =
          rentals.reduce(

            (
              acc: number,
              item: any
            ) =>

              acc +
              item.totalPrice,

            0
          );

        setStats({

          vehicles:
            vehicles.length,

          rentals:
            rentals.length,

          users:
            users.length,

          activeRentals:
            activeRentals.length,

          revenue,

        });

        setRecentRentals(
          rentals.slice(0, 3)
        );

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {

    fetchDashboard();

  }, []);

  const dashboardStats = [

    {

      label:
        "Total Vehicles",

      value:
        stats.vehicles,

      icon: "car-sport",

      color:
        "#2563EB",

      bg:
        "#DBEAFE",
    },

    {

      label:
        "Total Rentals",

      value:
        stats.rentals,

      icon:
        "clipboard",

      color:
        "#7C3AED",

      bg:
        "#EDE9FE",
    },

    {

      label:
        "Total Users",

      value:
        stats.users,

      icon:
        "people",

      color:
        "#059669",

      bg:
        "#D1FAE5",
    },

    {

      label:
        "Active Rentals",

      value:
        stats.activeRentals,

      icon:
        "pulse",

      color:
        "#D97706",

      bg:
        "#FEF3C7",
    },
  ];

  const quickActions = [

    {

      label:
        "Add Vehicle",

      icon: "add",

      color:
        "#2563EB",

      bg:
        "#DBEAFE",

      route:
        "/admin/vehicles/add",
    },

    {

      label:
        "Rentals",

      icon:
        "clipboard",

      color:
        "#7C3AED",

      bg:
        "#EDE9FE",

      route:
        "/admin/(tabs)/rentals",
    },

    {

      label:
        "Users",

      icon:
        "people",

      color:
        "#059669",

      bg:
        "#D1FAE5",

      route:
        "/admin/(tabs)/users",
    },

    {

      label:
        "Payments",

      icon:
        "card",

      color:
        "#D97706",

      bg:
        "#FEF3C7",

      route:
        "/admin/payments",
    },
  ];

  return (

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      <View style={styles.topBar}>

        <View style={styles.userSection}>

          <View style={styles.avatar}>

            <Text style={styles.avatarText}>

              {user?.fullname
                ?.charAt(0)
                ?.toUpperCase() || "A"}

            </Text>

          </View>

          <View>

            <Text style={styles.greeting}>
              Good morning,
            </Text>

            <Text style={styles.username}>
              {user?.fullname}
            </Text>

          </View>

        </View>

        <View style={styles.rightActions}>

          <TouchableOpacity
            style={styles.notificationButton}
          >

            <Ionicons
              name="notifications"
              size={18}
              color="#0F172A"
            />

            <View style={styles.notificationDot} />

          </TouchableOpacity>

          <TouchableOpacity

            style={styles.profileButton}

            onPress={() =>
              router.push(
                "/admin/(tabs)/profile" as any
              )
            }
          >

            <Text style={styles.profileText}>

              {user?.fullname
                ?.charAt(0)
                ?.toUpperCase() || "A"}

            </Text>

          </TouchableOpacity>

        </View>

      </View>

      <View style={styles.revenueCard}>

        <Text style={styles.revenueLabel}>
          Revenue this month
        </Text>

        <Text style={styles.revenueValue}>

          Rp {stats.revenue
            .toLocaleString(
              "id-ID"
            )}

        </Text>

        <View style={styles.revenueRow}>

          <View style={styles.revenueBadge}>

            <Text style={styles.revenueBadgeText}>
              +12.4%
            </Text>

          </View>

          <Text style={styles.revenueSub}>
            vs last month
          </Text>

        </View>

      </View>

      <View style={styles.statsGrid}>

        {dashboardStats.map(
          (item) => (

          <View
            key={item.label}
            style={styles.statsCard}
          >

            <View
              style={[

                styles.statsIcon,

                {
                  backgroundColor:
                    item.bg,
                },
              ]}
            >

              <Ionicons
                name={item.icon as any}
                size={18}
                color={item.color}
              />

            </View>

            <Text style={styles.statsValue}>
              {item.value}
            </Text>

            <Text style={styles.statsLabel}>
              {item.label}
            </Text>

          </View>
        ))}

      </View>

      <Text style={styles.sectionTitle}>
        Quick actions
      </Text>

      <View style={styles.quickGrid}>

        {quickActions.map(
          (item) => (

          <TouchableOpacity
            key={item.label}

            style={styles.quickItem}

            onPress={() =>
              router.push(
                item.route as any
              )
            }
          >

            <View
              style={[

                styles.quickIcon,

                {
                  backgroundColor:
                    item.bg,
                },
              ]}
            >

              <Ionicons
                name={item.icon as any}
                size={22}
                color={item.color}
              />

            </View>

            <Text style={styles.quickLabel}>
              {item.label}
            </Text>

          </TouchableOpacity>
        ))}

      </View>

      <View style={styles.activityHeader}>

        <Text style={styles.sectionTitle}>
          Recent activity
        </Text>

        <TouchableOpacity
          onPress={() =>
            router.push(
              "/admin/(tabs)/rentals"  as any
            )
          }
        >

          <Text style={styles.viewAll}>
            View all
          </Text>

        </TouchableOpacity>

      </View>

      <FlatList
        data={recentRentals}

        scrollEnabled={false}

        keyExtractor={(item) =>
          item.id.toString()
        }

        renderItem={({ item }) => (

          <View style={styles.activityCard}>

            <View>

              <Text style={styles.activityUser}>
                {item.user.fullname}
              </Text>

              <Text style={styles.activityMeta}>

                {item.vehicle.name}
                {" · "}

                {new Date(
                  item.startDate
                ).toLocaleDateString(
                  "id-ID"
                )}

              </Text>

            </View>

            <View style={styles.activityRight}>

              <View
                style={[

                  styles.statusBadge,

                  {

                    backgroundColor:

                      item.status ===
                      "completed"

                        ? "#DCFCE7"

                        : "#DBEAFE",
                  },
                ]}
              >

                <Text
                  style={[

                    styles.statusText,

                    {

                      color:

                        item.status ===
                        "completed"

                          ? "#16A34A"

                          : "#2563EB",
                    },
                  ]}
                >

                  {item.status}

                </Text>

              </View>

              <Ionicons
                name="chevron-forward"
                size={16}
                color="#CBD5E1"
              />

            </View>

          </View>
        )}
      />

      <View style={{
        height: 40
      }} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 60,
  },

  topBar: {

    paddingHorizontal: 20,

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",
  },

  userSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {

    width: 46,
    height: 46,

    borderRadius: 999,

    backgroundColor: "#DBEAFE",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  avatarText: {
    color: "#2563EB",
    fontSize: 18,
    fontWeight: "700",
  },

  greeting: {
    fontSize: 13,
    color: "#64748B",
  },

  username: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  rightActions: {
    flexDirection: "row",
    alignItems: "center",
  },

  notificationButton: {

    width: 42,
    height: 42,

    borderRadius: 999,

    backgroundColor: "#fff",

    borderWidth: 1,
    borderColor: "#E2E8F0",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 10,
  },

  notificationDot: {

    position: "absolute",

    top: 10,
    right: 10,

    width: 8,
    height: 8,

    borderRadius: 999,

    backgroundColor: "#2563EB",
  },

  profileButton: {

    width: 42,
    height: 42,

    borderRadius: 999,

    backgroundColor: "#2563EB",

    justifyContent: "center",
    alignItems: "center",
  },

  profileText: {
    color: "#fff",
    fontWeight: "700",
  },

  revenueCard: {

    marginTop: 26,
    marginHorizontal: 20,

    borderRadius: 30,

    padding: 24,

    backgroundColor: "#2563EB",
  },

  revenueLabel: {
    color: "#DBEAFE",
    fontSize: 13,
  },

  revenueValue: {
    marginTop: 8,
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },

  revenueRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  revenueBadge: {

    backgroundColor:
      "rgba(255,255,255,0.2)",

    paddingHorizontal: 10,
    paddingVertical: 4,

    borderRadius: 999,
  },

  revenueBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },

  revenueSub: {
    marginLeft: 10,
    color: "#DBEAFE",
    fontSize: 12,
  },

  statsGrid: {

    marginTop: 22,

    paddingHorizontal: 20,

    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent:
      "space-between",
  },

  statsCard: {

    width: "48%",

    backgroundColor: "#fff",

    borderRadius: 24,

    padding: 18,

    marginBottom: 14,

    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  statsIcon: {

    width: 42,
    height: 42,

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",
  },

  statsValue: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  statsLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748B",
  },

  sectionTitle: {

    marginTop: 28,
    marginBottom: 16,

    paddingHorizontal: 20,

    fontSize: 16,
    fontWeight: "700",

    color: "#0F172A",
  },

  quickGrid: {

    paddingHorizontal: 20,

    flexDirection: "row",

    justifyContent:
      "space-between",
  },

  quickItem: {
    alignItems: "center",
  },

  quickIcon: {

    width: 58,
    height: 58,

    borderRadius: 22,

    justifyContent: "center",
    alignItems: "center",
  },

  quickLabel: {
    marginTop: 10,
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
  },

  activityHeader: {

    marginTop: 28,

    paddingHorizontal: 20,

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",
  },

  viewAll: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },

  activityCard: {

    marginHorizontal: 20,

    backgroundColor: "#fff",

    borderRadius: 24,

    borderWidth: 1,
    borderColor: "#F1F5F9",

    padding: 18,

    marginBottom: 12,

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",
  },

  activityUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },

  activityMeta: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748B",
  },

  activityRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusBadge: {

    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 999,

    marginRight: 8,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },

});