const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  importance: { type: String, enum: ["poco", "medio", "mucho"], default: "medio" },
  status: { type: String, enum: ["todo", "done", "postponed"], default: "todo" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

// Forzar que `date` sea un objeto Date antes de guardar
taskSchema.pre("save", function (next) {
  this.date = new Date(this.date);
  next();
});

// ✅ REGISTRO CORRECTO DEL MODELO
module.exports = mongoose.models.Task || mongoose.model("Task", taskSchema);
