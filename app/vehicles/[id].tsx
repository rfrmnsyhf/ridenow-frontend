import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

// ✅ Dari app/vehicles/[id].tsx → naik 2 level ke root
import { getVehicleById } from "../../src/services/vehicle.service";

export default function VehicleDetailScreen() {

  const { id } = useLocalSearchParams();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchVehicle = async () => {
    try {
      const result = await getVehicleById(id as string);
      setVehicle(result.data);
    } catch (error) {
      console.log(error);
      alert("Gagal mengambil detail kendaraan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Memuat detail...</Text>
        </View>
      </View>
    );
  }

  const isAvailable = vehicle.status === "available";

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* ── HERO IMAGE ── */}
        <View style={styles.imageWrap}>
          <Image
            source={{
              uri:
                vehicle.image ||
                "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200",
            }}
            style={styles.image}
          />

          {/* Overlay gradient feel via semi-transparent bars */}
          <View style={styles.imageOverlayTop} />

          {/* Back button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={20} color="#0F172A" />
          </TouchableOpacity>

          {/* Status badge overlay */}
          <View style={[
            styles.statusBadge,
            isAvailable ? styles.available : styles.unavailable,
          ]}>
            <View style={[
              styles.statusDot,
              { backgroundColor: isAvailable ? "#16A34A" : "#DC2626" }
            ]} />
            <Text style={[
              styles.statusText,
              { color: isAvailable ? "#16A34A" : "#DC2626" }
            ]}>
              {isAvailable ? "Tersedia" : "Tidak Tersedia"}
            </Text>
          </View>
        </View>

        {/* ── CONTENT ── */}
        <View style={styles.content}>

          {/* Name & Brand */}
          <Text style={styles.name}>{vehicle.name}</Text>
          <Text style={styles.brand}>{vehicle.brand}</Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              Rp {Number(vehicle.pricePerDay).toLocaleString("id-ID")}
            </Text>
            <Text style={styles.day}>/hari</Text>
          </View>

          {/* ── SPEC BOX ── */}
          <View style={styles.specBox}>
            <View style={styles.specHeader}>
              <Ionicons name="information-circle-outline" size={16} color="#2563EB" />
              <Text style={styles.specTitle}>Informasi Kendaraan</Text>
            </View>

            {/* Divider */}
            <View style={styles.specDivider} />

            {/* Spec rows */}
            <View style={styles.specRow}>
              <View style={styles.specIconWrap}>
                <Ionicons name="card-outline" size={14} color="#2563EB" />
              </View>
              <View style={styles.specTextGroup}>
                <Text style={styles.specLabel}>Plat Nomor</Text>
                <Text style={styles.specValue}>{vehicle.plateNumber}</Text>
              </View>
            </View>

            <View style={styles.specRow}>
              <View style={styles.specIconWrap}>
                <Ionicons name="pulse-outline" size={14} color="#2563EB" />
              </View>
              <View style={styles.specTextGroup}>
                <Text style={styles.specLabel}>Status</Text>
                <Text style={[
                  styles.specValue,
                  { color: isAvailable ? "#16A34A" : "#DC2626" }
                ]}>
                  {isAvailable ? "Siap Digunakan" : "Tidak Tersedia"}
                </Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.descBox}>
              <Ionicons name="document-text-outline" size={13} color="#94A3B8" />
              <Text style={styles.descText}>
                Kendaraan siap digunakan untuk perjalanan harian, wisata, maupun kebutuhan bisnis.
              </Text>
            </View>
          </View>

        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── BOTTOM BAR ── */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceGroup}>
          <Text style={styles.bottomPriceLabel}>Harga per hari</Text>
          <Text style={styles.bottomPrice}>
            Rp {Number(vehicle.pricePerDay).toLocaleString("id-ID")}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, !isAvailable && styles.buttonDisabled]}
          onPress={() => router.push(`/booking?vehicleId=${vehicle.id}` as any)}
          disabled={!isAvailable}
          activeOpacity={0.88}
        >
          <Ionicons name="calendar-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Booking Sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
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

  // Hero Image
  imageWrap: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 300,
  },
  imageOverlayTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  backBtn: {
    position: "absolute",
    top: 52,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statusBadge: {
    position: "absolute",
    top: 52,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 5,
  },
  available: {
    backgroundColor: "rgba(220,252,231,0.95)",
  },
  unavailable: {
    backgroundColor: "rgba(254,226,226,0.95)",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  // Content
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  name: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  brand: {
    marginTop: 6,
    color: "#94A3B8",
    fontSize: 15,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 16,
    gap: 4,
  },
  price: {
    fontSize: 30,
    fontWeight: "800",
    color: "#2563EB",
    letterSpacing: -0.5,
  },
  day: {
    fontSize: 15,
    color: "#94A3B8",
    fontWeight: "500",
  },

  // Spec Box
  specBox: {
    marginTop: 24,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  specHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  specTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  specDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },
  specRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },
  specIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  specTextGroup: {
    flex: 1,
  },
  specLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  specValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  descBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 4,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
  },
  descText: {
    flex: 1,
    fontSize: 13,
    color: "#64748B",
    lineHeight: 20,
  },

  // Bottom Bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 28,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 10,
  },
  bottomPriceGroup: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 2,
    letterSpacing: -0.3,
  },
  button: {
    flex: 2,
    backgroundColor: "#2563EB",
    height: 52,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});