import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

export default function NinjaChallengeReportScreen({ route }) {
  const { patientId, patientName } = route.params;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`http://192.168.1.19:5000/api/ninja-challenge/user/${patientId}`);
        if (!response.ok) throw new Error('No se encontraron resultados.');
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error al cargar resultados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [patientId]);

  if (loading) return <ActivityIndicator size="large" />;
  if (results.length === 0) return <Text>No hay resultados del Desafío Ninja para este paciente.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Desafío Ninja - {patientName}</Text>
      {results.map((session, idx) => (
        <View key={idx} style={styles.sessionCard}>
          <Text style={styles.date}>📅 {new Date(session.date).toLocaleString()}</Text>
          {session.results.map((q, i) => (
            <View key={i} style={styles.questionCard}>
              <Text style={styles.questionTitle}>Pregunta {q.questionNumber}</Text>
              <Text>✅ Correctas: {q.correctOptions.join(', ')}</Text>
              <Text>📝 Seleccionadas: {q.selectedOptions.join(', ')}</Text>
              <Text>✔️ Aciertos: {q.correctCount} | ❌ Errores: {q.incorrectCount}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  sessionCard: {
    marginBottom: 16,
    backgroundColor: '#eef',
    borderRadius: 10,
    padding: 12
  },
  date: { fontWeight: '600', marginBottom: 8 },
  questionCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8
  },
  questionTitle: { fontWeight: 'bold' }
});
