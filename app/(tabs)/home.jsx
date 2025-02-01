import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import SvgUri from "react-native-svg-uri";
import PlayersSlide from "../../components/PlayersSlide";

const Home = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredGame, setFeaturedGame] = useState(null);
  const router = useRouter();
  const season = 2025;

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          `https://statsapi.mlb.com/api/v1/schedule?sportId=1&season=${season}`
        );
        const dates = response.data.dates || [];

        if (dates.length > 0 && dates[0].games.length > 0) {
          setFeaturedGame(dates[0].games[0]);
        }

        const upcomingGames = dates.slice(0, 11);
        setSchedule(upcomingGames);
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
            <SvgUri
              width="50"
              height="50"
              source={{
                uri: `https://www.mlbstatic.com/team-logos/${game.teams.away.team.id}.svg`,
              }}
            />
            <Text style={styles.teamName}>{game.teams.away.team.name}</Text>
          </View>
          <Text style={styles.vsText}>vs</Text>
          <View style={styles.teamContainer}>
            <SvgUri
              width="50"
              height="50"
              source={{
                uri: `https://www.mlbstatic.com/team-logos/${game.teams.home.team.id}.svg`,
              }}
            />
            <Text style={styles.teamName}>{game.teams.home.team.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logos}>MLB Prospects</Text>

      <ScrollView style={styles.container}>
        <View style={styles.playersSlideContainer}>
          <PlayersSlide limit={5} />
        </View>

        {featuredGame && (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/match-details",
                params: { game: JSON.stringify(featuredGame) },
              })
            }
          >
            <View style={styles.featuredGameContainer}>
              <Text style={styles.featuredGameHeading}>Featured Game</Text>
              <View style={styles.featuredGameCard}>
                <Text style={styles.featuredGameDate}>
                  {new Date(featuredGame.gameDate).toLocaleDateString()}
                </Text>
                <View style={styles.featuredGameTeams}>
                  <View style={styles.teamContainer}>
                    <SvgUri
                      width="80"
                      height="80"
                      source={{
                        uri: `https://www.mlbstatic.com/team-logos/${featuredGame.teams.away.team.id}.svg`,
                      }}
                    />
                    <Text style={styles.featuredTeamName}>
                      {featuredGame.teams.away.team.name}
                    </Text>
                  </View>
                  <Text style={styles.vsText}>vs</Text>
                  <View style={styles.teamContainer}>
                    <SvgUri
                      width="80"
                      height="80"
                      source={{
                        uri: `https://www.mlbstatic.com/team-logos/${featuredGame.teams.home.team.id}.svg`,
                      }}
                    />
                    <Text style={styles.featuredTeamName}>
                      {featuredGame.teams.home.team.name}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}

        <Text style={styles.heading}>Upcoming Games</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <FlatList
            data={schedule}
            renderItem={renderGame}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 12,
  },
  logos: {
    fontSize: 15,
    fontWeight: "bold",
    padding: 12,
    color: "#ffffff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#ffffff",
  },
  playersSlideContainer: {
    marginBottom: 24,
  },
  featuredGameContainer: {
    marginBottom: 24,
  },
  featuredGameHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#ffffff",
  },
  featuredGameCard: {
    backgroundColor: "#722039",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredGameDate: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#bbbbbb",
    textAlign: "center",
  },
  featuredGameTeams: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  featuredTeamName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#0C4389",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#bbbbbb",
    textAlign: "center",
  },
  gameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  teamContainer: {
    alignItems: "center",
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    paddingTop: 10,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
  },
  vsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginHorizontal: 16,
  },
});
