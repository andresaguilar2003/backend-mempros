import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import LottieView from 'lottie-react-native';

const VirtualAssistant = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [fadeAnim] = useState(new Animated.Value(0));
  const animationRef = useRef(null);
  
  const messages = {
    about: "Esta app te ayuda a registrar tareas y a notificarte sobre ellas",
    create: "Las tareas se crean dandole al boton 'Crear tarea'. Elige los campos que quieras. ¡Asi de facil!",
    view: "Para ver tus tareas, simplemente dale al boton de 'Ver mis Tareas', alli podras ver todas las tareas que tienes, incluso podrás seleccionar la vista de calendario y la vista de Kanban"
  };


  const showOptions = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setCurrentStep('options');
  };

  const showAnswer = (key) => {
    setCurrentStep(key);
  };

  const handleBack = () => {
    setCurrentStep('options');
  };

  return (
    <View style={styles.assistantModal}>
      <View style={styles.assistantContent}>
        {/* Cabecera con botón de cerrar */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>
        
        {/* Contenido del asistente */}
        <View style={styles.assistantBody}>
          {/* Reemplazamos la Image por LottieView */}
          <View style={styles.animationContainer}>
            <LottieView
                ref={animationRef}
                source={require('../assests/lottie/asistente1.json')}
                autoPlay={true}
                loop={true}
                style={styles.animation}
                resizeMode="contain"
                />
          </View>
          
          {/* Burbuja de diálogo */}
          <View style={styles.dialogBubble}>
            {currentStep === 'welcome' && (
              <>
                <Text style={styles.dialogText}>¡Hola, soy tu asistente virtual! ¿Quieres que te ayude con algo?</Text>
                <TouchableOpacity 
                  style={styles.continueButton}
                  onPress={showOptions}
                >
                  <Text style={styles.continueButtonText}>¡Sí, por favor!</Text>
                </TouchableOpacity>
              </>
            )}
            
            {currentStep === 'options' && (
              <Animated.View style={{ opacity: fadeAnim }}>
                <Text style={styles.dialogText}>¿Qué necesitas saber?</Text>
                <View style={styles.optionsContainer}>
                  <TouchableOpacity 
                    style={styles.optionButton}
                    onPress={() => showAnswer('about')}
                  >
                    <Text style={styles.optionText}>¿De qué va la app?</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.optionButton}
                    onPress={() => showAnswer('create')}
                  >
                    <Text style={styles.optionText}>¿Cómo se crean las tareas?</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.optionButton}
                    onPress={() => showAnswer('view')}
                  >
                    <Text style={styles.optionText}>¿Cómo miro mis tareas?</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
            
            {['about', 'create', 'view'].includes(currentStep) && currentStep !== 'options' && (
              <>
                <Text style={styles.dialogText}>{messages[currentStep]}</Text>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={handleBack}
                >
                  <Text style={styles.backButtonText}>Volver a las opciones</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  assistantModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  assistantContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '85%',
    maxWidth: 400,
    padding: 20,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 20,
    color: '#666',
  },
  assistantBody: {
    alignItems: 'center',
  },
  // Nuevos estilos para la animación Lottie
  animationContainer: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  // Mantén el resto de estilos igual
  dialogBubble: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 15,
    width: '100%',
  },
  dialogText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 15,
    color: '#6200ee',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 15,
    padding: 10,
  },
  backButtonText: {
    color: '#666',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default VirtualAssistant;