import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";

import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// ✅ Dari app/vehicles/index.tsx → naik 2 level ke root
import { getVehicles } from "../../src/services/vehicle.service";

export default function VehicleListScreen() {

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchVehicles = async () => {
    try {
      const result = await getVehicles();
      setVehicles(result.data);
    } catch (error) {
      console.log(error);
      alert("Gagal mengambil data kendaraan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter((item: any) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Memuat kendaraan...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* ── HEADER ── */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.header}>RideNow</Text>
          <Text style={styles.subHeader}>Pilih kendaraan terbaikmu</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{filteredVehicles.length} unit</Text>
        </View>
      </View>

      {/* ── SEARCH ── */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          placeholder="Cari kendaraan..."
          placeholderTextColor="#CBD5E1"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={16} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* ── EMPTY STATE ── */}
      {filteredVehicles.length === 0 && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="car-outline" size={32} color="#CBD5E1" />
          </View>
          <Text style={styles.emptyTitle}>Kendaraan tidak ditemukan</Text>
          <Text style={styles.emptySubtitle}>
            Coba kata kunci lain atau hapus filter pencarian
          </Text>
        </View>
      )}

      {/* ── VEHICLE LIST ── */}
      <FlatList
        data={filteredVehicles}
        keyExtractor={(item: any) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/vehicles/${item.id}` as any)}
            activeOpacity={0.92}
          >
            {/* ── IMAGE ── */}
            <View style={styles.imageWrap}>
              <Image
                source={{
                  uri:
                    item.image ||
                    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200",
                }}
                style={styles.image}
              />
              {/* Status badge overlay */}
              <View style={[
                styles.badge,
                item.status === "available" ? styles.available : styles.unavailable,
              ]}>
                <View style={[
                  styles.badgeDot,
                  { backgroundColor: item.status === "available" ? "#16A34A" : "#DC2626" }
                ]} />
                <Text style={[
                  styles.badgeText,
                  { color: item.status === "available" ? "#16A34A" : "#DC2626" }
                ]}>
                  {item.status === "available" ? "Tersedia" : "Tidak Tersedia"}
                </Text>
              </View>
            </View>

            {/* ── CONTENT ── */}
            <View style={styles.cardContent}>
              <View style={styles.rowBetween}>
                <View style={styles.nameGroup}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.brand}>{item.brand}</Text>
                </View>
                <View style={styles.priceGroup}>
                  <Text style={styles.price}>
                    Rp {Number(item.pricePerDay).toLocaleString("id-ID")}
                  </Text>
                  <Text style={styles.day}>/hari</Text>
                </View>
              </View>

              {/* CTA */}
              {item.status === "available" && (
                <View style={styles.ctaRow}>
                  <Text style={styles.ctaText}>Lihat Detail</Text>
                  <Ionicons name="arrow-forward" size={13} color="#2563EB" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  // Loading
  center: {
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

  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  subHeader: {
    color: "#94A3B8",
    marginTop: 4,
    fontSize: 14,
  },
  countBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  countText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },

  // Search
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },
  clearBtn: {
    padding: 4,
  },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
  },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  imageWrap: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 170,
  },

  // Badge — overlay di atas image
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    gap: 5,
  },
  available: {
    backgroundColor: "rgba(220, 252, 231, 0.95)",
  },
  unavailable: {
    backgroundColor: "rgba(254, 226, 226, 0.95)",
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  // Card content
  cardContent: {
    padding: 16,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  nameGroup: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  brand: {
    color: "#94A3B8",
    marginTop: 3,
    fontSize: 13,
  },
  priceGroup: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2563EB",
  },
  day: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },

  // CTA row
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 4,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },
});