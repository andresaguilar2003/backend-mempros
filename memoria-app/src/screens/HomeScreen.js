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
    const [showColorInfoModal, setShowColorInfoModal] = useState(false);
    const [showPuzzleInfoModal, setShowPuzzleInfoModal] = useState(false);
    const [showDesafioInfoModal, setShowDesafioInfoModal] = useState(false);
    const [showCaminoInfoModal, setShowCaminoInfoModal] = useState(false);
    const [showMemoryGameModal, setShowMemoryGameModal] = useState(false);
    const [showCriteriaGameModal, setShowCriteriaGameModal] = useState(false);


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
                                    {/* Dentro del Modal showGamesModal */}
                                    <TouchableOpacity onPress={() => {
                                        setShowGamesModal(false);
                                        setShowMemoryGameModal(true); // Mostrar modal explicativo primero
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
                                        setShowCriteriaGameModal(true); // Mostrar modal explicativo primero
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
                    {/* Modal para Juego de Memoria (Cartas/Parejas) */}
                    <Modal visible={showMemoryGameModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>¿Cómo se juega?</Text>
                        <Text style={styles.modalDescription}>
                            🔸 Qué es: Es un clásico juego de memoria donde debes encontrar parejas de cartas iguales.{"\n\n"}
                            🔸 Funcionamiento: Se muestran cartas boca abajo. Debes voltear dos a la vez para encontrar parejas. Si coinciden, permanecen visibles. El objetivo es encontrar todas las parejas en el menor tiempo posible.
                        </Text>
                        
                        <TouchableOpacity 
                            style={styles.playButton} 
                            onPress={() => {
                            setShowMemoryGameModal(false);
                            navigation.navigate('JuegoMemoria');
                            }}
                        >
                            <Text style={styles.playButtonText}>🎮 Jugar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => setShowMemoryGameModal(false)} 
                            style={styles.backArrow}
                        >
                            <Text style={styles.backArrowText}>←</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    </Modal>

                    {/* Modal para Cambio de Criterio (Figuras/Colores) */}
                    <Modal visible={showCriteriaGameModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>¿Cómo se juega?</Text>
                        <Text style={styles.modalDescription}>
                            🔸 Qué es: Juego de atención y flexibilidad cognitiva donde debes cambiar tu criterio de selección.{"\n\n"}
                            🔸 Funcionamiento: Primero verás una figura con un color específico. Luego se te mostrarán varias figuras y deberás seleccionar:
                            {"\n"}• En algunos niveles las que tienen la MISMA FORMA
                            {"\n"}• En otros niveles las que tienen el MISMO COLOR
                            {"\n\n"}¡Debes estar atento porque el criterio puede cambiar!
                        </Text>

                        <TouchableOpacity 
                            style={styles.playButton} 
                            onPress={() => {
                            setShowCriteriaGameModal(false);
                            navigation.navigate('CambioCriterio');
                            }}
                        >
                            <Text style={styles.playButtonText}>🎮 Jugar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => setShowCriteriaGameModal(false)} 
                            style={styles.backArrow}
                        >
                            <Text style={styles.backArrowText}>←</Text>
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
                                    setShowColorInfoModal(true);
                                }}>
                                    <Image source={require('../assests/reto-colores.png')} style={styles.gameImage} resizeMode="contain" />
                                    <Text style={styles.gameLabel}>Reto de Colores</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setShowEvaluablesModal(false);
                                    setShowPuzzleInfoModal(true);
                                }}>
                                    <Image source={require('../assests/reflexion-puzzle.png')} style={styles.gameImage} resizeMode="contain" />
                                    <Text style={styles.gameLabel}>Piezas y Respuestas</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setShowEvaluablesModal(false);
                                    setShowDesafioInfoModal(true);
                                }}>
                                    <Image source={require('../assests/desafio-ninja.png')} style={styles.gameImage} resizeMode="contain" />
                                    <Text style={styles.gameLabel}>Desafío Ninja</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setShowEvaluablesModal(false);
                                    setShowCaminoInfoModal(true);
                                }}>
                                    <Image source={require('../assests/camino-ninja.png')} style={styles.gameImage} resizeMode="contain" />
                                    <Text style={styles.gameLabel}>El Camino Ninja</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={() => setShowEvaluablesModal(false)} style={styles.closeButton}>
                                <Text style={{ color: 'white' }}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Modal para Reto de Colores */}
                <Modal visible={showColorInfoModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>¿Cómo se juega?</Text>
                            <Text style={styles.modalDescription}>
                                🔸 Qué es: Es un juego que consiste en repetir una secuencia de luces de colores en el mismo orden en que aparece. Es como el Simon.{"\n\n"}
                                🔸 Funcionamiento: El juego presenta cuatro botones de colores (rojo, verde, azul y amarillo). El juego inicia mostrando una secuencia de luces que tú debes repetir. Puedes fallar una vez por nivel, pero si fallas dos veces en el mismo nivel pierdes. Hay un total de siete niveles.
                            </Text>
                            <TouchableOpacity style={styles.playButton} onPress={() => {
                                setShowColorInfoModal(false);
                                navigation.navigate('RetoColores');
                            }}>
                                <Text style={styles.playButtonText}>🎮 Jugar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => setShowColorInfoModal(false)} 
                                style={styles.backArrow}
                            >
                                <Text style={styles.backArrowText}>←</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Modal para Piezas y Respuestas */}
                <Modal visible={showPuzzleInfoModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>¿Cómo se juega?</Text>
                            <Text style={styles.modalDescription}>
                                🔸 Qué es: Es una tarea que combina dos desafíos: primero, responder a una pregunta personal, y luego, completar una sopa de letras.{"\n\n"}
                                🔸 Funcionamiento: Primero se plantea una pregunta reflexiva. Luego haces una sopa de letras mientras piensas tu respuesta. Al terminar, deberás dar tu respuesta. Una forma divertida de entrenar memoria y reflexión.
                            </Text>
                            <TouchableOpacity style={styles.playButton} onPress={() => {
                                setShowPuzzleInfoModal(false);
                                navigation.navigate('ReflexionPuzzle');
                            }}>
                                <Text style={styles.playButtonText}>🎮 Jugar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => setShowPuzzleInfoModal(false)} 
                                style={styles.backArrow}
                            >
                                <Text style={styles.backArrowText}>←</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Modal para Desafío Ninja */}
                <Modal visible={showDesafioInfoModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>¿Cómo se juega?</Text>
                            <Text style={styles.modalDescription}>
                                🔸 Qué es: Un ejercicio interactivo para mejorar tus habilidades de planificación y organización.{"\n\n"}
                                🔸 Funcionamiento: En cada escenario, se te presenta una situación (como prepararte para un viaje). Debes elegir las 3 acciones correctas entre 5 opciones. Las acciones incorrectas deben ser descartadas.
                            </Text>
                            <TouchableOpacity style={styles.playButton} onPress={() => {
                                setShowDesafioInfoModal(false);
                                navigation.navigate('DesafioNinja');
                            }}>
                                <Text style={styles.playButtonText}>🎮 Jugar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => setShowDesafioInfoModal(false)} 
                                style={styles.backArrow}
                            >
                                <Text style={styles.backArrowText}>←</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Modal para El Camino Ninja */}
                <Modal visible={showCaminoInfoModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>¿Cómo se juega?</Text>
                            <Text style={styles.modalDescription}>
                                🔸 Qué es: Una actividad reflexiva donde defines tus metas a futuro.{"\n\n"}
                                🔸 Funcionamiento: Piensa en lo que te gustaría alcanzar en 1 año, en 5 años y a largo plazo. Escribe tus metas personales. Ideal para conectar con tu propósito y planificar tu futuro.
                            </Text>
                            <TouchableOpacity style={styles.playButton} onPress={() => {
                                setShowCaminoInfoModal(false);
                                navigation.navigate('CaminoNinja');
                            }}>
                                <Text style={styles.playButtonText}>🎮 Jugar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => setShowCaminoInfoModal(false)} 
                                style={styles.backArrow}
                            >
                                <Text style={styles.backArrowText}>←</Text>
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
    modalDescription: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'left',
    marginBottom: 20,
    color: '#333',
    },
    playButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    },

    playButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    },
    backArrow: {
    position: 'absolute',
    top: -15,
    left: 10,
    padding: 10,
    zIndex: 1,
    },

    backArrowText: {
    fontSize: 50,
    color: '#333',
    },

});