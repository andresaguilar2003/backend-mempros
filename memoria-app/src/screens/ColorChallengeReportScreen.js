import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";

export default function ColorChallengeReportScreen({ route }) {
  const { patientId, patientName } = route.params;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`http://192.168.1.19:5000/api/color-challenge/user/${patientId}`);
        if (!response.ok) {
          throw new Error("No se encontraron resultados.");
        }
        const data = await response.json();

        // Ordenar por fecha descendente (más reciente primero)
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setResults(sorted);
      } catch (error) {
        console.error("Error al cargar resultados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [patientId]);

  if (loading) return <ActivityIndicator size="large" />;
  if (!results.length) return <Text>No hay resultados disponibles para este paciente.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reto de Colores - {patientName}</Text>

      {results.map((result, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.date}>
            Fecha: {new Date(result.date).toLocaleDateString()}
          </Text>
          <Text style={styles.level}>Nivel máximo: {result.highestLevel}</Text>
          <Text style={styles.subTitle}>Errores por nivel:</Text>
          {result.errorsPerLevel.map((entry, i) => (
            <Text key={i} style={styles.error}>
              Nivel {entry.level}: {entry.errors} errores
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f4f4f4" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  date: { fontSize: 16, fontWeight: "500", marginBottom: 4 },
  level: { fontSize: 16, marginBottom: 4 },
  subTitle: { marginTop: 8, fontWeight: "600" },
  error: { marginLeft: 8 },
});
