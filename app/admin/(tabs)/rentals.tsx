import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useEffect,
  useState,
} from "react";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  deleteRental,
  getRentals,
  updateRentalStatus,
} from "../../../src/services/rental.service";

export default function
RentalsScreen() {

  const [rentals,
    setRentals] =
      useState<any[]>([]);

  const fetchRentals =
    async () => {

      try {

        const result =
          await getRentals();

        setRentals(
          result.data
        );

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {

    fetchRentals();

  }, []);

  const handleComplete =
    async (id: number) => {

      try {

        await updateRentalStatus(
          id,
          "completed"
        );

        fetchRentals();

      } catch (error) {

        console.log(error);
      }
    };

  const handleDelete =
    (id: number) => {

      Alert.alert(
        "Delete Rental",
        "Delete this rental data?",
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

                  await deleteRental(id);

                  fetchRentals();

                } catch (error) {

                  console.log(error);
                }
              },
          },
        ]
      );
    };

  const renderStatusColor =
    (status: string) => {

      switch (status) {

        case "completed":
          return "#16A34A";

        case "pending":
          return "#F59E0B";

        default:
          return "#2563EB";
      }
    };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Rentals
      </Text>

      <Text style={styles.subtitle}>
        Manage customer rentals
      </Text>

      <FlatList
        data={rentals}

        keyExtractor={(item) =>
          item.id.toString()
        }

        showsVerticalScrollIndicator={false}

        contentContainerStyle={{
          paddingBottom: 120,
        }}

        renderItem={({ item }) => (

          <View style={styles.card}>

            <View style={styles.topRow}>

              <View>

                <Text style={styles.customer}>
                  {item.user.fullname}
                </Text>

                <Text style={styles.email}>
                  {item.user.email}
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

            <View style={styles.vehicleBox}>

              <Ionicons
                name="car-sport"
                size={20}
                color="#2563EB"
              />

              <View style={{
                marginLeft: 12
              }}>

                <Text style={styles.vehicleName}>
                  {item.vehicle.name}
                </Text>

                <Text style={styles.vehicleBrand}>
                  {item.vehicle.brand}
                </Text>

              </View>

            </View>

            <View style={styles.dateRow}>

              <View>

                <Text style={styles.label}>
                  Start Date
                </Text>

                <Text style={styles.date}>
                  {new Date(
                    item.startDate
                  ).toLocaleDateString(
                    "id-ID"
                  )}
                </Text>

              </View>

              <View>

                <Text style={styles.label}>
                  End Date
                </Text>

                <Text style={styles.date}>
                  {new Date(
                    item.endDate
                  ).toLocaleDateString(
                    "id-ID"
                  )}
                </Text>

              </View>

            </View>

            <View style={styles.bottomRow}>

              <View>

                <Text style={styles.label}>
                  Total Price
                </Text>

                <Text style={styles.price}>
                  Rp {Number(
                    item.totalPrice
                  ).toLocaleString(
                    "id-ID"
                  )}
                </Text>

              </View>

              <View style={styles.actions}>

                {item.status !==
                  "completed" && (

                  <TouchableOpacity
                    style={styles.completeButton}

                    onPress={() =>
                      handleComplete(
                        item.id
                      )
                    }
                  >

                    <Ionicons
                      name="checkmark"
                      size={16}
                      color="#fff"
                    />

                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.deleteButton}

                  onPress={() =>
                    handleDelete(
                      item.id
                    )
                  }
                >

                  <Ionicons
                    name="trash"
                    size={16}
                    color="#EF4444"
                  />

                </TouchableOpacity>

              </View>

            </View>

          </View>
        )}

        ListEmptyComponent={() => (

          <View style={styles.emptyContainer}>

            <Ionicons
              name="document-text-outline"
              size={64}
              color="#CBD5E1"
            />

            <Text style={styles.emptyTitle}>
              No Rentals Found
            </Text>

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
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 24,
    color: "#64748B",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  customer: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  email: {
    marginTop: 4,
    color: "#64748B",
    fontSize: 13,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  vehicleBox: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 14,
  },

  vehicleName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  vehicleBrand: {
    marginTop: 2,
    color: "#64748B",
    fontSize: 12,
  },

  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  label: {
    fontSize: 12,
    color: "#94A3B8",
  },

  date: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },

  bottomRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: "700",
    color: "#2563EB",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },

  completeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#16A34A",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 10,
  },

  deleteButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",

    justifyContent: "center",
    alignItems: "center",
  },

  emptyContainer: {
    marginTop: 120,
    alignItems: "center",
  },

  emptyTitle: {
    marginTop: 18,
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

});