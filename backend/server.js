const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const os = require('os');
const User = require('./models/User'); // Importa el modelo User




dotenv.config();
const app = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
const memoryGameRoutes = require('./routes/memoryGameRoutes');
app.use('/api/memory-game', memoryGameRoutes);
const achievementRoutes = require("./routes/achievementRoutes");
app.use("/api/achievements", achievementRoutes);
const taskRoutes = require('./routes/taskroutes');
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', require("./routes/authRoutes"));
const colorChallengeRoutes = require('./routes/colorChallengeRoutes');
app.use('/api/color-challenge', colorChallengeRoutes);
const reflectionPuzzleRoutes = require('./routes/reflectionPuzzleRoutes');
app.use('/api/reflection-puzzle', reflectionPuzzleRoutes);
const ninjaChallengeRoutes = require('./routes/ninjaChallengeRoutes');
app.use('/api/ninja-challenge', ninjaChallengeRoutes);
const ninjaPathRoutes = require('./routes/ninjaPathRoutes');
app.use('/api/ninja-path', ninjaPathRoutes);




// Nuevo endpoint para guardar el token de notificaciones
app.post('/api/save-token', async (req, res) => {
  const { token, userId } = req.body;

  if (!token || !userId) {
    return res.status(400).json({ error: 'Token y userId son requeridos' });
  }

  try {
    // Busca al usuario por su ID y actualiza su campo fcmToken
    const user = await User.findByIdAndUpdate(userId, { fcmToken: token }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Respuesta al frontend
    res.json({ success: true, message: 'Token guardado correctamente', user });
  } catch (error) {
    console.error('Error al guardar el token:', error);
    res.status(500).json({ error: 'Error al guardar el token' });
  }
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('🔥 MongoDB conectado'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('✅ Servidor funcionando correctamente');
});

// Obtener IP local automáticamente
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (let interfaceName in interfaces) {
        for (let iface of interfaces[interfaceName]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// Importar el script de notificaciones
require('./services/notifications'); // Asegúrate de que el archivo notifications.js esté en la raíz

const PORT = process.env.PORT || 5000;
const LOCAL_IP = getLocalIP();

// Escuchar en 0.0.0.0 para permitir conexiones en la red
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor en ejecución:`);
    console.log(`👉 En local:   http://localhost:${PORT}`);
    console.log(`👉 En la red:  http://${LOCAL_IP}:${PORT}`);
});