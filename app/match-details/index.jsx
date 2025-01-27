import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";

const MatchDetails = () => {
  const { game } = useLocalSearchParams(); // Use `useLocalSearchParams` for search parameters
  const router = useRouter();
  const parsedGame = JSON.parse(game); // Parse the game details passed as a string
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simulate prediction (replace this with real API when available)
  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      try {
        // Replace this logic with actual Google Gemini API call
        const simulatedPrediction = {
          winner:
            Math.random() > 0.5
              ? parsedGame.teams.away.team.name
              : parsedGame.teams.home.team.name,
          confidence: (Math.random() * (90 - 50) + 50).toFixed(2),
        };
        setPrediction(simulatedPrediction);
      } catch (error) {
        console.error("Error predicting outcome:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [game]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {parsedGame.teams.away.team.name} vs {parsedGame.teams.home.team.name}
      </Text>
      <View style={styles.teamContainer}>
        <WebView
          source={{
            uri: `https://www.mlbstatic.com/team-logos/${parsedGame.teams.away.team.id}.svg`,
          }}
          style={styles.logo}
        />
        <Text style={styles.teamName}>{parsedGame.teams.away.team.name}</Text>
      </View>
      <Text style={styles.vsText}>vs</Text>
      <View style={styles.teamContainer}>
        <WebView
          source={{
            uri: `https://www.mlbstatic.com/team-logos/${parsedGame.teams.home.team.id}.svg`,
          }}
          style={styles.logo}
        />
        <Text style={styles.teamName}>{parsedGame.teams.home.team.name}</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        prediction && (
          <View style={styles.predictionContainer}>
            <Text style={styles.predictionTitle}>Predicted Outcome:</Text>
            <Text style={styles.predictionText}>
              Winner: {prediction.winner}
            </Text>
            <Text style={styles.predictionText}>
              Confidence: {prediction.confidence}%
            </Text>
          </View>
        )
      )}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/")}
      >
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MatchDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  teamContainer: { alignItems: "center", marginBottom: 20 },
  logo: { width: 100, height: 100 },
  teamName: { fontSize: 18, fontWeight: "600", marginTop: 10 },
  vsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginVertical: 10,
  },
  predictionContainer: { marginTop: 20, alignItems: "center" },
  predictionTitle: { fontSize: 18, fontWeight: "bold" },
  predictionText: { fontSize: 16, marginVertical: 5 },
  backButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 30,
  },
  backButtonText: { color: "#fff", fontWeight: "bold" },
});
