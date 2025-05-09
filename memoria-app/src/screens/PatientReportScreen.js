import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";

export default function PatientReportScreen({ route }) {
  const { patientId, patientName } = route.params;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`http://192.168.1.19:5000/api/pmcq/result/${patientId}`);
        if (!response.ok) throw new Error("Informe no encontrado");
        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error("Error al cargar informe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [patientId]);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  if (!report) return <Text style={styles.noReport}>No hay informe disponible para este paciente.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Informe PMCQ de {patientName}</Text>

      <View style={styles.contentRow}>
        <View style={styles.cardLeft}>
          <Text style={styles.sectionTitle}>Respuestas (1–35)</Text>
          {report.responses.map((resp, index) => (
            <Text key={index} style={styles.item}>
              Pregunta {index + 1}: <Text style={styles.responseValue}>{resp}</Text>
            </Text>
          ))}
        </View>

        <View style={styles.cardRight}>
          <Text style={styles.sectionTitle}>Tarea Posterior</Text>

          <Text style={styles.subSection}>Actividades favoritas:</Text>
          {report.favoriteActivities.map((act, i) => (
            <Text key={i} style={styles.item}>• {act}</Text>
          ))}

          <Text style={styles.subSection}>Series o Películas favoritas:</Text>
          {report.favoriteShowsOrMovies.map((show, i) => (
            <Text key={i} style={styles.item}>• {show}</Text>
          ))}

          <Text style={styles.subSection}>Emoji Actividad: <Text style={styles.emoji}>{report.emojiActivity}</Text></Text>
          <Text style={styles.subSection}>Emoji Peli/Serie: <Text style={styles.emoji}>{report.emojiMedia}</Text></Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  noReport: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#888",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  contentRow: {
    flexDirection: Dimensions.get("window").width > 600 ? "row" : "column", // horizontal si hay espacio
    justifyContent: "space-between",
    gap: 16,
  },
  cardLeft: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 16,
  },
  cardRight: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  subSection: {
    marginTop: 12,
    fontWeight: "500",
    fontSize: 16,
    color: "#444",
  },
  item: {
    fontSize: 15,
    marginTop: 4,
    color: "#555",
  },
  responseValue: {
    fontWeight: "bold",
    color: "#1e88e5",
  },
  emoji: {
    fontSize: 18,
  },
});
