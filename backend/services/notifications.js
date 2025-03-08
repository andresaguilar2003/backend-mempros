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

        // Agrupar tareas por usuario
        const tasksByUser = {};
        tasks.forEach(task => {
            if (task.userId.fcmToken) {
                if (!tasksByUser[task.userId.fcmToken]) {
                    tasksByUser[task.userId.fcmToken] = [];
                }
                tasksByUser[task.userId.fcmToken].push(task);
            }
        });

        // Enviar notificaciones a los usuarios
        for (const [deviceToken, userTasks] of Object.entries(tasksByUser)) {
            const message = formatNotificationMessage(userTasks);
            sendPushNotification(deviceToken, message);
        }

        console.log('Notificaciones enviadas con éxito.');
    } catch (error) {
        console.error('Error al enviar notificaciones:', error);
    }
}, {
    timezone: "Europe/Madrid" // Zona horaria de España
});

function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number); // Divide la hora en horas y minutos
    return hours * 60 + minutes; // Convierte a minutos desde la medianoche
}

function formatNotificationMessage(tasks) {
    let message = ''; // Inicializa la variable con un título

    // Ordenar las tareas por hora (de menor a mayor)
    tasks.sort((a, b) => {
        const timeA = timeToMinutes(a.time); // Convierte la hora de la tarea A a minutos
        const timeB = timeToMinutes(b.time); // Convierte la hora de la tarea B a minutos
        return timeA - timeB; // Compara las horas como números
    });

    // Formatear las tareas ordenadas
    tasks.forEach(task => {
        const emoji = getImportanceEmoji(task.importance); // Emoji según la importancia
        const boldTitle = toBold(task.title); // Convertir el título a "negrita"
        message += `${emoji} ${boldTitle} - ${task.time}\n`; // Agrega cada tarea al mensaje
    });

    return message;
}

// Función para convertir texto a "negrita" usando caracteres Unicode
function toBold(text) {
    const boldMap = {
        a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵', i: '𝗶', j: '𝗷',
        k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁',
        u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇',
        A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚', H: '𝗛', I: '𝗜', J: '𝗝',
        K: '𝗞', L: '𝗟', M: '𝗠', N: '𝗡', O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧',
        U: '𝗨', V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭',
        0: '𝟬', 1: '𝟭', 2: '𝟮', 3: '𝟯', 4: '𝟰', 5: '𝟱', 6: '𝟲', 7: '𝟳', 8: '𝟴', 9: '𝟵',
        ' ': ' ', '-': '-', ':': ':', '/': '/', '.': '.', ',': ',', '!': '!', '?': '?'
    };

    return text
        .split('')
        .map(char => boldMap[char] || char) // Reemplaza cada carácter por su versión en "negrita"
        .join('');
}

// Función para obtener un emoji según la importancia de la tarea
function getImportanceEmoji(importance) {
    switch (importance) {
        case 'poco':
            return '🟢'; // Verde para tareas de poca importancia
        case 'medio':
            return '🟡'; // Amarillo para tareas de importancia media
        case 'mucho':
            return '🔴'; // Rojo para tareas de mucha importancia
        default:
            return '⚪'; // Blanco por defecto
    }
}