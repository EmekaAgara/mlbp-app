import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";
import { fetchSeasonPlayers } from "../../services/api";
import ProspectPredictionCard from "../../components/ProspectPredictionCard";

export default function Prospects() {
  const [prospects, setProspects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadPlayers = async () => {
      const players = await fetchSeasonPlayers(2024);
      setProspects(players);
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
      <FlatList
        data={filteredProspects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ProspectPredictionCard player={item} />}
      />
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
});
