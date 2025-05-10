import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';

export default function ReflectionPuzzleReportScreen({ route }) {
  const { patientId, patientName } = route.params;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`http://192.168.1.19:5000/api/reflection-puzzle/user/${patientId}`);
        if (!response.ok) throw new Error("No se encontraron resultados.");
        const data = await response.json();
        setResults(data);
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
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(result);
    return acc;
  }, {});

  if (loading) return <ActivityIndicator size="large" color="#4A90E2" />;
  if (results.length === 0) return (
    <View style={styles.noResultsContainer}>
      <Text style={styles.noResultsText}>No hay resultados disponibles para este paciente.</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Desafío de Piezas y Respuestas</Text>
      <Text style={styles.subtitle}>Paciente: {patientName}</Text>
      
      {Object.entries(groupedResults).map(([date, items], index) => (
        <View key={index} style={styles.dateSection}>
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>{date}</Text>
          </View>
          
          {items.map((item, itemIndex) => (
            <View key={itemIndex} style={styles.card}>
              <Text style={styles.question}>🧩 {item.question}</Text>
              <View style={styles.answerContainer}>
                <Text style={styles.answerLabel}>Respuesta:</Text>
                <Text style={styles.answerText}>{item.answer}</Text>
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
    backgroundColor: '#F5F7FA',
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 4,
    color: '#2C3E50',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 20,
    textAlign: 'center',
  },
  dateSection: {
    marginBottom: 20,
  },
  dateHeader: {
    backgroundColor: '#4A90E2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  question: {
    fontWeight: '600',
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 10,
    lineHeight: 22,
  },
  answerContainer: {
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
    padding: 12,
  },
  answerLabel: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
    marginBottom: 4,
  },
  answerText: {
    fontSize: 15,
    color: '#34495E',
    lineHeight: 20,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
});