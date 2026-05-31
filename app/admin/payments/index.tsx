import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

import {
  useEffect,
  useState,
} from "react";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  getPayments,
} from "../../../src/services/payment.service";

import {
  getRentals,
} from "../../../src/services/rental.service";

export default function PaymentsScreen() {

  const [payments, setPayments] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const [paymentsResult, rentalsResult] = await Promise.all([
        getPayments(),
        getRentals(),
      ]);
      setPayments(paymentsResult.data);
      setRentals(rentalsResult.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalRevenue = rentals.reduce((acc, item) => acc + item.totalPrice, 0);

  const completedRevenue = rentals
    .filter((item) => item.status === "completed")
    .reduce((acc, item) => acc + item.totalPrice, 0);

  const pendingRevenue = rentals
    .filter((item) => item.status !== "completed")
    .reduce((acc, item) => acc + item.totalPrice, 0);

  const paymentIcons: any = {
    Visa: "card-outline",
    Mastercard: "card-outline",
    Gopay: "wallet-outline",
    Dana: "wallet-outline",
    OVO: "wallet-outline",
    PayPal: "logo-paypal",
  };

  // Color per payment provider
  const providerColors: any = {
    Visa: { bg: "#EFF6FF", icon: "#2563EB" },
    Mastercard: { bg: "#FFF1F2", icon: "#E11D48" },
    Gopay: { bg: "#ECFDF5", icon: "#059669" },
    Dana: { bg: "#EFF6FF", icon: "#3B82F6" },
    OVO: { bg: "#F5F3FF", icon: "#7C3AED" },
    PayPal: { bg: "#EFF6FF", icon: "#0070BA" },
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Payments</Text>
          <Text style={styles.subtitle}>Methods & transactions</Text>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="trending-up" size={14} color="#2563EB" />
          <Text style={styles.headerBadgeText}>{rentals.length} rentals</Text>
        </View>
      </View>

      {/* Revenue Card — improved with layered design */}
      <View style={styles.revenueCard}>
        {/* Decorative circles */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />

        <View style={styles.revenueTop}>
          <View style={styles.revenueLabelRow}>
            <Ionicons name="cash-outline" size={14} color="#BFDBFE" />
            <Text style={styles.revenueLabel}>Total Revenue</Text>
          </View>
        </View>

        <Text style={styles.revenueValue}>
          Rp {totalRevenue.toLocaleString("id-ID")}
        </Text>

        {/* Divider */}
        <View style={styles.revenueDivider} />

        <View style={styles.revenueStats}>
          <View style={styles.revenueStatItem}>
            <View style={styles.revenueStatDot}>
              <View style={[styles.dot, { backgroundColor: "#4ADE80" }]} />
            </View>
            <Text style={styles.smallLabel}>Completed</Text>
            <Text style={styles.smallValue}>
              Rp {completedRevenue.toLocaleString("id-ID")}
            </Text>
          </View>

          <View style={styles.revenueStatDividerVertical} />

          <View style={styles.revenueStatItem}>
            <View style={styles.revenueStatDot}>
              <View style={[styles.dot, { backgroundColor: "#FCD34D" }]} />
            </View>
            <Text style={styles.smallLabel}>Pending</Text>
            <Text style={styles.smallValue}>
              Rp {pendingRevenue.toLocaleString("id-ID")}
            </Text>
          </View>

          <View style={styles.revenueStatDividerVertical} />

          <View style={styles.revenueStatItem}>
            <View style={styles.revenueStatDot}>
              <View style={[styles.dot, { backgroundColor: "#93C5FD" }]} />
            </View>
            <Text style={styles.smallLabel}>Rentals</Text>
            <Text style={styles.smallValue}>{rentals.length}</Text>
          </View>
        </View>
      </View>

      {/* Payment Methods */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Payment Methods</Text>
        <Text style={styles.sectionCount}>{payments.length} saved</Text>
      </View>

      <View style={styles.methodsGrid}>
        {payments.map((item) => {
          const colors = providerColors[item.provider] || {
            bg: "#F8FAFC",
            icon: "#2563EB",
          };
          return (
            <View key={item.id} style={styles.methodCard}>
              <View style={[styles.methodIcon, { backgroundColor: colors.bg }]}>
                <Ionicons
                  name={paymentIcons[item.provider] || "card-outline"}
                  size={20}
                  color={colors.icon}
                />
              </View>
              <Text style={styles.methodName}>{item.provider}</Text>
              <Text style={styles.methodType}>{item.type}</Text>
              <View style={styles.methodAccountRow}>
                <Text style={styles.methodAccount}>{item.accountNo}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Recent Transactions */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <Text style={styles.sectionCount}>
          {Math.min(8, rentals.length)} of {rentals.length}
        </Text>
      </View>

      <FlatList
        data={rentals.slice(0, 8)}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.transactionCard}>
            {/* Avatar / Index */}
            <View style={styles.transactionAvatar}>
              <Text style={styles.transactionAvatarText}>
                {item.user.fullname?.charAt(0)?.toUpperCase() ?? "?"}
              </Text>
            </View>

            <View style={styles.transactionInfo}>
              <Text style={styles.customer}>{item.user.fullname}</Text>
              <Text style={styles.transactionMeta}>
                {new Date(item.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>

            <View style={styles.transactionRight}>
              <Text style={styles.amount}>
                Rp {Number(item.totalPrice).toLocaleString("id-ID")}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      item.status === "completed" ? "#DCFCE7" : "#FEF3C7",
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        item.status === "completed" ? "#16A34A" : "#D97706",
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        item.status === "completed" ? "#16A34A" : "#D97706",
                    },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
        )}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 4,
    color: "#94A3B8",
    fontSize: 14,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },

  // Revenue Card
  revenueCard: {
    borderRadius: 28,
    padding: 24,
    backgroundColor: "#1D4ED8",
    overflow: "hidden",
    position: "relative",
  },
  decorCircle1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: -60,
    right: -40,
  },
  decorCircle2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.04)",
    bottom: -20,
    left: 20,
  },
  revenueTop: {
    marginBottom: 8,
  },
  revenueLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  revenueLabel: {
    color: "#BFDBFE",
    fontSize: 13,
    fontWeight: "500",
  },
  revenueValue: {
    marginTop: 6,
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },
  revenueDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginVertical: 20,
  },
  revenueStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  revenueStatItem: {
    flex: 1,
    alignItems: "center",
  },
  revenueStatDot: {
    marginBottom: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  revenueStatDividerVertical: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  smallLabel: {
    fontSize: 11,
    color: "#BFDBFE",
    textAlign: "center",
  },
  smallValue: {
    marginTop: 4,
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
    textAlign: "center",
  },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  sectionCount: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },

  // Method Cards
  methodsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  methodCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  methodName: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  methodType: {
    marginTop: 3,
    color: "#94A3B8",
    fontSize: 12,
  },
  methodAccountRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  methodAccount: {
    color: "#CBD5E1",
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.5,
  },

  // Transaction Card
  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  transactionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionAvatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  customer: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  transactionMeta: {
    marginTop: 3,
    fontSize: 12,
    color: "#94A3B8",
  },
  amount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  statusBadge: {
    marginTop: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});