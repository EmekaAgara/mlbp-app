import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { fetchPlayerDetails } from "../../services/api";

export default function PlayerDetails() {
  const { id } = useLocalSearchParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadPlayerDetails = async () => {
      try {
        const playerData = await fetchPlayerDetails(id);
        setPlayer(playerData);
      } catch (error) {
        console.error("Error fetching player details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayerDetails();
  }, [id]);

  if (loading) return <Text>Loading player details...</Text>;
  if (!player) return <Text>Player not found.</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: player.headshotUrl }} style={styles.image} />
      <Text style={styles.name}>{player.fullName}</Text>
      <Text style={styles.team}>Team: {player.teamName}</Text>
      <Text style={styles.info}>
        Age: {player.currentAge}, Country: {player.birthCountry}
      </Text>
      <Text style={styles.info}>
        Height: {player.height}, Weight: {player.weight} lbs
      </Text>
      <Text style={styles.info}>
        Position: {player.primaryPosition?.name || "N/A"} (
        {player.primaryPosition?.abbreviation || "N/A"})
      </Text>
      <Text style={styles.info}>
        Bat Side: {player.batSide?.description || "N/A"}
      </Text>
      <Text style={styles.info}>
        Pitch Hand: {player.pitchHand?.description || "N/A"}
      </Text>
      <Text style={styles.stats}>
        Strike Zone: {player.strikeZoneTop} - {player.strikeZoneBottom}
      </Text>
      <Text style={styles.rank}>Rank: {player.rank}</Text>
      <Text style={styles.prediction}>Prediction: {player.prediction}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    resizeMode: "contain",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  team: {
    fontSize: 18,
    color: "#555",
  },
  info: {
    fontSize: 16,
    color: "#444",
    marginVertical: 5,
  },
  stats: {
    fontSize: 16,
    color: "#777",
  },
  rank: {
    fontSize: 16,
    color: "#999",
  },
  prediction: {
    fontSize: 16,
    color: "#444",
    marginTop: 10,
  },
});
