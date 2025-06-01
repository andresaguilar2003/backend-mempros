import axios from "axios";

export const checkForAchievementUnlock = async ({ userId, token, tasks, onUnlock }) => {
  try {
    // Verificamos condiciones
    const hasCreatedFirstTask = tasks.length >= 1;
    const hasCompletedTen = tasks.filter(t => t.status === "completada").length >= 10;

    // Pide los logros desbloqueados
    const unlockedRes = await axios.get("https://backend-mempros.onrender.com/api/achievements/unlocked", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const unlockedIds = unlockedRes.data;

    const unlock = async (achievementId) => {
      const res = await axios.post(
        "https://backend-mempros.onrender.com/api/achievements/unlock",
        { achievementId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUnlock(res.data); // Notificamos al popup
    };

    if (hasCreatedFirstTask && !unlockedIds.includes("1")) {
      await unlock("1"); // "Primera tarea"
    }

    if (hasCompletedTen && !unlockedIds.includes("2")) {
      await unlock("2"); // "Completa 10 tareas"
    }

  } catch (err) {
    console.error("Error verificando logros:", err.message);
  }
};
