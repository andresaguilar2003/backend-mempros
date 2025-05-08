import React, { useState, useContext } from "react";
import { 
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigation = useNavigation();

    // Función para validar el formato del correo electrónico
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Error", "Por favor, introduce tu email y contraseña");
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert("Error", "Por favor, introduce un correo electrónico válido");
            return;
        }

        try {
            const response = await fetch("http://192.168.1.19:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const text = await response.text();
            console.log("Respuesta del servidor:", text);

            try {
                const data = JSON.parse(text);

                if (!response.ok) {
                    // Mostrar mensajes de error específicos
                    if (data.error === "Usuario no encontrado") {
                        Alert.alert("Error", "La cuenta no existe. Por favor, regístrate.");
                    } else if (data.error === "Contraseña incorrecta") {
                        Alert.alert("Error", "Contraseña incorrecta. Inténtalo de nuevo.");
                    } else {
                        Alert.alert("Error", data.error || "Error al iniciar sesión");
                    }
                    return;
                }

                // Guardar usuario en contexto y redirigir
                login(data.token, data.user);
                navigation.replace("Inicio");
            } catch (jsonError) {
                Alert.alert("Error", "La respuesta del servidor no es válida.");
            }
        } catch (error) {
            console.error("Error en login:", error);
            Alert.alert("Error", "No se pudo conectar al servidor. Inténtalo de nuevo.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
                <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("TherapistCodeScreen")}>
                <Text style={[styles.link, { marginTop: 20, color: "#007AFF" }]}>
                    Acceder como terapeuta
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "#f7f7f7",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    link: {
        marginTop: 15,
        textAlign: "center",
        color: "#007bff",
    },
});