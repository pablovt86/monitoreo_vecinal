import { View, Text, TouchableOpacity, Alert } from "react-native";
import { api } from "../../services/api";

export default function TestValidation() {

  const testInvalidReport = async () => {
    try {
      const res = await api.post("/reports", {
        incident_type_id: 1,
        // ❌ falta location_id
        report_date: new Date(),
        status: "pending",
      });

      Alert.alert("Respuesta", JSON.stringify(res.data));

    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.error || "Error desconocido");
    }
  };

  const testValidReport = async () => {
    try {
      const res = await api.post("/reports", {
        incident_type_id: 1,
        location_id: 1,
        report_date: new Date(),
        status: "pending",
      });

      Alert.alert("OK", "Reporte creado correctamente");

    } catch (error: any) {
      Alert.alert("Error", "Falló el test válido");
    }
  };

  const testLastReports = async () => {
    try {
      const res = await api.get("/reports/with-score");

      Alert.alert("Cantidad", res.data.length.toString());

    } catch (error) {
      Alert.alert("Error", "No se pudieron traer reportes");
    }
  };

  return (
    <View style={{ padding: 20, gap: 15 }}>

      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        🧪 Test de Validaciones
      </Text>

      <TouchableOpacity
        style={{ backgroundColor: "red", padding: 15, borderRadius: 10 }}
        onPress={testInvalidReport}
      >
        <Text style={{ color: "#fff" }}>
          ❌ Test Reporte Inválido
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ backgroundColor: "green", padding: 15, borderRadius: 10 }}
        onPress={testValidReport}
      >
        <Text style={{ color: "#fff" }}>
          ✅ Test Reporte Válido
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ backgroundColor: "blue", padding: 15, borderRadius: 10 }}
        onPress={testLastReports}
      >
        <Text style={{ color: "#fff" }}>
          📊 Test Últimos Reportes
        </Text>
      </TouchableOpacity>

    </View>
  );
}