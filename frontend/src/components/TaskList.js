import React, { useEffect, useState, useContext } from "react";
import {
    View, Text, FlatList, ActivityIndicator,
    StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Modal, Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; 

export default function TaskList({ userId }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRotateMessage, setShowRotateMessage] = useState(false); // Estado para controlar el mensaje
    const navigation = useNavigation();
    const { token } = useContext(AuthContext);
    const { theme } = useTheme();

    useEffect(() => {
        if (userId) {
            fetchTasks();
        }
    }, [userId]);

    const fetchTasks = async () => {
        try {
            const response = await fetch(`http://192.168.1.19:5000/api/tasks?userId=${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error al obtener tareas: ${response.status}`);
            }

            const data = await response.json();
            console.log("📌 Tareas obtenidas:", data);

            if (!Array.isArray(data)) {
                throw new Error("La respuesta del servidor no es un array de tareas");
            }

            const formattedTasks = data.map(task => ({
                ...task,
                date: new Date(task.date).toISOString().split("T")[0],
            }));

            setTasks(formattedTasks);
        } catch (error) {
            console.error("Error al obtener tareas:", error);
            Alert.alert("Error", "No se pudieron obtener las tareas. Inténtalo de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (taskId) => {
        Alert.alert(
            "Eliminar tarea",
            "¿Seguro que quieres eliminar esta tarea?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    onPress: async () => {
                        try {
                            const response = await fetch(`http://192.168.1.19:5000/api/tasks/${taskId}`, {
                                method: "DELETE",
                                headers: {
                                    "Authorization": `Bearer ${token}`,
                                },
                            });

                            if (!response.ok) {
                                throw new Error(`Error al eliminar tarea: ${response.status}`);
                            }

                            setTasks(tasks.filter(task => task._id !== taskId));
                            console.log("Tarea eliminada correctamente");
                        } catch (error) {
                            console.error("Error al eliminar tarea:", error);
                            Alert.alert("Error", "No se pudo eliminar la tarea. Inténtalo de nuevo más tarde.");
                        }
                    },
                },
            ]
        );
    };

    const handleKanbanPress = () => {
        setShowRotateMessage(true); // Muestra el mensaje
        setTimeout(() => {
            setShowRotateMessage(false); // Oculta el mensaje después de 3 segundos
            navigation.navigate("KanbanScreen"); // Navega al KanbanScreen
        }, 3000);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.container, { backgroundColor: theme === "dark" ? "#000" : "#f7f7f7" }]}
        >
            {/* 📌 Botones de navegación */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={handleKanbanPress} // Usa la nueva función
                >
                    <Text style={styles.navButtonText}>📌 Estado de las tareas</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => navigation.navigate("CalendarScreen", { tasks })}
                >
                    <Text style={styles.navButtonText}>📅 Calendario</Text>
                </TouchableOpacity>
            </View>

            {/* Modal para el mensaje de rotación */}
            <Modal
                visible={showRotateMessage}
                transparent={true}
                animationType="fade"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Image
                            source={require("../assests/rotate-device.gif")} // Asegúrate de tener un GIF en tu proyecto
                            style={styles.gif}
                        />
                        <Text style={styles.modalText}>
                            Gira la pantalla a horizontal para una mejor experiencia.
                        </Text>
                    </View>
                </View>
            </Modal>

            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.taskItem}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text>{item.description}</Text>
                            <Text style={styles.date}>📅 {item.date}</Text>

                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => deleteTask(item._id)}
                            >
                                <Text style={styles.deleteText}>🗑 Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    contentContainerStyle={{ flexGrow: 1 }}
                />
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f7f7f7",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    navButton: {
        flex: 1,
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 5,
    },
    navButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    taskItem: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    date: {
        fontSize: 12,
        color: "#666",
        marginTop: 5,
    },
    deleteButton: {
        backgroundColor: "#dc3545",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: "center",
    },
    deleteText: {
        color: "white",
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    gif: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
    modalText: {
        fontSize: 18,
        textAlign: "center",
    },
});