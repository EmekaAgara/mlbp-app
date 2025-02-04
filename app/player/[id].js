import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Icons for back button
import { fetchPlayerDetails } from "../../services/api";
import runChat from "../../services/gemini";
import { Colors } from "@/constants/Colors";

export default function PlayerDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playerInsights, setPlayerInsights] = useState({
    potential: "",
    careerImpact: "",
  });

  useEffect(() => {
    if (!id) return;

    const loadPlayerDetails = async () => {
      try {
        const playerData = await fetchPlayerDetails(id);
        setPlayer(playerData);

        // Generate insights using Gemini AI
        const prompt = `
          Analyze the potential and projected career impact of ${playerData.fullName}, 
          considering their current performance, historical data, and league comparisons.
          Format the response as follows:
          Potential: [Describe player potential in 2 sentences]
          Career Impact: [Describe projected career impact in 2 sentences]
        `;

        const result = await runChat(prompt);

        // Extract insights from Gemini response
        const potential = result.match(/Potential:\s*(.+)/)?.[1]?.trim() || "";
        const careerImpact =
          result.match(/Career Impact:\s*(.+)/)?.[1]?.trim() || "";

        setPlayerInsights({ potential, careerImpact });
      } catch (error) {
        console.error("Error fetching player details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayerDetails();
  }, [id]);

  if (loading)
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="gray" />
      </View>
    );

  if (!player) return <Text style={styles.errorText}>Player not found.</Text>;

  return (
    <View style={styles.container}>
      {/* G Back Button (Top) */}
      {/* <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/(tabs)/home")}
      >
        <Ionicons name="arrow-back-circle" size={35} color="#664DF3" />
      </TouchableOpacity> */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Player Image */}
        <Image source={{ uri: player.headshotUrl }} style={styles.image} />

        {/* Player Name with Blue Verification Tick */}
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{player.fullName}</Text>
          <Ionicons
            name="checkmark-circle"
            size={20}
            color="#00BFFF"
            style={styles.verifiedIcon}
          />
        </View>

        {/* Team Name */}
        <Text style={styles.team}>
          {" "}
          {player.primaryPosition?.name || "N/A"} (
          {player.primaryPosition?.abbreviation || "N/A"})
        </Text>

        {/* Player Stats */}
        <View style={styles.detailsContainer}>
          <Text style={styles.info}>
            <Text style={styles.label}>Age:</Text> {player.currentAge}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Country:</Text> {player.birthCountry}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Height & Weight:</Text> {player.height} -{" "}
            {player.weight} lbs
          </Text>
          {/* <Text style={styles.info}>
            <Text style={styles.label}>Weight:</Text> {player.weight} lbs
          </Text> */}
          {/* <Text style={styles.info}>
            <Text style={styles.label}>Position:</Text>{" "}
            {player.primaryPosition?.name || "N/A"} (
            {player.primaryPosition?.abbreviation || "N/A"})
          </Text> */}
          <Text style={styles.info}>
            <Text style={styles.label}>Bat Side:</Text>{" "}
            {player.batSide?.description || "N/A"}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Pitch Hand:</Text>{" "}
            {player.pitchHand?.description || "N/A"}
          </Text>
        </View>

        {/* Strike Zone */}
        <Text style={styles.stats}>
          <Text style={styles.label}>Strike Zone:</Text> {player.strikeZoneTop}{" "}
          - {player.strikeZoneBottom}
        </Text>

        {/* Google Gemini Insights */}
        <View style={styles.insightsContainer}>
          <Text style={styles.sectionTitle}>Player Potential:</Text>
          <Text style={styles.insightText}>
            {playerInsights.potential || "No potential insights available."}
          </Text>

          <Text style={styles.sectionTitle}>Projected Career Impact:</Text>
          <Text style={styles.insightText}>
            {playerInsights.careerImpact ||
              "No career impact insights available."}
          </Text>
        </View>

        {/* G Back Button (Bottom) */}
        <TouchableOpacity
          style={styles.bottomBackButton}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text style={styles.bottomBackText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  errorText: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
    marginTop: 50,
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    zIndex: 10,
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  image: {
    marginTop: 20,
    width: 120,
    height: 120,
    borderRadius: 80,
    resizeMode: "cover",
    borderWidth: 3,
    borderColor: Colors.PRIMARY,
    shadowColor: "#00BFFF",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  verifiedIcon: {
    marginLeft: 6,
  },
  team: {
    fontSize: 18,
    color: "#bbbbbb",
    marginBottom: 10,
  },
  detailsContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 15,
    width: "90%",
    marginVertical: 10,
  },
  info: {
    fontSize: 16,
    color: "#cccccc",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#ffffff",
  },
  stats: {
    fontSize: 16,
    color: "#cccccc",
    marginTop: 5,
    textAlign: "center",
  },
  insightsContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    padding: 15,
    width: "90%",
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  insightText: {
    fontSize: 16,
    color: "#cccccc",
    marginBottom: 10,
  },
  bottomBackButton: {
    // flexDirection: "row",
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
