import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

const CalendarScreen = ({ route }) => {
    const { tasks } = route.params || { tasks: [] };
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
            markedDates={{ ...markedDates, [selectedDate]: { selected: true, selectedColor: "blue" } }}
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
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.task}>
                            <Text style={styles.taskTitle}>{item.title}</Text>
                            <Text style={styles.taskDescription}>{item.description}</Text>
                            <Text style={styles.taskTime}>⏰ {item.time}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    </View>
);
};

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: "#f4f4f4", padding: 10 },
taskContainer: { marginTop: 20, padding: 10, backgroundColor: "#fff", borderRadius: 10 },
title: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
noTasks: { textAlign: "center", marginTop: 10, color: "#888" },
task: { backgroundColor: "#ffeb99", padding: 10, marginVertical: 5, borderRadius: 5 },
taskTitle: { fontSize: 16, fontWeight: "bold" },
taskDescription: { fontSize: 14, color: "#555" },
taskTime: { fontSize: 12, color: "#777", marginTop: 5 },
});

export default CalendarScreen;
