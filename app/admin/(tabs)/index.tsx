import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  ScrollView,
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
        "Hapus Kendaraan",
        "Yakin ingin menghapus kendaraan?",
        [

          {
            text: "Batal",
            style: "cancel",
          },

          {
            text: "Hapus",

            style: "destructive",

            onPress:
              async () => {

                try {

                  await deleteVehicle(id);

                  fetchVehicles();

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
          size={20}
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
        keyboardShouldPersistTaps="handled"
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
        nestedScrollEnabled


        keyExtractor={(item) =>
          item.id.toString()
        }

        showsVerticalScrollIndicator={false}

        contentContainerStyle={{
          paddingBottom: 120,
        }}

        renderItem={({ item }) => (

          <View style={styles.card}>

            <Image
              source={{
                uri:
                  item.image ||
                  "https://placehold.co/400",
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

                <Text style={styles.price}>
                  Rp {item.price}
                </Text>

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
                      size={16}
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
                      size={16}
                      color="#DC2626"
                    />

                  </TouchableOpacity>

                </View>

              </View>

            </View>

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
          size={28}
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

    height: 54,

    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },

  filters: {
    marginTop: 20,
    marginBottom: 20,
    maxHeight: 50,
  },


  filterButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 10,
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
    fontWeight: "500",
  },

  activeFilterText: {
    color: "#fff",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    marginBottom: 18,
    overflow: "hidden",
    zIndex: 1,
  },

  image: {
    width: "100%",
    height: 180,
  },

  cardContent: {
    padding: 16,
  },

  topRow: {

    flexDirection: "row",

    justifyContent:
      "space-between",
  },

  brand: {
    fontSize: 12,
    color: "#64748B",
    textTransform: "uppercase",
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start",
  },

  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  bottomRow: {

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginTop: 18,
  },

  price: {
    color: "#2563EB",
    fontSize: 18,
    fontWeight: "bold",
  },

  actions: {
    flexDirection: "row",
  },

  editButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#DBEAFE",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 10,
  },

  deleteButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",

    justifyContent: "center",
    alignItems: "center",
  },

  fab: {
    position: "absolute",

    right: 24,
    bottom: 28,

    width: 64,
    height: 64,

    borderRadius: 999,

    backgroundColor: "#2563EB",

    justifyContent: "center",
    alignItems: "center",

    elevation: 8,
  },

});