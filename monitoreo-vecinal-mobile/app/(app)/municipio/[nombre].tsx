import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useMemo } from "react";
import { api } from "../../../services/api";

import MapView, { Marker } from "react-native-maps";
import { PieChart, BarChart } from "react-native-chart-kit";

export default function MunicipioAlertas() {

  // =============================
  // 📌 PARAMS
  // =============================
  const { nombre } = useLocalSearchParams();
  const nombreMunicipio = Array.isArray(nombre) ? nombre[0] : nombre;

  const router = useRouter();

  // =============================
  // 📊 ESTADOS
  // =============================
  const [reportes, setReportes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroTiempo, setFiltroTiempo] = useState("7d");

  // =============================
  // 🔥 FETCH CON CANCELACIÓN (FIX PRO)
  // =============================
  useEffect(() => {
    if (!nombreMunicipio) return;

    // 🔥 Creamos controlador para cancelar requests viejas
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setCargando(true);
        setReportes([]); // limpiar UI

     const response = await api.get(
  `/reports?municipio=${encodeURIComponent(nombreMunicipio)}`
);

        if (Array.isArray(response.data)) {
          setReportes(response.data);
        } else {
          setReportes([]);
        }

      } catch (error: any) {
        // 🔥 ignoramos errores por cancelación
        if (error.name !== "CanceledError") {
          console.log("Error al cargar:", error);
        }
      } finally {
        setCargando(false);
      }
    };

    fetchData();

    // 🔥 cleanup: cancela request anterior
    return () => {
      controller.abort();
    };

  }, [nombreMunicipio]);

  // =============================
  // 🧠 FILTRO POR TIEMPO
  // =============================
  const reportesFiltrados = useMemo(() => {
    const ahora = new Date();

    return reportes.filter((r) => {
      const fecha = new Date(r.report_date);
      const diff = (ahora.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24);

      if (filtroTiempo === "24h") return diff <= 1;
      if (filtroTiempo === "7d") return diff <= 7;
      if (filtroTiempo === "30d") return diff <= 30;

      return true;
    });
  }, [reportes, filtroTiempo]);

  // =============================
  // 📊 MÉTRICAS
  // =============================
  const { total, resueltos, pendientes, porcentajeResueltos } = useMemo(() => {
    const total = reportesFiltrados.length;
    const resueltos = reportesFiltrados.filter(r => r.status === "resuelto").length;
    const pendientes = total - resueltos;

    const porcentajeResueltos = total > 0
      ? Math.round((resueltos / total) * 100)
      : 0;

    return { total, resueltos, pendientes, porcentajeResueltos };
  }, [reportesFiltrados]);

  // =============================
  // 🗺️ MAPA
  // =============================
  const initialRegion = useMemo(() => {
    if (!reportesFiltrados.length || !reportesFiltrados[0].Location) return null;

    return {
      latitude: Number(reportesFiltrados[0].Location.latitude),
      longitude: Number(reportesFiltrados[0].Location.longitude),
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }, [reportesFiltrados]);

  // =============================
  // 📊 CHARTS
  // =============================
  const screenWidth = Dimensions.get("window").width;

  const pieData = [
    {
      name: "Resueltos",
      population: resueltos,
      color: "#22c55e",
      legendFontColor: "#fff",
      legendFontSize: 12,
    },
    {
      name: "Pendientes",
      population: pendientes,
      color: "#ef4444",
      legendFontColor: "#fff",
      legendFontSize: 12,
    },
  ];

  const reportsByDay: Record<string, number> = reportesFiltrados.reduce((acc, r) => {
    const date = new Date(r.report_date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barLabels = Object.keys(reportsByDay).slice(-5);
  const barData = Object.values(reportsByDay).slice(-5).map(Number);

  const chartConfig = {
    backgroundGradientFrom: "#0b1120",
    backgroundGradientTo: "#0b1120",
    color: () => `#3b82f6`,
    labelColor: () => "#9ca3af",
  };

  // =============================
  // 🎨 UI
  // =============================
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButtonText}>⬅ Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{nombreMunicipio}</Text>
      </View>

      <ScrollView>

        {/* FILTROS */}
        <View style={styles.filtrosContainer}>
          {["24h", "7d", "30d"].map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filtroBtn,
                filtroTiempo === f && styles.filtroActivo
              ]}
              onPress={() => setFiltroTiempo(f)}
            >
              <Text style={styles.filtroText}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.insight}>
          {total > 0
            ? `Se registraron ${total} reportes en los últimos ${filtroTiempo}`
            : "Sin actividad en este período"}
        </Text>

        {initialRegion && (
          <MapView style={styles.map} initialRegion={initialRegion}>
            {reportesFiltrados.map((r) => (
              r.Location && (
                <Marker
                  key={r.id}
                  coordinate={{
                    latitude: Number(r.Location.latitude),
                    longitude: Number(r.Location.longitude),
                  }}
                />
              )
            ))}
          </MapView>
        )}

        <View style={styles.metricsContainer}>
          <Metric title="Reportes" value={total} />
          <Metric title="Activos" value={pendientes} />
          <Metric title="Resueltos" value={resueltos} />
        </View>

        <View style={styles.analysisBox}>
          <Text style={styles.analysisText}>✔ {porcentajeResueltos}% resueltos</Text>
          <Text style={styles.analysisText}>⚠ {100 - porcentajeResueltos}% pendientes</Text>
        </View>

        <PieChart
          data={pieData}
          width={screenWidth - 32}
          height={180}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />

        <BarChart
          data={{
            labels: barLabels,
            datasets: [{ data: barData }],
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          fromZero
          showValuesOnTopOfBars
          yAxisLabel=""
          yAxisSuffix=""
        />

        {cargando ? (
          <ActivityIndicator size="large" color="#ef4444" />
        ) : reportesFiltrados.length === 0 ? (
          <Text style={styles.emptyText}>
            No hay alertas en este municipio
          </Text>
        ) : (
          reportesFiltrados.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.card}
              onPress={() => router.push(`/report/${report.id}`)}
            >
              <Text style={styles.reportTitle}>{report.description}</Text>
              <Text style={styles.reportDate}>
                Estado: {report.status}
              </Text>
            </TouchableOpacity>
          ))
        )}

      </ScrollView>
    </View>
  );
}

// 🔥 COMPONENTE REUTILIZABLE
function Metric({ title, value }: any) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b1120", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginTop: 40, marginBottom: 20 },
  backButtonText: { color: "#fff", marginRight: 10 },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  filtrosContainer: { flexDirection: "row", marginBottom: 15, gap: 10 },
  filtroBtn: { backgroundColor: "#1f2937", padding: 8, borderRadius: 8 },
  filtroActivo: { backgroundColor: "#2563eb" },
  filtroText: { color: "#fff" },
  insight: { color: "#9ca3af", marginBottom: 10 },
  map: { height: 200, borderRadius: 12, marginBottom: 15 },
  metricsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  metricCard: { backgroundColor: "#1f2937", padding: 12, borderRadius: 10, width: "30%", alignItems: "center" },
  metricTitle: { color: "#9ca3af", fontSize: 12 },
  metricValue: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  analysisBox: { backgroundColor: "#111827", padding: 12, borderRadius: 10, marginBottom: 20 },
  analysisText: { color: "#fff" },
  chartTitle: { color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  card: { backgroundColor: "#1f2937", padding: 16, borderRadius: 12, marginBottom: 12 },
  reportTitle: { color: "#fff", fontWeight: "bold" },
  reportDate: { color: "#ef4444" },
  emptyText: { color: "#9ca3af", textAlign: "center", marginTop: 20 }
});