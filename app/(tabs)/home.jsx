import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";

const Home = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const season = 2025;

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          `https://statsapi.mlb.com/api/v1/schedule?sportId=1&season=${season}`
        );
        setSchedule(response.data.dates || []);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const renderGame = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.date}>{item.date}</Text>
      {item.games.map((game, index) => (
        <TouchableOpacity
          key={index}
          style={styles.gameContainer}
          onPress={() =>
            router.push({
              pathname: "/match-details",
              params: { game: JSON.stringify(game) },
            })
          }
        >
          <View style={styles.teamContainer}>
            <WebView
              source={{
                uri: `https://www.mlbstatic.com/team-logos/${game.teams.away.team.id}.svg`,
              }}
              style={styles.logo}
            />
            <Text style={styles.teamName}>{game.teams.away.team.name}</Text>
          </View>
          <Text style={styles.vsText}>vs</Text>
          <View style={styles.teamContainer}>
            <WebView
              source={{
                uri: `https://www.mlbstatic.com/team-logos/${game.teams.home.team.id}.svg`,
              }}
              style={styles.logo}
            />
            <Text style={styles.teamName}>{game.teams.home.team.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recent MLB Games</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <FlatList
          data={schedule}
          renderItem={renderGame}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff", padding: 20 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  date: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  gameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  teamContainer: { alignItems: "center", flex: 1 },
  logo: { width: 50, height: 50 },
  teamName: { fontSize: 14, textAlign: "center", fontWeight: "600" },
  vsText: { fontSize: 18, fontWeight: "bold", color: "#333" },
});
