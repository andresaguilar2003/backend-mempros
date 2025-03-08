const cron = require('node-cron');
const Task = require('../models/task'); // Importa el modelo Task
const { sendPushNotification } = require('../services/notificationService'); // Función para enviar notificaciones

// Programar la tarea para que se ejecute todos los días a las 8:00 AM
cron.schedule('* * * * *', async () => {
    try {
        // Obtener la fecha actual
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Buscar tareas para el día actual
        const tasks = await Task.find({
            date: { $gte: startOfDay, $lte: endOfDay } // Cambia `dueDate` a `date`
        }).populate('userId', 'fcmToken'); // Cambia `user` a `userId` y asegúrate de que el campo sea `fcmToken`

        // Enviar notificaciones a los usuarios
        tasks.forEach(task => {
            if (task.userId.fcmToken) { // Cambia `user` a `userId`
                const message = task.status === "done" ? 'No tienes tareas pendientes para hoy.' : `Tienes la tarea: ${task.title}`;
                sendPushNotification(task.userId.fcmToken, message); // Cambia `user` a `userId`
            }
        });

        console.log('Notificaciones enviadas con éxito.');
    } catch (error) {
        console.error('Error al enviar notificaciones:', error);
    }
}, {
    timezone: "Europe/Madrid" // Zona horaria de España
});