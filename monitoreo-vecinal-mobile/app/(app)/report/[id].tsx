import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { Modal } from "react-native";

import { api } from "../../../services/api";

export default function ReportDetail() {

  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState<any[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [imageVisible, setImageVisible] = useState(false);

  useEffect(() => {
    fetchReport();
    fetchComments();
  }, []);

  // =============================
  // 📄 FETCH REPORTE
  // =============================
  const fetchReport = async () => {
    try {
      const response = await api.get(`/reports/${id}`);
      setReport(response.data);
    } catch (error) {
      console.log("Error detalle", error);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 💬 FETCH COMMENTS
  // =============================
  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const res = await api.get(`/comments/report/${id}`);
      setComments(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingComments(false);
    }
  };

  // =============================
  // ✍️ CREAR COMENTARIO
  // =============================
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await api.post("/comments", {
        content: newComment,
        report_id: id,
        parent_id: null
      });

      setNewComment("");
      fetchComments();

    } catch (error) {
      console.log(error);
    }
  };

  // =============================
  // 🔧 RESOLVER REPORTE
  // =============================
  const handleResolve = async () => {
    try {
      await api.put(`/reports/${id}/status`, {
        status: "resolved"
      });
      fetchReport();
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;
  if (!report) return <Text>No se encontró el reporte</Text>;

  const formatTime = (date: string) => {
    const diff = (Date.now() - new Date(date).getTime()) / 1000;

    if (diff < 60) return "Hace unos segundos";
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} hs`;

    return new Date(date).toLocaleDateString();
  };

  return (
    <ScrollView style={styles.container}>

      {/* 🗺️ MAPA */}
      {report.Location?.latitude && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: Number(report.Location.latitude),
            longitude: Number(report.Location.longitude),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: Number(report.Location.latitude),
              longitude: Number(report.Location.longitude),
            }}
          />
        </MapView>
      )}

      {/* 🧾 CONTENIDO */}
      <View style={styles.content}>

        {/* DESCRIPCIÓN */}
        <Text style={styles.title}>
          {report.description}
        </Text>

        {/* 🖼️ IMAGEN */}
       {report.image ? (
  <TouchableOpacity onPress={() => setImageVisible(true)}>
    <Image
      source={{ uri: report.image }}
      style={styles.image}
      resizeMode="cover"
    />
  </TouchableOpacity>
) : (
  <Text style={styles.noImage}>
    Sin imagen disponible
  </Text>
)}

        {!report.image && (
          <Text style={styles.noImage}>
            Sin imagen disponible
          </Text>
        )}

        {/* TIEMPO */}
        <Text style={styles.time}>
          {formatTime(report.report_date)}
        </Text>

        {/* UBICACIÓN */}
        <Text style={styles.location}>
          📍 {report.Location?.Neighborhood?.Municipality?.name || "Sin ubicación"}
        </Text>

        {/* 👥 USUARIO */}
        <View style={styles.witnessBox}>
          <Text style={styles.witnessTitle}>
            👥 Reportado por vecinos
          </Text>

          <Text style={styles.witnessItem}>
            Usuario #{report.user_id || "Anon"}
          </Text>
        </View>



 {/* 💬 COMENTARIOS */}
      <View style={{ padding: 16 }}>

        <Text style={styles.commentTitle}>
          💬 Comentarios
        </Text>

        {/* INPUT */}
        <View style={styles.commentInputBox}>
          <TextInput
            placeholder="Escribí un comentario..."
            placeholderTextColor="#6b7280"
            value={newComment}
            onChangeText={setNewComment}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleAddComment}
          >
            <Text style={{ color: "#fff" }}>Enviar</Text>
          </TouchableOpacity>
        </View>

        {/* LOADING */}
        {loadingComments && <ActivityIndicator />}

        {/* SIN COMENTARIOS */}
        {comments.length === 0 && !loadingComments && (
          <Text style={styles.noComments}>
            No hay comentarios todavía
          </Text>
        )}

        {/* LISTA */}
        {comments.map((comment) => (
          <View key={comment.id} style={styles.comment}>

            <Text style={styles.commentUser}>
              Usuario #{comment.User?.firstname || "Anon"}
            </Text>

            <Text style={styles.commentText}>
              {comment.content}
            </Text>

            {/* RESPUESTAS */}
            {comment.replies?.map((reply: any) => (
              <View key={reply.id} style={styles.reply}>
                <Text style={styles.commentUser}>
                  ↳ Usuario #{reply.user_id}
                </Text>
                <Text style={styles.commentText}>
                  {reply.content}
                </Text>
              </View>
            ))}

          </View>
        ))}

      </View>


        {/* 🚨 BOTÓN RESOLVER */}
        {report.status !== "resolved" && (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleResolve}
          >
            <Text style={styles.primaryText}>
              Confirmar / Marcar como resuelto
            </Text>
          </TouchableOpacity>
        )}

        {/* 🔙 VOLVER */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleBack}
        >
          <Text style={styles.secondaryText}>
            Volver
          </Text>
        </TouchableOpacity>

      </View>

      {/* MODAL IMAGEN */}
      <Modal visible={imageVisible} transparent={true}>
  <TouchableOpacity
    style={styles.modalContainer}
    onPress={() => setImageVisible(false)}
  >
    <Image
      source={{ uri: report.image }}
      style={styles.fullImage}
      resizeMode="contain"
    />
  </TouchableOpacity>
</Modal>


     
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0b1120"
  },

  map: {
    height: 260
  },

  content: {
    padding: 16
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    marginBottom: 12,
  },

  noImage: {
    color: "#6b7280",
    marginBottom: 10
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10
  },

  time: {
    color: "#9ca3af",
    marginBottom: 6
  },

  location: {
    color: "#6b7280",
    marginBottom: 15
  },

  witnessBox: {
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 14,
    marginBottom: 20
  },

  witnessTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 6
  },

  witnessItem: {
    color: "#9ca3af"
  },

  primaryButton: {
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10
  },

  primaryText: {
    color: "#fff",
    fontWeight: "bold"
  },

  secondaryButton: {
    backgroundColor: "#1f2937",
    padding: 12,
    borderRadius: 12,
    alignItems: "center"
  },

  secondaryText: {
    color: "#fff"
  },

  commentTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10
  },

  commentInputBox: {
    marginBottom: 15
  },

  input: {
    backgroundColor: "#111827",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8
  },

  sendButton: {
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 10,
    alignItems: "center"
  },

  noComments: {
    color: "#6b7280"
  },

  comment: {
    backgroundColor: "#111827",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },

  reply: {
    marginLeft: 20,
    marginTop: 5
  },

  commentUser: {
    color: "#9ca3af",
    fontSize: 12
  },

  commentText: {
    color: "#fff"
  },
  modalContainer: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.95)",
  justifyContent: "center",
  alignItems: "center"
},

fullImage: {
  width: "100%",
  height: "80%"
}  

});