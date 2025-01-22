import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../../components/Home/Header";
import axios from "axios";
import { Link, router, useRouter } from "expo-router";

const home = () => {
  const router = useRouter();

  const prospects = () => {
    // router.push("(tabs)/services"); // Navigate to the tabs screen
    router.push("prospects"); // Navigate to the tabs screen
  };
  const highlights = () => {
    router.push("highlights"); // Navigate to the tabs screen
  };
  const settings = () => {
    router.push("(tabs)/account"); // Navigate to the tabs screen
  };

  const [schedule, setSchedule] = useState([]);
  const season = 2025; // Update season dynamically if needed

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

  const renderGame = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.date}</Text>
      {item.games.map((game, index) => (
        <Text key={index}>
          {game.teams.away.team.name} vs {game.teams.home.team.name}
        </Text>
      ))}
    </View>
  );

  return (
    <View>
      <Header />

      <TouchableOpacity onPress={prospects} style={styles.logoutButton}>
        <Text style={styles.logoutText}>prospect prrediction</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={highlights} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Personalized highlights</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={settings} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Settings</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.heading}>Recent MLB Games</Text>
        <FlatList
          data={schedule}
          renderItem={renderGame}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: { padding: 20 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  card: { padding: 10, borderWidth: 1, marginBottom: 10, borderRadius: 5 },
  title: { fontSize: 18, fontWeight: "bold" },
  logoutButton: {
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
    marginTop: 20,
  },
  logoutText: { color: "white", fontWeight: "bold" },
});
