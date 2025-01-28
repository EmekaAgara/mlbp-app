import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";
import runChat from "../../services/gemini";

const MatchDetails = () => {
  const { game } = useLocalSearchParams();
  const router = useRouter();
  const parsedGame = JSON.parse(game);

  const [response, setResponse] = useState({
    historical: "",
    prediction: "",
    insights: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const prompt = `
          Provide a concise summary of the upcoming MLB match between ${parsedGame.teams.away.team.name} and ${parsedGame.teams.home.team.name}.
          Your response must include:
          - Historical: Brief historical data about both teams in 2 sentences.
          - Prediction: A short prediction on the outcome of the match in 2 sentences.
          - Insights: Insights and prospects for both teams in 2 sentences.

          Separate each section clearly using labels as shown below:
          Historical: [Your response here]
          Prediction: [Your response here]
          Insights: [Your response here]
        `;

        const result = await runChat(prompt);

        // Parse the response using regex
        const historical =
          result.match(/Historical:\s*(.+)/)?.[1]?.trim() || "";
        const prediction =
          result.match(/Prediction:\s*(.+)/)?.[1]?.trim() || "";
        const insights = result.match(/Insights:\s*(.+)/)?.[1]?.trim() || "";

        setResponse({ historical, prediction, insights });
      } catch (error) {
        console.error("Error fetching prediction:", error);
        setResponse({
          historical: "Unable to fetch historical data.",
          prediction: "Unable to fetch prediction.",
          insights: "Unable to fetch insights.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [game]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>
        {parsedGame.teams.away.team.name} vs {parsedGame.teams.home.team.name}
      </Text>

      <View style={styles.teamContainer}>
        <WebView
          originWhitelist={["*"]}
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
          originWhitelist={["*"]}
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
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Historical Data:</Text>
            <Text style={styles.sectionContent}>
              {response.historical || "No historical data available."}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prediction:</Text>
            <Text style={styles.sectionContent}>
              {response.prediction || "No prediction available."}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insights:</Text>
            <Text style={styles.sectionContent}>
              {response.insights || "No insights available."}
            </Text>
          </View>
        </>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/")}
      >
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MatchDetails;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
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
    textAlign: "center",
    marginVertical: 10,
  },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  sectionContent: { fontSize: 16, marginTop: 10 },
  backButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignSelf: "center",
  },
  backButtonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
