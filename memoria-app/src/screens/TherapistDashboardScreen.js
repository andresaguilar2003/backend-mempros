import React, { useEffect, useState } from "react";
import {
  View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function TherapistDashboardScreen({ route }) {
  const { therapist } = route.params;
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

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
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PatientReportsList", { patientId: item._id, patientName: item.name })
            }
            style={styles.patientCard}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  patientCard: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8
  },
  name: { fontSize: 18, fontWeight: "600" },
  email: { fontSize: 14, color: "#666" },
});
