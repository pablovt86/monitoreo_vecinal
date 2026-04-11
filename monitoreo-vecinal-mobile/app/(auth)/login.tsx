import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from "react-native";

import { useState } from "react";
import { useRouter } from "expo-router";
import { api } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {

    if (!email || !password) {
      return Alert.alert("Error", "Completá todos los campos");
    }

    try {
      const response = await api.post("/auth/login", {
        email,
        password
      });

      const token = response.data.token;

      await AsyncStorage.setItem("token", token);

      Alert.alert("Éxito", "Bienvenido 👋");

      router.replace("/(app)/home");

    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.error || "Credenciales inválidas"
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* 🔥 LOGO */}
      <View style={styles.logoContainer}>
        <Ionicons name="shield-checkmark" size={60} color="#8B5CF6" />
      </View>

      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subtitle}>Iniciá sesión para continuar</Text>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={18} color="#aaa" />
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#888"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={18} color="#aaa" />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={18}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>

      {/* Botón */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      {/* Link */}
      <Text style={styles.link} onPress={() => router.push("/register")}>
        ¿No tenés cuenta? Registrate
      </Text>

      {/* 🔐 Seguridad */}
      <View style={styles.securityBox}>
        <Ionicons name="shield-outline" size={20} color="#8B5CF6" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.securityTitle}>
            Tu seguridad es nuestra prioridad
          </Text>
          <Text style={styles.securityText}>
            Tus datos están protegidos.
          </Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0D0D0D",
    padding: 20,
    justifyContent: "center"
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 10
  },

  title: {
    color: "#fff",
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold"
  },

  subtitle: {
    color: "#aaa",
    textAlign: "center",
    marginBottom: 20
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A"
  },

  input: {
    flex: 1,
    color: "#fff",
    padding: 12
  },

  button: {
    backgroundColor: "#8B5CF6",
    padding: 15,
    borderRadius: 12,
    marginTop: 10
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },

  link: {
    color: "#8B5CF6",
    textAlign: "center",
    marginTop: 15
  },

  securityBox: {
    flexDirection: "row",
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center"
  },

  securityTitle: {
    color: "#fff",
    fontWeight: "bold"
  },

  securityText: {
    color: "#aaa",
    fontSize: 12
  }
});