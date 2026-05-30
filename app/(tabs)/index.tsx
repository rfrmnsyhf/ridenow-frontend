import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useEffect,
  useState,
} from "react";

import {
  Ionicons,
} from "@expo/vector-icons";

import { router } from "expo-router";

import {
  getDashboardStats,
} from "../../src/services/dashboard.service";

import {
  getProfile,
} from "../../src/services/profile.service";

export default function DashboardScreen() {

  const [stats, setStats] =
    useState<any>(null);

  const [user, setUser] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const fetchDashboard =
    async () => {

      try {

        const dashboardResult =
          await getDashboardStats();

        const profileResult =
          await getProfile();

        setStats(
          dashboardResult.data
        );

        setUser(profileResult.data);

      } catch (error) {

        console.log(error);

        alert(
          "Gagal mengambil dashboard"
        );

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
        />
      </View>
    );
  }

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {/* HERO */}

        <View style={styles.hero}>

          <View style={styles.headerRow}>

            <View>

              <Text style={styles.welcome}>
                Selamat Datang,
              </Text>

              <Text style={styles.username}>
                {user?.fullname} 👋
              </Text>

            </View>

            <TouchableOpacity
              style={styles.notification}
            >

              <Ionicons
                name="notifications"
                size={22}
                color="#fff"
              />

            </TouchableOpacity>

          </View>

          {/* LOCATION */}

          <View style={styles.locationRow}>

            <Ionicons
              name="location"
              size={14}
              color="#BFDBFE"
            />

            <Text style={styles.locationText}>
              Tanjungpinang, Indonesia
            </Text>

          </View>

          {/* SEARCH */}

          <View style={styles.searchBar}>

            <Ionicons
              name="search"
              size={18}
              color="rgba(255,255,255,0.7)"
            />

            <TextInput
              placeholder="Cari kendaraan..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={styles.searchInput}
            />

          </View>

        </View>

        {/* STATS */}

        <View style={styles.statsContainer}>

          {/* USERS */}

          <View
            style={[
              styles.statCard,
              {
                backgroundColor:
                  "#EFF6FF",
              },
            ]}
          >

            <View
              style={[
                styles.statIcon,
                {
                  backgroundColor:
                    "#DBEAFE",
                },
              ]}
            >

              <Ionicons
                name="people"
                size={18}
                color="#2563EB"
              />

            </View>

            <Text style={styles.statValue}>
              {stats?.totalUsers}
            </Text>

            <Text style={styles.statLabel}>
              Users
            </Text>

          </View>

          {/* VEHICLES */}

          <View
            style={[
              styles.statCard,
              {
                backgroundColor:
                  "#F0FDF4",
              },
            ]}
          >

            <View
              style={[
                styles.statIcon,
                {
                  backgroundColor:
                    "#DCFCE7",
                },
              ]}
            >

              <Ionicons
                name="car-sport"
                size={18}
                color="#22C55E"
              />

            </View>

            <Text style={styles.statValue}>
              {stats?.totalVehicles}
            </Text>

            <Text style={styles.statLabel}>
              Vehicles
            </Text>

          </View>

          {/* RENTALS */}

          <View
            style={[
              styles.statCard,
              {
                backgroundColor:
                  "#FEFCE8",
              },
            ]}
          >

            <View
              style={[
                styles.statIcon,
                {
                  backgroundColor:
                    "#FEF3C7",
                },
              ]}
            >

              <Ionicons
                name="document-text"
                size={18}
                color="#F59E0B"
              />

            </View>

            <Text style={styles.statValue}>
              {stats?.totalRentals}
            </Text>

            <Text style={styles.statLabel}>
              Rentals
            </Text>

          </View>

        </View>

        {/* PROMO */}

        <View style={styles.promoCard}>

          <Text style={styles.promoBadge}>
            PROMO
          </Text>

          <Text style={styles.promoTitle}>
            Diskon 30% Weekend
          </Text>

          <Text style={styles.promoText}>
            Nikmati perjalanan lebih hemat
            bersama RideNow
          </Text>

        </View>

        {/* BUTTON */}

        <TouchableOpacity
          style={styles.vehicleButton}
          onPress={() =>
            router.push(
              "/vehicles" as any
            )
          }
        >

          <Text style={styles.vehicleButtonText}>
            Lihat Kendaraan
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  hero: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 36,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  welcome: {
    color: "#BFDBFE",
    fontSize: 13,
  },

  username: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 4,
  },

  notification: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor:
      "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  locationText: {
    color: "#BFDBFE",
    marginLeft: 6,
    fontSize: 13,
  },

  searchBar: {
    height: 54,
    borderRadius: 18,
    backgroundColor:
      "rgba(255,255,255,0.15)",
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#fff",
  },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 24,
  },

  statCard: {
    width: "48%",
    borderRadius: 22,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 16,
  },

  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },

  statLabel: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 13,
  },

  promoCard: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 28,
    padding: 24,
    backgroundColor: "#4F46E5",
  },

  promoBadge: {
    color: "#FDE68A",
    fontWeight: "bold",
    marginBottom: 10,
  },

  promoTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  promoText: {
    color: "#E0E7FF",
    marginTop: 10,
    lineHeight: 22,
  },

  vehicleButton: {
    backgroundColor: "#2563EB",
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 40,
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  vehicleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

});