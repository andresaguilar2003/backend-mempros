import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function TherapistCodeScreen() {
  const [code, setCode] = useState("");
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const navigation = useNavigation();

  const fetchTherapists = async () => {
    if (!code.trim()) {
      Alert.alert(
        "Código requerido", 
        "Por favor, introduce el código de acceso proporcionado por tu terapeuta.",
        [{ text: "Entendido" }]
      );
      return;
    }

    try {
      setLoading(true);
      setSearchPerformed(true);
      const response = await fetch(`http://192.168.1.19:5000/api/therapists/by-code/${code}`);
      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          "No se encontraron resultados", 
          data.message || "Verifica que el código sea correcto e inténtalo nuevamente.",
          [{ text: "Aceptar" }]
        );
        setTherapists([]);
        return;
      }

      setTherapists(data);
    } catch (error) {
      console.error("Error al obtener terapeutas:", error);
      Alert.alert(
        "Error de conexión", 
        "No se pudo conectar al servidor. Por favor, verifica tu conexión a Internet.",
        [{ text: "Reintentar" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTherapist = (therapist) => {
    navigation.navigate("TherapistDashboardScreen", { therapist });
  };  

  return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Icon name="verified-user" size={28} color="#5E35B1" />
            <Text style={styles.title}>Acceso Terapéutico</Text>
            <Text style={styles.subtitle}>
              Introduce el código compartido por tu profesional de salud mental
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ej: TH-1234-ABCD"
              placeholderTextColor="#9E9E9E"
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              keyboardType="default"
              returnKeyType="search"
              onSubmitEditing={fetchTherapists}
            />
            <Icon name="vpn-key" size={24} color="#5E35B1" style={styles.inputIcon} />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={fetchTherapists}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Icon name="search" size={20} color="#FFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>BUSCAR TERAPEUTAS</Text>
              </>
            )}
          </TouchableOpacity>

          {searchPerformed && therapists.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <Icon name="find-replace" size={50} color="#B39DDB" />
              <Text style={styles.emptyText}>No se encontraron terapeutas</Text>
              <Text style={styles.emptySubtext}>Verifica el código e intenta nuevamente</Text>
            </View>
          )}

          {therapists.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>TERAPEUTAS DISPONIBLES</Text>
              <FlatList
                data={therapists}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.therapistCard}
                    onPress={() => handleSelectTherapist(item)}
                  >
                    <View style={styles.avatar}>
                      <Icon name="person" size={24} color="#FFF" />
                    </View>
                    <View style={styles.therapistInfo}>
                      <Text style={styles.therapistName}>{item.name}</Text>
                      <Text style={styles.therapistSpecialty}>
                        {item.specialty || "Salud mental"}
                      </Text>
                    </View>
                    <Icon name="chevron-right" size={24} color="#7E57C2" />
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  content: {
    flex: 1,
    padding: 25,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5E35B1',
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#616161',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1C4E9',
    borderRadius: 10,
    padding: 15,
    paddingLeft: 45,
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#333',
    elevation: 2,
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#5E35B1',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#5E35B1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    color: '#5E35B1',
    marginTop: 15,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#757575',
    marginTop: 5,
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  therapistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EDE7F6',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7E57C2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  therapistInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4527A0',
    marginBottom: 3,
  },
  therapistSpecialty: {
    fontSize: 13,
    color: '#757575',
  },
  separator: {
    height: 12,
  },
});