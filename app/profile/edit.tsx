import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import {
  useEffect,
  useState,
} from "react";

import {
  router,
  Stack,
} from "expo-router";

import {
  getProfile,
  updateProfile,
} from "../../src/services/profile.service";

export default function
EditProfileScreen() {

  const [fullname,
    setFullname] =
      useState("");

  const [email,
    setEmail] =
      useState("");

  const [loading,
    setLoading] =
      useState(false);

  const fetchProfile =
    async () => {

      try {

        const result =
          await getProfile();

        setFullname(
          result.data.fullname
        );

        setEmail(
          result.data.email
        );

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate =
    async () => {

      try {

        setLoading(true);

        await updateProfile({

          fullname,
          email,

        });

        alert(
          "Profile berhasil diupdate"
        );

        router.back();

      } catch (error: any) {

        console.log(error);

        alert(
          error?.response?.data?.message ||
          "Update gagal"
        );

      } finally {

        setLoading(false);

      }
    };

  return (

    <View style={styles.container}>

      <Stack.Screen
        options={{
          title: "Edit Profile",
        }}
      />

      <Text style={styles.label}>
        Fullname
      </Text>

      <TextInput
        style={styles.input}
        value={fullname}
        onChangeText={setFullname}
      />

      <Text style={styles.label}>
        Email
      </Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleUpdate}
      >

        {loading ? (

          <ActivityIndicator
            color="#fff"
          />

        ) : (

          <Text style={styles.buttonText}>
            Simpan Perubahan
          </Text>

        )}

      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 24,
  },

  label: {
    marginTop: 18,
    marginBottom: 10,
    fontWeight: "600",
    color: "#374151",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  button: {
    marginTop: 32,
    backgroundColor: "#2563EB",
    height: 56,
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