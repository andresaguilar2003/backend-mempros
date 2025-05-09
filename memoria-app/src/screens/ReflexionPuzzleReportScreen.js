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

  if (loading) return <ActivityIndicator size="large" />;
  if (results.length === 0) return <Text>No hay resultados disponibles para este paciente.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Desafío de Piezas y Respuestas - {patientName}</Text>
      {results.map((result, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.date}>{new Date(result.date).toLocaleString()}</Text>
          <Text style={styles.question}>🧩 {result.question}</Text>
          <Text style={styles.answer}>✍️ {result.answer}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  date: { fontSize: 14, color: '#555', marginBottom: 4 },
  question: { fontWeight: 'bold', fontSize: 16 },
  answer: { marginTop: 6, fontSize: 16 },
});
