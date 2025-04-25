import React, { useState, useEffect } from "react";
import {
    View, Text, FlatList, TouchableOpacity,
    StyleSheet, ScrollView
} from "react-native";
import { Calendar } from "react-native-calendars";

const CalendarScreen = ({ route }) => {
    const { tasks, userId } = route.params || { tasks: [], userId: null };
    const [selectedDate, setSelectedDate] = useState("");
    const [markedDates, setMarkedDates] = useState({});

    useEffect(() => {
        console.log("📌 Tareas recibidas en Calendario:", tasks);
        markTaskDates(tasks);
    }, [tasks]);

    const markTaskDates = (taskList) => {
        let marked = {};
        taskList.forEach((task) => {
            const dateKey = task.date;
            marked[dateKey] = { marked: true, dotColor: "red" };
        });
        setMarkedDates(marked);
    };

    const filteredTasks = tasks.filter((task) => task.date === selectedDate);

    return (
        <View style={styles.container}>
            {/* 📅 CALENDARIO */}
            <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{
                    ...markedDates,
                    [selectedDate]: {
                        selected: true,
                        selectedColor: "blue",
                    },
                }}
                theme={{
                    selectedDayBackgroundColor: "blue",
                    todayTextColor: "red",
                    arrowColor: "black",
                }}
            />

            {/* 📋 LISTA DE TAREAS */}
            <View style={styles.taskContainer}>
                <Text style={styles.title}>Tareas del {selectedDate || "..."}</Text>

                {filteredTasks.length === 0 ? (
                    <Text style={styles.noTasks}>No hay tareas para este día</Text>
                ) : (
                    <FlatList
                        data={filteredTasks}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        renderItem={({ item }) => {
                            const isAssigned = item.userId._id !== userId && item.assignedTo?.some(user => user._id === userId);
                        
                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.task,
                                        isAssigned && styles.assignedTask,
                                    ]}
                                >
                                    <Text style={styles.taskTitle}>{item.title}</Text>
                                    <Text style={styles.taskDescription}>{item.description}</Text>
                                    <Text style={styles.taskTime}>⏰ {item.time}</Text>
                        
                                    {isAssigned && item.userId?.name && (
                                        <Text style={styles.creatorLabel}>
                                            ✍️ Creada por: {item.userId.name}
                                        </Text>
                                    )}
                        
                                    {isAssigned && (
                                        <Text style={styles.assignedLabel}>
                                            🧑‍🤝‍🧑 Asignada por otro usuario
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            );
                        }}                        
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f4f4f4", padding: 10 },
    taskContainer: {
        flex: 1,
        marginTop: 20,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    title: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
    noTasks: { textAlign: "center", marginTop: 10, color: "#888" },
    task: {
        backgroundColor: "#ffeb99",
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    taskTitle: { fontSize: 16, fontWeight: "bold" },
    taskDescription: { fontSize: 14, color: "#555" },
    taskTime: { fontSize: 12, color: "#777", marginTop: 5 },
    assignedTask: {
        backgroundColor: "#d6eaff",
        borderColor: "#007bff",
        borderWidth: 1,
    },
    assignedLabel: {
        marginTop: 5,
        fontStyle: "italic",
        color: "#007bff",
        fontSize: 12,
    },
    creatorLabel: {
        fontSize: 12,
        fontStyle: "italic",
        color: "#555",
        marginTop: 2,
    }
    
});

export default CalendarScreen;
