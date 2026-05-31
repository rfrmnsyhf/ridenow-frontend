import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useState,
} from "react";

import {
  router,
} from "expo-router";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  createVehicle,
} from "../../../src/services/vehicle.service";

import * as ImagePicker
  from "expo-image-picker";

export default function AddVehicleScreen() {

  const [name, setName] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [plateNumber,
    setPlateNumber] =
      useState("");

  const [pricePerDay,
    setPricePerDay] =
      useState("");

  const [image, setImage] =
    useState("");

  const pickImage =
    async () => {

      try {

        const permission =

          await ImagePicker
            .requestMediaLibraryPermissionsAsync();

        if (
          permission.status !==
          "granted"
        ) {

          alert(
            "Gallery permission required"
          );

          return;
        }

        const result =

          await ImagePicker
            .launchImageLibraryAsync({

              mediaTypes:
                ["images"],

              allowsEditing: true,

              aspect: [4, 3],

              quality: 1,
            });

        if (!result.canceled) {

          setImage(
            result.assets[0].uri
          );
        }

      } catch (error) {

        console.log(
          "IMAGE PICK ERROR:",
          error
        );
      }
  };

  const handleSubmit =
    async () => {

      try {

        if (
          !name ||
          !brand ||
          !plateNumber ||
          !pricePerDay
        ) {

          alert(
            "Please fill all required fields"
          );

          return;
        }

        await createVehicle({

          name,
          brand,
          plateNumber,

          pricePerDay:
            Number(pricePerDay),

          image,
          status: "available",

        });

        alert(
          "Vehicle added successfully"
        );

        router.back();

      } catch (error: any) {

        console.log(
          "ADD VEHICLE ERROR:",
          error?.response?.data ||
          error
        );

        alert(
          error?.response?.data?.message ||
          "Failed to add vehicle"
        );
      }
    };

  return (

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      <Text style={styles.title}>
        Add Vehicle
      </Text>

      <Text style={styles.subtitle}>
        Create new fleet entry
      </Text>

      <TouchableOpacity
        style={styles.uploadBox}
        onPress={pickImage}
        activeOpacity={0.8}
      >

        {image?.trim() ? (

          <Image
            source={{
              uri: image
            }}
            style={styles.previewImage}
          />

        ) : (

          <>

            <View style={styles.cameraCircle}>

              <Ionicons
                name="camera"
                size={22}
                color="#2563EB"
              />

            </View>

            <Text style={styles.uploadTitle}>
              Vehicle Preview
            </Text>

            <Text style={styles.uploadSub}>
              Tap to upload image
            </Text>

          </>
        )}

      </TouchableOpacity>

      <View style={styles.form}>

        <View style={styles.field}>

          <Text style={styles.label}>
            Vehicle Name
          </Text>

          <TextInput
            placeholder="e.g. Fortuner"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

        </View>

        <View style={styles.field}>

          <Text style={styles.label}>
            Brand
          </Text>

          <TextInput
            placeholder="e.g. Toyota"
            style={styles.input}
            value={brand}
            onChangeText={setBrand}
          />

        </View>

        <View style={styles.field}>

          <Text style={styles.label}>
            Plate Number
          </Text>

          <TextInput
            placeholder="e.g. BP1234XYZ"
            style={styles.input}
            value={plateNumber}
            onChangeText={setPlateNumber}
            autoCapitalize="characters"
          />

        </View>

        <View style={styles.field}>

          <Text style={styles.label}>
            Price / Day
          </Text>

          <TextInput
            placeholder="500000"
            style={styles.input}
            keyboardType="numeric"
            value={pricePerDay}
            onChangeText={setPricePerDay}
          />

        </View>

        <View style={styles.field}>

          <Text style={styles.label}>
            Image URL
          </Text>

          <TextInput
            placeholder="https://..."
            style={styles.input}
            value={image}
            onChangeText={setImage}
            autoCapitalize="none"
          />

        </View>

      </View>

      <TouchableOpacity
        style={styles.saveButton}
        
        onPress={handleSubmit}
      >

        <Text style={styles.saveText}>
          Save Vehicle
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() =>
          router.back()
        }
      >

        <Text style={styles.cancelText}>
          Cancel
        </Text>

      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingTop: 60,
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

  uploadBox: {
    height: 180,
    borderRadius: 28,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    backgroundColor: "#fff",

    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  cameraCircle: {
    width: 54,
    height: 54,
    borderRadius: 999,
    backgroundColor: "#DBEAFE",

    justifyContent: "center",
    alignItems: "center",
  },

  uploadTitle: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },

  uploadSub: {
    marginTop: 4,
    fontSize: 12,
    color: "#94A3B8",
  },

  form: {
    marginTop: 26,
  },

  field: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 8,
    marginLeft: 4,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    height: 54,
    fontSize: 14,
    color: "#111827",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  halfField: {
    width: "48%",
  },

  saveButton: {
    backgroundColor: "#2563EB",
    height: 56,
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 12,
  },

  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  cancelButton: {
    backgroundColor: "#fff",
    height: 56,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",

    justifyContent: "center",
    alignItems: "center",

    marginTop: 14,
    marginBottom: 40,
  },

  cancelText: {
    color: "#475569",
    fontSize: 15,
    fontWeight: "600",
  },

});