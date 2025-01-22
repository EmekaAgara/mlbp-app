import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";

// Replace with your actual API keys
const NEWS_API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY;
const YOUTUBE_API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;

const NEWS_API_URL = `https://newsapi.org/v2/everything?q=baseball&apiKey=${NEWS_API_KEY}`;
const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=baseball+highlights&key=${YOUTUBE_API_KEY}`;

export default function HighlightsPage() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsAndVideos = async () => {
      try {
        // Fetch MLB team-related sports news and blog posts
        const newsResponse = await axios.get(NEWS_API_URL);
        setNews(newsResponse.data.articles || []);

        // Fetch baseball-specific YouTube video highlights
        const videoResponse = await axios.get(YOUTUBE_API_URL);
        setVideos(videoResponse.data.items || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsAndVideos();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Baseball Highlights, News & Videos</Text>

      <Text style={styles.sectionTitle}>Latest Baseball News</Text>
      <FlatList
        data={news}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/highlights/${item.source.id}`)}
          >
            <View style={styles.card}>
              <Image
                source={{
                  uri: item.urlToImage || "https://via.placeholder.com/150",
                }}
                style={styles.thumbnail}
              />
              <Text style={styles.titleText}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.sectionTitle}>
        Baseball Video Highlights{YOUTUBE_API_KEY}
      </Text>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id.videoId}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/highlights/${item.id.videoId}`)}
          >
            <View style={styles.card}>
              <Image
                source={{ uri: item.snippet.thumbnails.medium.url }}
                style={styles.thumbnail}
              />
              <Text style={styles.titleText}>{item.snippet.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, marginBottom: 16 },
  sectionTitle: { fontSize: 22, marginTop: 24 },
  card: {
    flexDirection: "row",
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  thumbnail: { width: 100, height: 100, borderRadius: 8, marginRight: 12 },
  titleText: { fontSize: 16, fontWeight: "bold", color: "#333" },
});
