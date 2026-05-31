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
  deleteUser,
  getUsers,
} from "../../../src/services/user.service";

// ── Avatar color generator berdasarkan nama ──────────────────────────────────
const AVATAR_PALETTES = [
  { bg: "#DBEAFE", text: "#2563EB" }, // biru
  { bg: "#FCE7F3", text: "#DB2777" }, // pink
  { bg: "#D1FAE5", text: "#059669" }, // hijau
  { bg: "#FEF3C7", text: "#D97706" }, // kuning
  { bg: "#EDE9FE", text: "#7C3AED" }, // ungu
  { bg: "#FFE4E6", text: "#E11D48" }, // merah muda
  { bg: "#CCFBF1", text: "#0D9488" }, // teal
];

const getAvatarPalette = (name: string) => {
  const index = (name?.charCodeAt(0) ?? 0) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
};

// ── Role badge config ────────────────────────────────────────────────────────
const getRoleBadge = (role: string) => {
  switch (role) {
    case "admin":
      return { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA" };
    case "moderator":
      return { bg: "#FFF7ED", text: "#EA580C", border: "#FED7AA" };
    default:
      return { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0" };
  }
};

export default function UsersScreen() {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const result = await getUsers();
      setUsers(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete User",
      "Are you sure want to delete this user?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser(id);
              fetchUsers();
            } catch (error) {
              console.log(error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Users</Text>
          <Text style={styles.subtitle}>Manage registered accounts</Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>{users.length}</Text>
        </View>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => {
          const palette = getAvatarPalette(item.fullname);
          const roleBadge = getRoleBadge(item.role);

          return (
            <View style={styles.card}>

              {/* Top Row: Avatar + Delete */}
              <View style={styles.topRow}>
                <View style={[styles.avatar, { backgroundColor: palette.bg }]}>
                  <Text style={[styles.avatarText, { color: palette.text }]}>
                    {item.fullname?.charAt(0)?.toUpperCase()}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>

              {/* Name & Email */}
              <Text style={styles.name}>{item.fullname}</Text>
              <Text style={styles.email}>{item.email}</Text>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Bottom Row: Role + Join Date */}
              <View style={styles.bottomRow}>
                <View
                  style={[
                    styles.roleBadge,
                    {
                      backgroundColor: roleBadge.bg,
                      borderColor: roleBadge.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.roleDot,
                      { backgroundColor: roleBadge.text },
                    ]}
                  />
                  <Text style={[styles.roleText, { color: roleBadge.text }]}>
                    {item.role}
                  </Text>
                </View>

                <View style={styles.dateRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={11}
                    color="#94A3B8"
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.date}>
                    Joined{" "}
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              </View>

            </View>
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrapper}>
              <Ionicons name="people-outline" size={40} color="#94A3B8" />
            </View>
            <Text style={styles.emptyTitle}>No Users Found</Text>
            <Text style={styles.emptySubtitle}>
              No user accounts have been registered yet.
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

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
  },

  subtitle: {
    marginTop: 4,
    color: "#64748B",
    fontSize: 13,
  },

  countBadge: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  countText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",

    // Subtle shadow untuk depth
    shadowColor: "#94A3B8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 18,
    fontWeight: "700",
  },

  deleteButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  name: {
    marginTop: 16,
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  email: {
    marginTop: 4,
    color: "#64748B",
    fontSize: 13,
  },

  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    gap: 6,
  },

  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },

  roleText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  date: {
    fontSize: 12,
    color: "#94A3B8",
  },

  // ── Empty State ───────────────────────────────────────────────────────────
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
    paddingHorizontal: 32,
  },

  emptyIconWrapper: {
    width: 88,
    height: 88,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
  },
});
