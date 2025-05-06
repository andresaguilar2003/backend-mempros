const ColorChallengeResult = require('../models/ColorChallengeResult');

exports.saveColorChallengeResult = async (req, res) => {
  const { highestLevel, errorsPerLevel } = req.body;

  try {
    const result = new ColorChallengeResult({
      user: req.user.userId,
      highestLevel,
      errorsPerLevel
    });

    await result.save();
    res.status(201).json({ message: 'Resultado guardado correctamente.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar el resultado del reto de colores.' });
  }
};

exports.getUserColorChallengeResults = async (req, res) => {
  try {
    const results = await ColorChallengeResult.find({ user: req.user.id });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener resultados.' });
  }
};
