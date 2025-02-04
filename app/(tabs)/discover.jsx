import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { fetchSeasonPlayers } from "../../services/api";
import ProspectPredictionCard from "../../components/ProspectPredictionCard";
import PlayersSlidee from "../../components/PlayersSlidee";

export default function Discover() {
  const [prospects, setProspects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

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
      {/* Static Top Players Section */}
      <View style={styles.staticSection}>
        <Text style={styles.heading}>Discover Prospects</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search players..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <PlayersSlidee players={prospects} />
      </View>

      {/* Scrollable All Prospects Section */}
      <View style={styles.listContainer}>
        <Text style={styles.subheading}>All Prospects</Text>
        {loading ? (
          <ActivityIndicator size="small" color="gray" style={styles.loader} />
        ) : (
          <FlatList
            data={filteredProspects}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ProspectPredictionCard player={item} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 16,
  },
  staticSection: {
    paddingHorizontal: 12,
    paddingBottom: 15, // Space between static & scrollable section
  },
  listContainer: {
    flex: 1, // Allows vertical scrolling
    paddingHorizontal: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
    textAlign: "center",
  },
  subheading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
