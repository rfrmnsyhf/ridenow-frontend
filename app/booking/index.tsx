import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useLocalSearchParams,
  router,
  Stack,
} from "expo-router";

import {
  useEffect,
  useState,
} from "react";

import DateTimePicker
from "@react-native-community/datetimepicker";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  getVehicleById,
} from "../../src/services/vehicle.service";

import {
  createBooking,
} from "../../src/services/booking.service";

export default function BookingScreen() {

  const { vehicleId } =
    useLocalSearchParams();

  const [vehicle, setVehicle] =
    useState<any>(null);

  const [startDate, setStartDate] =
    useState(new Date());

  const [endDate, setEndDate] =
    useState(new Date());

  const [showStartPicker,
    setShowStartPicker] =
      useState(false);

  const [showEndPicker,
    setShowEndPicker] =
      useState(false);

  const [loading, setLoading] =
    useState(false);

  const [fetchLoading,
    setFetchLoading] =
      useState(true);

  const fetchVehicle =
    async () => {

      try {

        const result =
          await getVehicleById(
            vehicleId as string
          );

        setVehicle(result.data);

      } catch (error) {

        console.log(error);

        alert(
          "Gagal mengambil kendaraan"
        );

      } finally {

        setFetchLoading(false);

      }
    };

  useEffect(() => {
    fetchVehicle();
  }, []);

  const calculateTotal =
    () => {

      if (!vehicle) {
        return 0;
      }

      const diffTime =
        endDate.getTime() -
        startDate.getTime();

      const diffDays =
        Math.ceil(
          diffTime /
          (1000 * 60 * 60 * 24)
        );

      if (diffDays <= 0) {
        return vehicle.pricePerDay;
      }

      return (
        diffDays *
        vehicle.pricePerDay
      );
    };

  const handleBooking =
    async () => {

      try {

        setLoading(true);

        await createBooking({

          vehicleId:
            Number(vehicleId),

          startDate:
            startDate.toISOString(),

          endDate:
            endDate.toISOString(),

          totalPrice:
            calculateTotal(),

        });

        alert(
          "Booking berhasil"
        );

        router.replace(
          "/history" as any
        );

      } catch (error: any) {

        console.log(error);

        alert(
          error?.response?.data?.message ||
          "Booking gagal"
        );

      } finally {

        setLoading(false);

      }
    };

  if (fetchLoading) {
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

      <Stack.Screen
        options={{
          headerTitle: "Booking",
        }}
      />

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.title}>
          Booking Kendaraan
        </Text>

        <Text style={styles.subtitle}>
          Lengkapi informasi booking Anda
        </Text>

      </View>

      {/* VEHICLE */}

      <View style={styles.vehicleCard}>

        <View style={styles.iconBox}>

          <Ionicons
            name="car-sport"
            size={26}
            color="#2563EB"
          />

        </View>

        <View>

          <Text style={styles.vehicleName}>
            {vehicle?.name}
          </Text>

          <Text style={styles.vehicleBrand}>
            {vehicle?.brand}
          </Text>

        </View>

      </View>

      {/* DATE PICKER */}

      <View style={styles.form}>

        {/* START DATE */}

        <Text style={styles.label}>
          Tanggal Mulai
        </Text>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() =>
            setShowStartPicker(true)
          }
        >

          <Ionicons
            name="calendar-outline"
            size={20}
            color="#2563EB"
          />

          <Text style={styles.dateText}>
            {startDate.toLocaleDateString()}
          </Text>

        </TouchableOpacity>

        {showStartPicker && (

          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(
              event,
              selectedDate
            ) => {

              setShowStartPicker(
                false
              );

              if (selectedDate) {
                setStartDate(
                  selectedDate
                );
              }
            }}
          />

        )}

        {/* END DATE */}

        <Text style={styles.label}>
          Tanggal Selesai
        </Text>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() =>
            setShowEndPicker(true)
          }
        >

          <Ionicons
            name="calendar-outline"
            size={20}
            color="#2563EB"
          />

          <Text style={styles.dateText}>
            {endDate.toLocaleDateString()}
          </Text>

        </TouchableOpacity>

        {showEndPicker && (

          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(
              event,
              selectedDate
            ) => {

              setShowEndPicker(
                false
              );

              if (selectedDate) {
                setEndDate(
                  selectedDate
                );
              }
            }}
          />

        )}

        {/* TOTAL */}

        <View style={styles.totalCard}>

          <Text style={styles.totalLabel}>
            Total Harga
          </Text>

          <Text style={styles.totalPrice}>
            Rp {calculateTotal()}
          </Text>

        </View>

        {/* BUTTON */}

        <TouchableOpacity
          style={styles.button}
          onPress={handleBooking}
          disabled={loading}
        >

          {loading ? (

            <ActivityIndicator
              color="#fff"
            />

          ) : (

            <Text style={styles.buttonText}>
              Booking Sekarang
            </Text>

          )}

        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 24,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    marginTop: 20,
    marginBottom: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
  },

  subtitle: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 15,
  },

  vehicleCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  vehicleName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },

  vehicleBrand: {
    marginTop: 4,
    color: "#6B7280",
  },

  form: {
    flex: 1,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
  },

  dateButton: {
    height: 58,
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  dateText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#111827",
  },

  totalCard: {
    backgroundColor: "#2563EB",
    borderRadius: 26,
    padding: 24,
    marginTop: 10,
    marginBottom: 28,
  },

  totalLabel: {
    color: "#BFDBFE",
    marginBottom: 10,
    fontSize: 14,
  },

  totalPrice: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
  },

  button: {
    backgroundColor: "#2563EB",
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

});