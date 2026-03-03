import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import MapView, { Heatmap } from "react-native-maps";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import { api } from "../../services/api";

// 🔥 IMPORTAR COLORES DESDE TU TEMA
import { colors } from "../../theme/colors";


export default function Home() {
  // 📊 Estados
  const [ranking, setRanking] = useState([]);
  const [lastReports, setLastReports] = useState([]);
  const [isPersonalized, setIsPersonalized] = useState(false);

  // 📍 Región inicial
  const [region, setRegion] = useState({
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  });

  // 🔄 Cargar datos al montar
  useEffect(() => {
    fetchGeneralRanking();
    fetchLastReports();
  }, []);

  // 🔥 Ranking general
  const fetchGeneralRanking = async () => {
  try {
    const response = await api.get("/reports/ranking/municipality");

    // 🔥 Transformamos el formato del backend a algo más usable
    const formatted = response.data.map((item) => ({
      municipio: item["Location.Neighborhood.Municipality.name"],
      total: item.totalReports,
    }));

    setRanking(formatted);

  } catch (error) {
    console.log("Error trayendo ranking", error);
  }
};

  // 📰 Últimos reportes
  const fetchLastReports = async () => {
    try {
      const response = await api.get("/reports"); // después filtramos 24h si hace falta
      setLastReports(response.data.slice(0, 5));
    } catch (error) {
      console.log("Error trayendo últimos reportes", error);
    }
  };

  // 📍 Personalizar por ubicación
  const handlePersonalize = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("Permiso denegado");
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});

    setRegion({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });

    setIsPersonalized(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <Text style={styles.title}>Monitoreo Vecinal</Text>

        {/* 🔥 MAPA HEATMAP */}
        <View style={styles.mapContainer}>
          <MapView style={styles.map} region={region}>
            <Heatmap
              points={[
                { latitude: -34.65, longitude: -58.56, weight: 1 },
                { latitude: -34.67, longitude: -58.55, weight: 1 },
                { latitude: -34.62, longitude: -58.52, weight: 1 },
              ]}
              radius={50}
              opacity={0.7}
            />
          </MapView>
        </View>

        {/* 🏆 TOP 3 MUNICIPIOS */}
        <Text style={styles.sectionTitle}>
          {isPersonalized
            ? "🔥 Reportes en tu zona"
            : "🔥 Municipios más reportados"}
        </Text>

       {ranking.slice(0, 3).map((item, index) => (
  <View key={index} style={styles.card}>
    <Text style={styles.rankPosition}>#{index + 1}</Text>
    <View>
      <Text style={styles.municipio}>
        {item.municipio || "Sin municipio"}
      </Text>
      <Text style={styles.total}>
        {item.total} reportes
      </Text>
    </View>
  </View>
))}

        {/* 📰 ÚLTIMOS REPORTES */}
        <Text style={styles.sectionTitle}>
          📰 Reportes últimas 24h
        </Text>

        {lastReports.map((report, index) => (
  <View key={index} style={styles.reportCard}>
    <Text style={styles.reportTitle}>
      {report.description}
    </Text>
    <Text style={styles.reportMunicipio}>
      📍 {report.Location?.Neighborhood?.Municipality?.name || "Sin municipio"}
    </Text>
  </View>
))}
        {/* 📍 BOTÓN PERSONALIZAR */}
        <TouchableOpacity style={styles.button} onPress={handlePersonalize}>
          <Text style={styles.buttonText}>Ver mi zona</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
    marginVertical: 20,
  },
  mapContainer: {
    height: 300,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: 25,
    marginBottom: 15,
    marginHorizontal: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  rankPosition: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.accent,
    marginRight: 15,
  },
  municipio: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  total: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  reportCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  reportTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    marginBottom: 4,
  },
  reportMunicipio: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  button: {
    backgroundColor: colors.accent,
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});