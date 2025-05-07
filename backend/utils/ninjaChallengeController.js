const NinjaChallengeResult = require('../models/NinjaChallengeResult');

exports.saveNinjaChallengeResult = async (req, res) => {
  const { results } = req.body;

  try {
    const result = new NinjaChallengeResult({
      user: req.user.userId,
      results
    });

    await result.save();
    res.status(201).json({ message: 'Resultado guardado correctamente.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar el resultado del Desafío Ninja.' });
  }
};

exports.getUserNinjaChallengeResults = async (req, res) => {
  try {
    const results = await NinjaChallengeResult.find({ user: req.user.id });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener resultados del Desafío Ninja.' });
  }
};
