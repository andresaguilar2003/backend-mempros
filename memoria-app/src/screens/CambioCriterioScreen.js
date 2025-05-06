// screens/CambioCriterioScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import CambioCriterioGame from '../components/CambioCriterioGame';

export default function CambioCriterioScreen() {
  return (
    <View style={styles.container}>
      <CambioCriterioGame />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
