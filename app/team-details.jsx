import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
// import Header from "../../components/Home/Header";
import axios from "axios";
import { useRouter } from "expo-router";

const home = () => {
  const router = useRouter();
  const [schedule, setSchedule] = useState([]);
  const [teams, setTeams] = useState({});
  const season = 2025; // Update season dynamically if needed

  // Fetch schedule data
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          `https://statsapi.mlb.com/api/v1/schedule?sportId=1&season=${season}`
        );
        setSchedule(response.data.dates || []);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchSchedule();
  }, []);

  // Fetch team details (logos and more)
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(
          `https://statsapi.mlb.com/api/v1/teams?sportId=1`
        );
        const teamsData = response.data.teams.reduce((acc, team) => {
          acc[team.id] = team; // Organize teams by ID for quick lookup
          return acc;
        }, {});
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  // Navigate to the Team Details page
  const handleGameClick = (game) => {
    router.push({
      pathname: "team-details", // Navigate to the team details page
      params: {
        homeTeamId: game.teams.home.team.id,
        awayTeamId: game.teams.away.team.id,
      },
    });
  };

  // Render individual games with team logos
  const renderGame = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.date}>{item.date}</Text>
      {item.games.map((game, index) => (
        <TouchableOpacity
          key={index}
          style={styles.gameContainer}
          onPress={() => handleGameClick(game)}
        >
          <View style={styles.teamContainer}>
            <Image
              source={{
                uri:
                  teams[game.teams.away.team.id]?.logo ||
                  "https://via.placeholder.com/50",
              }}
              style={styles.logo}
            />
            <Text style={styles.teamName}>{game.teams.away.team.name}</Text>
          </View>
          <Text style={styles.vsText}>vs</Text>
          <View style={styles.teamContainer}>
            <Image
              source={{
                uri:
                  teams[game.teams.home.team.id]?.logo ||
                  "https://via.placeholder.com/50",
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
      {/* <Header /> */}
      <ScrollView>
        <Text style={styles.heading}>Recent MLB Games</Text>
        <FlatList
          data={schedule}
          renderItem={renderGame}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  gameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  teamContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  teamName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  vsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#888",
  },
});
