import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
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
        // Fetch baseball-related news
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Baseball Highlights</Text>

      {/* Display videos horizontally */}
      <Text style={styles.sectionTitle}>Video Highlights</Text>
      <FlatList
        data={videos}
        horizontal
        keyExtractor={(item) => item.id.videoId}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/highlights/${item.id.videoId}`)}
          >
            <View style={styles.videoCard}>
              <Image
                source={{ uri: item.snippet.thumbnails.medium.url }}
                style={styles.videoThumbnail}
              />
              <Text style={styles.videoTitle}>{item.snippet.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Display news articles vertically */}
      <Text style={styles.sectionTitle}>Latest Baseball News</Text>
      <FlatList
        data={news}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push(`/highlights/${encodeURIComponent(item.url)}`)
            }
          >
            <View style={styles.newsCard}>
              <Image
                source={{
                  uri: item.urlToImage || "https://via.placeholder.com/150",
                }}
                style={styles.newsThumbnail}
              />
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>{item.title}</Text>
                <Text style={styles.newsDescription}>
                  {item.description || "No description available."}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: "bold", marginTop: 24 },
  videoCard: {
    width: 200,
    marginRight: 16,
    alignItems: "center",
  },
  videoThumbnail: {
    width: 200,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  videoTitle: {
    fontSize: 14,
    textAlign: "center",
  },
  newsCard: {
    flexDirection: "row",
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  newsThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  newsContent: {
    flex: 1,
    justifyContent: "center",
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  newsDescription: {
    fontSize: 14,
    color: "#555",
  },
});
