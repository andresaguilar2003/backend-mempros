// seedTherapists.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Therapist = require("./models/Therapist");
const User = require("./models/User");

dotenv.config();

const seedTherapists = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Simulamos obtener algunos usuarios existentes (asumiendo que ya hay)
    const users = await User.find().limit(4); // Ajusta la cantidad según lo que tengas
    if (users.length < 1) {
      console.warn("⚠️ No hay suficientes usuarios para asignar a los terapeutas.");
    }
    const therapistsData = [
      {
        name: "Dra. García",
        code: "123",
        avatarUrl: "", // si tienes alguna URL o base64
        users: users.slice(0, 2).map((u) => u._id),
      },
      {
        name: "Dr. Ramírez",
        code: "123",
        avatarUrl: "",
        users: users.slice(0, 1).map((u) => u._id),
      },
      {
        name: "Dr. López",
        code: "123",
        avatarUrl: "",
        users: users.slice(3).map((u) => u._id),
      },
    ];

    await Therapist.deleteMany(); // limpia anteriores si lo deseas
    await Therapist.insertMany(therapistsData);

    console.log("✅ Terapeutas insertados correctamente");
    process.exit();
  } catch (error) {
    console.error("❌ Error insertando terapeutas:", error.message);
    process.exit(1);
  }
};

seedTherapists();
