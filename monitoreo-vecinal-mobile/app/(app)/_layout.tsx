import { Tabs } from "expo-router";
import { ZoneProvider } from "./context/ZoneContext"; // 🔥 ruta según tu proyecto

export default function AppLayout() {
  return (
    <ZoneProvider>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="home" options={{ title: "Inicio" }} />
        <Tabs.Screen name="report" options={{ title: "Reportar" }} />
        <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
      </Tabs>
    </ZoneProvider>
  );
}