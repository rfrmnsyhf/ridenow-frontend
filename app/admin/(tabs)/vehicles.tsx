import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
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
  Ionicons,
} from "@expo/vector-icons";

import {
  getVehicles,
  deleteVehicle,
} from "../../../src/services/vehicle.service";

const filters = [
  "All",
  "available",
  "rented",
  "maintenance",
];

export default function
VehiclesScreen() {

  const [vehicles,
    setVehicles] =
      useState<any[]>([]);

  const [search,
    setSearch] =
      useState("");

  const [activeFilter,
    setActiveFilter] =
      useState("All");

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
        "Delete Vehicle",
        "Are you sure want to delete this vehicle?",
        [

          {
            text: "Cancel",
            style: "cancel",
          },

          {
            text: "Delete",

            style: "destructive",

            onPress:
              async () => {

                try {

                  try {

                    const result =
                      await deleteVehicle(id);

                    console.log(
                      "DELETE RESULT:",
                      result
                    );

                    Alert.alert(
                      "Success",
                      "Vehicle deleted"
                    );

                    fetchVehicles();

                  } catch (error: any) {

                    console.log(
                      "DELETE ERROR:",
                      error?.response?.data ||
                      error
                    );

                    Alert.alert(
                      "Error",
                      error?.response?.data?.message ||
                      "Failed to delete vehicle"
                    );
                  }

                } catch (error) {

                  console.log(error);

                }
              },
          },
        ]
      );
    };

  const filteredVehicles =
    vehicles.filter((item) => {

      const matchSearch =

        item.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        item.brand
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchFilter =

        activeFilter === "All" ||

        item.status ===
        activeFilter;

      return (
        matchSearch &&
        matchFilter
      );
    });

  const renderStatusColor =
    (status: string) => {

      switch (status) {

        case "available":
          return "#16A34A";

        case "rented":
          return "#DC2626";

        default:
          return "#F59E0B";
      }
    };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Vehicles
      </Text>

      <Text style={styles.subtitle}>
        {vehicles.length} total in fleet
      </Text>

      <View style={styles.searchContainer}>

        <Ionicons
          name="search"
          size={18}
          color="#94A3B8"
        />

        <TextInput
          placeholder="Search vehicles..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />

      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingRight: 20,
        }}
        style={styles.filters}
      >

        {filters.map((filter) => {

          const active =
            activeFilter === filter;

          return (

            <TouchableOpacity
              key={filter}

              style={[

                styles.filterButton,

                active &&
                styles.activeFilter,
              ]}

              onPress={() =>
                setActiveFilter(
                  filter
                )
              }
            >

              <Text
                style={[

                  styles.filterText,

                  active &&
                  styles.activeFilterText,
                ]}
              >

                {filter}

              </Text>

            </TouchableOpacity>
          );
        })}

      </ScrollView>

      <FlatList
        data={filteredVehicles}

        keyExtractor={(item) =>
          item.id.toString()
        }

        showsVerticalScrollIndicator={false}

        contentContainerStyle={{
          paddingBottom: 120,
        }}

        renderItem={({ item }) => (

          <View style={styles.card}>

            <View style={styles.cardRow}>

              <Image
                source={{
                  uri:
                    item.image ||
                    "https://placehold.co/300",
                }}

                style={styles.image}
              />

              <View style={styles.cardContent}>

                <View style={styles.topRow}>

                  <View>

                    <Text style={styles.brand}>
                      {item.brand}
                    </Text>

                    <Text style={styles.name}>
                      {item.name}
                    </Text>

                  </View>

                  <View
                    style={[

                      styles.statusBadge,

                      {
                        backgroundColor:
                          renderStatusColor(
                            item.status
                          ),
                      },
                    ]}
                  >

                    <Text style={styles.statusText}>
                      {item.status}
                    </Text>

                  </View>

                </View>

                <View style={styles.bottomRow}>

                  <View>

                    <Text style={styles.price}>
                      Rp {Number(
                        item.pricePerDay
                      ).toLocaleString("id-ID")}
                    </Text>

                    <Text style={styles.perDay}>
                      / hari
                    </Text>

                  </View>

                  <View style={styles.actions}>

                    <TouchableOpacity
                      style={styles.editButton}

                      onPress={() =>
                        router.push({
                          pathname:
                            "/admin/vehicles/edit/[id]",

                          params: {
                            id: item.id,
                          },
                        })
                      }
                    >

                      <Ionicons
                        name="pencil"
                        size={14}
                        color="#2563EB"
                      />

                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteButton}

                      onPress={() =>
                        handleDelete(item.id)
                      }
                    >

                      <Ionicons
                        name="trash"
                        size={14}
                        color="#EF4444"
                      />

                    </TouchableOpacity>

                  </View>

                </View>

              </View>

            </View>

          </View>
        )}

        ListEmptyComponent={() => (

          <View style={styles.emptyContainer}>

            <Ionicons
              name="car-outline"
              size={64}
              color="#CBD5E1"
            />

            <Text style={styles.emptyTitle}>
              No Vehicles Found
            </Text>

            <Text style={styles.emptySubtitle}>
              Try another keyword
            </Text>

          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}

        onPress={() =>
          router.push(
            "/admin/vehicles/add"
          )
        }
      >

        <Ionicons
          name="add"
          size={26}
          color="#fff"
        />

      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
  },

  subtitle: {
    color: "#64748B",
    marginTop: 6,
    marginBottom: 24,
  },

  searchContainer: {

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#fff",

    borderRadius: 18,

    paddingHorizontal: 16,

    height: 50,

    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#111827",
  },

  filters: {
    marginTop: 18,
    marginBottom: 18,
    maxHeight: 45,
  },

  filterButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  activeFilter: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  filterText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "500",
  },

  activeFilterText: {
    color: "#fff",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },

  cardRow: {
    flexDirection: "row",
  },

  image: {
    width: 112,
    height: 112,
  },

  cardContent: {
    flex: 1,
    padding: 14,
    paddingRight: 16,
  },

  topRow: {

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "flex-start",
  },

  brand: {
    fontSize: 11,
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  bottomRow: {

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginTop: 16,
  },

  price: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "700",
  },

  perDay: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },

  editButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 8,
  },

  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FEF2F2",

    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
  },

  emptyTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },

  emptySubtitle: {
    marginTop: 8,
    color: "#64748B",
  },

  fab: {
    position: "absolute",

    right: 24,
    bottom: 28,

    width: 58,
    height: 58,

    borderRadius: 999,

    backgroundColor: "#2563EB",

    justifyContent: "center",
    alignItems: "center",

    elevation: 8,
  },

});