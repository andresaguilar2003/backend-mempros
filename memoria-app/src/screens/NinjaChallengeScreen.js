// NinjaChallengeScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

const questions = [
    {
      question: "Prepararse para un viaje",
      options: [
        "Hacer la maleta",
        "Revisar documentos de identidad",
        "Comprobar reservas del hotel",
        "Comprar una televisión nueva",
        "Ver una película"
      ],
      correct: [
        "Hacer la maleta",
        "Revisar documentos de identidad",
        "Comprobar reservas del hotel"
      ],
    },
    {
      question: "Estudiar para un examen",
      options: [
        "Organizar apuntes",
        "Crear un plan de estudio",
        "Eliminar distracciones",
        "Jugar videojuegos",
        "Salir de fiesta"
      ],
      correct: [
        "Organizar apuntes",
        "Crear un plan de estudio",
        "Eliminar distracciones"
      ],
    },
    {
      question: "Cocinar una receta nueva",
      options: [
        "Leer la receta completa",
        "Comprar los ingredientes",
        "Lavar las manos",
        "Llamar a un amigo",
        "Ver redes sociales"
      ],
      correct: [
        "Leer la receta completa",
        "Comprar los ingredientes",
        "Lavar las manos"
      ],
    },
    {
      question: "Hacer ejercicio en casa",
      options: [
        "Preparar el espacio",
        "Vestirse con ropa deportiva",
        "Calentar antes de comenzar",
        "Dormir una siesta",
        "Encender velas aromáticas"
      ],
      correct: [
        "Preparar el espacio",
        "Vestirse con ropa deportiva",
        "Calentar antes de comenzar"
      ],
    },
    {
      question: "Salir a caminar al parque",
      options: [
        "Ponerse calzado cómodo",
        "Revisar el clima",
        "Llevar agua",
        "Llevar libros pesados",
        "Encender la televisión"
      ],
      correct: [
        "Ponerse calzado cómodo",
        "Revisar el clima",
        "Llevar agua"
      ],
    },
    {
      question: "Ir al supermercado",
      options: [
        "Hacer una lista de compras",
        "Revisar si tienes bolsas reutilizables",
        "Comprobar qué falta en casa",
        "Escuchar música a todo volumen",
        "Limpiar el baño"
      ],
      correct: [
        "Hacer una lista de compras",
        "Revisar si tienes bolsas reutilizables",
        "Comprobar qué falta en casa"
      ],
    },
    {
      question: "Prepararse para una entrevista",
      options: [
        "Investigar sobre la empresa",
        "Practicar respuestas comunes",
        "Elegir ropa adecuada",
        "Ir al cine",
        "Pintar la casa"
      ],
      correct: [
        "Investigar sobre la empresa",
        "Practicar respuestas comunes",
        "Elegir ropa adecuada"
      ],
    },
    {
      question: "Hacer limpieza general",
      options: [
        "Reunir los productos de limpieza",
        "Hacer una lista de zonas a limpiar",
        "Ponerse ropa cómoda",
        "Comprar flores",
        "Estudiar matemáticas"
      ],
      correct: [
        "Reunir los productos de limpieza",
        "Hacer una lista de zonas a limpiar",
        "Ponerse ropa cómoda"
      ],
    },
    {
      question: "Organizar una fiesta",
      options: [
        "Hacer una lista de invitados",
        "Comprar comida y bebidas",
        "Preparar música y decoración",
        "Hacer tareas del trabajo",
        "Leer un libro de historia"
      ],
      correct: [
        "Hacer una lista de invitados",
        "Comprar comida y bebidas",
        "Preparar música y decoración"
      ],
    },
    {
      question: "Empezar una nueva serie de televisión",
      options: [
        "Ver la sinopsis",
        "Preparar algo para picar",
        "Elegir un momento libre para verla",
        "Limpiar el coche",
        "Escribir un ensayo"
      ],
      correct: [
        "Ver la sinopsis",
        "Preparar algo para picar",
        "Elegir un momento libre para verla"
      ],
    }
  ];
  

const NinjaChallengeScreen = ({ navigation }) => {
  const { token } = useAuth();
  const [current, setCurrent] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [results, setResults] = useState([]);

  const toggleOption = (option) => {
    setSelectedOptions(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleNext = () => {
    const currentQuestion = questions[current];
    const correct = currentQuestion.correct;
    const correctCount = selectedOptions.filter(opt => correct.includes(opt)).length;
    const incorrectCount = selectedOptions.filter(opt => !correct.includes(opt)).length;

    const result = {
      questionNumber: current + 1,
      correctOptions: correct,
      selectedOptions,
      correctCount,
      incorrectCount
    };

    setResults([...results, result]);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelectedOptions([]);
    } else {
      saveResults([...results, result]);
    }
  };

  const saveResults = async (finalResults) => {
    try {
      const res = await fetch("https://backend-mempros.onrender.com/api/ninja-challenge/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ results: finalResults }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar resultados');
      Alert.alert("Juego terminado", "¡Bien hecho!", [{ text: "OK", onPress: () => navigation.navigate("Inicio") }]);
    } catch (err) {
      console.error("Error al guardar resultado:", err);
      Alert.alert("Error", "No se pudo guardar el resultado.");
    }
  };

  const currentQuestion = questions[current];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Desafío Ninja</Text>
      <Text style={styles.question}>{currentQuestion.question}</Text>

      {currentQuestion.options.map((opt, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.option,
            selectedOptions.includes(opt) ? styles.optionSelected : null,
          ]}
          onPress={() => toggleOption(opt)}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {current === questions.length - 1 ? 'Terminar' : 'Siguiente'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default NinjaChallengeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  question: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  option: {
    width: '100%',
    padding: 15,
    backgroundColor: '#ddd',
    marginVertical: 6,
    borderRadius: 10,
  },
  optionSelected: {
    backgroundColor: '#8fbc8f',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#0077cc',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
