import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "./context/AuthContext.js";
import HomeScreen from "./screens/HomeScreen";
import TaskScreen from "./screens/TaskScreen";
import AddTaskScreen from "./screens/AddTaskScreen";
import KanbanScreen from "./screens/KanbanScreen";
import CalendarScreen from "./screens/CalendarScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import AchievementsScreen from './screens/AchievementsScreen';
import MemoryGameScreen from './screens/MemoryGameScreen'; 
import CambioCriterioScreen from './screens/CambioCriterioScreen';
import ColorChallengeScreen from './screens/ColorChallengeScreen';
import ReflectionPuzzleScreen from './screens/ReflexionPuzzleScreen'; 
import NinjaChallengeScreen from './screens/NinjaChallengeScreen';
import NinjaPathScreen from "./screens/NinjaPathScreen.js";
import UsageScreen from './screens/UsageScreen';
import TherapistCodeScreen from "./screens/TherapistCodeScreen";
import TherapistDashboardScreen from "./screens/TherapistDashboardScreen";
import PatientReportScreen from "./screens/PatientReportScreen";
import PatientReportsListScreen from "./screens/PatientReportsListScreen";
import ColorChallengeReportScreen from "./screens/ColorChallengeReportScreen";
import ReflexionPuzzleReportScreen from "./screens/ReflexionPuzzleReportScreen";
import NinjaChallengeReportScreen from "./screens/NinjaChallengeReportScreen";
import NinjaPathReportScreen from "./screens/NinjaPathReportScreen";
import UsageReportScreen from "./screens/UsageReportScreen";

const Stack = createStackNavigator();

function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator initialRouteName={user ? "Inicio" : "LoginScreen"}>
      {user ? (
        <>
          <Stack.Screen name="Inicio" component={HomeScreen} />
          <Stack.Screen name="Tareas" component={TaskScreen} />
          <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: "Añadir tarea"}}/>
          <Stack.Screen name="Logros" component={AchievementsScreen} />
          <Stack.Screen name="KanbanScreen" component={KanbanScreen} options={{ title: "Estado de las tareas" }} />
          <Stack.Screen name="CalendarScreen" component={CalendarScreen} options={{ title: "Calendario" }} />
          <Stack.Screen name="JuegoMemoria" component={MemoryGameScreen} options={{ title: 'Juego de Memoria' }} />
          <Stack.Screen name="CambioCriterio" component={CambioCriterioScreen} options={{ title: 'Juego Cambio de Criterio' }} />
          <Stack.Screen name="RetoColores" component={ColorChallengeScreen} options={{ title: 'Reto de Colores' }} />
          <Stack.Screen name="ReflexionPuzzle" component={ReflectionPuzzleScreen} options={{ title: 'Desafío de Piezas y Respuestas' }} />
          <Stack.Screen name="DesafioNinja" component={NinjaChallengeScreen} options={{ title: 'Desafío Ninja' }} />
          <Stack.Screen name="CaminoNinja" component={NinjaPathScreen} options={{ title: 'Camino Ninja' }} />
          <Stack.Screen name="Uso" component={UsageScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: "Iniciar Sesión" }} />
          <Stack.Screen name="TherapistCodeScreen" component={TherapistCodeScreen} options={{ headerTitle: "Acceso terapeuta" }} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ title: "Registrarse" }} />
          <Stack.Screen name="TherapistDashboardScreen" component={TherapistDashboardScreen} options={{ title: "Pacientes" }} />
          <Stack.Screen name="PatientReportScreen" component={PatientReportScreen} options={{ title: "PMCQ" }} />
          <Stack.Screen name="PatientReportsList" component={PatientReportsListScreen} options={{ title: "Informes del Paciente" }} />
          <Stack.Screen name="ColorChallengeReport" component={ColorChallengeReportScreen} options={{ title: "Reto de Colores" }}/>
          <Stack.Screen name="ReflexionPuzzleReport" component={ReflexionPuzzleReportScreen} options={{ title: "Desafío de Piezas y Respuestas" }} />
          <Stack.Screen name="NinjaChallengeReport" component={NinjaChallengeReportScreen} options={{ title: "Desafío Ninja" }} />
          <Stack.Screen name="NinjaPathReport" component={NinjaPathReportScreen} options={{ title: "Camino Ninja" }} />
          <Stack.Screen name="UsageReport" component={UsageReportScreen} options={{ title: "Tiempo de Uso" }} />
        </>
      )}
    </Stack.Navigator>
  );
}


export default AppNavigator; // Asegúrate de exportar AppNavigator como default