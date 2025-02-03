import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ProspectPredictionCard({ player }) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.card}>
      <Link href={`/player/${player.id}`} style={styles.link}>
        {/* Centered Player Image */}
        <Image source={{ uri: player.headshotUrl }} style={styles.image} />

        {/* Player Details */}
        <View style={styles.info}>
          {/* <View style={styles.header}>
            <Text style={styles.name}>{player.fullName}</Text>
            <Ionicons name="checkmark-circle" size={18} color="#007BFF" />
          </View> */}
          <Text style={styles.detail}>
            <Text style={styles.name}>{player.fullName} </Text>
            <Ionicons name="checkmark-circle" size={18} color="#007BFF" />
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.label}>Position:</Text>{" "}
            {player.primaryPosition?.name || "N/A"}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.label}>Strike Zone:</Text>{" "}
            {player.strikeZoneTop} - {player.strikeZoneBottom}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.label}>Age:</Text> {player.currentAge} |
            Country: {player.birthCountry}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.label}>Rank:</Text> {player.rank}
          </Text>
        </View>
      </Link>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#333",
    width: "100%",
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#444",
    marginRight: 15,
    alignSelf: "center", // Centers image vertically
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    gap: 5,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  detail: {
    fontSize: 15,
    color: "#bbbbbb",
    marginTop: 3,
    marginLeft: 20,
  },
  label: {
    fontWeight: "bold",
    color: "#ffffff",
  },
});
