const NinjaPathResult = require('../models/NinjaPathResult');

exports.saveNinjaPathResult = async (req, res) => {
  const { goals, usedHelp } = req.body;

  if (!Array.isArray(goals) || goals.length !== 5) {
    return res.status(400).json({ error: 'Debes enviar exactamente 5 metas.' });
  }

  try {
    const result = new NinjaPathResult({
      user: req.user.userId,
      goals,
      usedHelp: !!usedHelp
    });

    await result.save();
    res.status(201).json({ message: 'Resultado guardado correctamente.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar el resultado de Camino Ninja.' });
  }
};

exports.getUserNinjaPathResults = async (req, res) => {
  try {
    const results = await NinjaPathResult.find({ user: req.user.id });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los resultados de Camino Ninja.' });
  }
};
