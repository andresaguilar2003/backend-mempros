import React from 'react';
import { View, StyleSheet } from 'react-native';
import MemoryGame from '../components/MemoryGame';

export default function MemoryGameScreen() {
  return (
    <View style={styles.container}>
      <MemoryGame />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
