import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useEffect,
  useState,
} from "react";

import {
  getRentals,
} from "../../src/services/rental.service";
import { router } from "expo-router";

export default function HistoryScreen() {

  const [rentals, setRentals] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchRentals =
    async () => {

      try {

        const result =
          await getRentals();

        setRentals(result.data);

      } catch (error) {

        console.log(error);

        alert(
          "Gagal mengambil data rental"
        );

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {
    fetchRentals();
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

        {/* HEADER */}

        <View style={styles.header}>

          <Text style={styles.title}>
            Riwayat Rental
          </Text>

          <Text style={styles.subtitle}>
            Semua aktivitas rental kendaraan Anda
          </Text>

        </View>

        {/* LIST */}

        <View style={styles.listContainer}>

          {rentals.map((item) => (

            <TouchableOpacity
              key={item.id}
              style={styles.card}

              onPress={() => {

                router.push(
                  `/rentals/${item.id}` as any
                );

              }}
            >

              <View style={styles.cardTop}>

                <View>

                  <Text style={styles.vehicle}>
                    {item.vehicle.name}
                  </Text>

                  <Text style={styles.date}>
                    {new Date(
                      item.startDate
                    ).toLocaleDateString()}
                  </Text>

                </View>

                <View
                  style={[
                    styles.badge,

                    item.status ===
                    "approved"
                      ? styles.completed
                      : item.status ===
                        "pending"
                        ? styles.pending
                        : styles.active,
                  ]}
                >

                  <Text
                    style={styles.badgeText}
                  >
                    {item.status}
                  </Text>

                </View>

              </View>

              <View style={styles.cardBottom}>

                <Text style={styles.price}>
                  Rp {item.totalPrice}
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#9CA3AF"
                />

              </View>

            </TouchableOpacity>

          ))}

        </View>

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

  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
  },

  subtitle: {
    marginTop: 8,
    color: "#6B7280",
    lineHeight: 22,
  },

  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  vehicle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  date: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 13,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  completed: {
    backgroundColor: "#DCFCE7",
  },

  active: {
    backgroundColor: "#DBEAFE",
  },

  pending: {
    backgroundColor: "#FEF3C7",
  },

  badgeText: {
    fontWeight: "bold",
    fontSize: 12,
    textTransform: "capitalize",
  },

  cardBottom: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
  },

});