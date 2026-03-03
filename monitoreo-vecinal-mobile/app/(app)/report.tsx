import { View, Text, StyleSheet, TextInput } from "react-native";
import Button from "../../components/Button";
import { colors } from "../../theme/colors";

export default function Login() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitoreo Vecinal</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        placeholderTextColor={colors.gray}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={styles.input}
        placeholderTextColor={colors.gray}
      />

      <Button title="Iniciar sesión" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
    color: colors.secondary,
  },
  input: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
});
