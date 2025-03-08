import React, { useState, useEffect,useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { AuthContext } from "../context/AuthContext";

const STATUS_TYPES = {
  todo: "📌 Por hacer",
  inProgress: "⚙️ En curso",
  done: "✅ Hecha",
  postponed: "⏳ Postpuesta",
};

const KanbanScreen = () => {
  const [tasks, setTasks] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://192.168.1.19:5000/api/tasks", {
        headers: {
          "Authorization": `Bearer ${token}`, // Incluye el token en el encabezado
        },
      });

      if (!response.ok) throw new Error("Error al obtener las tareas");

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`http://192.168.1.19:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Incluye el token en el encabezado
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Error al actualizar la tarea");

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  const renderColumn = (status) => {
    const filteredTasks = tasks.filter((task) => task.status === status);

    return (
      <View style={styles.column}>
        <Text style={styles.columnTitle}>{STATUS_TYPES[status]}</Text>
        <DraggableFlatList
          data={filteredTasks}
          keyExtractor={(item) => item._id}
          renderItem={({ item, drag, isActive }) => (
            <TouchableOpacity
              style={[styles.task, isActive && styles.activeTask]}
              onLongPress={drag}
              onPress={() => updateTaskStatus(item._id, getNextStatus(status))}
            >
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
              <Text style={styles.taskDate}>
                📅 {new Date(item.date).toLocaleDateString()} - ⏰ {item.time}
              </Text>
              <Text style={styles.taskImportance}>🔥 {item.importance}</Text>
            </TouchableOpacity>
          )}
          onDragEnd={({ data, from, to }) => {
            if (from !== to) {
              const updatedTask = data[to];
              updateTaskStatus(updatedTask._id, getNextStatus(updatedTask.status));
            }
            setTasks(data);
          }}
        />
      </View>
    );
  };

  const getNextStatus = (currentStatus) => {
    const statusOrder = ["todo", "inProgress", "done", "postponed"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    return statusOrder[nextIndex];
  };

  return (
    <View style={styles.container}>
      <View style={styles.kanbanContainer}>
        {Object.keys(STATUS_TYPES).map((status) => (
          <View key={status} style={styles.columnContainer}>
            {renderColumn(status)}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", padding: 10 },
  kanbanContainer: { flexDirection: "row", justifyContent: "space-around" },
  columnContainer: { flex: 1, marginHorizontal: 5 },
  column: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  columnTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 5 },
  task: {
    backgroundColor: "#ffeb99",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  activeTask: { backgroundColor: "#ffcc00" },
  taskTitle: { fontSize: 16, fontWeight: "bold" },
  taskDescription: { fontSize: 14, color: "#555" },
  taskDate: { fontSize: 12, color: "#777", marginTop: 5 },
  taskImportance: { fontSize: 12, color: "#777", marginTop: 2 },
});

export default KanbanScreen;
