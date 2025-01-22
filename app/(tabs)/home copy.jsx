import { StyleSheet, View, Text, FlatList, Image, Button } from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../../components/Home/Header";
import axios from "axios";
import { Link } from "expo-router";

const home = () => {
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
      <Link href="/prospects">
        <Button title="Prospect Prediction" />
      </Link>
      <Link href="/highlights">
        <Button title="Personalized Highlights" />
      </Link>
      <Link href="/settings">
        <Button title="Settings" />
      </Link>
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
});
