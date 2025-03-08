const { Expo } = require('expo-server-sdk');

const expo = new Expo();

const sendPushNotification = async (deviceToken, message) => {
  // Verifica si el token es válido
  if (!Expo.isExpoPushToken(deviceToken)) {
    console.error(`Token no válido: ${deviceToken}`);
    return;
  }

  // Crea el mensaje de notificación
  const notification = {
    to: deviceToken,
    sound: 'default',
    title: 'Tareas del día',
    body: message,
  };

  try {
    // Envía la notificación
    const receipt = await expo.sendPushNotificationsAsync([notification]);
    console.log('Notificación enviada con éxito:', receipt);
  } catch (error) {
    console.error('Error al enviar notificación:', error);
  }
};

module.exports = { sendPushNotification };