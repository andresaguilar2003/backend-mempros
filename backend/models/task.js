const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },  // 👈 Fecha de la tarea
    time: { type: String, required: true },  // 👈 Hora de la tarea (HH:MM)
    importance: { type: String, enum: ["poco", "medio", "mucho"], default: "medio" },
    status: { type: String, enum: ["todo", "inProgress", "done", "postponed"], default: "todo" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // 🔹 Usuario que creó la tarea
});

// Forzar que `date` sea un objeto `Date` antes de guardar
TaskSchema.pre("save", function (next) {
    this.date = new Date(this.date);
    next();
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
