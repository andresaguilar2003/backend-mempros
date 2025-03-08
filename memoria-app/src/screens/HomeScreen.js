import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen() {
    const navigation = useNavigation();
    const { logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    
    return (
        <View style={[styles.container, theme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
            {/* 🔴 Botón para cerrar sesión */}
            <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={logout}
            >
                <Text style={[styles.logoutButtonText, theme === 'dark' ? styles.darkText : styles.lightText]}>
                    🚪 Cerrar sesión
                </Text>
            </TouchableOpacity>

            {/* 🌙☀ Botón para cambiar el tema */}
            <TouchableOpacity 
                style={[styles.themeButton, theme === 'dark' ? styles.themeButtonDark : styles.themeButtonLight]} 
                onPress={toggleTheme}
            >
                <Text style={styles.themeButtonText}>
                    {theme === 'dark' ? '☀' : '🌙'}
                </Text>
            </TouchableOpacity>

            <Text style={[styles.title, theme === 'dark' ? styles.darkText : styles.lightText]}>
                Bienvenido a Memoria App
            </Text>
            <Text style={[styles.subtitle, theme === 'dark' ? styles.darkText : styles.lightText]}>
                Tu asistente personal de tareas
            </Text>

            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('Tareas')}
            >
                <Text style={styles.buttonText}>📋 Ver mis tareas</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('AddTask')}
            >
                <Text style={styles.buttonText}>➕ Nueva tarea</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    // 🎨 Estilos de fondo según el tema
    lightContainer: {
        backgroundColor: "#f7f7f7",
    },
    darkContainer: {
        backgroundColor: "#121212",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: "80%",
        alignItems: "center",
    },
    logoutButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: "#dc3545",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    logoutButtonText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    // 🌙☀ Estilos del botón de cambio de tema
    themeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3.5,
        elevation: 5,
    },
    themeButtonLight: {
        backgroundColor: "black",
    },
    themeButtonDark: {
        backgroundColor: "white",
    },
    themeButtonText: {
        fontSize: 20,
    },
    // 🎨 Cambia el color del texto en modo oscuro
    darkText: {
        color: "white",
    },
    lightText: {
        color: "black",
    },
});

