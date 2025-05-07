const ReflectionPuzzleResult = require('../models/ReflectionPuzzleResult');

exports.saveReflectionPuzzleResult = async (req, res) => {
  const { question, answer } = req.body;

  try {
    const result = new ReflectionPuzzleResult({
      user: req.user.userId,
      question,
      answer
    });

    await result.save();
    res.status(201).json({ message: 'Resultado guardado correctamente.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar el resultado del ejercicio reflexivo.' });
  }
};

exports.getUserReflectionPuzzleResults = async (req, res) => {
  try {
    const results = await ReflectionPuzzleResult.find({ user: req.user.id });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener resultados del ejercicio reflexivo.' });
  }
};
