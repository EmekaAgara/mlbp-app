import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import WebView from "react-native-webview";

const NEWS_API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY;
const YOUTUBE_API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;

const NEWS_API_URL = `https://newsapi.org/v2/everything?q=baseball&apiKey=${NEWS_API_KEY}`;
const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=baseball+highlights&key=${YOUTUBE_API_KEY}`;

export default function highlights() {
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [categories, setCategories] = useState([
    "All",
    "News",
    "Videos",
    "Highlights",
    "MLB",
  ]);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData([...news, ...videos]); // Display all data if search query is empty
    } else {
      const filteredNews = news.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const filteredVideos = videos.filter((item) =>
        item.snippet.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData([...filteredNews, ...filteredVideos]);
    }
  }, [searchQuery, news, videos]);

  const renderItem = ({ item }) => {
    if (item.snippet) {
      // Video item
      return (
        <TouchableOpacity onPress={() => setSelectedItem(item)}>
          <View style={styles.videoCard}>
            <Image
              source={{ uri: item.snippet.thumbnails.medium.url }}
              style={styles.videoThumbnail}
            />
            <Text style={styles.videoTitle}>{item.snippet.title}</Text>
            <Text style={styles.videoDescription}>
              {item.snippet.description.slice(0, 100)}...
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      // News item
      return (
        <TouchableOpacity onPress={() => setSelectedItem(item)}>
          <View style={styles.newsCard}>
            <Image
              source={{
                uri: item.urlToImage || "https://via.placeholder.com/150",
              }}
              style={styles.newsThumbnail}
            />
            <View style={styles.newsTextContainer}>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsDescription}>
                {item.description
                  ? item.description.slice(0, 100) + "..."
                  : "No description available."}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const renderSelectedItem = () => {
    if (selectedItem?.snippet) {
      // Video details
      return (
        <WebView
          source={{
            uri: `https://www.youtube.com/embed/${selectedItem.id.videoId}`,
          }}
          style={styles.webview}
        />
      );
    } else {
      // News details
      return (
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{selectedItem.title}</Text>
          <Image
            source={{
              uri: selectedItem.urlToImage || "https://via.placeholder.com/150",
            }}
            style={styles.detailsImage}
          />
          <Text style={styles.description}>
            {selectedItem.description || "No description available."}
          </Text>
          <Text style={styles.fullContent}>
            {selectedItem.content || "No full content available."}
          </Text>
        </View>
      );
    }
  };

  if (loading) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      {selectedItem ? (
        <>
          {renderSelectedItem()}
          <TouchableOpacity
            onPress={() => setSelectedItem(null)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back to Highlights</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.searchBar}
            placeholder="Search news or highlights..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Categories Section */}
          <ScrollView horizontal style={styles.categoriesList}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryButton}
                onPress={() => console.log(category)}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView horizontal style={styles.videoList}>
            {videos.slice(0, 5).map((item) => (
              <TouchableOpacity
                key={item.id.videoId}
                onPress={() => setSelectedItem(item)}
              >
                <View style={styles.videoCard}>
                  <Image
                    source={{ uri: item.snippet.thumbnails.medium.url }}
                    style={styles.videoThumbnail}
                  />
                  <Text style={styles.videoTitle}>{item.snippet.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Baseball News</Text>
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) =>
              item.id?.videoId || item.url || index.toString()
            }
            renderItem={renderItem}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F4F4F4" },
  searchBar: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  categoriesList: { marginBottom: 16 },
  categoryButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  categoryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  videoList: { marginBottom: 16 },
  videoCard: {
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 180,
    alignItems: "center",
    padding: 10,
    elevation: 3,
  },
  videoThumbnail: {
    width: 160,
    height: 90,
    borderRadius: 10,
    marginBottom: 8,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
  },
  newsCard: {
    flexDirection: "row",
    marginBottom: 16,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  newsThumbnail: { width: 120, height: 120, borderRadius: 8, marginRight: 12 },
  newsTextContainer: { flex: 1 },
  newsTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  newsDescription: { fontSize: 14, color: "#555" },
  detailsContainer: { flex: 1, alignItems: "center", padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  detailsImage: { width: "100%", height: 200, marginBottom: 16 },
  description: { fontSize: 16, color: "#555", textAlign: "center" },
  fullContent: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginTop: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginTop: 24 },
  backButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#007BFF",
    borderRadius: 30,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  webview: { flex: 1, marginTop: 16 },
});
