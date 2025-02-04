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
import { SvgUri } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import runChat from "../../services/gemini";
import { Colors } from "@/constants/Colors";

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
    <View style={styles.container}>
      {/* Back Button (Top) */}
      <TouchableOpacity
        style={styles.backButtonTop}
        onPress={() => router.push("/(tabs)/home")}
      >
        <Ionicons name="arrow-back-circle" size={35} color="#664DF3" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>
          {parsedGame.teams.away.team.name} vs {parsedGame.teams.home.team.name}
        </Text>

        {/* Horizontal Team Logos */}
        <View style={styles.teamsContainer}>
          <View style={styles.team}>
            <SvgUri
              uri={`https://www.mlbstatic.com/team-logos/${parsedGame.teams.away.team.id}.svg`}
              width={80}
              height={80}
            />
            <Text style={styles.teamName}>
              {parsedGame.teams.away.team.name}
            </Text>
          </View>

          <Text style={styles.vsText}>VS</Text>

          <View style={styles.team}>
            <SvgUri
              uri={`https://www.mlbstatic.com/team-logos/${parsedGame.teams.home.team.id}.svg`}
              width={80}
              height={80}
            />
            <Text style={styles.teamName}>
              {parsedGame.teams.home.team.name}
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color="gray" />
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

        {/* Go Back Button (Bottom) */}
        <TouchableOpacity
          style={styles.bottomBackButton}
          onPress={() => router.push("/")}
        >
          {/* <Ionicons name="arrow-back" size={20} color="#ffffff" /> */}
          <Text style={styles.bottomBackText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default MatchDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  backButtonTop: {
    position: "absolute",
    top: 30,
    left: 20,
    zIndex: 10,
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  heading: {
    fontSize: 24,
    marginTop: 40,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  teamsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "90%",
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  team: {
    alignItems: "center",
  },
  teamName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#bbbbbb",
    marginTop: 10,
    textAlign: "center",
  },
  vsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginHorizontal: 10,
  },
  section: {
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 15,
    width: "90%",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  sectionContent: {
    fontSize: 16,
    color: "#cccccc",
    marginTop: 10,
  },
  bottomBackButton: {
    alignItems: "center",
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    width: "90%",
  },
  bottomBackText: {
    color: "#ffffff",
    fontSize: 16,
    marginLeft: 5,
  },
});
