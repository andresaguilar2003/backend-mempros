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

  if (loading) return <ActivityIndicator size="large" color="#FF4757" />;
  if (results.length === 0) return (
    <View style={styles.noResultsContainer}>
      <Text style={styles.noResultsText}>No hay resultados del Desafío Ninja para este paciente.</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Desafío Ninja</Text>
      <Text style={styles.subtitle}>Paciente: {patientName}</Text>

      {Object.entries(groupedResults).map(([date, sessions], dateIndex) => (
        <View key={dateIndex} style={styles.dateSection}>
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>{date}</Text>
          </View>

          {sessions.map((session, sessionIndex) => (
            <View key={sessionIndex} style={styles.sessionCard}>
              <Text style={styles.sessionTime}>🕒 {new Date(session.date).toLocaleTimeString()}</Text>
              
              {session.results.map((question, qIndex) => (
                <View key={qIndex} style={styles.questionCard}>
                  <View style={styles.questionHeader}>
                    <Text style={styles.questionTitle}>Pregunta {question.questionNumber}</Text>
                    <View style={[
                      styles.scoreBadge, 
                      question.correctCount > question.incorrectCount ? styles.successBadge : styles.errorBadge
                    ]}>
                      <Text style={styles.scoreText}>
                        {question.correctCount}/{question.correctCount + question.incorrectCount}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.answerSection}>
                    <View style={styles.answerRow}>
                      <Text style={styles.answerLabel}>✅ Correctas:</Text>
                      <Text style={styles.answerText}>{question.correctOptions.join(', ') || 'Ninguna'}</Text>
                    </View>
                    <View style={styles.answerRow}>
                      <Text style={styles.answerLabel}>📝 Seleccionadas:</Text>
                      <Text style={styles.answerText}>{question.selectedOptions.join(', ') || 'Ninguna'}</Text>
                    </View>
                  </View>

                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{question.correctCount}</Text>
                      <Text style={styles.statLabel}>Aciertos</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{question.incorrectCount}</Text>
                      <Text style={styles.statLabel}>Errores</Text>
                    </View>
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
    backgroundColor: '#F8F9FA',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 4,
    color: '#2F3542',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#57606F',
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
    color: '#57606F',
    textAlign: 'center',
  },
  dateSection: {
    marginBottom: 20,
  },
  dateHeader: {
    backgroundColor: '#FF4757',
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
  sessionTime: {
    color: '#57606F',
    marginBottom: 12,
    fontSize: 14,
  },
  questionCard: {
    backgroundColor: '#F1F2F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2F3542',
  },
  scoreBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  successBadge: {
    backgroundColor: '#2ED573',
  },
  errorBadge: {
    backgroundColor: '#FF6B81',
  },
  scoreText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  answerSection: {
    marginBottom: 8,
  },
  answerRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  answerLabel: {
    fontWeight: '600',
    color: '#57606F',
    marginRight: 6,
    fontSize: 14,
  },
  answerText: {
    flex: 1,
    color: '#2F3542',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2F3542',
  },
  statLabel: {
    fontSize: 12,
    color: '#57606F',
    marginTop: 2,
  },
});