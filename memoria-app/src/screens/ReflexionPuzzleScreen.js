import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert,  PanResponder } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const QUESTIONS = [
  '¿Cuál es tu recuerdo favorito de la infancia?',
  '¿Qué te gustaría lograr en los próximos años?',
  '¿Qué tipo de música sueles escuchar?',
  '¿Qué persona ha influido más en tu vida?',
  '¿Cuál ha sido un momento difícil que superaste?',
  '¿Qué te motiva cada día?',
  '¿Cuál es tu lugar favorito en el mundo?',
];

const VALID_WORDS = ['SOL', 'GATO', 'AMOR', 'MESA'];
const ALL_LETTERS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

const generateGrid = (rows = 10, cols = 10) => { 
  const directions = [
    { dr: 0, dc: 1 },   // → derecha
    { dr: 1, dc: 0 },   // ↓ abajo
    { dr: 1, dc: 1 },   // ↘️ diagonal abajo derecha
    { dr: 1, dc: -1 },  // ↙️ diagonal abajo izquierda
  ];

  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => '')
  );

  const placeWord = (word) => {
    const tries = 100;
    for (let attempt = 0; attempt < tries; attempt++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      
      // Calcular límites basados en la dirección
      let maxRow = rows - 1;
      let maxCol = cols - 1;
      
      if (dir.dr === 1) maxRow = rows - word.length;
      if (dir.dc === 1) maxCol = cols - word.length;
      if (dir.dc === -1) maxCol = word.length - 1;
      
      const rowStart = Math.floor(Math.random() * (maxRow + 1));
      const colStart = dir.dc === -1 
        ? Math.floor(Math.random() * (cols - word.length + 1)) + word.length - 1
        : Math.floor(Math.random() * (maxCol + 1));
  
      let fits = true;
      const tempCoords = [];
      
      // Verificar si la palabra cabe
      for (let i = 0; i < word.length; i++) {
        const r = rowStart + dir.dr * i;
        const c = colStart + dir.dc * i;
        
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
          fits = false;
          break;
        }
        tempCoords.push({r, c});
      }
  
      if (fits) {
        // Colocar la palabra
        for (let i = 0; i < word.length; i++) {
          const {r, c} = tempCoords[i];
          grid[r][c] = word[i];
        }
        return true;
      }
    }
    return false;
  };

  VALID_WORDS.forEach(word => placeWord(word));

  // Rellenar letras vacías
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
      }
    }
  }

  return grid;
};



const ReflectionPuzzleScreen = () => {
  const { token } = useAuth();

  const [etapa, setEtapa] = useState('pregunta');
  const [question, setQuestion] = useState('');
  const [grid, setGrid] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState([]);
  const [foundCoords, setFoundCoords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [answer, setAnswer] = useState('');
  const navigation = useNavigation();
  const [cellSize, setCellSize] = useState(0);

  useEffect(() => {
    const randomQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    setQuestion(randomQuestion);
    setGrid(generateGrid());

    const timeout = setTimeout(() => {
      setEtapa('sopa');
    }, 6000);

    return () => clearTimeout(timeout);
  }, []);

  const isInBounds = (row, col) =>
    row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;

  const directions = [
    { dr: 0, dc: 1 },    // derecha
    { dr: 1, dc: 0 },    // abajo
    { dr: 1, dc: 1 },    // diagonal abajo derecha
    { dr: 1, dc: -1 },   // diagonal abajo izquierda
  ];

  const tryFindWordFrom = (startRow, startCol) => {
    for (let { dr, dc } of directions) {
      let word = '';
      const coords = [];

      for (let i = 0; i < 8; i++) {
        const row = startRow + dr * i;
        const col = startCol + dc * i;

        if (!isInBounds(row, col)) break;
        word += grid[row][col];
        coords.push({ row, col });

        if (VALID_WORDS.includes(word) && !foundWords.includes(word)) {
          setFoundWords(prev => [...prev, word]);
          setFoundCoords(prev => [...prev, ...coords]);
          return true;
        }
      }
    }
    return false;
  };

  const handleLetterPress = (row, col) => {
    if (
      foundCoords.some(c => c.row === row && c.col === col) ||
      selectedCoords.some(c => c.row === row && c.col === col)
    ) {
      return;
    }

    const newSelection = [...selectedCoords, { row, col }];
    setSelectedCoords(newSelection);

    if (newSelection.length === 1) {
      tryFindWordFrom(row, col);
      setSelectedCoords([]);
    }
  };

  const isCellSelected = (row, col) =>
    selectedCoords.some(coord => coord.row === row && coord.col === col);

  const isCellFound = (row, col) =>
    foundCoords.some(coord => coord.row === row && coord.col === col);

  useEffect(() => {
    if (foundWords.length === 4) {
      setTimeout(() => setEtapa('respuesta'), 800);
    }
  }, [foundWords]);

  const submitResult = async () => {
    if (!answer.trim()) {
      Alert.alert('Por favor escribe tu respuesta antes de enviar.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.19:5000/api/reflection-puzzle/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question, answer }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al guardar resultado');

      Alert.alert('Gracias', 'Tu respuesta ha sido guardada.', [
        { text: 'OK', onPress: () => navigation.navigate('Inicio') },
      ]);
    } catch (error) {
      console.error('Error al guardar datos:', error);
      Alert.alert('Error', 'No se pudo guardar tu respuesta.');
    }
  };
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (e, gestureState) => {
      handleTouch(e.nativeEvent);
    },
    onPanResponderMove: (e, gestureState) => {
      handleTouch(e.nativeEvent);
    },
    onPanResponderRelease: () => {
      if (selectedCoords.length > 0) {
        const { row, col } = selectedCoords[0];
        tryFindWordFrom(row, col);
      }
      setSelectedCoords([]);
    },
  });
  
  const handleTouch = (nativeEvent) => {
    const { locationX, locationY } = nativeEvent;
  
    const row = Math.floor(locationY / cellSize);
    const col = Math.floor(locationX / cellSize);
  
    if (!isInBounds(row, col)) return;
  
    const alreadySelected = selectedCoords.some(c => c.row === row && c.col === col);
    const alreadyFound = foundCoords.some(c => c.row === row && c.col === col);
  
    if (!alreadySelected && !alreadyFound) {
      setSelectedCoords(prev => [...prev, { row, col }]);
    }
  };
  

  const resetGame = () => {
    setQuestion(QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]);
    setGrid(generateGrid());
    setSelectedCoords([]);
    setFoundCoords([]);
    setFoundWords([]);
    setAnswer('');
    setEtapa('pregunta');
  };

  return (
    <View style={styles.container}>
      {etapa === 'pregunta' && (
        <>
          <Text style={styles.title}>Recuerda esta pregunta:</Text>
          <Text style={styles.question}>{question}</Text>
        </>
      )}

      {etapa === 'sopa' && (
        <>
          <Text style={styles.title}>Encuentra las 4 palabras clave</Text>
          <View style={styles.grid}>
            {grid.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.gridRow}>
                {row.map((letter, colIndex) => {
                  const selected = isCellSelected(rowIndex, colIndex);
                  const found = isCellFound(rowIndex, colIndex);
                  return (
                    <TouchableOpacity
                      key={colIndex}
                      style={[
                        styles.gridCell,
                        selected && styles.selectedCell,
                        found && styles.foundCell,
                      ]}
                      onPress={() => handleLetterPress(rowIndex, colIndex)}
                    >
                      <Text style={styles.gridLetter}>{letter}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>
            Palabras encontradas: {foundWords.length} / {VALID_WORDS.length}
          </Text>

          <TouchableOpacity onPress={() => setSelectedCoords([])} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Borrar selección</Text>
          </TouchableOpacity>
        </>
      )}

      {etapa === 'respuesta' && (
        <>
          <Text style={styles.title}>¿Cuál era tu respuesta?</Text>
          <TextInput
            style={styles.textInput}
            value={answer}
            onChangeText={setAnswer}
            placeholder="Escribe tu reflexión..."
            multiline
          />
          <TouchableOpacity style={styles.submitButton} onPress={submitResult}>
            <Text style={styles.submitButtonText}>Enviar respuesta</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ReflectionPuzzleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  question: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  grid: {
    marginVertical: 20,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
  },
  gridLetter: {
    fontSize: 16,
    fontWeight: '600',
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  wordButton: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    margin: 6,
  },
  wordButtonSelected: {
    backgroundColor: '#a3d8f4',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 12,
  },
  textInput: {
    width: '100%',
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    textAlignVertical: 'top',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  selectedCell: {
    backgroundColor: '#ffeaa7',
  },
  foundCell: {
    backgroundColor: '#81ecec',
  },
  clearButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#d63031',
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
});
