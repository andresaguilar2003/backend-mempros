import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

export default function NinjaPathReportScreen({ route }) {
  const { patientId, patientName } = route.params;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`http://192.168.1.19:5000/api/ninja-path/user/${patientId}`);
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
  if (results.length === 0) return <Text>No hay resultados de El Camino Ninja para este paciente.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>El Camino Ninja - {patientName}</Text>
      {results.map((session, idx) => (
        <View key={idx} style={styles.sessionCard}>
          <Text style={styles.date}>📅 {new Date(session.date).toLocaleString()}</Text>
          <Text style={styles.helpText}>🆘 Usó ayuda: {session.usedHelp ? 'Sí' : 'No'}</Text>
          {session.goals.map((goal, i) => (
            <View key={i} style={styles.goalCard}>
              <Text style={styles.goalText}>🎯 {goal.description}</Text>
              <Text style={styles.timeframeText}>⏱ Tiempo estimado: {goal.timeframe}</Text>
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
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 12
  },
  date: { fontWeight: '600', marginBottom: 6 },
  helpText: { fontStyle: 'italic', marginBottom: 10 },
  goalCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8
  },
  goalText: { fontWeight: '500' },
  timeframeText: { color: '#555' }
});
