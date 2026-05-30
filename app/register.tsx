import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useState,
} from "react";

import {
  router,
} from "expo-router";

import {
  Ionicons,
} from "@expo/vector-icons";

import api from "../src/api/axios";

export default function RegisterScreen() {

  const [fullname, setFullname] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleRegister =
    async () => {

      if (
        !fullname ||
        !email ||
        !password
      ) {

        alert(
          "Semua field wajib diisi"
        );

        return;
      }

      try {

        setLoading(true);

        await api.post(
          "/auth/register",
          {
            fullname,
            email,
            password,
          }
        );

        alert(
          "Register berhasil"
        );

        router.replace("/");

      } catch (error: any) {

        console.log(error);

        alert(
          error?.response?.data?.message ||
          "Register gagal"
        );

      } finally {

        setLoading(false);

      }
    };

  return (

    <SafeAreaView style={styles.container}>

      <StatusBar
        barStyle="light-content"
      />

      {/* HERO */}

      <View style={styles.hero}>

        <View style={styles.logoBox}>
          <Ionicons
            name="person-add"
            size={24}
            color="#fff"
          />
        </View>

        <Text style={styles.logoText}>
          RideNow
        </Text>

        <Text style={styles.heroTitle}>
          Buat Akun Baru
        </Text>

        <Text style={styles.heroSubtitle}>
          Daftar untuk mulai menggunakan RideNow
        </Text>

      </View>

      {/* FORM */}

      <View style={styles.form}>

        {/* FULLNAME */}

        <View style={styles.field}>

          <Text style={styles.label}>
            Nama Lengkap
          </Text>

          <View style={styles.inputWrapper}>

            <Ionicons
              name="person-outline"
              size={20}
              color="#60A5FA"
            />

            <TextInput
              placeholder="Masukkan nama lengkap"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={fullname}
              onChangeText={setFullname}
            />

          </View>

        </View>

        {/* EMAIL */}

        <View style={styles.field}>

          <Text style={styles.label}>
            Email
          </Text>

          <View style={styles.inputWrapper}>

            <Ionicons
              name="mail-outline"
              size={20}
              color="#60A5FA"
            />

            <TextInput
              placeholder="email@contoh.com"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

          </View>

        </View>

        {/* PASSWORD */}

        <View style={styles.field}>

          <Text style={styles.label}>
            Password
          </Text>

          <View style={styles.inputWrapper}>

            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#60A5FA"
            />

            <TextInput
              placeholder="Masukkan password"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >

              <Ionicons
                name={
                  showPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={20}
                color="#94A3B8"
              />

            </TouchableOpacity>

          </View>

        </View>

        {/* BUTTON */}

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >

          {loading ? (

            <ActivityIndicator
              color="#fff"
            />

          ) : (

            <Text style={styles.buttonText}>
              Daftar Sekarang
            </Text>

          )}

        </TouchableOpacity>

        {/* LOGIN */}

        <TouchableOpacity
          onPress={() =>
            router.replace("/")
          }
        >

          <Text style={styles.loginText}>
            Sudah punya akun? Login
          </Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  hero: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 50,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  logoBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor:
      "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  logoText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 18,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },

  heroSubtitle: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
    fontSize: 15,
    lineHeight: 24,
  },

  form: {
    flex: 1,
    padding: 24,
    paddingTop: 36,
  },

  field: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 10,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1.5,
    borderColor: "#DBEAFE",
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 56,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#111827",
  },

  button: {
    height: 56,
    backgroundColor: "#2563EB",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#2563EB",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  loginText: {
    marginTop: 28,
    textAlign: "center",
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 15,
  },

});