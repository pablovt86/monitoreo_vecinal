import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { api } from "../../../services/api"; // Asegúrate de que esta ruta sea correcta para tu proyecto

export default function MunicipioAlertas() {
  const { nombre } = useLocalSearchParams(); 
  const router = useRouter();
  
  const [reportes, setReportes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (nombre) {
      cargarReportesDelMunicipio();
    }
  }, [nombre]);

  const cargarReportesDelMunicipio = async () => {
    try {
      setCargando(true);
      
      // ⚠️ ATENCIÓN AQUÍ: Si tu backend no está preparado para filtrar por query param (?municipio=X), 
      // esto podría devolver todos los reportes o dar error. Revisa tu consola de Node.js si falla.
      const response = await api.get(`/reports?municipio=${nombre}`);
      
      // Guardamos los datos en el estado
      if (Array.isArray(response.data)) {
        setReportes(response.data);
      } else {
        setReportes([]);
      }
    } catch (error) {
      console.log("Error al cargar los reportes del municipio:", error);
    } finally {
      setCargando(false); // Apagamos la animación de carga
    }
  };

  return (
    <View style={styles.container}>
      
      {/* HEADER CON BOTÓN DE VOLVER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>⬅ Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{nombre}</Text>
      </View>

      <Text style={styles.subtitle}>Alertas en esta zona</Text>

      {/* RENDERIZADO CONDICIONAL (Cargando -> Vacío -> Lista) */}
      {cargando ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#ef4444" />
          <Text style={styles.loadingText}>Buscando alertas...</Text>
        </View>
      ) : reportes.length === 0 ? (
        <View style={styles.centerBox}>
          <Text style={styles.emptyText}>No hay alertas registradas en este municipio por el momento.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {reportes.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.card}
              onPress={() => router.push(`/report/${report.id}`)}
            >
              <Text style={styles.reportTitle}>{report.description}</Text>
              <Text style={styles.reportDate}>
                Estado: {report.status || "Pendiente"}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

    </View>
  );
}

// ESTILOS ADAPTADOS A TU TEMA OSCURO
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0b1120", // Tu color de fondo
    padding: 16 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40, // Espacio para el notch del celular
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#1f2937",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 15,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#fff",
    flex: 1,
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 16,
    marginBottom: 20,
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#9ca3af",
    marginTop: 10,
  },
  emptyText: {
    color: "#9ca3af",
    textAlign: "center",
    fontSize: 16,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#1f2937",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reportTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  reportDate: {
    color: "#ef4444",
    fontSize: 14,
  }
});