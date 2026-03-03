import { View, Text, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { api } from "../../services/api";

import Button from "../../components/Button";
import { colors } from "../../theme/colors";


export default function Login() {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");    

const handleLogin = async () => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token } = response.data;

    console.log("TOKEN:", token);

    // Más adelante guardaremos el token
    router.replace("/(app)/home");

  } catch (error: any) {
    console.log("ERROR LOGIN:", error.response?.data || error.message);
  }
};






  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitoreo Vecinal</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor={colors.gray}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor={colors.gray}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

        <Button title="Iniciar sesión" onPress={handleLogin} />
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
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 24,
  },
  input: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
