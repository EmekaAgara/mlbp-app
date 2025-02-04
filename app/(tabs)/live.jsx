import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";

const { height, width } = Dimensions.get("window");

const live = () => {
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" color="gray" />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>MLB Condensed Game</Text> */}
      <WebView
        source={{
          uri: "https://www.mlb.com/video/condensed-game-lad-nyy-game-5",
        }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={renderLoading}
        javaScriptEnabled={true}
      />
    </View>
  );
};

export default live;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#fff",
  },
  webview: {
    flex: 1,
    width: "100%",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    height: height,
    width: width,
  },
});
