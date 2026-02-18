import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

useEffect(() => {
  const checkLogin = async () => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      router.replace("/(app)/home");
    }
  };

  checkLogin();
}, []);





export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      
  
     const response = await axios.post(
  "http://192.168.1.44:4000/api/auth/login",
  { email, password }
);
await AsyncStorage.setItem("token", response.data.token);
      Alert.alert("Login exitoso");
      router.replace("/home");

      console.log(response.data);
   } catch (error: any) {
  console.log("ERROR COMPLETO:", error.response?.data);
  Alert.alert("Error", JSON.stringify(error.response?.data));
}

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitoreo Vecinal</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <Button title="Iniciar Sesión" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
