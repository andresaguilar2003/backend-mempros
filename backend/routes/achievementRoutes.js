// routes/achievementRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Achievement = require("../models/Achievement");

// 🔹 Obtener los logros desbloqueados del usuario autenticado
router.get("/my", authMiddleware, async (req, res) => {
  console.log("📥 Entró en GET /api/achievements/my");
  try {
    const user = await User.findById(req.user.userId).populate("achievements");
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user.achievements || []);
  } catch (error) {
    console.error("❌ Error al obtener logros:", error.message);
    res.status(500).json({ error: "Error al obtener logros del usuario" });
  }
});



module.exports = router;
