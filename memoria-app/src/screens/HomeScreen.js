import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from '../context/ThemeContext';
import VirtualAssistant from '../components/VirtualAssistant';
import { Menu, Provider, IconButton } from 'react-native-paper';

export default function HomeScreen() {
    const navigation = useNavigation();
    const { logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const [showAssistant, setShowAssistant] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const handleNavigateLogros = () => {
        closeMenu();
        navigation.navigate('Logros');
    };

    const handleToggleTheme = () => {
        closeMenu();
        toggleTheme();
    };

    const handleAssistant = () => {
        closeMenu();
        setShowAssistant(true);
    };

    const handleLogout = () => {
        closeMenu();
        logout();
    };

    return (
        <Provider>
            <View style={[styles.container, theme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
                <View style={styles.menuContainer}>
                    <Menu
                        visible={menuVisible}
                        onDismiss={closeMenu}
                        anchor={
                            <IconButton
                                icon="menu"
                                size={28}
                                onPress={openMenu}
                            />
                        }
                    >
                        <Menu.Item onPress={handleLogout} title="Cerrar sesión" leadingIcon="logout" />
                        <Menu.Item onPress={handleToggleTheme} title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`} leadingIcon="theme-light-dark" />
                        <Menu.Item onPress={handleNavigateLogros} title="Ver logros" leadingIcon="star" />
                        <Menu.Item onPress={handleAssistant} title="Asistente virtual" leadingIcon="robot" />
                    </Menu>
                </View>

                <Text style={[styles.title, theme === 'dark' ? styles.darkText : styles.lightText]}>
                    📓Memory AAP📓
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

                {/* Asistente modal */}
                {showAssistant && (
                    <VirtualAssistant onClose={() => setShowAssistant(false)} />
                )}
            </View>
        </Provider>
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
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        borderWidth: 1,
        minWidth: 120,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    logoutButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#dc3545",
    },
    logoutIcon: {
        fontSize: 14,
        marginRight: 5,
        fontWeight: "bold",
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    logoutButtonLight: {
        backgroundColor: "white",
        borderColor: "#dc3545",
    },
    logoutButtonDark: {
        backgroundColor: "white",
        borderColor: "#dc3545",
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
    menuButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
    },    
    menuContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
      },      
});

