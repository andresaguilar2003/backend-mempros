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
        // Ordenar por fecha descendente
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setResults(sortedData);
      } catch (error) {
        console.error('Error al cargar resultados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [patientId]);

  // Agrupar resultados por fecha
  const groupedResults = results.reduce((acc, session) => {
    const date = new Date(session.date).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(session);
    return acc;
  }, {});

  if (loading) return <ActivityIndicator size="large" color="#8A2BE2" />;
  if (results.length === 0) return (
    <View style={styles.noResultsContainer}>
      <Text style={styles.noResultsText}>No hay resultados de El Camino Ninja para este paciente.</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>El Camino Ninja</Text>
      <Text style={styles.subtitle}>Paciente: {patientName}</Text>

      {Object.entries(groupedResults).map(([date, sessions], dateIndex) => (
        <View key={dateIndex} style={styles.dateSection}>
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>{date}</Text>
          </View>

          {sessions.map((session, sessionIndex) => (
            <View key={sessionIndex} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionTime}>🕒 {new Date(session.date).toLocaleTimeString()}</Text>
                <View style={[
                  styles.helpBadge,
                  session.usedHelp ? styles.helpUsed : styles.helpNotUsed
                ]}>
                  <Text style={styles.helpBadgeText}>
                    {session.usedHelp ? 'Usó ayuda' : 'Sin ayuda'}
                  </Text>
                </View>
              </View>

              <Text style={styles.goalsTitle}>Objetivos establecidos:</Text>
              
              {session.goals.map((goal, goalIndex) => (
                <View key={goalIndex} style={styles.goalCard}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalIcon}>🎯</Text>
                    <Text style={styles.goalText}>{goal.description}</Text>
                  </View>
                  <View style={styles.timeframeContainer}>
                    <Text style={styles.timeframeIcon}>⏱</Text>
                    <Text style={styles.timeframeText}>Tiempo estimado: {goal.timeframe}</Text>
                  </View>
                </View>
              ))}
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
    backgroundColor: '#F5F0FF',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 4,
    color: '#4B0082',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#9370DB',
    marginBottom: 20,
    textAlign: 'center',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#9370DB',
    textAlign: 'center',
  },
  dateSection: {
    marginBottom: 20,
  },
  dateHeader: {
    backgroundColor: '#8A2BE2',
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
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionTime: {
    color: '#6A5ACD',
    fontSize: 14,
  },
  helpBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  helpUsed: {
    backgroundColor: '#FF6347',
  },
  helpNotUsed: {
    backgroundColor: '#3CB371',
  },
  helpBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  goalsTitle: {
    fontWeight: '600',
    color: '#4B0082',
    marginBottom: 10,
    fontSize: 16,
  },
  goalCard: {
    backgroundColor: '#F8F5FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  goalIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  goalText: {
    flex: 1,
    fontWeight: '500',
    color: '#483D8B',
    fontSize: 15,
  },
  timeframeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeframeIcon: {
    marginRight: 8,
    color: '#6A5ACD',
  },
  timeframeText: {
    color: '#6A5ACD',
    fontSize: 14,
  },
});