const moment = require('moment');
const User = require('../models/User');

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
    const user = await User.findById(userId);
    const { minutes } = req.body;

    const today = new Date().toISOString().split('T')[0];

    if (!user.dailyUsage || user.dailyUsage.date !== today) {
      user.dailyUsage = {
        date: today,
        minutesUsed: minutes,
      };
    } else {
      user.dailyUsage.minutesUsed += minutes;
    }

    await user.save();

    const nearingLimit = user.dailyUsage.minutesUsed >= 25 && user.dailyUsage.minutesUsed < 30;
    const limitReached = user.dailyUsage.minutesUsed >= 30;

    res.json({
      message: "Tiempo actualizado",
      minutesUsed: user.dailyUsage.minutesUsed,
      nearingLimit,
      limitReached,
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
