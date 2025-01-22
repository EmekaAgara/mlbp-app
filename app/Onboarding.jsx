import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Onboarding = ({ navigation }) => {
  const [language, setLanguage] = useState("en"); // Language code (e.g., 'en' for English, 'es' for Spanish)
  const [favoriteTeam, setFavoriteTeam] = useState("");
  const [favoritePlayer, setFavoritePlayer] = useState("");

  const savePreferences = async () => {
    const preferences = { language, favoriteTeam, favoritePlayer };
    await AsyncStorage.setItem("userPreferences", JSON.stringify(preferences));
    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Preferences</Text>
      <Text style={styles.label}>Select Language</Text>
      <Picker
        selectedValue={language}
        onValueChange={(value) => setLanguage(value)}
        style={styles.picker}
      >
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Spanish" value="es" />
        <Picker.Item label="French" value="fr" />
      </Picker>

      <Text style={styles.label}>Favorite Team</Text>
      <TextInput
        placeholder="Enter your favorite team"
        value={favoriteTeam}
        onChangeText={setFavoriteTeam}
        style={styles.input}
      />

      <Text style={styles.label}>Favorite Player</Text>
      <TextInput
        placeholder="Enter your favorite player"
        value={favoritePlayer}
        onChangeText={setFavoritePlayer}
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Save & Continue"
          onPress={savePreferences}
          color="#6200ee"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f7f7f7" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  label: { fontSize: 16, marginVertical: 10, color: "#555" },
  picker: { backgroundColor: "#fff", borderRadius: 8, marginBottom: 15 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: { marginTop: 20 },
});

export default Onboarding;
