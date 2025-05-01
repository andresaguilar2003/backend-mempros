import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from '../context/ThemeContext';
import VirtualAssistant from '../components/VirtualAssistant';
import { Menu, Provider, IconButton } from 'react-native-paper';
import TodayTasksBanner from '../components/TodayTasksBanner';

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
                                color={theme === 'dark' ? 'white' : 'black'}
                            />
                        }
                    >
                        {/* Los items del menú permanecen igual */}
                    </Menu>
                </View>
                
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Banner de tareas con más margen inferior */}
                    <View style={styles.bannerContainer}>
                        <TodayTasksBanner />
                    </View>
                    
                    {/* Sección de Tareas - Sin título pero con separación */}
                    <View style={styles.section}>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.taskButton]}
                                onPress={() => navigation.navigate('Tareas')}
                            >
                                <View style={styles.buttonContent}>
                                    <Text style={styles.buttonText}>Ver todas mis tareas</Text>
                                    <Text style={styles.buttonSubtext}>Revisa tu lista completa</Text>
                                </View>
                                <Text style={styles.buttonIcon}>📋</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.addButton]}
                                onPress={() => navigation.navigate('AddTask')}
                            >
                                <View style={styles.buttonContent}>
                                    <Text style={styles.buttonText}>Crear nueva tarea</Text>
                                    <Text style={styles.buttonSubtext}>Organiza tus actividades</Text>
                                </View>
                                <Text style={styles.buttonIcon}>✏️</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    {/* Sección de Ejercicios con diseño mejorado */}
                    <View style={[styles.section, styles.exerciseSection]}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, theme === 'dark' ? styles.darkText : styles.lightText]}>
                                Juegos 🃏
                            </Text>
                            <Text style={[styles.sectionSubtitle, theme === 'dark' ? styles.darkSubtext : styles.lightSubtext]}>
                                Elige entre diferentes juegos para mejorar tu memoria
                            </Text>
                        </View>
                        
                        <TouchableOpacity 
                            style={[styles.actionButton, styles.exerciseButton]}
                            onPress={() => {}}
                        >
                            <View style={styles.buttonContent}>
                                <Text style={styles.buttonText}>Explorar juegos</Text>
                                <Text style={styles.buttonSubtext}>¡Mejora tu memoria jugando!</Text>
                            </View>
                            <Text style={styles.buttonIcon}>🏋️</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

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
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    // Estilos de tema
    lightContainer: {
        backgroundColor: "#f7f7f7",
    },
    darkContainer: {
        backgroundColor: "#121212",
    },
    // Banner
    bannerContainer: {
        marginBottom: 24,
    },
    // Secciones
    section: {
        marginBottom: 28,
    },
    exerciseSection: {
        backgroundColor: '#f0f4ff', // Fondo claro azulado en modo claro
        borderRadius: 16,
        padding: 16,
        marginTop: 8,
    },
    // Encabezado de sección
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        opacity: 0.8,
    },
    darkSubtext: {
        color: 'rgba(255,255,255,0.7)',
    },
    lightSubtext: {
        color: 'rgba(0,0,0,0.6)',
    },
    // Grupos de botones
    buttonGroup: {
        flexDirection: 'column',
        gap: 14,
    },
    // Botones de acción
    actionButton: {
        borderRadius: 14,
        padding: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonContent: {
        flex: 1,
    },
    buttonIcon: {
        fontSize: 24,
        marginLeft: 10,
    },
    taskButton: {
        backgroundColor: '#4a6da7',
    },
    addButton: {
        backgroundColor: '#5a9e56',
    },
    exerciseButton: {
        backgroundColor: '#6a5acd', // Cambié a un morado profesional
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    buttonSubtext: {
        color: "rgba(255,255,255,0.85)",
        fontSize: 13,
    },
    // Textos según tema
    darkText: {
        color: "white",
    },
    lightText: {
        color: "black",
    },
    menuContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 1,
    },
});