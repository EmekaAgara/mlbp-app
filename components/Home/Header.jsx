import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Colors } from "./../../constants/Colors";

export default function Header() {
  const { user } = useUser();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userSection}>
          {/* <Image
            source={require("../../assets/images/Solvv-logo.png")}
            style={styles.userImage}
          /> */}

          <View style={styles.textContainer}>
            <Text style={styles.userName}>MLB Insights</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.locationToggle}>
          <Image
            source={require("../../assets/images/Solvv-logo.png")}
            style={styles.userImage}
          />
          {/* <Text style={styles.userName}>{user?.fullName}</Text> */}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PRIMARY,
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 99,
    marginRight: 15,
    // backgroundColor: "#fff",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.01,
    shadowRadius: 4,
    elevation: 5,
  },
  textContainer: {
    justifyContent: "center",
  },
  welcomeText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "outfit",
  },
  userName: {
    paddingTop: 10,
    fontSize: 17,
    fontFamily: "outfit-bold",
    fontWeight: "bold",
    color: "#fff",
    paddingBottom: 5,
  },
  locationToggle: {
    flexDirection: "row",
    alignItems: "center",
    // padding: 10,
    borderRadius: 8,
  },

  locationToggleText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "outfit",
    marginLeft: 2,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 5,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 15,
    fontSize: 12,
    borderWidth: 1,
  },
  searchInput: {
    fontFamily: "outfit",
    fontSize: 12,
    marginLeft: 10,
    flex: 1,
    color: "#000",
  },
});
