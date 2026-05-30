import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  router,
} from "expo-router";

import {
  useEffect,
  useState,
} from "react";

import {
  getProfile,
} from "../../src/services/profile.service";

export default function ProfileScreen() {

  const [user, setUser] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const fetchProfile =
    async () => {

      try {

        const result =
          await getProfile();

        setUser(result.data);

      } catch (error) {

        console.log(error);

        alert(
          "Gagal mengambil profile"
        );

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout =
    async () => {

      Alert.alert(
        "Logout",
        "Yakin ingin keluar?",
        [
          {
            text: "Batal",
            style: "cancel",
          },
          {
            text: "Logout",

            onPress: async () => {

              try {

                await AsyncStorage.clear();

                router.dismissAll();

                setTimeout(() => {

                  router.replace("/");

                }, 100);

              } catch (error) {

                console.log(error);

              }

            },
          },
        ]
      );
    };

  const menus = [
    {
      title: "Edit Profile",
      icon: "person-outline",
    },
    {
      title: "Metode Pembayaran",
      icon: "card-outline",
    },
    {
      title: "Notifikasi",
      icon: "notifications-outline",
    },
    {
      title: "Bantuan",
      icon: "help-circle-outline",
    },
  ];

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}

        <View style={styles.header}>

          <View style={styles.avatar}>

            <Ionicons
              name="person"
              size={50}
              color="#2563EB"
            />

          </View>

          <Text style={styles.name}>
            {user?.fullname}
          </Text>

          <Text style={styles.email}>
            {user?.email}
          </Text>

          <View style={styles.roleBadge}>

            <Text style={styles.roleText}>
              {user?.role}
            </Text>

          </View>

        </View>

        {/* MENU */}

        <View style={styles.menuContainer}>

          {menus.map((item, index) => (

            <TouchableOpacity
              key={index}
              style={styles.menuCard}

              onPress={() => {

                if (
                  item.title ===
                  "Edit Profile"
                ) {

                  router.push(
                    "/profile/edit" as any
                  );

                }

                if (
                  item.title ===
                  "Metode Pembayaran"
                ) {

                  router.push(
                    "/payment" as any
                  );

                }

              }}
            >

              <View style={styles.menuLeft}>

                <View style={styles.iconBox}>

                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color="#2563EB"
                  />

                </View>

                <Text style={styles.menuText}>
                  {item.title}
                </Text>

              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color="#9CA3AF"
              />

            </TouchableOpacity>

          ))}

        </View>

        {/* LOGOUT */}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >

          <Ionicons
            name="log-out-outline"
            size={20}
            color="#fff"
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: "#2563EB",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 999,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },

  email: {
    marginTop: 8,
    color: "#DBEAFE",
    fontSize: 15,
  },

  roleBadge: {
    marginTop: 16,
    backgroundColor:
      "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },

  roleText: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  menuContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  logoutButton: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: "#EF4444",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },

});