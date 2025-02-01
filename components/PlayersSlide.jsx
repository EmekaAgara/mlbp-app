import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { fetchSeasonPlayers } from "../services/api";
import { MaterialIcons } from "@expo/vector-icons"; // For verification and star icons

export default function PlayersSlide() {
  const [prospects, setProspects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const players = await fetchSeasonPlayers(2024);
        setProspects(players);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPlayers();
  }, []);

  const filteredProspects = prospects.filter((player) =>
    player.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Always show search input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search players..."
        placeholderTextColor="#ccc"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Text style={styles.heading}>Top Players</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00BFFF" style={styles.loader} />
      ) : filteredProspects.length === 0 ? (
        <Text style={styles.noResults}>No players found.</Text>
      ) : (
        <FlatList
          data={filteredProspects}
          pagingEnabled
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: item.teamColor || "#333" },
              ]}
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
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#121212",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#ffffff", // White text for dark theme
  },
  searchInput: {
    borderWidth: 0.3,
    borderColor: "#666",
    padding: 17,
    borderRadius: 5,
    marginBottom: 15,
    color: "#fff",
    backgroundColor: "#1e1e1e",
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50%",
  },
  noResults: {
    textAlign: "center",
    fontSize: 16,
    color: "#aaa",
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
