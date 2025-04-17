// achievementUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'unlockedAchievements';

export const unlockAchievement = async (achievementId) => {
  try {
    const current = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = current ? JSON.parse(current) : [];

    if (!parsed.includes(achievementId)) {
      parsed.push(achievementId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
  } catch (e) {
    console.error('Error al guardar logro:', e);
  }
};

export const getUnlockedAchievements = async () => {
  try {
    const result = await AsyncStorage.getItem(STORAGE_KEY);
    return result ? JSON.parse(result) : [];
  } catch (e) {
    console.error('Error al leer logros:', e);
    return [];
  }
};
