import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";

const NEWS_API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY;
const NEWS_API_URL = `https://newsapi.org/v2/everything?apiKey=${NEWS_API_KEY}&url=`;

export default function HighlightDetails() {
  const router = useRouter();
  const { id } = router.query; // Using `router.query` to get the passed parameter
  const [highlight, setHighlight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchHighlightDetails = async () => {
      try {
        if (id.length === 11) {
          // Assume it's a YouTube video ID
          setHighlight({ type: "video", videoId: id });
        } else {
          // Fetch article details from the News API
          const response = await axios.get(
            NEWS_API_URL + encodeURIComponent(id)
          );
          const article = response?.data?.articles?.[0];

          if (article) {
            setHighlight({
              type: "news",
              article,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching highlight details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlightDetails();
  }, [id]);

  if (loading) return <Text>Loading...</Text>;
  if (!highlight) return <Text>No highlight details available.</Text>;

  return (
    <ScrollView style={styles.container}>
      {highlight.type === "news" && highlight.article ? (
        <>
          <Text style={styles.title}>{highlight.article.title}</Text>
          <Image
            source={{
              uri:
                highlight.article.urlToImage ||
                "https://via.placeholder.com/150",
            }}
            style={styles.image}
          />
          <Text style={styles.description}>
            {highlight.article.description || "No description available."}
          </Text>
          <Button
            title="Read Full Article"
            onPress={() => {
              router.push({ pathname: highlight.article.url });
            }}
          />
        </>
      ) : (
        <View>
          <Text style={styles.title}>YouTube Video</Text>
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${highlight.videoId}`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#ffffff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  image: { width: "100%", height: 200, marginBottom: 16 },
  description: { fontSize: 16, marginBottom: 16 },
});
