import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function PatientReportsListScreen({ route, navigation }) {
  const { patientId, patientName } = route.params;

  const reports = [
    { name: "PMCQ", route: "PatientReportScreen" },
    { name: "Reto de colores", route: "ColorChallengeReport" },
    { name: "Desafío de Piezas y Respuestas", route: "ReflexionPuzzleReport" },
    { name: "Desafío Ninja: De la Planificación a la Acción", route: null },
    { name: "El Camino Ninja: Construyendo mi Futuro", route: null },
    { name: "Tiempo de uso", route: null },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Informes de {patientName}</Text>

      {reports.map((report, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => {
            if (report.route) {
              navigation.navigate(report.route, { patientId, patientName });
            } else {
              alert("Este informe aún no está disponible.");
            }
          }}
        >
          <Text style={styles.reportName}>{report.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  reportName: {
    fontSize: 16,
    fontWeight: "500",
  },
});
