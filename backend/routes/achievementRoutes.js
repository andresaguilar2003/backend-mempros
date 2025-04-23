// routes/achievementRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Achievement = require("../models/Achievement");
const { assignAchievementIfNeeded } = require("../utils/achievementManager");

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


router.post("/check", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate("achievements");
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const unlocked = [];

    // Condición: primera tarea creada
    const userTasks = await require("../models/Task").find({ userId });
    if (userTasks.length >= 1) {
      await assignAchievementIfNeeded(userId, "first-task");
      const first = await Achievement.findOne({ code: "first-task" });
      if (first && !user.achievements.includes(first._id)) unlocked.push(first);
    }

    // Condición: 10 tareas completadas
    const completedTasks = userTasks.filter(t => t.status === "completada");
    if (completedTasks.length >= 10) {
      await assignAchievementIfNeeded(userId, "ten-completed");
      const ten = await Achievement.findOne({ code: "ten-completed" });
      if (ten && !user.achievements.includes(ten._id)) unlocked.push(ten);
    }

    res.json({ unlocked });

  } catch (error) {
    console.error("❌ Error en /check de logros:", error.message);
    res.status(500).json({ error: "Error al verificar logros" });
  }
});




module.exports = router;
