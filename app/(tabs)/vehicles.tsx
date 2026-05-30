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

import {
  useEffect,
  useState,
} from "react";

import { router } from "expo-router";

import {
  getVehicles,
} from "../../src/services/vehicle.service";

export default function VehicleListScreen() {

  const [vehicles, setVehicles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const fetchVehicles = async () => {

    try {

      const result =
        await getVehicles();

      setVehicles(result.data);

    } catch (error) {

      console.log(error);

      alert(
        "Gagal mengambil data kendaraan"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles =
    vehicles.filter((item: any) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.header}>
        RideNow
      </Text>

      <Text style={styles.subHeader}>
        Pilih kendaraan terbaikmu
      </Text>

      <TextInput
        placeholder="Cari kendaraan..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredVehicles}
        keyExtractor={(item: any) =>
          item.id.toString()
        }
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: any) => (

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push(
                `/vehicles/${item.id}` as any
              )
            }
          >

            <Image
              source={{
                uri:
                  item.image ||
                  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200",
              }}
              style={styles.image}
            />

            <View style={styles.cardContent}>

              <View style={styles.rowBetween}>

                <Text style={styles.name}>
                  {item.name}
                </Text>

                <View
                  style={[
                    styles.badge,
                    item.status ===
                    "available"
                      ? styles.available
                      : styles.unavailable,
                  ]}
                >
                  <Text
                    style={styles.badgeText}
                  >
                    {item.status}
                  </Text>
                </View>

              </View>

              <Text style={styles.brand}>
                {item.brand}
              </Text>

              <Text style={styles.price}>
                Rp {item.pricePerDay}
                <Text style={styles.day}>
                  /hari
                </Text>
              </Text>

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
    backgroundColor: "#f9fafb",
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
  },

  subHeader: {
    color: "#6b7280",
    marginTop: 6,
    marginBottom: 24,
    fontSize: 16,
  },

  searchInput: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 190,
  },

  cardContent: {
    padding: 16,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },

  brand: {
    color: "#6b7280",
    marginTop: 6,
    fontSize: 15,
  },

  price: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563eb",
  },

  day: {
    fontSize: 14,
    color: "#6b7280",
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  available: {
    backgroundColor: "#dcfce7",
  },

  unavailable: {
    backgroundColor: "#fee2e2",
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
  },

});