const PMCQResult = require('../models/PMCQResult');

const savePMCQResult = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Verifica si ya existe una respuesta guardada para este usuario
    const existingResult = await PMCQResult.findOne({ user: userId });
    if (existingResult) {
      return res.status(400).json({ message: 'Ya has completado este informe.' });
    }

    const {
      responses,
      favoriteActivities,
      favoriteShowsOrMovies,
      emojiActivity,
      emojiMedia
    } = req.body;

    // Validación básica adicional por seguridad
    if (
      !Array.isArray(responses) || responses.length !== 35 ||
      !Array.isArray(favoriteActivities) || favoriteActivities.length !== 3 ||
      !Array.isArray(favoriteShowsOrMovies) || favoriteShowsOrMovies.length !== 3 ||
      !emojiActivity || !emojiMedia
    ) {
      return res.status(400).json({ message: 'Datos incompletos o mal formateados.' });
    }

    const newResult = new PMCQResult({
      user: userId,
      responses,
      favoriteActivities,
      favoriteShowsOrMovies,
      emojiActivity,
      emojiMedia
    });

    await newResult.save();

    res.status(201).json({ message: 'Informe guardado correctamente.' });
  } catch (error) {
    console.error('⛔ Error al guardar el PMCQ:', error);
    res.status(500).json({ error: 'Error al guardar el informe' });
  }
};

const getPMCQResult = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await PMCQResult.findOne({ user: userId });

    if (!result) {
      return res.status(404).json({ message: 'No se encontró un resultado para este usuario.' });
    }

    res.json(result);
  } catch (error) {
    console.error('⛔ Error al obtener el PMCQ:', error);
    res.status(500).json({ error: 'Error al obtener el informe' });
  }
};

module.exports = {
  savePMCQResult,
  getPMCQResult,
};
