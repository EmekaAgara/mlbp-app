import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { fetchSeasonPlayers } from "../../services/api";
import ProspectPredictionCard from "../../components/ProspectPredictionCard";

export default function Discover() {
  const [prospects, setProspects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const players = await fetchSeasonPlayers(2024);
        setProspects(players);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    loadPlayers();
  }, []);

  const filteredProspects = prospects.filter((player) =>
    player.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search players..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Show ActivityIndicator while loading players */}
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredProspects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ProspectPredictionCard player={item} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50%", // Center the ActivityIndicator vertically
  },
});
