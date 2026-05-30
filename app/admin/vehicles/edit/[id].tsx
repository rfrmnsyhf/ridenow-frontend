import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import {
  useEffect,
  useState,
} from "react";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  getVehicleById,
  updateVehicle,
} from "../../../../src/services/vehicle.service";

export default function
EditVehicleScreen() {

  const { id } =
    useLocalSearchParams();

  const [name,
    setName] =
      useState("");

  const [brand,
    setBrand] =
      useState("");

  const [price,
    setPrice] =
      useState("");

  const [image,
    setImage] =
      useState("");

  const [status,
    setStatus] =
      useState("");

  const fetchVehicle =
    async () => {

      try {

        const result =
          await getVehicleById(
            id as string
          );

        const vehicle =
          result.data;

        setName(
          vehicle.name
        );

        setBrand(
          vehicle.brand
        );

        setPrice(
          String(vehicle.price)
        );

        setImage(
          vehicle.image || ""
        );

        setStatus(
          vehicle.status
        );

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {

    fetchVehicle();

  }, []);

  const handleUpdate =
    async () => {

      try {

        await updateVehicle(

          Number(id),

          {

            name,

            brand,

            price:
              Number(price),

            image,

            status,

          }

        );

        alert(
          "Kendaraan berhasil diupdate"
        );

        router.back();

      } catch (error) {

        console.log(error);

        alert(
          "Gagal update kendaraan"
        );

      }
    };

  return (

    <ScrollView
      style={styles.container}
    >

      <Text style={styles.title}>
        Edit Kendaraan
      </Text>

      <TextInput
        placeholder="Nama Kendaraan"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Brand"
        style={styles.input}
        value={brand}
        onChangeText={setBrand}
      />

      <TextInput
        placeholder="Harga"
        style={styles.input}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TextInput
        placeholder="URL Gambar"
        style={styles.input}
        value={image}
        onChangeText={setImage}
      />

      <TextInput
        placeholder="Status"
        style={styles.input}
        value={status}
        onChangeText={setStatus}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleUpdate}
      >

        <Text style={styles.buttonText}>
          Update Kendaraan
        </Text>

      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#111827",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 18,
    borderRadius: 14,
    marginTop: 8,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

});