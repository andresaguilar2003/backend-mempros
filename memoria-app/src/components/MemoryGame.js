import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

// Genera un conjunto de pares aleatorios
const generateCards = () => {
  const emojis = ['🍎', '🐶', '🚗', '🎵', '🏀', '🌟', '📚', '💪🏻'];
  const pairList = [...emojis, ...emojis];
  return pairList
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
};

const MemoryGame = () => {
  const [cards, setCards] = useState(generateCards());
  const [selected, setSelected] = useState([]);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    if (selected.length === 2) {
      const [first, second] = selected;
      if (cards[first].emoji === cards[second].emoji) {
        const newCards = [...cards];
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setSelected([]);
      } else {
        setTimeout(() => {
          const newCards = [...cards];
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards(newCards);
          setSelected([]);
        }, 1000);
      }
    }
  }, [selected]);

  useEffect(() => {
    if (cards.every(card => card.isMatched)) {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      Alert.alert("🎉 ¡Bien Hecho!", `Has terminado en ${timeTaken} segundos.`);
      // Aquí puedes hacer el POST al backend para guardar el tiempo
    }
  }, [cards]);

  const handleFlip = (index) => {
    if (cards[index].isFlipped || cards[index].isMatched || selected.length === 2) return;
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    setSelected([...selected, index]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 Juego de Memoria</Text>
      <View style={styles.grid}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={card.id}
            style={styles.card}
            onPress={() => handleFlip(index)}
          >
            <Text style={styles.cardText}>
              {card.isFlipped || card.isMatched ? card.emoji : '❓'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  card: {
    width: 60,
    height: 60,
    margin: 5,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  cardText: {
    fontSize: 24,
    color: '#fff',
  },
});

export default MemoryGame;
