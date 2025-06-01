import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, Button, FlatList, ScrollView, useWindowDimensions } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { AuthContext } from "../context/AuthContext";

const KanbanScreen = () => {
  const [tasks, setTasks] = useState([]);
  const { token, user } = useContext(AuthContext);
  const userId = user?._id;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newDate, setNewDate] = useState(new Date());
  const [newTime, setNewTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("https://backend-mempros.onrender.com/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    }
  };

  const isTaskAssignedByOther = (task) => {
    const taskCreatorId = typeof task.userId === "string" ? task.userId : task.userId?._id;
    return taskCreatorId && taskCreatorId !== userId;
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      await fetch(`https://backend-mempros.onrender.com/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          status: newStatus,
          date: task.date,
          time: task.time,
        }),
      });

      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fetch(`https://backend-mempros.onrender.com/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  const updateTaskDateTime = async () => {
    try {
      await fetch(`https://backend-mempros.onrender.com/api/tasks/${selectedTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: newDate.toISOString(),
          time: newTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "todo",
        }),
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === selectedTask._id
            ? {
                ...task,
                date: newDate.toISOString(),
                time: newTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                status: "todo",
              }
            : task
        )
      );

      setModalVisible(false);
    } catch (error) {
      console.error("Error al actualizar la fecha:", error);
    }
  };

  const handleTaskPress = (task) => {
    if (isTaskAssignedByOther(task)) {
      Alert.alert("Tarea asignada", "Esta tarea fue asignada por otro usuario y no puede ser modificada.");
      return;
    }

    if (task.status === "todo") {
      Alert.alert("Mover tarea", "¿A qué estado quieres moverla?", [
        { text: "✅ Hecha", onPress: () => updateTaskStatus(task._id, "done") },
        { text: "⏳ Postponer", onPress: () => updateTaskStatus(task._id, "postponed") },
        { text: "Cancelar", style: "cancel" },
      ]);
    } else if (task.status === "done") {
      Alert.alert("Eliminar tarea", "¿Seguro que deseas eliminarla?", [
        { text: "Cancelar", style: "cancel" },
        { text: "🗑️ Eliminar", style: "destructive", onPress: () => deleteTask(task._id) },
      ]);
    } else if (task.status === "postponed") {
      setSelectedTask(task);
      setModalVisible(true);
    }
  };

  const renderTask = ({ item }) => {
    const isAssigned = isTaskAssignedByOther(item);
    const creatorName = typeof item.userId === "object" ? item.userId.name : "Otro usuario";

    return (
      <TouchableOpacity
        style={[styles.task, isAssigned && styles.assignedTask]}
        onPress={() => handleTaskPress(item)}
      >
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDescription}>{item.description}</Text>
        <Text style={styles.taskMeta}>
          📅 {new Date(item.date).toLocaleDateString()} ⏰ {item.time}
        </Text>
        {isAssigned && (
          <Text style={styles.creatorLabel}>✍️ {creatorName} - Tarea asignada</Text>
        )}
      </TouchableOpacity>
    );
  };

  const Section = ({ title, data }) => (
    <View style={[styles.section, title.includes("📌") && styles.todoColumn, title.includes("✅") && styles.doneColumn, title.includes("⏳") && styles.postponedColumn]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={renderTask}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.boardContainer, isLandscape && styles.boardLandscape]}>
        <Section title="📌 Por hacer" data={tasks.filter((t) => t.status === "todo")} />
        <Section title="✅ Hechas" data={tasks.filter((t) => t.status === "done")} />
        <Section title="⏳ Postpuestas" data={tasks.filter((t) => t.status === "postponed")} />
      </View>
      {selectedTask && (
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Nueva fecha y hora</Text>
              <Button title="Seleccionar fecha" onPress={() => setShowDatePicker(true)} />
              {showDatePicker && (
                <DateTimePicker
                  value={newDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) setNewDate(date);
                  }}
                />
              )}
              <Button title="Seleccionar hora" onPress={() => setShowTimePicker(true)} />
              {showTimePicker && (
                <DateTimePicker
                  value={newTime}
                  mode="time"
                  is24Hour
                  display="default"
                  onChange={(event, time) => {
                    setShowTimePicker(false);
                    if (time) setNewTime(time);
                  }}
                />
              )}
              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                <Button title="Guardar" onPress={updateTaskDateTime} />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#f1f5f9",
  },
  section: {
    flex: 1,
    minWidth: 250,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },  
  todoColumn: {
    backgroundColor: "#e0f2fe", // azul claro
  },
  doneColumn: {
    backgroundColor: "#dcfce7", // verde claro
  },
  postponedColumn: {
    backgroundColor: "#fef9c3", // amarillo suave
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1e293b",
  },
  task: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  assignedTask: {
    borderColor: "#f87171",
    borderWidth: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  taskDescription: {
    color: "#475569",
    marginBottom: 6,
  },
  taskMeta: {
    fontSize: 12,
    color: "#94a3b8",
  },
  creatorLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#ef4444",
    fontStyle: "italic",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  boardContainer: {
    flexDirection: "column",
    gap: 16,
  },
  boardLandscape: {
    flexDirection: "row",
    justifyContent: "space-between",
  },  
});


export default KanbanScreen;
