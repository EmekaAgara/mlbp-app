import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { Colors } from "@/constants/Colors";

export default function Login() {
  const { signIn } = useSignIn();
  const router = useRouter();
  const [identifier, setIdentifier] = useState(""); // Username or email
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Error", "Please enter your username/email and password.");
      return;
    }

    try {
      setLoading(true);
      await signIn.create({
        identifier, // Accepts either email or username
        password,
      });

      Alert.alert("Login Successful", "Welcome back!");
      router.push("/(tabs)/home"); // Navigate to the tabs screen
    } catch (err) {
      Alert.alert("Login Error", err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/Solvv-logo.png")}
          style={styles.logo}
        />
      </View>
      <Text style={styles.title}>Sign in to your MLBP Account</Text>
      <Text style={styles.subtitle}>Fill in your details to continue</Text>

      <Text style={styles.label}>Username or Email Address</Text>
      <TextInput
        style={[
          styles.input,
          focusedField === "identifier" && styles.inputFocused,
        ]}
        placeholder="Enter Username or Email"
        value={identifier}
        onChangeText={setIdentifier}
        placeholderTextColor="#888" // Light gray placeholder text
        autoCapitalize="none"
        keyboardType="default"
        onFocus={() => setFocusedField("identifier")}
        onBlur={() => setFocusedField("")}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={[
          styles.input,
          focusedField === "password" && styles.inputFocused,
        ]}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter your Password"
        placeholderTextColor="#888" // Light gray placeholder text
        onFocus={() => setFocusedField("password")}
        onBlur={() => setFocusedField("")}
      />

      <TouchableOpacity
        onPress={() => router.push("auth/signup")}
        style={styles.forgotlink}
      >
        <Text style={styles.forgotlinkText}>Forgot Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? <ActivityIndicator size="small" color="gray" /> : "Log In"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("auth/signup")}
        style={styles.link}
      >
        <Text style={styles.linkText}>Don’t have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#000000", // Dark background
  },
  logoContainer: {
    alignItems: "center",
    marginTop: -100,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#fff", // White text
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "regular",
    marginBottom: 35,
    color: "#888", // Light gray text
  },
  input: {
    borderWidth: 1,
    borderColor: "#333", // Darker border
    padding: 22,
    marginBottom: 18,
    borderRadius: 8,
    backgroundColor: "#1e1e1e", // Dark input background
    color: "#fff", // White text
  },
  inputFocused: {
    borderColor: Colors.PRIMARY, // Highlight focused input
  },
  button: {
    padding: 22,
    borderRadius: 7,
    backgroundColor: Colors.PRIMARY,
    marginTop: 7,
    width: "100%",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff", // White text
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    alignItems: "center",
  },
  linkText: {
    fontSize: 13,
    color: Colors.PRIMARY,
    fontWeight: "bold",
  },
  forgotlink: {
    marginTop: -10,
    marginBottom: 5,
    alignItems: "flex-end",
  },
  forgotlinkText: {
    fontSize: 12,
    color: Colors.PRIMARY,
  },
});
