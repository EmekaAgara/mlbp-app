import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Video } from "expo-av";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
// import AnimatedTextSlider from "./AnimatedTextSlider";
import { useAuth } from "@clerk/clerk-expo";

export default function GetStarted() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handlePress = () => {
    if (isSignedIn) {
      router.push("(tabs)/home"); // Navigate to tabs if logged in
    } else {
      // router.push("/auth/login"); // Navigate to signup if not logged in
      router.push("auth/login"); // Navigate to tabs if logged in
    }
    // router.push("(tabs)/home"); // Navigate to tabs if logged in
  };
  const texts = ["Hello", "Welcome", "To Animated Text Slider", "Enjoy!"];
  return (
    <View style={styles.container}>
      {/* Background Video */}
      <Video
        // source={require("../assets/images/splash.mp4")} // Replace with your video path
        source={require("../assets/images/splash.mp4")} // Replace with your video path
        style={StyleSheet.absoluteFill} // Full-screen video
        resizeMode="cover"
        isLooping
        shouldPlay
        isMuted
      />

      {/* Content Overlay */}
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/Solvv-logo.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            <Text style={styles.title}>Latest Major League Baseball</Text>
            <Text style={styles.primaryText}> MLBP</Text>
          </Text>
          <Text style={styles.subText}>
            Get all the Latest Major League Baseball highlights, prospective
            players, teams and more.
          </Text>
        </View>

        <TouchableOpacity onPress={handlePress} style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  subText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
    color: "white",
    fontFamily: "manrope",
    paddingBottom: "5",
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginTop: "10%",
    marginBottom: "120%",
  },
  textContainer: {
    borderRadius: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 37,
    lineHeight: 40,
    fontFamily: "manrope-extrabold",
    textAlign: "center",
    color: "white",
  },
  primaryText: {
    color: Colors.PRIMARY,
  },
  button: {
    padding: 18,
    borderRadius: 5,
    backgroundColor: Colors.PRIMARY,
    marginTop: 7,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "manrope-extrabold",
    fontSize: 17,
    fontWeight: 500,
  },
  slideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
