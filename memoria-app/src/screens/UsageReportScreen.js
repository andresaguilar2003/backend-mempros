import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';

export default function DailyUsageReportScreen({ route }) {
  const { patientId, patientName } = route.params;
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch(`http://192.168.1.19:5000/api/usage/history/${patientId}`);
        if (!response.ok) throw new Error('No se encontró historial');
        const data = await response.json();
        setUsage(data);
      } catch (error) {
        console.error('⛔ Error al cargar uso:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [patientId]);

  if (loading) return <ActivityIndicator size="large" />;
  if (usage.length === 0) return <Text>No hay datos de uso para este paciente.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Uso Diario - {patientName}</Text>
      {usage.map((entry, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.date}>📅 {entry.date}</Text>
          <Text style={styles.minutes}>⏱ {entry.minutesUsed} minutos</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#e6f7ff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },
  date: { fontSize: 16, fontWeight: '600' },
  minutes: { fontSize: 16 }
});
