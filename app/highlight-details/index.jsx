import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import Video from "react-native-video";

const HighlightDetails = ({ route }) => {
  const { highlight } = route.params;
  const parsedHighlight = JSON.parse(highlight);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{parsedHighlight.title}</Text>
      <Video
        source={{ uri: parsedHighlight.videoUrl }}
        style={styles.video}
        controls
      />
      <Text style={styles.description}>{parsedHighlight.description}</Text>
    </ScrollView>
  );
};

export default HighlightDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark theme background
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff", // White text for dark theme
    marginBottom: 16,
  },
  video: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#bbbbbb", // Light gray text for dark theme
  },
});
