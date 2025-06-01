import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  RefreshControl
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function TherapistDashboardScreen({ route }) {
  const { therapist } = route.params;
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchPatients = async () => {
    try {
      const res = await fetch(`https://backend-mempros.onrender.com/api/therapists/${therapist._id}/patients`);
      const data = await res.json();
      setPatients(data.users || []);
    } catch (error) {
      console.error("Error al obtener pacientes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPatients();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A76FF" />
      </View>
    );
  }

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Bienvenido,</Text>
          <Text style={styles.title}>{therapist.name}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon name="people" size={20} color="#4A76FF" />
              <Text style={styles.statText}>{patients.length} pacientes</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Lista de Pacientes</Text>

        <FlatList
          data={patients}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4A76FF']}
              tintColor="#4A76FF"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="group" size={50} color="#CCD6FF" />
              <Text style={styles.emptyText}>No hay pacientes asignados</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("PatientReportsList", {
                  patientId: item._id,
                  patientName: item.name
                })
              }
              style={styles.patientCard}
            >
              <View style={styles.avatar}>
                <Icon name="person" size={24} color="#FFF" />
              </View>
              <View style={styles.patientInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email} numberOfLines={1}>{item.email}</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#B8C4FF" />
            </TouchableOpacity>
          )}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  header: {
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4FF',
  },
  greeting: {
    fontSize: 16,
    color: '#6D7FB3',
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2A3F7D',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: '#F0F5FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statText: {
    marginLeft: 6,
    color: '#4A76FF',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A76FF',
    marginBottom: 15,
    marginLeft: 5,
  },
  listContent: {
    paddingBottom: 20,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#4A76FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F4FF',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A76FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  patientInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A3F7D',
    marginBottom: 3,
  },
  email: {
    fontSize: 14,
    color: '#6D7FB3',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6D7FB3',
    textAlign: 'center',
  },
});