import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

// ✅ Dari app/vehicles/[id].tsx → naik 2 level ke root
import { getVehicleById } from "../../src/services/vehicle.service";
import { createBooking } from "../../src/services/booking.service";

// ── CALENDAR HELPERS ──────────────────────────────────────
const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isInRange(date: Date, start: Date, end: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return d > s && d < e;
}

function isBeforeToday(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

// ── CALENDAR COMPONENT ────────────────────────────────────
function InlineCalendar({
  startDate,
  endDate,
  onSelectStart,
  onSelectEnd,
}: {
  startDate: Date;
  endDate: Date;
  onSelectStart: (d: Date) => void;
  onSelectEnd: (d: Date) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selecting, setSelecting] = useState<"start" | "end">("start");

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleDayPress = (day: number) => {
    const selected = new Date(viewYear, viewMonth, day);
    if (isBeforeToday(selected)) return;

    if (selecting === "start") {
      onSelectStart(selected);
      // Reset end jika end sebelum start baru
      if (selected >= endDate) {
        const nextDay = new Date(selected);
        nextDay.setDate(nextDay.getDate() + 1);
        onSelectEnd(nextDay);
      }
      setSelecting("end");
    } else {
      if (selected <= startDate) {
        // Kalau pilih hari sebelum/sama start, reset ke start baru
        onSelectStart(selected);
        const nextDay = new Date(selected);
        nextDay.setDate(nextDay.getDate() + 1);
        onSelectEnd(nextDay);
      } else {
        onSelectEnd(selected);
        setSelecting("start");
      }
    }
  };

  // Build grid cells
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <View style={calStyles.wrapper}>
      {/* Selecting indicator */}
      <View style={calStyles.selectingRow}>
        <TouchableOpacity
          style={[calStyles.selectingTab, selecting === "start" && calStyles.selectingTabActive]}
          onPress={() => setSelecting("start")}
        >
          <Ionicons name="calendar-outline" size={12}
            color={selecting === "start" ? "#2563EB" : "#94A3B8"} />
          <Text style={[calStyles.selectingLabel, selecting === "start" && calStyles.selectingLabelActive]}>
            Mulai
          </Text>
          <Text style={[calStyles.selectingValue, selecting === "start" && calStyles.selectingValueActive]}>
            {startDate.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
          </Text>
        </TouchableOpacity>

        <View style={calStyles.selectingArrow}>
          <Ionicons name="arrow-forward" size={14} color="#CBD5E1" />
        </View>

        <TouchableOpacity
          style={[calStyles.selectingTab, selecting === "end" && calStyles.selectingTabActive]}
          onPress={() => setSelecting("end")}
        >
          <Ionicons name="calendar-outline" size={12}
            color={selecting === "end" ? "#2563EB" : "#94A3B8"} />
          <Text style={[calStyles.selectingLabel, selecting === "end" && calStyles.selectingLabelActive]}>
            Selesai
          </Text>
          <Text style={[calStyles.selectingValue, selecting === "end" && calStyles.selectingValueActive]}>
            {endDate.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Month navigation */}
      <View style={calStyles.monthNav}>
        <TouchableOpacity style={calStyles.navBtn} onPress={prevMonth}>
          <Ionicons name="chevron-back" size={16} color="#475569" />
        </TouchableOpacity>
        <Text style={calStyles.monthLabel}>
          {MONTHS[viewMonth]} {viewYear}
        </Text>
        <TouchableOpacity style={calStyles.navBtn} onPress={nextMonth}>
          <Ionicons name="chevron-forward" size={16} color="#475569" />
        </TouchableOpacity>
      </View>

      {/* Day headers */}
      <View style={calStyles.dayHeaders}>
        {DAYS.map((d) => (
          <Text key={d} style={calStyles.dayHeader}>{d}</Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={calStyles.grid}>
        {cells.map((day, idx) => {
          if (!day) return <View key={`empty-${idx}`} style={calStyles.cell} />;

          const date = new Date(viewYear, viewMonth, day);
          const isStart = isSameDay(date, startDate);
          const isEnd = isSameDay(date, endDate);
          const inRange = isInRange(date, startDate, endDate);
          const isPast = isBeforeToday(date);
          const isToday = isSameDay(date, today);

          return (
            <TouchableOpacity
              key={`day-${day}`}
              style={[
                calStyles.cell,
                inRange && calStyles.cellRange,
                isStart && calStyles.cellRangeStart,
                isEnd && calStyles.cellRangeEnd,
              ]}
              onPress={() => handleDayPress(day)}
              activeOpacity={isPast ? 1 : 0.7}
              disabled={isPast}
            >
              <View style={[
                calStyles.dayCircle,
                (isStart || isEnd) && calStyles.dayCircleActive,
              ]}>
                <Text style={[
                  calStyles.dayText,
                  isPast && calStyles.dayTextPast,
                  inRange && calStyles.dayTextRange,
                  (isStart || isEnd) && calStyles.dayTextActive,
                  isToday && !isStart && !isEnd && calStyles.dayTextToday,
                ]}>
                  {day}
                </Text>
              </View>
              {/* Today dot */}
              {isToday && !isStart && !isEnd && (
                <View style={calStyles.todayDot} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const calStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },

  // Selecting tabs
  selectingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 6,
  },
  selectingTab: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
    gap: 2,
  },
  selectingTabActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2563EB",
  },
  selectingArrow: {
    paddingHorizontal: 2,
  },
  selectingLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 0.3,
  },
  selectingLabelActive: {
    color: "#2563EB",
  },
  selectingValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },
  selectingValueActive: {
    color: "#0F172A",
  },

  // Month nav
  monthNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  navBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  // Day headers
  dayHeaders: {
    flexDirection: "row",
    marginBottom: 6,
  },
  dayHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
  },

  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cellRange: {
    backgroundColor: "#EFF6FF",
  },
  cellRangeStart: {
    backgroundColor: "#EFF6FF",
    borderTopLeftRadius: 999,
    borderBottomLeftRadius: 999,
  },
  cellRangeEnd: {
    backgroundColor: "#EFF6FF",
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  dayCircleActive: {
    backgroundColor: "#2563EB",
  },
  dayText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#0F172A",
  },
  dayTextPast: {
    color: "#CBD5E1",
  },
  dayTextRange: {
    color: "#2563EB",
    fontWeight: "600",
  },
  dayTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  dayTextToday: {
    color: "#2563EB",
    fontWeight: "700",
  },
  todayDot: {
    position: "absolute",
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2563EB",
  },
});

// ── MAIN SCREEN ───────────────────────────────────────────
export default function BookingScreen() {

  const { vehicleId } = useLocalSearchParams();

  const [vehicle, setVehicle] = useState<any>(null);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchVehicle = async () => {
    try {
      const result = await getVehicleById(vehicleId as string);
      setVehicle(result.data);
    } catch (error) {
      console.log(error);
      alert("Gagal mengambil kendaraan");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, []);

  const calculateTotal = () => {
    if (!vehicle) return 0;
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return vehicle.pricePerDay;
    return diffDays * vehicle.pricePerDay;
  };

  const getDiffDays = () => {
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 0 ? 1 : diffDays;
  };

  const handleBooking = async () => {
    try {
      setLoading(true);
      await createBooking({
        vehicleId: Number(vehicleId),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice: calculateTotal(),
      });
      alert("Booking berhasil");
      router.replace("/history" as any);
    } catch (error: any) {
      console.log(error);
      alert(error?.response?.data?.message || "Booking gagal");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <View style={styles.loading}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Memuat kendaraan...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerTitle: "Booking" }} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <Text style={styles.title}>Booking Kendaraan</Text>
          <Text style={styles.subtitle}>Pilih tanggal rental Anda</Text>
        </View>

        {/* ── VEHICLE CARD ── */}
        <View style={styles.vehicleCard}>
          <View style={styles.iconBox}>
            <Ionicons name="car-sport" size={26} color="#2563EB" />
          </View>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>{vehicle?.name}</Text>
            <Text style={styles.vehicleBrand}>{vehicle?.brand}</Text>
          </View>
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeValue}>
              Rp {Number(vehicle?.pricePerDay).toLocaleString("id-ID")}
            </Text>
            <Text style={styles.priceBadgeLabel}>/hari</Text>
          </View>
        </View>

        {/* ── INLINE CALENDAR ── */}
        <InlineCalendar
          startDate={startDate}
          endDate={endDate}
          onSelectStart={setStartDate}
          onSelectEnd={setEndDate}
        />

        {/* ── TOTAL CARD ── */}
        <View style={styles.totalCard}>
          <View style={styles.totalCircle1} />
          <View style={styles.totalCircle2} />

          <View style={styles.durationPill}>
            <Ionicons name="time-outline" size={12} color="#93C5FD" />
            <Text style={styles.durationText}>{getDiffDays()} hari rental</Text>
          </View>

          <Text style={styles.totalLabel}>Total Harga</Text>
          <Text style={styles.totalPrice}>
            Rp {calculateTotal().toLocaleString("id-ID")}
          </Text>

          <View style={styles.totalDivider} />
          <Text style={styles.breakdownText}>
            Rp {Number(vehicle?.pricePerDay).toLocaleString("id-ID")} × {getDiffDays()} hari
          </Text>
        </View>

        {/* ── BUTTON ── */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleBooking}
          disabled={loading}
          activeOpacity={0.88}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Booking Sekarang</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    backgroundColor: "#F8FAFC",
  },
  loadingCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    gap: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  loadingText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 5,
    color: "#94A3B8",
    fontSize: 14,
  },
  vehicleCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  vehicleBrand: {
    marginTop: 3,
    color: "#94A3B8",
    fontSize: 13,
  },
  priceBadge: {
    alignItems: "flex-end",
  },
  priceBadgeValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },
  priceBadgeLabel: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  totalCard: {
    backgroundColor: "#2563EB",
    borderRadius: 26,
    padding: 24,
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
  },
  totalCircle1: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: -60,
    right: -40,
  },
  totalCircle2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.04)",
    bottom: -20,
    left: 20,
  },
  durationPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
    marginBottom: 14,
  },
  durationText: {
    color: "#BFDBFE",
    fontSize: 12,
    fontWeight: "500",
  },
  totalLabel: {
    color: "#BFDBFE",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 6,
  },
  totalPrice: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  totalDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginVertical: 14,
  },
  breakdownText: {
    color: "#BFDBFE",
    fontSize: 13,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#2563EB",
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});