const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// 🔹 REGISTRO
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, fcmToken } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "El correo ya está registrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, fcmToken });
        await newUser.save();

        // Generar el token JWT con el ID del usuario
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ user: { _id: newUser._id, name, email }, token });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 🔹 LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password, fcmToken } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        // Actualizar el token FCM si es necesario
        if (fcmToken && user.fcmToken !== fcmToken) {
            user.fcmToken = fcmToken;
            await user.save();
        }

        // Generar el token JWT con el ID del usuario
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ user: { _id: user._id, name: user.name, email }, token });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = router;