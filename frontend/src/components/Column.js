import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import TaskCard from "./TaskCard.js"; // Componente para cada tarea

export default function Column({ title, status, tasks }) {
    // Filtra las tareas según el estado de la columna
    const filteredTasks = tasks.filter(task => task.status === status);

    return (
        <View style={styles.column}>
            <Text style={styles.title}>{title}</Text>
            <FlatList
                data={filteredTasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <TaskCard task={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    column: {
        flex: 1,
        margin: 10,
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
});
