import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { WebView } from "react-native-webview";

const live = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MLB Condensed Game</Text>
      <WebView
        source={{
          uri: "https://www.mlb.com/video/condensed-game-lad-nyy-game-5",
        }}
        style={styles.webview}
        startInLoadingState={true}
        javaScriptEnabled={true}
      />
    </View>
  );
};

export default live;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    // padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  webview: {
    flex: 1,
    width: "100%",
    // marginTop: 10,
  },
});
