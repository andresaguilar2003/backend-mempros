import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";

export default function TaskCard({ task, onDrag }) {
    return (
        <GestureHandlerRootView>
            <PanGestureHandler onGestureEvent={onDrag}>
                <View style={styles.card}>
                    <Text style={styles.title}>{task.title}</Text>
                    <Text style={styles.description}>{task.description}</Text>
                    <Text style={styles.priority}>Prioridad: {task.priority}</Text>
                </View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: "#555",
    },
    priority: {
        fontSize: 12,
        fontWeight: "bold",
        color: "red",
    },
});
