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
import { useRouter } from "expo-router";

import { api } from "../../services/api";
import { useZone } from "./context/ZoneContext"; // ✅ RUTA CORRECTA
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
  address?: string 
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
  const router = useRouter();
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [lastReports, setLastReports] = useState<ReportItem[]>([]);
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([]);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const { setZone } = useZone();

  // ✅ NUEVO: Estado para saber si el mapa puede renderizarse sin explotar
  const [isMapReady, setIsMapReady] = useState(false);

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

  // ✅ NUEVO: Retrasamos el mapa un microsegundo para que la pantalla cargue bien
  useEffect(() => {
    setTimeout(() => {
      setIsMapReady(true);
    }, 100);
  }, []);

  // ✅ CAMBIO: Usamos useEffect normal en lugar de useFocusEffect
  useEffect(() => {
    console.log("CARGANDO HOME POR PRIMERA VEZ 🔥");
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
      console.log("Últimos reportes: del fetchLastReports", response.data);

      if (Array.isArray(response.data)) {
        setLastReports(response.data);
      } else {
        console.log("La API no devolvió un array");
        setLastReports([]);
      }
    } catch (error) {
      alert("no hay reportes recientes o hubo un error al cargarlos");
      console.log("Error trayendo últimos reportes del fetchLastReports", error);
    }
  };

  // =============================
  // TRAER DATOS PARA HEATMAP
  // =============================

  const fetchHeatmap = async () => {
    try {
      const response = await api.get("/reports/heatmap");
      console.log("Heatmap:", response.data);

      const validPoints: HeatmapPoint[] = response.data
        .map((p: any) => ({
          latitude: Number(p.latitude),
          longitude: Number(p.longitude),
          weight: Number(p.weight)
        }))
        .filter((p: HeatmapPoint) =>
          !isNaN(p.latitude) &&
          !isNaN(p.longitude) &&
          !isNaN(p.weight)
        );
      console.log("Puntos válidos para heatmap:", validPoints);
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
      const response = await api.get(`/zones/my-zone?lat=${lat}&lng=${lng}`);
      
      if (response.data?.zone) {
        setZone({
          ...response.data.zone,
          latitude: lat,
          longitude: lng
        });
      }    
      console.log("MI ZONA:", response.data);

      setRanking([
        {
          municipio: response.data.zone.municipality,
          total: response.data.reports.length
        }
      ]);
      setLastReports(response.data.reports);

      const points = response.data.reports
        .map((r: any) => ({
          latitude: Number(r.Location?.latitude),
          longitude: Number(r.Location?.longitude),
          weight: 1,
        }))
        .filter(
          (p: any) =>
            !isNaN(p.latitude) &&
            !isNaN(p.longitude) &&
            p.latitude !== 0 &&
            p.longitude !== 0
        );

      console.log("POINTS MI ZONA:", points);
      setHeatmapPoints(points);

      if (points.length > 0) {
        setRegion({
          latitude: points[0].latitude,
          longitude: points[0].longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      }    
    } catch (error) {
      console.log("Error trayendo mi zona", error);
    }
  };

  // =============================
  // PERSONALIZAR MAPA Y UBICACIÓN
  // =============================

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permiso denegado");
      return null;
    }
    let loc = await Location.getCurrentPositionAsync({});
    return {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
  };

  const handlePersonalize = async () => {
    const location = await getUserLocation();
    if (!location) return;

    const { latitude, longitude } = location;
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    setIsPersonalized(true);
    await fetchMyZoneData(latitude, longitude);
  };

  const handleCreateReport = async () => {
    const location = await getUserLocation();
    if (!location) {
      alert("Necesitamos tu ubicación para crear un reporte");
      return;
    }

    setRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });

    router.push({
      pathname: "./denuncia",
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    });
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

        {/* ✅ MAPA SEGURO: Solo se dibuja cuando isMapReady es true */}
        <View style={styles.mapContainer}>
          {isMapReady ? (
            <MapView style={styles.map} region={region}>
              {heatmapPoints && heatmapPoints.length > 0 && (
                <Heatmap
                  points={heatmapPoints}
                  radius={50}
                  opacity={0.7}
                />
              )}
            </MapView>
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 100, color: colors.textSecondary || '#666' }}>
              Cargando mapa...
            </Text>
          )}
        </View>

      {/* RANKING */}
        {isPersonalized && (
          <TouchableOpacity
            style={{
              backgroundColor: "#4e2828",
              marginHorizontal: 16,
              marginTop: 10,
              padding: 10,
              borderRadius: 10,
              alignItems: "center"
            }}
            onPress={() => {
              setIsPersonalized(false);
              fetchGeneralRanking();
              fetchLastReports();
              fetchHeatmap();
            }}
          >
            <Text style={{ color: "#f8f2f2" }}>
              Volver a vista general
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>
          {isPersonalized
            ? "🔥 Reportes en tu zona"
            : "🔥 Municipios más reportados"}
        </Text>

        {/* ✅ CAMBIO 1: El View ahora es TouchableOpacity */}
        {ranking.slice(0, 3).map((item, index) => (
          <TouchableOpacity 
            key={item.municipio}
            style={styles.card}
            onPress={() => router.push(`/municipio/${item.municipio}` as any)}
          >
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
          </TouchableOpacity>
        ))}

        {/* CARRUSEL */}
        <Text style={styles.sectionTitle}>
          {isPersonalized
            ? "🚨 Alertas en tu zona (últimas 12h)"
            : "🚨 Alertas de vecinos en las últimas horas"}
        </Text>

        <ScrollView
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          style={{ paddingLeft: 16 }}
        >
          {lastReports.length === 0 ? (
            <Text style={{ marginLeft: 16, color: colors.textSecondary || '#666' }}>
              No hay alertas recientes
            </Text>
          ) : (
            lastReports.map((report) => (
              /* ✅ CAMBIO 2: Arreglamos el error del key en el carrusel */
              <TouchableOpacity
                key={report.id} // 🔥 Usamos el ID de la base de datos
                style={styles.carouselCard}
                onPress={() => router.push(`/report/${report.id}` as const)}
              >
                <Text style={styles.reportTitle}>
                  {report.description}
                </Text>
                <Text style={styles.reportMunicipio}>
                  📍 {report.Location?.address || "Sin ubicación"}
                </Text>
              </TouchableOpacity>
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

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateReport}
        >
          <Text style={styles.buttonText}>
            🚨 Crear reporte
          </Text>
        </TouchableOpacity>

        {/* BOTÓN TEST */}
        {__DEV__ && (
          <TouchableOpacity
            style={{
              marginHorizontal: 20,
              marginBottom: 10,
              padding: 10,
              backgroundColor: "#333",
              borderRadius: 10,
              alignItems: "center"
            }}
            onPress={() => router.push("/test-validation")}
          >
            <Text style={{ color: "#fff" }}>
              ⚙️ Modo Test
            </Text>
          </TouchableOpacity>
        )}

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
    backgroundColor: "#e0e0e0", // Un fondo gris claro mientras carga
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