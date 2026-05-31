import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";

import {
  useEffect,
  useState,
} from "react";

import { Ionicons } from "@expo/vector-icons";

import {
  createPayment,
  deletePayment,
  getPayments,
} from "../../src/services/payment.service";

const providerColors: any = {
  Gopay:      { bg: "#ECFDF5", icon: "#059669", letter: "#059669" },
  Dana:       { bg: "#EFF6FF", icon: "#3B82F6", letter: "#3B82F6" },
  OVO:        { bg: "#F5F3FF", icon: "#7C3AED", letter: "#7C3AED" },
  PayPal:     { bg: "#EFF6FF", icon: "#0070BA", letter: "#0070BA" },
  Visa:       { bg: "#EFF6FF", icon: "#2563EB", letter: "#2563EB" },
  Mastercard: { bg: "#FFF1F2", icon: "#E11D48", letter: "#E11D48" },
};

const providerIcons: any = {
  Gopay:      "wallet-outline",
  Dana:       "wallet-outline",
  OVO:        "wallet-outline",
  PayPal:     "logo-paypal",
  Visa:       "card-outline",
  Mastercard: "card-outline",
};

export default function PaymentScreen() {

  const [payments, setPayments] = useState<any[]>([]);
  const [provider, setProvider] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      const result = await getPayments();
      setPayments(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleCreate = async () => {
    if (!provider || !accountName || !accountNo) {
      return alert("Lengkapi data payment");
    }

    try {
      await createPayment({
        type: "e-wallet",
        provider,
        accountName,
        accountNo,
        isDefault: false,
      });

      setProvider("");
      setAccountName("");
      setAccountNo("");

      fetchPayments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Hapus Payment",
      "Yakin ingin menghapus?",
      [
        { text: "Batal" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            await deletePayment(id);
            fetchPayments();
          },
        },
      ]
    );
  };

  const colors = (p: string) =>
    providerColors[p] ?? { bg: "#F1F5F9", icon: "#64748B", letter: "#64748B" };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Metode Pembayaran</Text>
        <Text style={styles.subtitle}>Kelola akun pembayaran Anda</Text>
      </View>

      {/* Form Card */}
      <View style={styles.formCard}>
        <View style={styles.formHeaderRow}>
          <View style={styles.formIconWrap}>
            <Ionicons name="add-circle-outline" size={16} color="#2563EB" />
          </View>
          <Text style={styles.formTitle}>Tambah Metode Baru</Text>
        </View>

        {/* Provider */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Provider</Text>
          <View
            style={[
              styles.inputWrap,
              focusedField === "provider" && styles.inputWrapFocused,
            ]}
          >
            <Ionicons
              name="wallet-outline"
              size={16}
              color={focusedField === "provider" ? "#2563EB" : "#94A3B8"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Gopay, Dana, OVO..."
              placeholderTextColor="#CBD5E1"
              style={styles.input}
              value={provider}
              onChangeText={setProvider}
              onFocus={() => setFocusedField("provider")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* Account Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nama Akun</Text>
          <View
            style={[
              styles.inputWrap,
              focusedField === "accountName" && styles.inputWrapFocused,
            ]}
          >
            <Ionicons
              name="person-outline"
              size={16}
              color={focusedField === "accountName" ? "#2563EB" : "#94A3B8"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Nama pemilik akun"
              placeholderTextColor="#CBD5E1"
              style={styles.input}
              value={accountName}
              onChangeText={setAccountName}
              onFocus={() => setFocusedField("accountName")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* Account No */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nomor Akun</Text>
          <View
            style={[
              styles.inputWrap,
              focusedField === "accountNo" && styles.inputWrapFocused,
            ]}
          >
            <Ionicons
              name="keypad-outline"
              size={16}
              color={focusedField === "accountNo" ? "#2563EB" : "#94A3B8"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="08xxxxxxxxxx"
              placeholderTextColor="#CBD5E1"
              style={styles.input}
              value={accountNo}
              onChangeText={setAccountNo}
              keyboardType="numeric"
              onFocus={() => setFocusedField("accountNo")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreate}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.buttonText}>Tambah Payment</Text>
        </TouchableOpacity>
      </View>

      {/* List Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tersimpan</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{payments.length}</Text>
        </View>
      </View>

      {/* Empty State */}
      {payments.length === 0 && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="wallet-outline" size={28} color="#CBD5E1" />
          </View>
          <Text style={styles.emptyTitle}>Belum ada metode pembayaran</Text>
          <Text style={styles.emptySubtitle}>
            Tambahkan metode di atas untuk memulai
          </Text>
        </View>
      )}

      {/* Payment Cards */}
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => {
          const c = colors(item.provider);
          const icon = providerIcons[item.provider] ?? "card-outline";

          return (
            <View style={styles.card}>
              {/* Provider Avatar */}
              <View style={[styles.cardAvatar, { backgroundColor: c.bg }]}>
                <Ionicons name={icon} size={20} color={c.icon} />
              </View>

              {/* Info */}
              <View style={styles.cardInfo}>
                <Text style={[styles.provider, { color: c.letter }]}>
                  {item.provider}
                </Text>
                <Text style={styles.detail}>{item.accountName}</Text>
                <View style={styles.accountNoRow}>
                  <Text style={styles.accountNo}>{item.accountNo}</Text>
                </View>
              </View>

              {/* Delete */}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  // Header
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#94A3B8",
  },

  // Form Card
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  formHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  formIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  formTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  // Fields
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    height: 48,
  },
  inputWrapFocused: {
    borderColor: "#2563EB",
    backgroundColor: "#fff",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },

  // Button
  button: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  countBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  countText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
  },

  // Cards
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardAvatar: {
    width: 46,
    height: 46,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
  },
  provider: {
    fontSize: 15,
    fontWeight: "700",
  },
  detail: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 2,
  },
  accountNoRow: {
    marginTop: 6,
    backgroundColor: "#F8FAFC",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  accountNo: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },

  // Delete Button
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },
});