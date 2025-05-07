import React, { useContext, useState } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { Picker } from '@react-native-picker/picker'; 
import { AuthContext } from "../context/AuthContext";
import AchievementPopup from '../components/AchievementPopup';

export default function AddTaskScreen({ route }) {
    const { user,token } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [importance, setImportance] = useState('medio');
    const [status, setStatus] = useState('todo');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [assignedToEmails, setAssignedToEmails] = useState(['']);
    const [showPopup, setShowPopup] = useState(false);
    const [unlockedAchievement, setUnlockedAchievement] = useState(null);

    const navigation = useNavigation();

    const handleAddTask = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Por favor, completa todos los campos');
            return;
        }

        console.log("👤 Usuario actual:", user); // Verifica que el usuario esté definido
        console.log("🆔 ID del usuario:", user._id); // Verifica que el ID del usuario no sea


        const newTask = {
            title,
            description,
            date: date.toISOString(),
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            importance,
            status,
            userId: user ? user._id : null, 
            assignedToEmails: assignedToEmails.filter(email => email.trim() !== ''),
        };

        console.log("📩 Datos enviados al backend:", newTask); // Verifica que el userId esté incluido

        try {
            const response = await fetch('http://192.168.1.19:5000/api/tasks', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Incluye el token en el encabezado
                },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) {
                throw new Error(`Error al agregar tarea: ${response.status}`);
            }

            
            setTitle('');
            setDescription('');
            setDate(new Date());
            setTime(new Date());
            setImportance('medio');
            setStatus('todo');

            Alert.alert('Éxito', 'Tarea añadida correctamente');
            navigation.navigate('Tareas');

            try {
              // Llamar al endpoint /check para verificar logros nuevos
              const checkResponse = await fetch('http://192.168.1.19:5000/api/achievements/check', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: user._id }),
              });

              const checkData = await checkResponse.json();
              console.log("📥 Respuesta del check de logros:", checkData);

              if (checkData.unlocked && checkData.unlocked.length > 0) {
                const unlocked = checkData.unlocked[0];
                setUnlockedAchievement(unlocked);
                setShowPopup(true);

                // Oculta el popup después de 4 segundos
                setTimeout(() => {
                  setShowPopup(false);
                }, 3000);
              }
            } catch (error) {
              console.error("❌ Error al verificar logros:", error);
            }
        } catch (error) {
            console.error('Error al añadir tarea:', error);
            Alert.alert('Error', 'No se pudo añadir la tarea');
        }
    };

    return (
      <>
        <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Título:</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Título de la tarea"
          />
    
          <Text style={styles.label}>Descripción:</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción de la tarea"
          />
    
          <Text style={styles.label}>Fecha:</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{date.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
    
          <Text style={styles.label}>Hora:</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.dateText}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) setTime(selectedTime);
              }}
            />
          )}
    
          <Text style={styles.label}>Importancia:</Text>
          <Picker
            selectedValue={importance}
            onValueChange={(itemValue) => setImportance(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="🔥 Poco" value="poco" />
            <Picker.Item label="🔥🔥 Medio" value="medio" />
            <Picker.Item label="🔥🔥🔥 Mucho" value="mucho" />
          </Picker>

          <Text style={styles.label}>Asignar a (correos):</Text>
          {assignedToEmails.map((email, index) => (
            <TextInput
              key={index}
              style={styles.input}
              value={email}
              onChangeText={(text) => {
                const updated = [...assignedToEmails];
                updated[index] = text;
                setAssignedToEmails(updated);
              }}
              placeholder={`Correo asignado #${index + 1}`}
            />
          ))}
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => setAssignedToEmails([...assignedToEmails, ''])}
        >
          <Text style={styles.buttonSecondaryText}>➕ Añadir otro usuario</Text>
        </TouchableOpacity>




    
          <TouchableOpacity style={styles.button} onPress={handleAddTask}>
            <Text style={styles.buttonText}>➕ Añadir tarea</Text>
          </TouchableOpacity>
        </ScrollView>
        <AchievementPopup
          visible={showPopup}
          achievement={unlockedAchievement}
        />
        </>
      );
    }

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f7f7f7' },
    label: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, marginLeft: 20, marginTop: 10 },
    input: { 
        backgroundColor: 'white', 
        padding: 10, 
        borderRadius: 5, 
        marginBottom: 10, 
        marginHorizontal: 20 
    },
    dateButton: { 
        backgroundColor: 'white', 
        padding: 10, 
        borderRadius: 5, 
        marginBottom: 10, 
        alignItems: 'center',
        marginHorizontal: 20
    },
    dateText: { fontSize: 16 },
    picker: { backgroundColor: 'white', marginBottom: 10, marginHorizontal: 20 },
    button: { 
        backgroundColor: '#28a745', 
        padding: 15, 
        borderRadius: 5, 
        alignItems: 'center', 
        margin: 20
    },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    buttonSecondary: {
      borderWidth: 1,
      borderColor: "#999",
      borderRadius: 8,
      padding: 8,
      marginVertical: 10,
      alignItems: "center",
      backgroundColor: "#f0f0f0"
    },
    buttonSecondaryText: {
      color: "#666",
      fontSize: 14,
    }
    
});
