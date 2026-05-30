import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import {
  useEffect,
  useState,
} from "react";

import {
  router,
} from "expo-router";

import {
  deleteVehicle,
  getVehicles,
} from "../../../src/services/vehicle.service";

export default function
AdminVehicleScreen() {

  const [vehicles,
    setVehicles] =
      useState<any[]>([]);

  const fetchVehicles =
    async () => {

      try {

        const result =
          await getVehicles();

        setVehicles(
          result.data
        );

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {

    fetchVehicles();

  }, []);

  const handleDelete =
    (id: number) => {

      Alert.alert(
        "Hapus Kendaraan",
        "Yakin ingin hapus kendaraan?",
        [

          {
            text: "Batal",
          },

          {
            text: "Hapus",

            onPress:
              async () => {

                await deleteVehicle(id);

                fetchVehicles();

              },
          },

        ]
      );
    };

  return (

    <View style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.title}>
          Admin Kendaraan
        </Text>

        <TouchableOpacity
          style={styles.addButton}

          onPress={() =>
            router.push(
              "/admin/vehicles/add" as any
            )
          }
        >

          <Text style={styles.addText}>
            + Tambah
          </Text>

        </TouchableOpacity>

      </View>

      <FlatList
        data={vehicles}

        keyExtractor={(item) =>
          item.id.toString()
        }

        renderItem={({ item }) => (

          <View style={styles.card}>

            <View>

              <Text style={styles.name}>
                {item.name}
              </Text>

              <Text style={styles.brand}>
                {item.brand}
              </Text>

              <Text style={styles.price}>
                Rp {item.price}
              </Text>

            </View>

            <View style={styles.actions}>

              <TouchableOpacity
                style={styles.editButton}

                onPress={() =>
                  router.push(
                    `/admin/vehicles/edit/${item.id}` as any
                  )
                }
              >

                <Text style={styles.actionText}>
                  Edit
                </Text>

              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}

                onPress={() =>
                  handleDelete(item.id)
                }
              >

                <Text style={styles.actionText}>
                  Hapus
                </Text>

              </TouchableOpacity>

            </View>

          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },

  header: {

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },

  addButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },

  addText: {
    color: "#fff",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  brand: {
    color: "#6B7280",
    marginTop: 4,
  },

  price: {
    color: "#2563EB",
    fontWeight: "bold",
    marginTop: 8,
  },

  actions: {
    flexDirection: "row",
    gap: 8,
  },

  editButton: {
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 10,
  },

  deleteButton: {
    backgroundColor: "#DC2626",
    padding: 10,
    borderRadius: 10,
  },

  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },

});