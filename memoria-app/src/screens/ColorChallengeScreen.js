import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const COLORS = ['red', 'green', 'blue', 'yellow'];

const ColorChallengeScreen = () => {
  const { token } = useAuth();
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [level, setLevel] = useState(1);
  const [errorsPerLevel, setErrorsPerLevel] = useState([]);
  const currentMistakes = useRef(0);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [activeColor, setActiveColor] = useState(null);
  const [shouldRepeat, setShouldRepeat] = useState(false); 
  const navigation = useNavigation();

  useEffect(() => {
    if (!shouldRepeat) {
      generateNewSequence();
    } else {
      // Solo repite la secuencia sin generar una nueva
      showSequence(sequence);
    }
  }, [level, shouldRepeat]);

  const generateNewSequence = () => {
    const newSequence = Array.from({ length: level + 2 }, () =>
      COLORS[Math.floor(Math.random() * COLORS.length)]
    );
    setSequence(newSequence);
    setUserInput([]);
    showSequence(newSequence);
  };

  const showSequence = (seq) => {
    setIsDisplaying(true);
    let i = 0;
    const interval = setInterval(() => {
      setActiveColor(seq[i]);
      setTimeout(() => setActiveColor(null), 500);
      i++;
      if (i >= seq.length) {
        clearInterval(interval);
        setTimeout(() => setIsDisplaying(false), 500);
      }
    }, 1000);
  };


  const handleColorPress = (color) => {
    if (isDisplaying) return;

    const newInput = [...userInput, color];
    setUserInput(newInput);

    const correctColor = sequence[newInput.length - 1];
    if (color !== correctColor) {
      currentMistakes.current += 1;
    
      if (currentMistakes.current >= 2) {
        // Guardar errores de este nivel antes de terminar
        setErrorsPerLevel(prev => [...prev, { level, errors: currentMistakes.current }]);
        endGame();
      } else {
        setUserInput([]);
        setShouldRepeat(true);
      }
    } else if (newInput.length === sequence.length) {
      // Nivel completado
      setErrorsPerLevel(prev => [...prev, { level, errors: currentMistakes.current }]);
      currentMistakes.current = 0;
      if (level >= 7) {
        endGame(true);
      } else {
        setShouldRepeat(false);
        setLevel((prev) => prev + 1);
      }
    }
  };    

  const endGame = async (completed = false) => {
    try {
      const response = await fetch('https://backend-mempros.onrender.com/api/color-challenge/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          highestLevel: completed ? 7 : level, // 👈 nombre correcto
          errorsPerLevel,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Error al guardar resultado');

      Alert.alert('Juego terminado', completed ? '¡Completaste todos los niveles!' : 'Juego finalizado', [
        { text: 'OK', onPress: () => navigation.navigate('Inicio') },
      ]);
    } catch (error) {
      console.error('Error al guardar datos del juego:', error);
    }
  };

  const resetGame = () => {
    setLevel(1);
    setUserInput([]);
    setSequence([]);
    setErrorsPerLevel([]);           // Limpia historial de errores por nivel
    currentMistakes.current = 0;     // Reinicia errores del nivel actual
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reto de Colores</Text>
      <Text style={styles.subtitle}>Nivel: {level}</Text>
      <Text style={styles.subtitle}>Errores: {currentMistakes.current}/2</Text>

      <View style={styles.grid}>
        {COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorButton,
              { backgroundColor: color, opacity: activeColor === color ? 1 : 0.5 },
            ]}
            onPress={() => handleColorPress(color)}
            disabled={isDisplaying}
          />
        ))}
      </View>
    </View>
  );
};

export default ColorChallengeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '80%',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  colorButton: {
    width: 120,
    height: 120,
    borderRadius: 12,
    margin: 10,
  },
});
