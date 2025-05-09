const moment = require('moment');
const User = require('../models/User');
const DailyUsageLog = require('../models/DailyUsageLog');

const getUsage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const today = new Date().toISOString().split('T')[0];

    const usageToday = user.dailyUsage?.date === today
      ? user.dailyUsage.minutesUsed
      : 0;

    res.json({ minutesUsed: usageToday });
  } catch (error) {
    console.error('Error al obtener el uso diario:', error);
    res.status(500).json({ error: 'Error al obtener el uso' });
  }
};


const updateUsage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { minutes } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Actualiza el campo actual
    if (!user.dailyUsage || user.dailyUsage.date !== today) {
      user.dailyUsage = {
        date: today,
        minutesUsed: minutes,
      };
    } else {
      user.dailyUsage.minutesUsed += minutes;
    }

    await user.save();

    // Actualiza o inserta el historial
    await DailyUsageLog.findOneAndUpdate(
      { user: userId, date: today },
      { $inc: { minutesUsed: minutes } },
      { upsert: true, new: true }
    );

    const totalToday = user.dailyUsage.minutesUsed;

    res.json({
      message: "Tiempo actualizado",
      minutesUsed: totalToday,
      nearingLimit: totalToday >= 25 && totalToday < 30,
      limitReached: totalToday >= 30,
    });
  } catch (err) {
    console.error("⛔ Error en updateUsage:", err);
    res.status(500).json({ error: "Error al actualizar el uso" });
  }
};




module.exports = {
  updateUsage,
  getUsage,
};
