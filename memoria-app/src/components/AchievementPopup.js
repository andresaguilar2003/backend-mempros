import React from "react";
import { View, Text, Image, StyleSheet, Modal } from "react-native";

const AchievementPopup = ({ visible, onClose, achievement }) => {
  if (!achievement) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>🏆 ¡Logro desbloqueado!</Text>
          <Image
            source={getImageSource(achievement.image)}
            style={styles.image}
          />
          <Text style={styles.name}>{achievement.name}</Text>
          <Text style={styles.description}>{achievement.description}</Text>
        </View>
      </View>
    </Modal>
  );
};

const getImageSource = (iconCode) => {
  switch (iconCode) {
    case "first-task":
      return require("../assests/medals/medalla1.png");
    case "ten-tasks":
      return require("../assests/medals/medalla10.png");
    case "early-bird":
      return require("../assests/medals/medallabird.png");
    default:
      return require("../assests/medals/question.png");
  }
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  popup: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "green",
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    textAlign: "center",
    marginTop: 8,
    color: "#444",
  },
});

export default AchievementPopup;
