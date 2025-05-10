import React, { useContext, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView,Modal, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from '../context/ThemeContext';
import VirtualAssistant from '../components/VirtualAssistant';
import { Menu, Provider, IconButton } from 'react-native-paper';
import TodayTasksBanner from '../components/TodayTasksBanner';
import { usePMCQ } from '../context/PMCQContext';
import PMCQScreen from './PmcqScreen';

export default function HomeScreen() {
    const navigation = useNavigation();
    const { logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const [showAssistant, setShowAssistant] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [showGamesModal, setShowGamesModal] = useState(false);
    const [showEvaluablesModal, setShowEvaluablesModal] = useState(false);

    const { hasCompletedPMCQ } = usePMCQ();

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const showHelpInfo = () => {
        Alert.alert(
        "¿Qué significan estas secciones?",
        "🕹️ Los juegos son ejercicios no evaluables. Están diseñados para entretenerte mientras fortaleces tu memoria prospectiva.\n\n📝 Los ejercicios evaluables sí serán revisados por tu terapeuta. ¡Haz tu mejor esfuerzo!",
        [{ text: "Entendido", style: "default" }]
        );
    };

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

    if (hasCompletedPMCQ === null) {
        return null; // para debug visual
      }

    if (!hasCompletedPMCQ) {
        return <PMCQScreen />; 
    }

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
                        <Menu.Item onPress={handleLogout} title="Cerrar sesión" leadingIcon="logout" />
                        <Menu.Item onPress={handleToggleTheme} title={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`} leadingIcon="theme-light-dark" />
                        <Menu.Item onPress={handleNavigateLogros} title="Ver logros" leadingIcon="star" />
                        <Menu.Item onPress={handleAssistant} title="Asistente virtual" leadingIcon="robot" />
                        <Menu.Item onPress={() => navigation.navigate('Uso')} title="Ver tiempo de uso" leadingIcon="clock-outline" />
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
                    <View style={[styles.section, styles.exerciseSection, {alignItems: 'center'}]}>
                        <View style={[styles.sectionHeader, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                            <Text style={[
                                styles.sectionTitle,
                                theme === 'dark' ? styles.darkText : styles.lightText,
                                {
                                fontSize: 22,
                                fontWeight: 'bold',
                                color: '#6A5ACD',
                                textAlign: 'center',
                                paddingVertical: 8,
                                textTransform: 'uppercase'
                                }
                                ]}>
                                ¡Mejora y evalúa tu memoria prospectiva!
                                </Text>
                                <IconButton
                                icon="help-circle"
                                size={24}
                                onPress={showHelpInfo}
                                style={{ marginLeft: 8 }}
                                accessibilityLabel="Información sobre juegos y ejercicios evaluables"
                            />
                        </View>
                        
                        <View style={styles.buttonColumn}>
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.exerciseButton, styles.fullWidthButton]}
                                onPress={() => setShowGamesModal(true)}
                            >
                                <View style={styles.buttonContent}>
                                    <Text style={styles.buttonText}>Juegos</Text>
                                    <Text style={styles.buttonSubtext}>¡Mejora tu memoria jugando!</Text>
                                </View>
                                <Text style={styles.buttonIcon}>🎮</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.actionButton, styles.exerciseButton, styles.fullWidthButton]}
                                onPress={() => setShowEvaluablesModal(true)} // nuevo estado
                            >
                                <View style={styles.buttonContent}>
                                    <Text style={styles.buttonText}>Ejercicios evaluables</Text>
                                    <Text style={styles.buttonSubtext}>Evalúa tu memoria</Text>
                                </View>
                                <Text style={styles.buttonIcon}>📝</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Modal visible={showGamesModal} transparent animationType="slide">
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Selecciona un juego</Text>
                                <View style={styles.modalGameGrid}>
                                    <TouchableOpacity onPress={() => {
                                        setShowGamesModal(false);
                                        navigation.navigate('JuegoMemoria');
                                    }}>
                                        <Image
                                            source={require('../assests/memory-game.png')}
                                            style={styles.gameImage}
                                            resizeMode="contain"
                                        />
                                        <Text style={styles.gameLabel}>Juego de Memoria</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => {
                                        setShowGamesModal(false);
                                        navigation.navigate('CambioCriterio');
                                    }}>
                                        <Image
                                            source={require('../assests/cambio-criterio.png')}
                                            style={styles.gameImage}
                                            resizeMode="contain"
                                        />
                                        <Text style={styles.gameLabel}>Cambio de Criterio</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity onPress={() => setShowGamesModal(false)} style={styles.closeButton}>
                                    <Text style={{ color: 'white' }}>Cerrar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <Modal visible={showEvaluablesModal} transparent animationType="slide">
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Selecciona un ejercicio evaluable</Text>
                                <View style={styles.modalGameGrid}>
                                    <TouchableOpacity onPress={() => {
                                        setShowEvaluablesModal(false);
                                        navigation.navigate('RetoColores');
                                    }}>
                                        <Image
                                            source={require('../assests/reto-colores.png')} // cambia si no tienes esta imagen
                                            style={styles.gameImage}
                                            resizeMode="contain"
                                        />
                                        <Text style={styles.gameLabel}>Reto de Colores</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => {
                                        setShowEvaluablesModal(false);
                                        navigation.navigate('ReflexionPuzzle');
                                    }}>
                                        <Image
                                            source={require('../assests/reflexion-puzzle.png')} // cambia si no tienes esta imagen
                                            style={styles.gameImage}
                                            resizeMode="contain"
                                        />
                                        <Text style={styles.gameLabel}>Reflexión + Puzzle</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        setShowEvaluablesModal(false);
                                        navigation.navigate('DesafioNinja');
                                        }}>
                                        <Image
                                            source={require('../assests/desafio-ninja.png')} // asegúrate de tener esta imagen
                                            style={styles.gameImage}
                                            resizeMode="contain"
                                        />
                                        <Text style={styles.gameLabel}>Desafío Ninja</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        setShowEvaluablesModal(false);
                                        navigation.navigate('CaminoNinja');
                                        }}>
                                        <Image
                                            source={require('../assests/camino-ninja.png')} // asegúrate de tener esta imagen
                                            style={styles.gameImage}
                                            resizeMode="contain"
                                        />
                                        <Text style={styles.gameLabel}>El Camino Ninja</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity onPress={() => setShowEvaluablesModal(false)} style={styles.closeButton}>
                                    <Text style={{ color: 'white' }}>Cerrar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

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
        backgroundColor: '#F0F8FF', // Fondo azul claro
        borderRadius: 9, // Bordes redondeados
        padding: 11, // Espaciado interno
        marginVertical: 10, // Margen vertical
        shadowColor: '#000', // Sombra para efecto elevado
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 0, // Para Android
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
    logoutText: {
        fontSize: 16,
        marginRight: 12,
        alignSelf: 'center',
      },
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        width: '85%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalGameGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    gameImage: {
        width: 120,
        height: 120,
        borderRadius: 12,
        marginBottom: 8,
    },
    gameLabel: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '500',
    },
    closeButton: {
        backgroundColor: '#333',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },  
    buttonColumn: {
        flexDirection: 'column',
        gap: 10,
    },
    fullWidthButton: {
        width: '100%',
    },
});