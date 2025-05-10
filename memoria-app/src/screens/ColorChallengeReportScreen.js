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
        if (!response.ok) throw new Error("No se encontraron resultados.");
        const data = await response.json();
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

  // Agrupar resultados por fecha
  const groupedResults = results.reduce((acc, result) => {
    const date = new Date(result.date).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(result);
    return acc;
  }, {});

  if (loading) return <ActivityIndicator size="large" color="#6C5CE7" />;
  if (!results.length) return (
    <View style={styles.noResultsContainer}>
      <Text style={styles.noResultsText}>No hay resultados disponibles para este paciente.</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reto de Colores</Text>
      <Text style={styles.subtitle}>Paciente: {patientName}</Text>

      {Object.entries(groupedResults).map(([date, items], index) => (
        <View key={index} style={styles.dateSection}>
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>{date}</Text>
          </View>

          {items.map((result, resultIndex) => (
            <View key={resultIndex} style={styles.card}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Nivel máximo: {result.highestLevel}</Text>
              </View>

              <Text style={styles.sectionTitle}>Errores por nivel:</Text>
              
              <View style={styles.errorsContainer}>
                {result.errorsPerLevel.map((entry, i) => (
                  <View key={i} style={styles.errorItem}>
                    <Text style={styles.errorLevel}>Nivel {entry.level}</Text>
                    <View style={styles.errorBarContainer}>
                      <View 
                        style={[
                          styles.errorBar, 
                          { width: `${Math.min(100, entry.errors * 20)}%` }
                        ]}
                      />
                      <Text style={styles.errorCount}>{entry.errors} {entry.errors === 1 ? 'error' : 'errores'}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 16,
    backgroundColor: "#F9F9F9",
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 4,
    color: "#2D3436",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#636E72",
    marginBottom: 20,
    textAlign: "center",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: "#636E72",
    textAlign: "center",
  },
  dateSection: {
    marginBottom: 20,
  },
  dateHeader: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  levelBadge: {
    backgroundColor: "#00B894",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  levelText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  sectionTitle: {
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 8,
    fontSize: 16,
  },
  errorsContainer: {
    marginTop: 8,
  },
  errorItem: {
    marginBottom: 10,
  },
  errorLevel: {
    fontWeight: "500",
    color: "#636E72",
    marginBottom: 4,
    fontSize: 14,
  },
  errorBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorBar: {
    height: 8,
    backgroundColor: "#FD79A8",
    borderRadius: 4,
    marginRight: 8,
  },
  errorCount: {
    fontSize: 12,
    color: "#636E72",
  },
});