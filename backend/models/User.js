const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fcmToken: { type: String },  // 🔥 Guardamos el token FCM
    achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }],
    dailyUsage: {
        date: { type: String }, // formato: YYYY-MM-DD
        minutesUsed: { type: Number, default: 0 }
      },      
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
