// routes/achievementRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Achievement = require("../models/Achievement");

router.get("/all", authMiddleware, async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener logros" });
  }
});



// 🔹 Obtener los logros desbloqueados del usuario autenticado
router.get("/my", authMiddleware, async (req, res) => {
  console.log("📥 Entró en GET /api/achievements/my");
  try {
    const user = await User.findById(req.user.userId).populate("achievements");

    console.log("🧠 Usuario encontrado:", user);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json((user.achievements || []).map(a => a._id));

  } catch (error) {
    console.error("❌ Error al obtener logros:", error.message);
    res.status(500).json({ error: "Error al obtener logros del usuario" });
  }
});




module.exports = router;
