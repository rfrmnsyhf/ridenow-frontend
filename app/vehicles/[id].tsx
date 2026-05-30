import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import {
  useLocalSearchParams,
  router,
} from "expo-router";

import {
  useEffect,
  useState,
} from "react";

import {
  getVehicleById,
} from "../../src/services/vehicle.service";

export default function
VehicleDetailScreen() {

  const { id } =
    useLocalSearchParams();

  const [vehicle, setVehicle] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const fetchVehicle =
    async () => {

      try {

        const result =
          await getVehicleById(
            id as string
          );

        setVehicle(result.data);

      } catch (error) {

        console.log(error);

        alert(
          "Gagal mengambil detail kendaraan"
        );

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
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >

        <Image
          source={{
            uri:
              vehicle.image ||
              "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200",
          }}
          style={styles.image}
        />

        <View style={styles.content}>

          <View style={styles.rowBetween}>

            <Text style={styles.name}>
              {vehicle.name}
            </Text>

            <View
              style={[
                styles.badge,
                vehicle.status ===
                "available"
                  ? styles.available
                  : styles.unavailable,
              ]}
            >
              <Text
                style={styles.badgeText}
              >
                {vehicle.status}
              </Text>
            </View>

          </View>

          <Text style={styles.brand}>
            {vehicle.brand}
          </Text>

          <Text style={styles.price}>
            Rp {vehicle.pricePerDay}
            <Text style={styles.day}>
              /hari
            </Text>
          </Text>

          <View style={styles.specBox}>

            <Text style={styles.specTitle}>
              Informasi Kendaraan
            </Text>

            <Text style={styles.specText}>
              Plat Nomor:
              {" "}
              {vehicle.plateNumber}
            </Text>

            <Text style={styles.specText}>
              Status:
              {" "}
              {vehicle.status}
            </Text>

            <Text style={styles.specText}>
              Kendaraan siap digunakan
              untuk perjalanan harian,
              wisata, maupun kebutuhan
              bisnis.
            </Text>

          </View>

        </View>

      </ScrollView>

      <View style={styles.bottomBar}>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push(
              `/booking?vehicleId=${vehicle.id}` as any
            )
          }
        >
          <Text style={styles.buttonText}>
            Booking Sekarang
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 300,
  },

  content: {
    padding: 24,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
    marginRight: 12,
  },

  brand: {
    marginTop: 8,
    color: "#6b7280",
    fontSize: 16,
  },

  price: {
    marginTop: 20,
    fontSize: 32,
    fontWeight: "bold",
    color: "#2563eb",
  },

  day: {
    fontSize: 16,
    color: "#6b7280",
  },

  badge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  available: {
    backgroundColor: "#dcfce7",
  },

  unavailable: {
    backgroundColor: "#fee2e2",
  },

  badgeText: {
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  specBox: {
    marginTop: 28,
    backgroundColor: "#f9fafb",
    padding: 20,
    borderRadius: 20,
  },

  specTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },

  specText: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 12,
    lineHeight: 24,
  },

  bottomBar: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 18,
    borderRadius: 16,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },

});