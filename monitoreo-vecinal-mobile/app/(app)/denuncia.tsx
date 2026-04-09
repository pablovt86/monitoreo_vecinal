import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView
} from "react-native";

import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { api } from "../../services/api";
import { useZone } from "./context/ZoneContext";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// =============================
// 🔥 TIPOS
// =============================
type IncidentType = {
  id: number;
  name: string;
};

export default function Denuncia() {

  // =============================
  // 🧠 ESTADOS
  // =============================
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<any>(null);

  const [incidentTypes, setIncidentTypes] = useState<IncidentType[]>([]);
  const [selectedType, setSelectedType] = useState<IncidentType | null>(null);

  const { latitude, longitude } = useLocalSearchParams();

  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const { zone } = useZone();

  // =============================
  // 🔥 TIPOS HARDCODE
  // =============================
  useEffect(() => {
    setIncidentTypes([
      { id: 1, name: "Robo" },
      { id: 2, name: "Vandalismo" },
      { id: 3, name: "Ruido molesto" },
      { id: 4, name: "Sospechoso" },
    ]);
  }, []);

  // =============================
  // 📍 UBICACIÓN DESDE HOME
  // =============================
  useEffect(() => {
    if (latitude && longitude) {
      setCoords({
        latitude: Number(latitude),
        longitude: Number(longitude)
      });
    }
  }, [latitude, longitude]);

  // =============================
  // 📷 IMAGE PICKER
  // =============================
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // =============================
  // 🚀 SUBMIT
  // =============================
  const handleSubmit = async () => {

    if (!description) return Alert.alert("Agregá una descripción");
    if (!selectedType) return Alert.alert("Seleccioná el tipo de incidente");
    if (!coords) return Alert.alert("No se pudo obtener tu ubicación");

    try {

      // 🟢 SIN imagen → usar axios normal
      if (!image) {
        await api.post("/reports", {
          description,
          incident_type_id: selectedType.id,
          latitude: coords.latitude,
          longitude: coords.longitude,
          municipality: zone?.municipality
        });

        Alert.alert("Reporte enviado correctamente");
        return;
      }

      // 🔥 CON imagen → usar fetch
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();

      formData.append("description", description);
      formData.append("incident_type_id", String(selectedType.id));
      formData.append("latitude", String(coords.latitude));
      formData.append("longitude", String(coords.longitude));

      formData.append("image", {
        uri: image.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);

      const response = await fetch("http://192.168.1.44:3000/api/reports", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await response.json();
      console.log("RESPONSE FETCH:", data);

      if (!response.ok) {
        throw new Error(data?.error || "Error al crear reporte");
      }

      Alert.alert("Reporte enviado correctamente");

      // 🔄 reset
      setDescription("");
      setImage(null);
      setSelectedType(null);

    } catch (error: any) {
      console.log("ERROR COMPLETO:", error);

      Alert.alert("Error al enviar reporte");
    }
  };

  // =============================
  // 🎨 UI
  // =============================
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Nueva Denuncia</Text>

      {zone && coords && (
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.detected}>
            📍 {zone.municipality}
          </Text>

          <Text style={styles.coords}>
            Lat: {coords.latitude.toFixed(4)} | Lng: {coords.longitude.toFixed(4)}
          </Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="¿Qué está pasando?"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Tipo de incidente</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {incidentTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.tag,
              selectedType?.id === type.id && styles.tagActive
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text style={styles.tagText}>{type.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>📷 Subir imagen</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image.uri }} style={styles.preview} />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar reporte</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

// =============================
// 🎨 ESTILOS
// =============================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1120",
    padding: 16
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20
  },

  detected: {
    color: "#22c55e",
    marginBottom: 5,
    fontWeight: "bold"
  },

  coords: {
    color: "#9ca3af",
    fontSize: 12
  },

  input: {
    backgroundColor: "#111827",
    color: "#fff",
    padding: 14,
    borderRadius: 12,
    minHeight: 100,
    marginBottom: 15
  },

  label: {
    color: "#9ca3af",
    marginBottom: 8,
    marginTop: 10
  },

  tag: {
    backgroundColor: "#1f2937",
    padding: 10,
    borderRadius: 20,
    marginRight: 10
  },

  tagActive: {
    backgroundColor: "#ef4444"
  },

  tagText: {
    color: "#fff"
  },

  imageButton: {
    backgroundColor: "#1f2937",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 15
  },

  imageButtonText: {
    color: "#fff"
  },

  preview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 15
  },

  button: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 12,
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});