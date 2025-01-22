import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function ProspectPredictionCard({ player }) {
  return (
    <TouchableOpacity>
      <Link href={`/player/${player.id}`} style={styles.card}>
        <Image source={{ uri: player.headshotUrl }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{player.fullName}</Text>
          <Text style={styles.team}>Team: {player.teamName}</Text>
          <Text style={styles.stats}>Batting Avg: {player.battingAverage}</Text>
          <Text style={styles.rank}>Rank: {player.prospectRank}</Text>
        </View>
      </Link>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    elevation: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  team: {
    fontSize: 14,
    color: "#555",
  },
  stats: {
    fontSize: 14,
    color: "#777",
  },
  rank: {
    fontSize: 14,
    color: "#999",
  },
});
