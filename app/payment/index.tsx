import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

import {
  useEffect,
  useState,
} from "react";

import {
  createPayment,
  deletePayment,
  getPayments,
} from "../../src/services/payment.service";

export default function
PaymentScreen() {

  const [payments,
    setPayments] =
      useState<any[]>([]);

  const [provider,
    setProvider] =
      useState("");

  const [accountName,
    setAccountName] =
      useState("");

  const [accountNo,
    setAccountNo] =
      useState("");

  const fetchPayments =
    async () => {

      try {

        const result =
          await getPayments();

        setPayments(
          result.data
        );

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {

    fetchPayments();

  }, []);

  const handleCreate =
    async () => {

      if (
        !provider ||
        !accountName ||
        !accountNo
      ) {

        return alert(
          "Lengkapi data payment"
        );
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

  const handleDelete =
    async (id: number) => {

      Alert.alert(
        "Hapus Payment",
        "Yakin ingin menghapus?",
        [

          {
            text: "Batal",
          },

          {
            text: "Hapus",

            onPress:
              async () => {

                await deletePayment(id);

                fetchPayments();

              },
          },

        ]
      );
    };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Metode Pembayaran
      </Text>

      <TextInput
        placeholder="Provider"
        style={styles.input}
        value={provider}
        onChangeText={setProvider}
      />

      <TextInput
        placeholder="Nama Akun"
        style={styles.input}
        value={accountName}
        onChangeText={setAccountName}
      />

      <TextInput
        placeholder="Nomor Akun"
        style={styles.input}
        value={accountNo}
        onChangeText={setAccountNo}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreate}
      >

        <Text style={styles.buttonText}>
          Tambah Payment
        </Text>

      </TouchableOpacity>

      <FlatList
        data={payments}
        keyExtractor={(item) =>
          item.id.toString()
        }

        renderItem={({ item }) => (

          <View style={styles.card}>

            <View>

              <Text style={styles.provider}>
                {item.provider}
              </Text>

              <Text style={styles.detail}>
                {item.accountName}
              </Text>

              <Text style={styles.detail}>
                {item.accountNo}
              </Text>

            </View>

            <TouchableOpacity
              onPress={() =>
                handleDelete(item.id)
              }
            >

              <Text style={styles.delete}>
                Hapus
              </Text>

            </TouchableOpacity>

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
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#111827",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,

    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",
  },

  provider: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  detail: {
    color: "#6B7280",
    marginTop: 4,
  },

  delete: {
    color: "#DC2626",
    fontWeight: "bold",
  },

});