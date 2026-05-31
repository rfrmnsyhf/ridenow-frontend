import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// ✅ Dari app/(tabs)/index.tsx → naik 2 level ke root
import { getDashboardStats } from "../../src/services/dashboard.service";
import { getProfile } from "../../src/services/profile.service";

const QUICK_ACTIONS = [
  { label: "Kendaraan",  icon: "car-sport-outline",    route: "/vehicles",  color: "#2563EB", bg: "#EFF6FF" },
  { label: "Rental", icon: "document-text-outline", route: "", color: "#059669", bg: "#ECFDF5" },
  { label: "Pembayaran", icon: "wallet-outline",        route: "/payment",   color: "#7C3AED", bg: "#F5F3FF" }, // ✅ /payment bukan /payments
  { label: "Profil",     icon: "person-outline",        route: "/profile",   color: "#D97706", bg: "#FFFBEB" },
];

export default function DashboardScreen() {

  const [stats, setStats] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const dashboardResult = await getDashboardStats();
      const profileResult = await getProfile();
      setStats(dashboardResult.data);
      setUser(profileResult.data);
    } catch (error) {
      console.log(error);
      alert("Gagal mengambil dashboard");
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
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Memuat dashboard...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── HERO ── */}
        <View style={styles.hero}>
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />
          <View style={styles.heroCircle3} />

          <View style={styles.headerRow}>
            <View>
              <Text style={styles.welcome}>Selamat Datang,</Text>
              <Text style={styles.username}>{user?.fullname} 👋</Text>
            </View>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={20} color="#fff" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          <View style={styles.locationRow}>
            <View style={styles.locationPill}>
              <Ionicons name="location" size={12} color="#93C5FD" />
              <Text style={styles.locationText}>Tanjungpinang, Indonesia</Text>
            </View>
          </View>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={16} color="rgba(255,255,255,0.6)" />
            <TextInput
              placeholder="Cari kendaraan..."
              placeholderTextColor="rgba(255,255,255,0.55)"
              style={styles.searchInput}
            />
            <View style={styles.searchDivider} />
            <TouchableOpacity style={styles.searchFilterBtn}>
              <Ionicons name="options-outline" size={16} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── STATS ── */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: "#EFF6FF" }]}>
            <View style={[styles.statIcon, { backgroundColor: "#DBEAFE" }]}>
              <Ionicons name="people" size={16} color="#2563EB" />
            </View>
            <Text style={styles.statValue}>{stats?.totalUsers ?? "—"}</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: "#F0FDF4" }]}>
            <View style={[styles.statIcon, { backgroundColor: "#DCFCE7" }]}>
              <Ionicons name="car-sport" size={16} color="#22C55E" />
            </View>
            <Text style={styles.statValue}>{stats?.totalVehicles ?? "—"}</Text>
            <Text style={styles.statLabel}>Vehicles</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: "#FEFCE8" }]}>
            <View style={[styles.statIcon, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="document-text" size={16} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>{stats?.totalRentals ?? "—"}</Text>
            <Text style={styles.statLabel}>Rentals</Text>
          </View>
        </View>

        {/* ── QUICK ACTIONS ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Akses Cepat</Text>
        </View>

        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.route}
              style={styles.quickActionItem}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.75}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.bg }]}>
                <Ionicons name={action.icon as any} size={22} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── PROMO CARD ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Penawaran</Text>
        </View>

        <View style={styles.promoCard}>
          <View style={styles.promoCircle1} />
          <View style={styles.promoCircle2} />

          <View style={styles.promoBadgeWrap}>
            <Text style={styles.promoBadge}>🔥 PROMO</Text>
          </View>

          <Text style={styles.promoTitle}>Diskon 30%{"\n"}Weekend Ini</Text>
          <Text style={styles.promoText}>
            Nikmati perjalanan lebih hemat bersama RideNow
          </Text>

          <TouchableOpacity
            style={styles.promoBtn}
            onPress={() => router.push("/vehicles" as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.promoBtnText}>Klaim Sekarang</Text>
            <Ionicons name="arrow-forward" size={14} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        {/* ── CTA ── */}
        <TouchableOpacity
          style={styles.vehicleButton}
          onPress={() => router.push("/vehicles" as any)}
          activeOpacity={0.88}
        >
          <Ionicons name="car-sport-outline" size={18} color="#fff" />
          <Text style={styles.vehicleButtonText}>Lihat Semua Kendaraan</Text>
          <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
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
    backgroundColor: "#F8FAFC",
  },
  loadingCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    gap: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  loadingText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },
  hero: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: "hidden",
    position: "relative",
  },
  heroCircle1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: -80,
    right: -60,
  },
  heroCircle2: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(255,255,255,0.04)",
    bottom: -20,
    left: -30,
  },
  heroCircle3: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: 30,
    right: 80,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  welcome: {
    color: "#BFDBFE",
    fontSize: 13,
    fontWeight: "500",
  },
  username: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 4,
    letterSpacing: -0.3,
  },
  notificationBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  notifDot: {
    position: "absolute",
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FCD34D",
    borderWidth: 1.5,
    borderColor: "#2563EB",
  },
  locationRow: {
    marginTop: 16,
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  locationText: {
    color: "#BFDBFE",
    fontSize: 12,
    fontWeight: "500",
  },
  searchBar: {
    height: 52,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },
  searchDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  searchFilterBtn: {
    paddingLeft: 10,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: -20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  statLabel: {
    marginTop: 3,
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "500",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  quickActionItem: {
    alignItems: "center",
    gap: 8,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  promoCard: {
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 24,
    backgroundColor: "#4F46E5",
    overflow: "hidden",
    position: "relative",
  },
  promoCircle1: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -50,
    right: -40,
  },
  promoCircle2: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.05)",
    bottom: -20,
    left: 30,
  },
  promoBadgeWrap: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(253,230,138,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 14,
  },
  promoBadge: {
    color: "#FDE68A",
    fontWeight: "700",
    fontSize: 12,
  },
  promoTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  promoText: {
    color: "#C7D2FE",
    marginTop: 10,
    lineHeight: 20,
    fontSize: 13,
  },
  promoBtn: {
    marginTop: 20,
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  promoBtnText: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 13,
  },
  vehicleButton: {
    backgroundColor: "#2563EB",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 18,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  vehicleButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    flex: 1,
    textAlign: "center",
  },
});