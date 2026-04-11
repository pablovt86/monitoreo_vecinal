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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../services/api";

import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {

  const router = useRouter();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleRegister = async () => {

    if (!firstname || !lastname || !email || !password) {
      return Alert.alert("Error", "Completá los campos obligatorios");
    }

    if (password.length < 6) {
      return Alert.alert("Error", "Mínimo 6 caracteres");
    }

    if (password !== confirmPassword) {
      return Alert.alert("Error", "Las contraseñas no coinciden");
    }

    if (!accepted) {
      return Alert.alert("Error", "Debés aceptar los términos");
    }

    try {
      const response = await api.post("/auth/register", {
        firstname,
        lastname,
        email,
        phone,
        password
      });

      await AsyncStorage.setItem("token", response.data.token);

      Alert.alert("Éxito", "Cuenta creada 🚀");

      router.replace("/(app)/home");

    } catch (error) {
      const err = error as any;
        Alert.alert(
        
        "Error",
        err.response?.data?.error || "No se pudo registrar"
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* 🔥 LOGO */}
      <View style={styles.logoContainer}>
        <Ionicons name="shield-checkmark" size={60} color="#8B5CF6" />
      </View>

      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>Unite a Monitoreo Vecinal</Text>

      {/* Inputs */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={18} color="#aaa" />
        <TextInput
          placeholder="Nombre"
          placeholderTextColor="#888"
          style={styles.input}
          value={firstname}
          onChangeText={setFirstname}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={18} color="#aaa" />
        <TextInput
          placeholder="Apellido"
          placeholderTextColor="#888"
          style={styles.input}
          value={lastname}
          onChangeText={setLastname}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={18} color="#aaa" />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={18} color="#aaa" />
        <TextInput
          placeholder="Teléfono (opcional)"
          placeholderTextColor="#888"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
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
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={18} color="#aaa" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={18} color="#aaa" />
        <TextInput
          placeholder="Confirmar contraseña"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword}
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Checkbox */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setAccepted(!accepted)}
      >
        <Ionicons
          name={accepted ? "checkbox" : "square-outline"}
          size={20}
          color="#8B5CF6"
        />
        <Text style={styles.checkboxText}>
          Acepto los <Text style={{ color: "#8B5CF6" }}>Términos</Text>
        </Text>
      </TouchableOpacity>

      {/* Botón */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      {/* Link */}
      <Text style={styles.link} onPress={() => router.push("/login")}>
        ¿Ya tenés cuenta? Iniciar sesión
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

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10
  },

  checkboxText: {
    color: "#aaa",
    marginLeft: 8
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