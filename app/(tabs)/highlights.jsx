import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import SvgUri from "react-native-svg-uri";

const highlights = () => {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeams();
    fetchPlayers();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch(
        "https://statsapi.mlb.com/api/v1/teams?sportId=1"
      );
      const data = await response.json();
      setTeams(data.teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await fetch(
        "https://statsapi.mlb.com/api/v1/sports/1/players?season=2025"
      );
      const data = await response.json();
      setPlayers(data.people);
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
        const response = await fetch(
          `https://statsapi.mlb.com/api/v1/teams/${teamId}/news`
        );
        const data = await response.json();
        highlightsData.push(...data.articles);
      }

      for (const playerId of selectedPlayers) {
        const response = await fetch(
          `https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=highlight`
        );
        const data = await response.json();
        highlightsData.push(...data.stats);
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

  const categories = ["All", "Game Recaps", "Player Highlights", "Team News"];

  return (
    <ScrollView style={{ backgroundColor: "#121212", padding: 16 }}>
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        Personalized Fan Highlights
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 16,
        }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor:
                selectedCategory === category ? "#722039" : "#1F2937",
              borderRadius: 16,
            }}
          >
            <Text style={{ color: "#FFFFFF" }}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "600" }}>
        Select Teams:
      </Text>
      <ScrollView horizontal style={{ marginBottom: 16 }}>
        {teams.map((team) => (
          <TouchableOpacity
            key={team.id}
            onPress={() => toggleSelection(team.id, "team")}
            style={{
              margin: 8,
              padding: 12,
              backgroundColor: selectedTeams.includes(team.id)
                ? "#0C4389"
                : "#1F2937",
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <SvgUri
              source={{
                uri: `https://www.mlbstatic.com/team-logos/${team.id}.svg`,
              }}
              width={50}
              height={50}
            />
            <Text style={{ color: "#FFFFFF", marginTop: 4 }}>{team.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "600" }}>
        Select Players:
      </Text>
      <ScrollView horizontal style={{ marginBottom: 16 }}>
        {players.slice(0, 20).map((player) => (
          <TouchableOpacity
            key={player.id}
            onPress={() => toggleSelection(player.id, "player")}
            style={{
              margin: 8,
              padding: 12,
              backgroundColor: selectedPlayers.includes(player.id)
                ? "#2563EB"
                : "#1F2937",
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <SvgUri
              source={{
                uri: `https://img.mlbstatic.com/headshots/mlb/latest/128x128/${player.id}.svg`,
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginBottom: 4,
              }}
            />
            <Text style={{ color: "#FFFFFF" }}>{player.fullName}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={fetchHighlights}
        style={{
          backgroundColor: "#722039",
          padding: 16,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}>
          Get Highlights
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FFFFFF"
          style={{ marginTop: 16 }}
        />
      ) : (
        <View style={{ marginTop: 16 }}>
          {highlights.map((highlight, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "#0C4389",
                padding: 16,
                borderRadius: 12,
                marginBottom: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              {highlight.image && (
                <Image
                  source={{ uri: highlight.image }}
                  style={{
                    width: "100%",
                    height: 200,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                />
              )}
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 4,
                }}
              >
                {highlight.headline || highlight.displayName}
              </Text>
              <Text style={{ color: "#9CA3AF" }}>
                {highlight.summary || highlight.description}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default highlights;
