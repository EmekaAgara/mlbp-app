import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  StyleSheet,
} from "react-native";
import axios from "axios";

const Highlights = () => {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTeams();
    fetchPlayers();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(
        "https://statsapi.mlb.com/api/v1/teams?sportId=1"
      );
      setTeams(response.data.teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(
        "https://statsapi.mlb.com/api/v1/sports/1/players?season=2024"
      );
      setPlayers(response.data.people);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const toggleSelection = (id, type) => {
    if (type === "team") {
      setSelectedTeams((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setSelectedPlayers((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    }
  };

  const fetchHighlights = async () => {
    setLoading(true);
    const highlightsData = [];

    try {
      for (const teamId of selectedTeams) {
        const response = await axios.get(
          `https://statsapi.mlb.com/api/v1/teams/${teamId}/news`
        );
        highlightsData.push(...response.data.articles);
      }

      for (const playerId of selectedPlayers) {
        const response = await axios.get(
          `https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=highlight`
        );
        highlightsData.push(...response.data.stats);
      }

      const filteredHighlights =
        selectedCategory === "All"
          ? highlightsData
          : highlightsData.filter(
              (highlight) => highlight.category === selectedCategory
            );

      setHighlights(filteredHighlights);
    } catch (error) {
      console.error("Error fetching highlights:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlayers = players.filter((player) =>
    player.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={{ backgroundColor: "#121212", padding: 16 }}>
      <Text style={styles.header}>Personalized Fan Highlights</Text>

      <View style={styles.categoryContainer}>
        {["All", "Game Recaps", "Player Highlights", "Team News"].map(
          (category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={
                selectedCategory === category
                  ? styles.selectedCategory
                  : styles.categoryButton
              }
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search players..."
        placeholderTextColor="#9CA3AF"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView horizontal style={styles.selectionContainer}>
        {teams.map((team) => (
          <TouchableOpacity
            key={team.id}
            onPress={() => toggleSelection(team.id, "team")}
            style={
              selectedTeams.includes(team.id)
                ? styles.selectedItem
                : styles.item
            }
          >
            <Image
              source={{
                uri: `https://www.mlbstatic.com/team-logos/${team.id}.png`,
              }}
              style={styles.logo}
            />
            <Text style={styles.itemText}>{team.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView horizontal style={styles.selectionContainer}>
        {filteredPlayers.slice(0, 20).map((player) => (
          <TouchableOpacity
            key={player.id}
            onPress={() => toggleSelection(player.id, "player")}
            style={
              selectedPlayers.includes(player.id)
                ? styles.selectedItem
                : styles.item
            }
          >
            <Image
              source={{
                uri: `https://img.mlbstatic.com/headshots/mlb/latest/128x128/${player.id}.png`,
              }}
              style={styles.headshot}
            />
            <Text style={styles.itemText}>{player.fullName}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={fetchHighlights} style={styles.button}>
        <Text style={styles.buttonText}>Get Highlights</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          size="small"
          color="gray"
          style={{ marginTop: 16 }}
        />
      ) : (
        <View style={{ marginTop: 16 }}>
          {highlights.map((highlight, index) => (
            <View key={index} style={styles.highlightCard}>
              {highlight.image && (
                <Image
                  source={{ uri: highlight.image }}
                  style={styles.highlightImage}
                />
              )}
              <Text style={styles.highlightTitle}>
                {highlight.headline || highlight.displayName}
              </Text>
              <Text style={styles.highlightDescription}>
                {highlight.summary || highlight.description}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    paddingTop: 50,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  categoryButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#1F2937",
    borderRadius: 7,
  },
  selectedCategory: {
    backgroundColor: "#664DF3",
    borderRadius: 7,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  categoryText: {
    color: "#FFFFFF",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
    color: "#FFFFFF",
  },
  selectionContainer: {
    marginBottom: 16,
  },
  item: {
    margin: 8,
    padding: 12,
    backgroundColor: "#1F2937",
    borderRadius: 8,
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "#0C4389",
    margin: 8,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 4,
  },
  headshot: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 4,
  },
  itemText: {
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#664DF3",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  highlightCard: {
    backgroundColor: "#0C4389",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  highlightImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  highlightTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  highlightDescription: {
    color: "#9CA3AF",
  },
});

export default Highlights;
