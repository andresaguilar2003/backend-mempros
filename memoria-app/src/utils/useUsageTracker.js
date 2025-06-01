import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';

const useUsageTracker = (token) => {
  const intervalRef = useRef(null);
  const notifiedRef = useRef({ warning: false, limit: false });

  useEffect(() => {
    if (!token) return;

    const startTracking = () => {
      intervalRef.current = setInterval(async () => {
        try {
          const res = await fetch('https://backend-mempros.onrender.com/api/usage/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ minutes: 1 }),
          });

          const data = await res.json();

          if (data.nearingLimit && !notifiedRef.current.warning) {
            sendLocalNotification("⏳ Te quedan 5 minutos", "Has usado la app 25 minutos hoy.");
            notifiedRef.current.warning = true;
          }

          if (data.limitReached && !notifiedRef.current.limit) {
            sendLocalNotification("🚫 Tiempo agotado", "Has alcanzado el límite de 30 minutos de uso diario.");
            notifiedRef.current.limit = true;
          }
        } catch (err) {
          console.error('⛔ Error al actualizar el tiempo de uso:', err);
        }
      }, 60000); // cada 1 minuto
    };

    startTracking();
    return () => clearInterval(intervalRef.current);
  }, [token]);
};

const sendLocalNotification = async (title, body) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
    },
    trigger: null, // inmediata
  });
};

export default useUsageTracker;
