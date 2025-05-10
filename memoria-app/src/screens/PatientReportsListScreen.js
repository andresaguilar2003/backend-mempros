import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ImageBackground,
  Dimensions
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function PatientReportsListScreen({ route, navigation }) {
  const { patientId, patientName } = route.params;

  const reports = [
    { 
      name: "PMCQ", 
      route: "PatientReportScreen",
      icon: "assignment",
      color: "#4CAF50",
      description: "Cuestionario psicológico multidimensional"
    },
    { 
      name: "Reto de colores", 
      route: "ColorChallengeReport",
      icon: "palette",
      color: "#2196F3",
      description: "Resultados de la prueba de atención y concentración"
    },
    { 
      name: "Desafío de Piezas y Respuestas", 
      route: "ReflexionPuzzleReport",
      icon: "extension",
      color: "#FF9800",
      description: "Análisis de respuestas reflexivas"
    },
    { 
      name: "Desafío Ninja: Planificación", 
      route: "NinjaChallengeReport",
      icon: "schedule",
      color: "#9C27B0",
      description: "Evaluación de habilidades de planificación"
    },
    { 
      name: "Camino Ninja: Futuro", 
      route: "NinjaPathReport",
      icon: "timeline",
      color: "#E91E63",
      description: "Objetivos personales y progreso"
    },
    { 
      name: "Tiempo de uso", 
      route: "UsageReport",
      icon: "query-builder",
      color: "#607D8B",
      description: "Estadísticas de uso de la aplicación"
    },
  ];

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Informes</Text>
          <Text style={styles.subtitle}>Paciente: {patientName}</Text>
        </View>

        <View style={styles.grid}>
          {reports.map((report, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { borderTopColor: report.color }]}
              onPress={() => {
                if (report.route) {
                  navigation.navigate(report.route, { patientId, patientName });
                } else {
                  alert("Este informe aún no está disponible.");
                }
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: report.color }]}>
                <Icon name={report.icon} size={24} color="#FFF" />
              </View>
              <Text style={styles.reportName}>{report.name}</Text>
              <Text style={styles.reportDescription}>{report.description}</Text>
              <Icon 
                name="chevron-right" 
                size={20} 
                color="#BDBDBD" 
                style={styles.arrowIcon} 
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  header: {
    marginBottom: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: Dimensions.get('window').width > 500 ? '48%' : '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  reportName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 5,
  },
  reportDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
    marginBottom: 15,
  },
  arrowIcon: {
    alignSelf: 'flex-end',
  },
});