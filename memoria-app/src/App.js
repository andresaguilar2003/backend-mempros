import React, { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Provider as PaperProvider } from 'react-native-paper';

// Configura el manejo de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Función para guardar el token en el backend
async function saveTokenToBackend(token, userId) {
  try {
    const response = await fetch('http://192.168.1.19:5000/api/save-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, userId }),
    });
    const data = await response.json();
    console.log('Token guardado en el backend:', data);
  } catch (error) {
    console.error('Error al guardar el token:', error);
  }
}

// Solicita permisos para notificaciones
async function requestUserPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status === 'granted') {
    console.log('Permisos de notificación concedidos.');
  } else {
    console.log('Permisos de notificación denegados.');
    Alert.alert('Aviso', 'No recibirás notificaciones porque no concediste permisos.');
  }
}

// Componente principal de la aplicación
function MainApp() {
  const { user } = useAuth(); // Obtén el usuario autenticado
  const { themeStyles } = useTheme();
  const notificationListener = useRef(); // Listener para notificaciones en primer plano
  const responseListener = useRef(); // Listener para interacciones con notificaciones

  useEffect(() => {
    // Solicita permisos para notificaciones
    requestUserPermission();

    // Obtén el token de notificaciones push y guárdalo en el backend
    async function getNotificationToken(userId) {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('🔥 Token de notificaciones:', token);
      await saveTokenToBackend(token, userId); // Guarda el token en el backend
      return token;
    }

    if (user) {
      getNotificationToken(user._id); // Pasa el userId al obtener el token
    }

    // Listener para notificaciones en primer plano
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida en primer plano:', notification);
    });

    // Listener para interacciones con notificaciones (en segundo plano)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notificación recibida en segundo plano:', response);
    });

    // Limpia los listeners cuando el componente se desmonte
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [user]);

  return (
    <NavigationContainer theme={themeStyles}>
      <AppNavigator />
    </NavigationContainer>
  );
}

// Envuelve la aplicación con el AuthProvider
export default function App() {
  return (
    <PaperProvider> 
      <AuthProvider>
        <ThemeProvider>
          <MainApp />
        </ThemeProvider>
      </AuthProvider>
    </PaperProvider>
  );
}