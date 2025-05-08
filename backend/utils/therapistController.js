// controllers/therapistController.js
const Therapist = require('../models/Therapist'); // Asegúrate de que la ruta sea correcta

const getTherapistsByCode = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({ message: 'Se requiere un código de acceso.' });
    }

    const therapists = await Therapist.find({ code }).select('_id name avatarUrl');


    res.json(therapists);
  } catch (error) {
    console.error('❌ Error al obtener terapeutas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getTherapistWithUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const therapist = await Therapist.findById(id).populate('users', 'name email avatar');

    if (!therapist) {
      return res.status(404).json({ message: "Terapeuta no encontrado" });
    }

    res.json(therapist);
  } catch (error) {
    console.error("❌ Error al obtener terapeuta:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


module.exports = {
  getTherapistsByCode,
  getTherapistWithUsers,
};
