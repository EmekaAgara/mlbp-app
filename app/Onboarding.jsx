import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Onboarding = ({ navigation }) => {
  const [language, setLanguage] = useState("en");
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
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={language}
          onValueChange={(value) => setLanguage(value)}
          style={styles.picker}
          dropdownIconColor="#fff"
        >
          <Picker.Item label="English" value="en" color="#fff" />
          <Picker.Item label="Spanish" value="es" color="#fff" />
          <Picker.Item label="French" value="fr" color="#fff" />
        </Picker>
      </View>

      <Text style={styles.label}>Favorite Team</Text>
      <TextInput
        placeholder="Enter your favorite team"
        placeholderTextColor="#888"
        value={favoriteTeam}
        onChangeText={setFavoriteTeam}
        style={styles.input}
      />

      <Text style={styles.label}>Favorite Player</Text>
      <TextInput
        placeholder="Enter your favorite player"
        placeholderTextColor="#888"
        value={favoritePlayer}
        onChangeText={setFavoritePlayer}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={savePreferences}>
        <Text style={styles.buttonText}>Save & Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    color: "#bbb",
  },
  pickerContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    color: "#fff",
    padding: 10,
  },
  input: {
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#fff",
  },
  button: {
    backgroundColor: "#664DF3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Onboarding;
