import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function account() {
  const router = useRouter();
  const { signOut } = useAuth();

  const logout = () => {
    signOut();
    router.push("GetStarted"); // Navigate to the tabs screen
    Alert.alert("Logged Out", "You can login later!");
  };
  const onboarding = () => {
    // signOut();
    router.push("Onboarding"); // Navigate to the tabs screen
    // Alert.alert("Logged Out", "You can login later!");
  };

  return (
    <View>
      <Text>account</Text>
      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onboarding} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Onboarding</Text>
      </TouchableOpacity>

      <View
        style={{
          padding: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 35,
          }}
        >
          {" "}
          Profile
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
    marginTop: 20,
  },
  logoutText: { color: "white", fontWeight: "bold" },
});
