import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, ActivityIndicator, StyleSheet
} from "react-native";

export default function TherapistDashboardScreen({ route }) {
  const { therapist } = route.params;
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(`http://192.168.1.19:5000/api/therapists/${therapist._id}/patients`);
        const data = await res.json();
        setPatients(data.users || []);
      } catch (error) {
        console.error("Error al obtener pacientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pacientes de {therapist.name}</Text>

      <FlatList
        data={patients}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.patientCard}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  patientCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: "600" },
  email: { fontSize: 14, color: "#555" },
});
