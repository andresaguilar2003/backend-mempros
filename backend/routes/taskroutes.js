// routes/taskRoutes.js
const express = require("express");
const Task = require("../models/task");
const authMiddleware = require("../middleware/authMiddleware");
const { assignAchievementIfNeeded } = require("../utils/achievementManager");
const router = express.Router();

// 🔹 Crear una tarea (Protegido)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description, date, time, importance, status } = req.body;

        if (!title || !date || !time) {
            return res.status(400).json({ error: "El título, la fecha y la hora son obligatorios" });
        }

        const newTask = new Task({
            title,
            description,
            date,
            time,
            importance,
            status,
            userId: req.user.userId,
        });

        await newTask.save();

        // 🏆 Verificar si es su primera tarea
        const userTasks = await Task.find({ userId: req.user.userId });
        if (userTasks.length === 1) {
            await assignAchievementIfNeeded(req.user.userId, "first-task");
        }

        res.status(201).json(newTask);
    } catch (error) {
        console.error("Error al guardar la tarea:", error.message);
        res.status(500).json({ error: "Error al guardar la tarea", details: error.message });
    }
});

// 🔹 Obtener tareas del usuario autenticado (Protegido)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId });
        res.json(tasks);
    } catch (error) {
        console.error("❌ Error al obtener tareas:", error.message);
        res.status(500).json({ error: "Error al obtener tareas" });
    }
});

// 🔹 Actualizar una tarea (fecha, hora o estado)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { status, date, time } = req.body;

        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { status, ...(date && { date }), ...(time && { time }) },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Tarea no encontrada o no tienes permisos" });
        }

        // 🏆 Verificar si completó 10 tareas
        if (status === "completed") {
            const completedTasks = await Task.find({
                userId: req.user.userId,
                status: "completed",
            });

            if (completedTasks.length === 10) {
                await assignAchievementIfNeeded(req.user.userId, "ten-tasks");
            }

            // 🕗 Verificar si la completó antes de las 08:00
            const taskHour = parseInt(updatedTask.time.split(":")[0]);
            if (taskHour < 8) {
                await assignAchievementIfNeeded(req.user.userId, "early-bird");
            }
        }

        res.json(updatedTask);
    } catch (error) {
        console.error("❌ Error al actualizar la tarea:", error.message);
        res.status(500).json({ error: "Error al actualizar la tarea", details: error.message });
    }
});

// 🔹 Eliminar una tarea (Protegido)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });

        if (!task) {
            return res.status(404).json({ error: "Tarea no encontrada o no tienes permisos" });
        }

        res.json({ message: "Tarea eliminada correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar la tarea:", error.message);
        res.status(500).json({ error: "Error al eliminar la tarea", details: error.message });
    }
});





module.exports = router;
