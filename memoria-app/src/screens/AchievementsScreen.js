// AchievementsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { achievementsList } from '../data/achievementsData';
import { getUnlockedAchievements } from '../utils/achievementUtils';

const AchievementsScreen = () => {
  const [unlocked, setUnlocked] = useState([]);

  useEffect(() => {
    const loadAchievements = async () => {
      const unlockedIds = await getUnlockedAchievements();
      setUnlocked(unlockedIds);
    };
    loadAchievements();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>🏆 Todos los logros</Text>
      <FlatList
        data={achievementsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const achieved = unlocked.includes(item.id);
          return (
            <View style={styles.achievementItem}>
              <Image 
                source={item.image} 
                style={[styles.medal, !achieved && styles.lockedMedal]} 
              />
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.desc}>{item.description}</Text>
              </View>
            </View>
          );
        }}
      />

      <Text style={styles.sectionTitle}>🎖️ Mis logros</Text>
      <View style={styles.medalGallery}>
        {unlocked.map((id) => {
          const medal = achievementsList.find(a => a.id === id);
          return (
            <Image 
              key={id}
              source={medal.image} 
              style={styles.medal} 
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  achievementItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  medal: { width: 50, height: 50, marginRight: 15 },
  lockedMedal: { opacity: 0.3 },
  title: { fontWeight: 'bold' },
  desc: { fontSize: 12, color: '#555' },
  medalGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 10,
  },
});

export default AchievementsScreen;
