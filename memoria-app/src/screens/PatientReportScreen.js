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

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#5E35B1" />
    </View>
  );
  
  if (!report) return (
    <View style={styles.noReportContainer}>
      <Text style={styles.noReportText}>No hay informe disponible para este paciente.</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Informe PMCQ</Text>
        <Text style={styles.patientName}>{patientName}</Text>
      </View>

      <View style={styles.contentRow}>
        {/* Columna izquierda - Respuestas */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Respuestas (1-35)</Text>
          </View>
          
          <View style={styles.responsesGrid}>
            {report.responses.map((resp, index) => (
              <View key={index} style={styles.responseItem}>
                <Text style={styles.questionNumber}>P{index + 1}</Text>
                <View style={[
                  styles.responseBadge,
                  resp === 'Sí' ? styles.positiveResponse : styles.negativeResponse
                ]}>
                  <Text style={styles.responseText}>{resp}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Columna derecha - Tarea Posterior */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Tarea Posterior</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🌟</Text>
              <Text style={styles.subSectionTitle}>Actividades favoritas</Text>
            </View>
            <View style={styles.listContainer}>
              {report.favoriteActivities.map((act, i) => (
                <View key={i} style={styles.listItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.listText}>{act}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🎬</Text>
              <Text style={styles.subSectionTitle}>Series o Películas favoritas</Text>
            </View>
            <View style={styles.listContainer}>
              {report.favoriteShowsOrMovies.map((show, i) => (
                <View key={i} style={styles.listItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.listText}>{show}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.emojiContainer}>
            <View style={styles.emojiItem}>
              <Text style={styles.emojiLabel}>Actividad:</Text>
              <Text style={styles.emoji}>{report.emojiActivity}</Text>
            </View>
            <View style={styles.emojiItem}>
              <Text style={styles.emojiLabel}>Peli/Serie:</Text>
              <Text style={styles.emoji}>{report.emojiMedia}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F3FF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noReportContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noReportText: {
    fontSize: 16,
    color: "#7E57C2",
    textAlign: "center",
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#5E35B1",
  },
  patientName: {
    fontSize: 18,
    color: "#7E57C2",
    marginTop: 4,
  },
  contentRow: {
    flexDirection: Dimensions.get("window").width > 600 ? "row" : "column",
    gap: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#EDE7F6",
    paddingBottom: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#5E35B1",
  },
  responsesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  responseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
    marginBottom: 8,
  },
  questionNumber: {
    fontSize: 12,
    color: "#7986CB",
    marginRight: 6,
    width: 24,
  },
  responseBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    minWidth: 50,
    alignItems: 'center',
  },
  positiveResponse: {
    backgroundColor: "#E8F5E9",
  },
  negativeResponse: {
    backgroundColor: "#FFEBEE",
  },
  responseText: {
    fontSize: 14,
    fontWeight: '500',
    color: "#5E35B1",
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5E35B1",
  },
  listContainer: {
    marginLeft: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#7E57C2",
    marginTop: 8,
    marginRight: 8,
  },
  listText: {
    fontSize: 14,
    color: "#424242",
    flex: 1,
    lineHeight: 20,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  emojiItem: {
    alignItems: 'center',
  },
  emojiLabel: {
    fontSize: 14,
    color: "#616161",
    marginBottom: 4,
  },
  emoji: {
    fontSize: 24,
  },
});