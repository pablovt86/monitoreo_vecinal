import { View, Text, Button } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/(auth)");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Pantalla Home 🔥</Text>
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}
