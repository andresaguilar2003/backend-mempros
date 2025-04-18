import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const AchievementsScreen = () => {
  const [allAchievements, setAllAchievements] = useState([]);
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);
  const { token, user } = useAuth(); // añadimos `user`

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const [allRes, unlockedRes] = await Promise.all([
          axios.get("http://192.168.1.19:5000/api/achievements/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://192.168.1.19:5000/api/achievements/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
  
        console.log("🎯 Todos los logros:", allRes.data);
        console.log("✅ Logros desbloqueados:", unlockedRes.data);
  
        setAllAchievements(allRes.data);
        setUnlockedIds(unlockedRes.data); // Esto asume que el array viene como lista de IDs
      } catch (err) {
        if (err.response) {
          console.error("❌ Error al obtener logros (respuesta del backend):", err.response.data);
          console.error("📦 Código:", err.response.status);
        } else {
          console.error("❌ Error al obtener logros:", err.message);
        }
      }      
    };
  
    if (user?._id) {
      fetchAchievements();
    }
  }, [user]);
  

  const renderAchievement = ({ item }) => {
    const unlocked = unlockedIds.includes(item._id);
    return (
      <View style={[styles.card, unlocked ? styles.unlocked : styles.locked]}>
        <Image
          source={getImageSource(item.image)}
          style={[styles.image, { opacity: unlocked ? 1 : 0.3 }]}
        />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const getImageSource = (filename) => {
    switch (filename) {
      case "medalla1.png":
        return require("../assests/medals/medalla1.png");
      case "medalla3.png":
        return require("../assests/medals/medalla3.png");
      case "medalla10.png":
        return require("../assests/medals/medalla10.png");
      default:
        return require("../assests/medals/question.png");
    }
  };

  const achievementsToShow = showOnlyUnlocked
    ? allAchievements.filter((a) => unlockedIds.includes(a._id))
    : allAchievements;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎖️ Logros</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, !showOnlyUnlocked && styles.activeTab]}
          onPress={() => setShowOnlyUnlocked(false)}
        >
          <Text>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, showOnlyUnlocked && styles.activeTab]}
          onPress={() => setShowOnlyUnlocked(true)}
        >
          <Text>Mis logros</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={achievementsToShow}
        keyExtractor={(item) => item._id}
        renderItem={renderAchievement}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  toggleContainer: { flexDirection: "row", marginBottom: 16 },
  toggleButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  activeTab: { backgroundColor: "#ddd" },
  card: {
    flexDirection: "row",
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  unlocked: { borderColor: "green" },
  locked: { borderColor: "gray" },
  image: { width: 60, height: 60, marginRight: 12 },
  textContainer: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold" },
  description: { fontSize: 14, color: "#555" },
});

export default AchievementsScreen;
