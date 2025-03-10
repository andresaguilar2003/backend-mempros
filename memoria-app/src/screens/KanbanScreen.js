import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, Button } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DraggableFlatList from "react-native-draggable-flatlist";
import { AuthContext } from "../context/AuthContext";

const STATUS_TYPES = {
  todo: "📌 Por hacer",
  done: "✅ Hecha",
  postponed: "⏳ Postpuesta",
};

const KanbanScreen = () => {
  const [tasks, setTasks] = useState([]);
  const { token } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newDate, setNewDate] = useState(new Date());
  const [newTime, setNewTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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
      await fetch(`http://192.168.1.19:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fetch(`http://192.168.1.19:5000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  const updateTaskDateTime = async () => {
    try {
      const response = await fetch(`http://192.168.1.19:5000/api/tasks/${selectedTask._id}`, {
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

      if (!response.ok) throw new Error("Error al actualizar la tarea");

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === selectedTask._id
            ? { ...task, date: newDate.toISOString(), time: newTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), status: "todo" }
            : task
        )
      );

      setModalVisible(false);
    } catch (error) {
      console.error("Error al actualizar la fecha:", error);
    }
  };

  const updateTaskDate = async (taskId, newDate, newTime) => {
    try {
      await fetch(`http://192.168.1.19:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ date: newDate, time: newTime }),
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, date: newDate, time: newTime } : task
        )
      );
    } catch (error) {
      console.error("Error al actualizar la fecha:", error);
    }
  };

  const handleTaskPress = (task) => {
    if (task.status === "todo") {
      Alert.alert(
        "Mover tarea",
        "¿A qué estado quieres mover la tarea?",
        [
          { text: "✅ Hecha", onPress: () => updateTaskStatus(task._id, "done") },
          { text: "⏳ Postponer", onPress: () => updateTaskStatus(task._id, "postponed") },
          { text: "Cancelar", style: "cancel" },
        ],
        { cancelable: true }
      );
    } else if (task.status === "done") {
      Alert.alert(
        "Eliminar tarea",
        "¿Quieres borrar esta tarea?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "🗑️ Borrar", onPress: () => deleteTask(task._id), style: "destructive" },
        ],
        { cancelable: true }
      );
    } else if (task.status === "postponed") {
      setSelectedTask(task);
      setModalVisible(true);
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
              onPress={() => handleTaskPress(item)}
            >
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
              <Text style={styles.taskDate}>
                📅 {new Date(item.date).toLocaleDateString()} - ⏰ {item.time}
              </Text>
              <Text style={styles.taskImportance}>🔥 {item.importance}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.kanbanContainer}>
        {Object.keys(STATUS_TYPES).map((status) => (
          <View key={status} style={styles.column}>
            <Text style={styles.columnTitle}>{STATUS_TYPES[status]}</Text>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <TouchableOpacity
                  key={task._id}
                  style={styles.task}
                  onPress={() => handleTaskPress(task)}
                >
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskDescription}>{task.description}</Text>
                  <Text style={styles.taskDate}>📅 {new Date(task.date).toLocaleDateString()} - ⏰ {task.time}</Text>
                </TouchableOpacity>
              ))}
          </View>
        ))}
      </View>

      {/* Modal para cambiar fecha y hora de tareas postergadas */}
      {selectedTask && (
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Elige nueva fecha y hora</Text>
              <Button title="Seleccionar fecha" onPress={() => setShowDatePicker(true)} />
              {showDatePicker && (
                <DateTimePicker value={newDate} mode="date" display="default" onChange={(event, date) => { setShowDatePicker(false); if (date) setNewDate(date); }} />
              )}
              <Button title="Seleccionar hora" onPress={() => setShowTimePicker(true)} />
              {showTimePicker && (
                <DateTimePicker value={newTime} mode="time" is24Hour display="default" onChange={(event, time) => { setShowTimePicker(false); if (time) setNewTime(time); }} />
              )}
              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                <Button title="Guardar" onPress={updateTaskDateTime} />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f4f4f4", 
    padding: 10 
  },
  kanbanContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    width: "100%", 
  },
  columnContainer: { 
    flex: 1, 
    marginHorizontal: 5 
  },
  column: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    flex: 1, 
    minWidth: "30%", 
  },
  columnTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 10, 
    paddingVertical: 5, 
    borderBottomWidth: 2, 
    borderBottomColor: "#ddd" 
  },
  task: {
    backgroundColor: "#ffeb99",
    padding: 12,
    marginVertical: 6,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  taskTitle: { 
    fontSize: 16, 
    fontWeight: "bold",
    color: "#333"
  },
  taskDescription: { 
    fontSize: 14, 
    color: "#555",
    marginVertical: 4 
  },
  taskDate: { 
    fontSize: 12, 
    color: "#777", 
    marginTop: 5 
  },
  taskImportance: { 
    fontSize: 12, 
    color: "#777", 
    marginTop: 2 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
  },
  modalContent: { 
    backgroundColor: "#fff", 
    padding: 25, 
    borderRadius: 10, 
    width: "80%",
    alignItems: "center"  // 🔹 Asegura que todo el contenido dentro del modal esté centrado
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 15, 
    textAlign: "center" 
  },
  modalButtons: { 
    flexDirection: "column",  // 🔹 Los botones se apilan en una columna en vez de una fila
    alignItems: "center", // 🔹 Centra los botones dentro del modal
    width: "100%", 
    marginTop: 15 
  },
  activeTask: { 
    backgroundColor: "#ffcc00" 
  },
  actionContainer: { 
    alignItems: "center", 
    justifyContent: "center",
    marginVertical: 10 
  },
  actionButton: { 
    backgroundColor: "#007bff", 
    padding: 12, 
    borderRadius: 5, 
    marginVertical: 8,  // 🔹 Más espacio entre los botones para mejor visibilidad
    width: "80%",  // 🔹 Controla el ancho para mantener uniformidad
    alignItems: "center"
  },
  actionText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "bold" 
  }
});


export default KanbanScreen;