// components/CambioCriterioGame.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const shapes = ['⬛', '🔺', '⚪', '⬜', '🔵'];
const colors = ['red', 'green', 'blue', 'orange', 'purple']; // Reales colores RN

const generateItems = () => {
  return Array.from({ length: 12 }).map(() => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    return { color, shape };
  });
};

export default function CambioCriterioGame() {
  const [criterion, setCriterion] = useState('color'); // Alterna color/shape
  const [model, setModel] = useState({ color: '', shape: '' });
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showModel, setShowModel] = useState(true);
  const [showChangeSignal, setShowChangeSignal] = useState(false);
  const [round, setRound] = useState(0);

  useEffect(() => {
    startNewRound();
  }, [round]);

  const startNewRound = () => {
    const newItems = generateItems();
    const modelIndex = Math.floor(Math.random() * newItems.length);
    const newModel = newItems[modelIndex];

    setItems(newItems);
    setModel(newModel);
    setSelected([]);
    setShowModel(true);
    setShowChangeSignal(false);

    setTimeout(() => {
      setShowModel(false);
    }, 3000); // Muestra modelo por 3 segundos

    if (round > 0) {
      setShowChangeSignal(true);
      setTimeout(() => {
        setShowChangeSignal(false);
      }, 1000); // Muestra la señal brevemente
    }
  };

  const toggleCriterion = () => {
    setCriterion(prev => (prev === 'color' ? 'shape' : 'color'));
    setRound(prev => prev + 1);
  };

  const isCorrect = (item) => {
    return criterion === 'color'
      ? item.color === model.color
      : item.shape === model.shape;
  };

  const handleSelect = (index) => {
    if (selected.includes(index)) return;

    const item = items[index];
    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (!isCorrect(item)) {
      Alert.alert('❌ Error', 'Has seleccionado un elemento incorrecto');
      return;
    }

    const correctCount = items.filter(isCorrect).length;

    if (newSelected.filter(i => isCorrect(items[i])).length === correctCount) {
      Alert.alert('✅ Bien hecho', 'Cambio de criterio!');
      setTimeout(toggleCriterion, 1000); // Espera un poco antes de cambiar
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔄 Cambio de Criterio</Text>

      {showModel && (
        <View style={styles.modelCard}>
          <Text style={styles.instructions}>Figura modelo:</Text>
          <View style={[styles.card, { backgroundColor: model.color }]}>
            <Text style={styles.shape}>{model.shape}</Text>
          </View>
        </View>
      )}

      {showChangeSignal && (
        <Text style={styles.signal}>🔁 Cambio de consigna</Text>
      )}

      {!showModel && !showChangeSignal && (
        <>
          <Text style={styles.instructions}>
            {criterion === 'color'
              ? `Selecciona todos los elementos del color anterior`
              : `Selecciona todas las figuras similares a la del modelo anterior`}
          </Text>

          <View style={styles.grid}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                  {
                    backgroundColor: item.color,
                    opacity: selected.includes(index) ? 0.5 : 1,
                  }
                ]}
                onPress={() => handleSelect(index)}
              >
                <Text style={styles.shape}>{item.shape}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  instructions: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  signal: { fontSize: 22, textAlign: 'center', marginBottom: 20, color: 'tomato' },
  modelCard: { alignItems: 'center', marginBottom: 20 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  card: {
    width: 70,
    height: 70,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
  },
  shape: { fontSize: 28 },
});
