const User = require('../models/User');
const moment = require('moment');

exports.updateUsage = async (req, res) => {
  const userId = req.user.userId;
  const minutesToAdd = req.body.minutes || 1; // frontend puede enviar cada 1 o 2 mins
  const today = moment().format('YYYY-MM-DD');

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });

    if (user.dailyUsage?.date !== today) {
      user.dailyUsage = {
        date: today,
        minutesUsed: minutesToAdd
      };
    } else {
      user.dailyUsage.minutesUsed += minutesToAdd;
    }

    await user.save();

    res.json({
      message: 'Tiempo actualizado correctamente',
      minutesUsed: user.dailyUsage.minutesUsed,
      limitReached: user.dailyUsage.minutesUsed >= 30,
      nearingLimit: user.dailyUsage.minutesUsed >= 25
    });
  } catch (err) {
    console.error('Error al actualizar uso:', err);
    res.status(500).json({ error: 'Error al actualizar uso diario' });
  }
};
