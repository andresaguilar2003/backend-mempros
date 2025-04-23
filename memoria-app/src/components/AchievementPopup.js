import React from 'react';
import { Modal, View, Text, StyleSheet, Image, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const iconMap = {
  'first-task': require('../assests/medals/medalla1.png'),
  'ten-completed': require('../assests/medals/medalla10.png'),
  'early-bird': require('../assests/medals/medallabird.png'),
};

export default function AchievementPopup({ visible, achievement }) {
  if (!visible || !achievement) return null;

  const icon = iconMap[achievement.code] || require('../assests/medals/question.png');

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>🏆 ¡Logro desbloqueado!</Text>
          <Image source={icon} style={styles.image} />
          <Text style={styles.achievementTitle}>{achievement.title}</Text>
          <Text style={styles.description}>{achievement.description}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    color: '#666',
  },
});
