import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function TherapistCodeScreen() {
  const [code, setCode] = useState("");
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const fetchTherapists = async () => {
    if (!code.trim()) {
      Alert.alert("Código requerido", "Por favor, introduce el código de acceso.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://192.168.1.19:5000/api/therapists/by-code/${code}`);
      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "No se pudo obtener la lista de terapeutas.");
        setTherapists([]);
        return;
      }

      setTherapists(data); // Lista de terapeutas encontrados
    } catch (error) {
      console.error("Error al obtener terapeutas:", error);
      Alert.alert("Error", "No se pudo conectar al servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTherapist = (therapist) => {
    navigation.navigate("TherapistLoginScreen", { therapist }); // Lo definiremos luego
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Código de terapeuta</Text>

      <TextInput
        style={styles.input}
        placeholder="Introduce el código compartido"
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity style={styles.button} onPress={fetchTherapists}>
        <Text style={styles.buttonText}>Buscar terapeutas</Text>
      </TouchableOpacity>

      {therapists.length > 0 && (
        <FlatList
          data={therapists}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.therapistCard}
              onPress={() => handleSelectTherapist(item)}
            >
              <Text style={styles.therapistName}>{item.name}</Text>
              {/* Si tienes avatarUrl, podrías mostrar una imagen aquí */}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  therapistCard: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  therapistName: {
    fontSize: 16,
    fontWeight: "500",
  },
});
