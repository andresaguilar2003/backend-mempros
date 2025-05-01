// routes/taskRoutes.js
const express = require("express");
const Task = require("../models/task");
const User = require("../models/User"); // 👇 NUEVO
const authMiddleware = require("../middleware/authMiddleware");
const { assignAchievementIfNeeded } = require("../utils/achievementManager");
const router = express.Router();

// 🔹 Crear una tarea (Protegido)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description, date, time, importance, status, assignedToEmails } = req.body; // 👇 NUEVO

        if (!title || !date || !time) {
            return res.status(400).json({ error: "El título, la fecha y la hora son obligatorios" });
        }

        let assignedUserIds = [];

        if (Array.isArray(assignedToEmails) && assignedToEmails.length > 0) {
            const users = await User.find({
                email: { $in: assignedToEmails.map(e => e.trim().toLowerCase()) }
            });
        
            if (users.length !== assignedToEmails.length) {
                return res.status(404).json({ error: "Uno o más correos no corresponden a usuarios registrados" });
            }
        
            assignedUserIds = users.map(user => user._id);
        }

        const newTask = new Task({
            title,
            description,
            date,
            time,
            importance,
            status,
            userId: req.user.userId,
            assignedTo: assignedUserIds, // 👇 NUEVO
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
        const userId = req.user.userId;

        const tasks = await Task.find({
            $or: [
                { userId: userId },
                { assignedTo: userId } // 👇 NUEVO
            ]
        })

        .populate("userId", "name")        // Esto traerá el nombre del creador
        .populate("assignedTo", "name");

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

        // Validar que si se marca como hecha, venga con hora
        if (status === "done" && !time) {
            return res.status(400).json({ error: "La hora es requerida para tareas completadas" });
        }

        const updatedTask = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                $or: [
                    { userId: req.user.userId },
                    { assignedTo: req.user.userId }
                ]
            },
            {
                ...(status && { status }),
                ...(date && { date }),
                ...(time && { time })
            },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Tarea no encontrada o no tienes permisos" });
        }

        // 🏆 Verificar si completó 10 tareas
        if (status === "done") {
            const completedTasks = await Task.find({
                userId: req.user.userId,
                status: "done",
            });

            if (completedTasks.length === 10) {
                await assignAchievementIfNeeded(req.user.userId, "ten-tasks");
            }

            // 🕗 Verificar si la completó antes de las 08:00
            if (updatedTask.time) {
                const taskHour = parseInt(updatedTask.time.split(":")[0]);
                if (taskHour < 8) {
                    await assignAchievementIfNeeded(req.user.userId, "early-bird");
                }
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

// 🔹 Obtener tareas del día de hoy
router.get("/today", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const tasks = await Task.find({
            $and: [
                {
                    $or: [
                        { userId: userId },
                        { assignedTo: userId }
                    ]
                },
                {
                    date: {
                        $gte: today,
                        $lt: tomorrow
                      }
                }
            ]
        })
        .populate("userId", "name")
        .populate("assignedTo", "name");

        res.json(tasks);
    } catch (error) {
        console.error("❌ Error al obtener tareas de hoy:", error.message);
        res.status(500).json({ error: "Error al obtener tareas de hoy" });
    }
});


module.exports = router;
