// utils/achievementManager.js
const User = require("../models/User");
const Achievement = require("../models/Achievement");

/**
 * Asigna un logro al usuario si aún no lo tiene
 */
const assignAchievementIfNeeded = async (userId, achievementCode) => {
  try {
    const achievement = await Achievement.findOne({ code: achievementCode });
    if (!achievement) {
      console.warn(`⚠️ Logro con código '${achievementCode}' no encontrado.`);
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      console.warn(`⚠️ Usuario con ID '${userId}' no encontrado.`);
      return;
    }

    const alreadyUnlocked = user.achievements?.some((id) => id.equals(achievement._id));
    if (!alreadyUnlocked) {
      user.achievements = [...(user.achievements || []), achievement._id];
      await user.save();
      console.log(`🏅 Logro '${achievement.title}' asignado al usuario ${user.email}`);
    } else {
      console.log(`🔁 Usuario ya tiene el logro '${achievement.title}'`);
    }
  } catch (error) {
    console.error("❌ Error asignando logro:", error.message);
  }
};

module.exports = {
  assignAchievementIfNeeded,
};
