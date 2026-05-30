import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import {
  useEffect,
  useState,
} from "react";

import {
  useLocalSearchParams,
  Stack,
} from "expo-router";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  getRentalById,
} from "../../src/services/rental.service";

export default function
RentalDetailScreen() {

  const { id } =
    useLocalSearchParams();

  const [rental, setRental] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const fetchRental =
    async () => {

      try {

        const result =
          await getRentalById(
            id as string
          );

        setRental(result.data);

      } catch (error) {

        console.log(error);

        alert(
          "Gagal mengambil detail rental"
        );

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {
    fetchRental();
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

    <View style={styles.container}>

      <Stack.Screen
        options={{
          title: "Detail Rental",
        }}
      />

      <View style={styles.card}>

        <View style={styles.iconBox}>

          <Ionicons
            name="car-sport"
            size={34}
            color="#2563EB"
          />

        </View>

        <Text style={styles.vehicle}>
          {rental?.vehicle?.name}
        </Text>

        <Text style={styles.brand}>
          {rental?.vehicle?.brand}
        </Text>

        {/* STATUS */}

        <View
          style={[
            styles.statusBadge,

            rental?.status ===
            "approved"
              ? styles.approved
              : styles.pending,
          ]}
        >

          <Text style={styles.statusText}>
            {rental?.status}
          </Text>

        </View>

      </View>

      {/* DETAILS */}

      <View style={styles.details}>

        <View style={styles.row}>

          <Text style={styles.label}>
            Tanggal Mulai
          </Text>

          <Text style={styles.value}>
            {new Date(
              rental?.startDate
            ).toLocaleDateString()}
          </Text>

        </View>

        <View style={styles.row}>

          <Text style={styles.label}>
            Tanggal Selesai
          </Text>

          <Text style={styles.value}>
            {new Date(
              rental?.endDate
            ).toLocaleDateString()}
          </Text>

        </View>

        <View style={styles.row}>

          <Text style={styles.label}>
            Total Harga
          </Text>

          <Text style={styles.price}>
            Rp{" "}
            {rental?.totalPrice
              ?.toLocaleString("id-ID")}
          </Text>

        </View>

        <View style={styles.row}>

          <Text style={styles.label}>
            Customer
          </Text>

          <Text style={styles.value}>
            {rental?.user?.fullname}
          </Text>

        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 24,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    marginTop: 40,
  },

  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  vehicle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },

  brand: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 16,
  },

  statusBadge: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },

  approved: {
    backgroundColor: "#DCFCE7",
  },

  pending: {
    backgroundColor: "#FEF3C7",
  },

  statusText: {
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  details: {
    marginTop: 28,
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  label: {
    color: "#6B7280",
    fontSize: 15,
  },

  value: {
    color: "#111827",
    fontWeight: "600",
  },

  price: {
    color: "#2563EB",
    fontWeight: "bold",
    fontSize: 18,
  },

});