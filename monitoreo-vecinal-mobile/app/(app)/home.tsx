// =============================
// IMPORTACIONES
// =============================

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

import { useState, useEffect, useRef } from "react";

import { api } from "../../services/api";

import { colors } from "../../theme/colors";


// =============================
// TIPOS TYPESCRIPT
// =============================

type RankingItem = {
  municipio: string
  total: number
}

type ReportItem = {
  id: number
  description: string
  Location?: {
    Neighborhood?: {
      Municipality?: {
        name?: string
      }
    }
  }
}

type HeatmapPoint = {
  latitude: number
  longitude: number
  weight: number
}


// =============================
// COMPONENTE HOME
// =============================

export default function Home() {

  // =============================
  // ESTADOS
  // =============================

  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [lastReports, setLastReports] = useState<ReportItem[]>([]);
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([]);
  const [isPersonalized, setIsPersonalized] = useState(false);

  const [region, setRegion] = useState({
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  });

  const scrollRef = useRef<ScrollView>(null);
  const scrollPosition = useRef(0);


  // =============================
  // CARGA INICIAL
  // =============================

  useEffect(() => {

    fetchGeneralRanking();
    fetchLastReports();
    fetchHeatmap();

  }, []);


  // =============================
  // AUTO SCROLL CARRUSEL
  // =============================

  useEffect(() => {

  const interval = setInterval(() => {

    if (!scrollRef.current || lastReports.length === 0) return;

    scrollPosition.current += 220;

    if (scrollPosition.current > lastReports.length * 220) {
      scrollPosition.current = 0;
    }

    scrollRef.current.scrollTo({
      x: scrollPosition.current,
      animated: true
    });

  }, 3000);

  return () => clearInterval(interval);

}, [lastReports]);

  // =============================
  // TRAER RANKING MUNICIPIOS
  // =============================

  const fetchGeneralRanking = async () => {

    try {

      const response = await api.get("/reports/ranking/municipality");

      console.log("Ranking backend:", response.data);

      // 🔥 ahora usamos directamente el formato del backend
      const formatted: RankingItem[] = response.data.map((item: any) => ({

        municipio: item.municipio || "Sin municipio",

        total: item.total || 0

      }));

      setRanking(formatted);

    } catch (error) {

      console.log("Error trayendo ranking", error);

    }

  };


  // =============================
  // TRAER REPORTES RECIENTES
  // =============================

 const fetchLastReports = async () => {

  try {

    const response = await api.get("/reports/last");

    console.log("Últimos reportes:", response.data);

    // 🔥 verificamos que realmente sea un array
    if (Array.isArray(response.data)) {

      setLastReports(response.data);

    } else {

      console.log("La API no devolvió un array");

      setLastReports([]);

    }

  } catch (error) {

    console.log("Error trayendo últimos reportes", error);

  }

};

  // =============================
  // TRAER DATOS PARA HEATMAP
  // =============================

  const fetchHeatmap = async () => {

    try {

      const response = await api.get("/reports/heatmap");

      console.log("Heatmap:", response.data);

      // 🔥 convertimos a Number para evitar error de AirMapHeatmap
    const validPoints: HeatmapPoint[] = response.data
    .map((p:any) => ({
    latitude: Number(p.latitude),
    longitude: Number(p.longitude),
    weight: Number(p.weight)})).filter(p => !isNaN(p.latitude) && !isNaN(p.longitude));

      setHeatmapPoints(validPoints);

    } catch (error) {

      console.log("Error cargando heatmap", error);

    }

  };
// =============================
// TRAER DATOS DE MI ZONA
// =============================

const fetchMyZoneData = async (lat: number, lng: number) => {

  try {

    const response = await api.get(`/api/zones/my-zone?lat=${lat}&lng=${lng}`);
    


    console.log("MI ZONA:", response.data);

    // 🔥 reemplazamos datos con la zona

    setRanking([
      {
        municipio: response.data.zone.municipality,
        total: response.data.reports.length
      }
    ]);

    setLastReports(response.data.reports);

    const points = response.data.reports.map((r:any) => ({
      latitude: Number(r.Location?.latitude),
      longitude: Number(r.Location?.longitude),
      weight: 1
    }));

    setHeatmapPoints(points);

  } catch (error) {

    console.log("Error trayendo mi zona", error, );

  }

};

  // =============================
  // PERSONALIZAR MAPA
  // =============================

 const handlePersonalize = async () => {

  let { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    alert("Permiso denegado");
    return;
  }

  let loc = await Location.getCurrentPositionAsync({});

  const lat = loc.coords.latitude;
  const lng = loc.coords.longitude;

  // ✔ lo que ya tenías
  setRegion({
    latitude: lat,
    longitude: lng,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  setIsPersonalized(true);

  // 🔥 NUEVO (esto es lo único que agregamos)
  await fetchMyZoneData(lat, lng);

};


  // =============================
  // RENDER
  // =============================

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>
          Monitoreo Vecinal
        </Text>


        {/* MAPA */}

        <View style={styles.mapContainer}>

          <MapView style={styles.map} region={region}>

            <Heatmap
              points={heatmapPoints}
              radius={50}
              opacity={0.7}
            />

          </MapView>

        </View>


        {/* RANKING */}

        <Text style={styles.sectionTitle}>

          {isPersonalized
            ? "🔥 Reportes en tu zona"
            : "🔥 Municipios más reportados"}

        </Text>


        {ranking.slice(0, 3).map((item, index) => (

          <View key={index} style={styles.card}>

            <Text style={styles.rankPosition}>
              #{index + 1}
            </Text>

            <View>

              <Text style={styles.municipio}>
                {item.municipio}
              </Text>

              <Text style={styles.total}>
                {item.total} reportes
              </Text>

            </View>

          </View>

        ))}


        {/* CARRUSEL */}

        <Text style={styles.sectionTitle}>
          🚨 Alertas de vecinos en las últimas horas
        </Text>
       

        <ScrollView
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          style={{ paddingLeft: 16 }}
        >

         {lastReports.length === 0 ? (

  <Text style={{marginLeft:16}}>
    No hay alertas recientes
  </Text>

) : (

  lastReports.map((report, index) => (

    <View key={index} style={styles.carouselCard}>

      <Text style={styles.reportTitle}>
        {report.description}
      </Text>

      <Text style={styles.reportMunicipio}>
        📍 {report.Location?.Neighborhood?.Municipality?.name || "Sin municipio"}
      </Text>

    </View>

  ))

)}
        </ScrollView>


        {/* BOTÓN UBICACIÓN */}

        <TouchableOpacity
          style={styles.button}
          onPress={handlePersonalize}
        >

          <Text style={styles.buttonText}>
            Ver mi zona
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>

  );

}


// =============================
// ESTILOS
// =============================

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

  carouselCard: {
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 14,
    marginRight: 12,
    width: 220,
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