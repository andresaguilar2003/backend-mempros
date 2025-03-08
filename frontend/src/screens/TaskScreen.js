import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import TaskList from "../components/TaskList";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // 📌 Importamos el tema

const TaskScreen = () => {
    const { user } = useContext(AuthContext);
    const { theme } = useTheme(); // 📌 Obtenemos el tema actual

    return (
        <View style={[styles.container, { backgroundColor: theme === "dark" ? "#000" : "#f7f7f7" }]}>
            <TaskList userId={user?._id} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default TaskScreen;
