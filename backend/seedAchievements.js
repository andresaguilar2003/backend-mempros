// seedAchievements.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Achievement = require("./models/Achievement");

dotenv.config();

const achievementsData = [
  {
    code: "first-task",
    title: "¡Primera tarea!",
    description: "Has creado tu primera tarea. ¡Sigue así! 💪",
    icon: "first-task",
  },
  {
    code: "ten-tasks",
    title: "10 tareas completadas",
    description: "¡Has completado 10 tareas! 🏆",
    icon: "ten-tasks",
  },
  {
    code: "early-bird",
    title: "Madrugador",
    description: "Has completado una tarea antes de las 8 AM. 🌅",
    icon: "early-bird",
  },
];

const seedAchievements = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Achievement.deleteMany(); // (opcional) limpia los anteriores
    await Achievement.insertMany(achievementsData);

    console.log("✅ Logros insertados correctamente");
    process.exit();
  } catch (error) {
    console.error("❌ Error insertando logros:", error.message);
    process.exit(1);
  }
};

seedAchievements();
