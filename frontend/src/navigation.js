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

const Stack = createStackNavigator();

function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen name="Inicio" component={HomeScreen} />
          <Stack.Screen name="Tareas" component={TaskScreen} />
          <Stack.Screen name="AddTask" component={AddTaskScreen} />
          <Stack.Screen name="KanbanScreen" component={KanbanScreen} options={{ title: "Tablero Kanban" }} />
          <Stack.Screen name="CalendarScreen" component={CalendarScreen} options={{ title: "Calendario" }} />
        </>
      ) : (
        <>
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: "Iniciar Sesión" }} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ title: "Registrarse" }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default AppNavigator; // Asegúrate de exportar AppNavigator como default