import { View, Text, StyleSheet, Image, Button } from "react-native";
import { useSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";

// News API for fetching article details
const NEWS_API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY;
const NEWS_API_URL = `https://newsapi.org/v2/everything?apiKey=${NEWS_API_KEY}&url=`;

export default function HighlightDetails() {
  const { id } = useSearchParams();
  const [highlight, setHighlight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlightDetails = async () => {
      try {
        // Check if it's a YouTube video (ID is a videoId)
        if (id.length === 11) {
          setHighlight({ type: "video", videoId: id });
        } else {
          // Fetch article details from News API
          const articleResponse = await axios.get(
            NEWS_API_URL + encodeURIComponent(id)
          );
          setHighlight({
            type: "news",
            article: articleResponse.data.articles[0],
          });
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
  if (!highlight) return <Text>Highlight not found.</Text>;

  return (
    <View style={styles.container}>
      {highlight.type === "news" && highlight.article ? (
        <>
          <Text style={styles.title}>{highlight.article.title}</Text>
          <Image
            source={{ uri: highlight.article.urlToImage }}
            style={styles.image}
          />
          <Text style={styles.description}>
            {highlight.article.description || "No description available."}
          </Text>
          <Button
            title="Read Full Article"
            onPress={() => window.open(highlight.article.url, "_blank")}
          />
        </>
      ) : (
        <View style={styles.videoContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  image: { width: "100%", height: 200, marginBottom: 16 },
  description: { fontSize: 16, marginBottom: 16 },
  videoContainer: { flex: 1, alignItems: "center" },
});
