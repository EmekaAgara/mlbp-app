import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { fetchPlayerDetails } from "../../services/api";

export default function PlayerDetails() {
  const { id } = useLocalSearchParams(); // Use this instead of useSearchParams
  const router = useRouter();
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
    <View style={styles.container}>
      <Image source={{ uri: player.headshotUrl }} style={styles.image} />
      <Text style={styles.name}>{player.fullName}</Text>
      <Text style={styles.team}>Team: {player.teamName}</Text>
      <Text style={styles.stats}>Batting Avg: {player.battingAverage}</Text>
      <Text style={styles.rank}>Prospect Rank: {player.prospectRank}</Text>
      <Text style={styles.prediction}>Prediction: {player.prediction}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  team: {
    fontSize: 16,
    color: "#555",
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
