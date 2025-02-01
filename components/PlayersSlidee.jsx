import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function PlayersSlidee({ players }) {
  const router = useRouter();

  if (!players || players.length === 0) {
    return <Text style={styles.noPlayers}>No players available</Text>;
  }

  return (
    <View>
      <Text style={styles.heading}>Top Players</Text>
      <FlatList
        data={players.slice(0, 10)} // Limit to top 10 players
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: item.teamColor || "#333" }]}
            onPress={() => router.push(`/player/${item.id}`)}
          >
            <View style={styles.overlay} />
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>5.0</Text>
              <MaterialIcons name="star" size={19} color="gold" />
            </View>
            <Image source={{ uri: item.headshotUrl }} style={styles.image} />
            <View style={styles.info}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{item.fullName}</Text>
                <MaterialIcons
                  name="verified"
                  size={18}
                  color="#1DA1F2"
                  style={styles.verifiedIcon}
                />
              </View>
              <Text style={styles.details}>
                {item.primaryPosition?.name || "N/A"}
              </Text>
              <Text style={styles.details}>{item.currentAge}</Text>
            </View>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#ffffff",
  },
  noPlayers: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
  },
  horizontalList: {
    paddingVertical: 10,
  },
  card: {
    width: 200,
    marginRight: 12,
    padding: 15,
    borderRadius: 15,
    position: "relative",
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 15,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    marginBottom: 10,
  },
  info: {
    alignItems: "center",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginRight: 5,
  },
  verifiedIcon: {
    marginTop: 2,
  },
  ratingContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#ddd",
    fontWeight: "bold",
    marginRight: 1,
  },
  details: {
    fontSize: 14,
    color: "#ddd",
    textAlign: "center",
  },
});
