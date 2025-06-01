import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const NinjaPathScreen = () => {
  const { token } = useAuth();
  const navigation = useNavigation();

  const [goals, setGoals] = useState([
    { description: '', timeframe: '' },
    { description: '', timeframe: '' },
    { description: '', timeframe: '' },
    { description: '', timeframe: '' },
    { description: '', timeframe: '' },
  ]);
  const [usedHelp, setUsedHelp] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleChange = (index, field, value) => {
    const updated = [...goals];
    updated[index][field] = value;
    setGoals(updated);
  };

  const handleSubmit = async () => {
    if (goals.some(g => !g.description.trim() || !g.timeframe.trim())) {
      Alert.alert('Completa todas las metas y tiempos.');
      return;
    }

    try {
      const response = await fetch('https://backend-mempros.onrender.com/api/ninja-path/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ goals, usedHelp }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al guardar');

      Alert.alert('¡Éxito!', 'Tus metas fueron guardadas.', [
        { text: 'OK', onPress: () => navigation.navigate('Inicio') },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo guardar la información.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>El Camino Ninja</Text>
      <Text style={styles.subtitle}>Escribe 5 metas con su tiempo estimado.</Text>

      {goals.map((goal, i) => (
        <View key={i} style={styles.goalBlock}>
          <Text style={styles.label}>Meta {i + 1}</Text>
          <TextInput
            placeholder="¿Qué quieres lograr?"
            value={goal.description}
            onChangeText={(text) => handleChange(i, 'description', text)}
            style={styles.input}
          />
          <TextInput
            placeholder="¿En cuánto tiempo?"
            value={goal.timeframe}
            onChangeText={(text) => handleChange(i, 'timeframe', text)}
            style={styles.input}
          />
        </View>
      ))}

      <TouchableOpacity onPress={() => { setUsedHelp(true); setShowHelp(true); }} style={styles.helpButton}>
        <Text style={styles.helpText}>¿Necesitas ejemplos?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitText}>Guardar</Text>
      </TouchableOpacity>

      {/* Ayuda Modal */}
      <Modal visible={showHelp} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.helpTitle}>Ejemplos de Metas</Text>
            <Text>🎯 Estudiar una nueva carrera - 5 años</Text>
            <Text>✈️ Viajar a otro país - 2 años</Text>
            <Text>🏡 Comprar una casa - 10 años</Text>
            <Text>📚 Leer 50 libros - 1 año</Text>
            <Text>💼 Conseguir un trabajo soñado - 3 años</Text>

            <TouchableOpacity onPress={() => setShowHelp(false)} style={styles.closeButton}>
              <Text style={{ color: '#fff' }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default NinjaPathScreen;

const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
    goalBlock: {
      marginBottom: 20,
      width: '100%',
    },
    label: {
      fontWeight: 'bold',
      marginBottom: 6,
    },
    input: {
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      marginBottom: 8,
    },
    helpButton: {
      backgroundColor: '#e0e0e0',
      padding: 12,
      borderRadius: 8,
      marginTop: 10,
    },
    helpText: {
      color: '#333',
    },
    submitButton: {
      backgroundColor: '#4CAF50',
      padding: 14,
      borderRadius: 10,
      marginTop: 20,
    },
    submitText: {
      color: 'white',
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 20,
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 20,
    },
    helpTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    closeButton: {
      backgroundColor: '#4CAF50',
      marginTop: 20,
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
  });
  