import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { usePMCQ } from '../context/PMCQContext';

const likertOptions = [
  { label: 'Nunca (0)', value: 0 },
  { label: 'A veces (1)', value: 1 },
  { label: 'Frecuentemente (2)', value: 2 },
  { label: 'Muy frecuentemente (3)', value: 3 },
];

const questions = [
    "Me olvido de hacer tareas diarias como pagar facturas, enviar cartas o sacar la basura.",
    "Me olvido de transmitir mensajes importantes a familiares, amigos o colegas.",
    "Pongo las cosas en el lugar equivocado, por ejemplo, la leche en el armario y el azúcar en el frigorífico.",
    "En medio de una frase, olvido lo que iba a decir.",
    "Olvidé citas importantes.",
    "Cuando me dan un mensaje para transmitir, olvido cuál era el mensaje.",
    "Me olvido de hacer cosas que se pueden hacer en secuencia, por ejemplo, comprar un sello, poner el sello en un sobre y enviarlo por correo.",
    "Cuando tengo que hacer dos cosas a la vez, me cuesta recordar hacer ambas.",
    "No suelo recordar hacer las cosas que tengo que hacer incluso si estoy en medio de otra tarea.",
    "Hago las cosas dos veces porque olvido que ya las he hecho, por ejemplo, tomar una pastilla dos veces.",
    "Pienso que he hecho cosas cuando en realidad no las he hecho.",
    "Me olvido de apagar la estufa o la plancha.",
    "Tengo problemas para recordar direcciones o instrucciones.",
    "Tengo problemas para cambiar mi atención entre dos cosas diferentes, por ejemplo, mirar televisión y hablar con alguien al mismo tiempo.",
    "Cuando estoy cansado, estresado, enojado o molesto, me olvido de hacer cosas con más frecuencia de lo normal.",
    "Olvidé fechas importantes, cumpleaños o aniversarios.",
    "Tengo problemas para recordar los nombres de personas y lugares.",
    "Tengo problemas para recordar eventos recientes de mi vida.",
    "Me preocupa que mi memoria esté empeorando.",
    "Sé que voy a necesitar una ayuda para la memoria, como una nota, una lista o una alarma.",
    "Me lleva más tiempo hacer tareas mentales que antes, por ejemplo, crucigramas.",
    "Me frustro conmigo mismo porque me olvido de hacer cosas que debería hacer.",
    "Tengo problemas para pensar en formas de ayudar a mi memoria.",
    "Hay veces que recuerdo que tengo que hacer algo, pero no puedo recordar qué es.",
    "Entro en una habitación y olvido por qué fui allí.",
    "Me olvido de hacer cosas que he empezado, por ejemplo, tender la ropa una vez que la lavadora ha terminado.",
    "Olvidé dónde puse las cosas, por ejemplo, las llaves o el dinero.",
    "Ver lugares u objetos puede recordarme que necesito hacer algo, pero no puedo recordar exactamente qué es.",
    "Me olvido de hacer cosas porque me dejo llevar haciendo otra cosa.",
    "Encuentro que no vuelvo a las tareas planificadas si me interrumpen.",
    "Me olvido de hacer algunas cosas que tengo planeado hacer.",
    "Olvidé cosas que debería estar haciendo si estoy ansioso o preocupado por algo.",
    "Sólo puedo recordar que tengo un mensaje que transmitir cuando veo a la persona a la que va dirigido el mensaje.",
    "Le cuento a la gente la misma historia porque olvido que ya se la he contado.",
    "Recuerdo las partes principales de las instrucciones (por ejemplo, comprar leche) pero olvido los detalles (comprar dos litros de leche)."
  ];

export default function PMCQScreen() {
  const [step, setStep] = useState(1); // 1 = intro, 2 = cuestionario, 3 = preguntas finales
  const [responses, setResponses] = useState(Array(35).fill(null));
  const [favoriteActivities, setFavoriteActivities] = useState(['', '', '']);
  const [favoriteMedia, setFavoriteMedia] = useState(['', '', '']);
  const [emojiActivity, setEmojiActivity] = useState('');
  const [emojiMedia, setEmojiMedia] = useState('');
  const { submitPMCQ } = usePMCQ();

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = parseInt(value);
    setResponses(newResponses);
  };

  const handleFinalSubmit = async () => {
    if (favoriteActivities.some(a => a.trim() === '') || favoriteMedia.some(m => m.trim() === '') || !emojiActivity || !emojiMedia) {
      return Alert.alert('Error', 'Completa todos los campos.');
    }

    try {
        console.log({
            responses,
            favoriteActivities,
            favoriteShowsOrMovies: favoriteMedia,
            emojiActivity,
            emojiMedia,
          });
      await submitPMCQ({
        responses,
        favoriteActivities,
        favoriteShowsOrMovies: favoriteMedia,
        emojiActivity,
        emojiMedia,
      });
      
      Alert.alert('¡Formulario enviado con éxito!');
      // Podrías navegar o reiniciar aquí
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el cuestionario.');
    }
  };

  if (step === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Antes de comenzar...</Text>
        <Text style={styles.text}>
          A continuación, deberás completar un cuestionario de 35 preguntas sobre tu memoria diaria.
          Al finalizar, se te pedirá:
        </Text>
        <Text style={styles.bullet}>• Escribir 3 actividades favoritas</Text>
        <Text style={styles.bullet}>• Escribir 3 series o películas favoritas</Text>
        <Text style={styles.bullet}>• Seleccionar un emoji para tu actividad favorita y otro para tu película favorita</Text>
        <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
          <Text style={styles.buttonText}>Comenzar cuestionario</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 2) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Cuestionario de Memoria Prospectiva</Text>
        {questions.map((question, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.questionText}>{index + 1}. {question}</Text>
            <RadioButton.Group
              onValueChange={value => handleResponseChange(index, value)}
              value={responses[index]}
            >
              <View style={styles.optionsRow}>
                {likertOptions.map(opt => (
                  <View key={opt.value} style={styles.optionItem}>
                    <RadioButton value={opt.value} />
                    <Text>{opt.label}</Text>
                  </View>
                ))}
              </View>
            </RadioButton.Group>
          </View>
        ))}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (responses.includes(null)) {
              return Alert.alert('Completa todas las preguntas antes de continuar.');
            }
            setStep(3);
          }}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (step === 3) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>¿Recuerdas lo que se te pidió antes?</Text>
        <Text style={styles.text}>Rellena los siguientes campos con esas respuestas:</Text>
  
        <Text style={styles.subtitle}>Respuestas 1 a 3:</Text>
        {favoriteActivities.map((act, i) => (
          <TextInput
            key={i}
            style={styles.input}
            placeholder={`Respuesta ${i + 1}`}
            value={act}
            onChangeText={text => {
              const updated = [...favoriteActivities];
              updated[i] = text;
              setFavoriteActivities(updated);
            }}
          />
        ))}
  
        <Text style={styles.subtitle}>Respuestas 4 a 6:</Text>
        {favoriteMedia.map((media, i) => (
          <TextInput
            key={i}
            style={styles.input}
            placeholder={`Respuesta ${i + 4}`}
            value={media}
            onChangeText={text => {
              const updated = [...favoriteMedia];
              updated[i] = text;
              setFavoriteMedia(updated);
            }}
          />
        ))}
  
        <Text style={styles.subtitle}>Respuesta 7:</Text>
        <TextInput style={styles.input} value={emojiActivity} onChangeText={setEmojiActivity} placeholder="Ej: 🎨" maxLength={2} />
  
        <Text style={styles.subtitle}>Respuesta 8:</Text>
        <TextInput style={styles.input} value={emojiMedia} onChangeText={setEmojiMedia} placeholder="Ej: 🎬" maxLength={2} />
  
        <TouchableOpacity style={styles.button} onPress={handleFinalSubmit}>
          <Text style={styles.buttonText}>Enviar cuestionario</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
  

  return null;
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  text: { fontSize: 16, marginBottom: 12 },
  bullet: { fontSize: 16, marginBottom: 8, marginLeft: 8 },
  questionContainer: { marginBottom: 16 },
  questionText: { fontSize: 16, marginBottom: 4 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  optionItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginTop: 8 },
  button: { backgroundColor: '#6200ee', padding: 12, borderRadius: 8, marginTop: 24, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
