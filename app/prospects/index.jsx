import { View, FlatList, TextInput, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { fetchSeasonPlayers } from "../../services/api";
import ProspectPredictionCard from "../../components/ProspectPredictionCard";

export default function Prospects() {
  const [prospects, setProspects] = useState([]);
  const [filteredProspects, setFilteredProspects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadPlayers = async () => {
      const players = await fetchSeasonPlayers(2024);
      const sortedPlayers = players.sort(
        (a, b) => a.prospectRank - b.prospectRank
      );
      setProspects(sortedPlayers);
      setFilteredProspects(sortedPlayers);
    };
    loadPlayers();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilteredProspects(
      prospects.filter((player) =>
        player.fullName.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search players..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredProspects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ProspectPredictionCard player={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  search: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
