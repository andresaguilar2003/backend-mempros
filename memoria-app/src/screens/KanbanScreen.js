import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { AuthContext } from "../context/AuthContext";

const STATUS_TYPES = {
  todo: "📌 Por hacer",
  done: "✅ Hecha",
  postponed: "⏳ Postpuesta",
};

const KanbanScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://192.168.1.19:5000/api/tasks", {
        headers: {
          "Authorization": `Bearer ${token}`,
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
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar la tarea");
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      setSelectedTask(null);
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
              onPress={() => setSelectedTask(item)}
            >
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
              <Text style={styles.taskDate}>
                📅 {new Date(item.date).toLocaleDateString()} - ⏰ {item.time}
              </Text>
              <Text style={styles.taskImportance}>🔥 {item.importance}</Text>
            </TouchableOpacity>
          )}
          onDragEnd={({ data }) => setTasks(data)}
        />
      </View>
    );
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

      {/* Modal para cambiar estado */}
      {selectedTask && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={!!selectedTask}
          onRequestClose={() => setSelectedTask(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cambiar estado</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => updateTaskStatus(selectedTask._id, "done")}
              >
                <Text style={styles.modalButtonText}>✅ Hecha</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => updateTaskStatus(selectedTask._id, "postponed")}
              >
                <Text style={styles.modalButtonText}>⏳ Postpuesta</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setSelectedTask(null)}
              >
                <Text style={styles.modalButtonText}>❌ Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", padding: 10 },
  kanbanContainer: { flexDirection: "row", justifyContent: "space-around" },
  columnContainer: { flex: 1, marginHorizontal: 5 },
  column: { backgroundColor: "#ffffff", borderRadius: 10, padding: 10 },
  columnTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 5 },
  task: { backgroundColor: "#ffeb99", padding: 10, marginVertical: 5, borderRadius: 5 },
  activeTask: { backgroundColor: "#ffcc00" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: 300, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalButton: { backgroundColor: "#007bff", padding: 10, marginVertical: 5, borderRadius: 5, width: "80%", alignItems: "center" },
  cancelButton: { backgroundColor: "#dc3545", padding: 10, marginTop: 10, borderRadius: 5, width: "80%", alignItems: "center" },
  modalButtonText: { color: "white", fontWeight: "bold" },
});

export default KanbanScreen;
