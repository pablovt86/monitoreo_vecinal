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
  // 📌 PARAMS (nombre del municipio)
  // =============================
  const { nombre } = useLocalSearchParams();

  // ⚠️ Puede venir como string o array → lo normalizamos
  const nombreMunicipio = Array.isArray(nombre) ? nombre[0] : nombre;

  const router = useRouter();

  // =============================
  // 📊 ESTADOS
  // =============================
  const [reportes, setReportes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  // =============================
  // 🔄 FETCH DATA
  // =============================
  useEffect(() => {
    if (nombreMunicipio) {
      cargarReportesDelMunicipio();
    }
  }, [nombreMunicipio]);

  const cargarReportesDelMunicipio = async () => {
    try {
      setCargando(true);

      // 🔥 Traemos reportes filtrados por municipio
      const response = await api.get(`/reports?municipio=${nombreMunicipio}`);

      // Validamos que sea array
      if (Array.isArray(response.data)) {
        setReportes(response.data);
      } else {
        setReportes([]);
      }

    } catch (error) {
      console.log("Error al cargar:", error);
      setReportes([]);
    } finally {
      setCargando(false);
    }
  };

  // =============================
  // 📈 MÉTRICAS (OPTIMIZADAS)
  // =============================
  const { total, resueltos, pendientes, porcentajeResueltos } = useMemo(() => {

    const total = reportes.length;

    const resueltos = reportes.filter(r => r.status === "resuelto").length;

    const pendientes = total - resueltos;

    const porcentajeResueltos = total > 0
      ? Math.round((resueltos / total) * 100)
      : 0;

    return { total, resueltos, pendientes, porcentajeResueltos };

  }, [reportes]);

  // =============================
  // 🗺️ MAPA CONFIG
  // =============================
  const initialRegion = useMemo(() => {
    if (!reportes.length || !reportes[0].Location) return null;

    return {
      latitude: Number(reportes[0].Location.latitude),
      longitude: Number(reportes[0].Location.longitude),
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }, [reportes]);

  // =============================
  // 📊 DATOS GRÁFICOS
  // =============================
  const screenWidth = Dimensions.get("window").width;

  // 🥧 Pie Chart (estado)
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

  // 📊 Bar Chart (reportes por día)
 const reportsByDay: Record<string, number> = reportes.reduce((acc, r) => {
  const date = new Date(r.report_date).toLocaleDateString();

  acc[date] = (acc[date] || 0) + 1;

  return acc;
}, {} as Record<string, number>);

const barLabels = Object.keys(reportsByDay).slice(-5);

const barData = Object.values(reportsByDay)
  .slice(-5)
  .map((v) => Number(v));

  // 🎨 CONFIG GRÁFICOS
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

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButtonText}>⬅ Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{nombreMunicipio}</Text>
      </View>

      <ScrollView>

        <Text style={styles.subtitle}>Análisis del municipio</Text>

        {/* 🗺️ MAPA */}
        {initialRegion && (
          <MapView style={styles.map} initialRegion={initialRegion}>
            {reportes.map((r) => (
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

        {/* 📊 MÉTRICAS */}
        <View style={styles.metricsContainer}>
          <Metric title="Reportes" value={total} />
          <Metric title="Activos" value={pendientes} />
          <Metric title="Resueltos" value={resueltos} />
        </View>

        {/* 📈 ANÁLISIS */}
        <View style={styles.analysisBox}>
          <Text style={styles.analysisText}>
            ✔ {porcentajeResueltos}% resueltos
          </Text>
          <Text style={styles.analysisText}>
            ⚠ {100 - porcentajeResueltos}% pendientes
          </Text>
        </View>

        {/* 🥧 PIE CHART */}
        <Text style={styles.chartTitle}>Estado de Reportes</Text>
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

        {/* 📊 BAR CHART */}
        <Text style={styles.chartTitle}>Actividad reciente</Text>
        
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




        {/* LISTA */}
        {cargando ? (
          <ActivityIndicator size="large" color="#ef4444" />
        ) : reportes.length === 0 ? (
          <Text style={styles.emptyText}>
            No hay alertas en este municipio
          </Text>
        ) : (
          reportes.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.card}
              onPress={() => router.push(`/report/${report.id}`)}
            >
              <Text style={styles.reportTitle}>
                {report.description}
              </Text>

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

// 🧱 COMPONENTE REUTILIZABLE
function Metric({ title, value }: any) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

// 🎨 ESTILOS
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b1120", padding: 16 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },

  backButtonText: {
    color: "#fff",
    marginRight: 10
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold"
  },

  subtitle: {
    color: "#9ca3af",
    marginBottom: 15
  },

  map: {
    height: 200,
    borderRadius: 12,
    marginBottom: 15
  },

  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },

  metricCard: {
    backgroundColor: "#1f2937",
    padding: 12,
    borderRadius: 10,
    width: "30%",
    alignItems: "center"
  },

  metricTitle: {
    color: "#9ca3af",
    fontSize: 12
  },

  metricValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },

  analysisBox: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20
  },

  analysisText: {
    color: "#fff"
  },

  chartTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10
  },

  card: {
    backgroundColor: "#1f2937",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12
  },

  reportTitle: {
    color: "#fff",
    fontWeight: "bold"
  },

  reportDate: {
    color: "#ef4444"
  },

  emptyText: {
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 20
  }
});