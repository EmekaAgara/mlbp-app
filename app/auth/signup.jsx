import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { Colors } from "@/constants/Colors";

export default function Signup() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [focusedField, setFocusedField] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName: fullName.split(" ")[0],
        lastName: fullName.split(" ").slice(1).join(" "),
        username,
        publicMetadata: { phoneNumber },
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      Alert.alert("Sign Up Error", err.message || "An error occurred.");
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.push("/(tabs)/home");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      Alert.alert("Verification Error", err.message || "An error occurred.");
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/Solvv-logo.png")}
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>Verify Your Email Address</Text>
        <Text style={styles.subtitle}>
          Enter the verification code sent to your email
        </Text>
        <TextInput
          style={[styles.input, focusedField === "code" && styles.inputFocused]}
          value={code}
          placeholder="Enter verification code"
          placeholderTextColor="#888"
          onChangeText={setCode}
          onFocus={() => setFocusedField("code")}
          onBlur={() => setFocusedField("")}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.button} onPress={onVerifyPress}>
          <Text style={styles.buttonText}>Verify Email</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/Solvv-logo.png")}
          style={styles.logo}
        />
      </View>
      <Text style={styles.title}>Create Your Account</Text>
      <Text style={styles.subtitle}>Fill in your details to continue</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={[
          styles.input,
          focusedField === "fullName" && styles.inputFocused,
        ]}
        value={fullName}
        placeholder="Enter your full name"
        placeholderTextColor="#888"
        onChangeText={setFullName}
        onFocus={() => setFocusedField("fullName")}
        onBlur={() => setFocusedField("")}
      />

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={[
          styles.input,
          focusedField === "username" && styles.inputFocused,
        ]}
        value={username}
        placeholder="Enter a username"
        placeholderTextColor="#888"
        onChangeText={setUsername}
        onFocus={() => setFocusedField("username")}
        onBlur={() => setFocusedField("")}
      />

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={[
          styles.input,
          focusedField === "emailAddress" && styles.inputFocused,
        ]}
        value={emailAddress}
        placeholder="Enter your email"
        placeholderTextColor="#888"
        onChangeText={setEmailAddress}
        onFocus={() => setFocusedField("emailAddress")}
        onBlur={() => setFocusedField("")}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={[
          styles.input,
          focusedField === "password" && styles.inputFocused,
        ]}
        value={password}
        placeholder="Enter your password"
        placeholderTextColor="#888"
        onChangeText={setPassword}
        onFocus={() => setFocusedField("password")}
        onBlur={() => setFocusedField("")}
        secureTextEntry
      />

      {/* <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={[
          styles.input,
          focusedField === "phoneNumber" && styles.inputFocused,
        ]}
        value={phoneNumber}
        placeholder="Enter your phone number"
        placeholderTextColor="#888"
        onChangeText={setPhoneNumber}
        onFocus={() => setFocusedField("phoneNumber")}
        onBlur={() => setFocusedField("")}
        keyboardType="phone-pad"
      /> */}

      <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("auth/login")}
        style={styles.link}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
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
    width: 50,
    height: 50,
    borderRadius: 10,
    marginBottom: 10,
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
  label: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff", // White text
  },
  input: {
    borderWidth: 1,
    borderColor: "#333", // Darker border
    padding: 19,
    marginBottom: 18,
    borderRadius: 8,
    backgroundColor: "#1e1e1e", // Dark input background
    color: "#fff", // White text
  },
  inputFocused: {
    borderColor: Colors.PRIMARY, // Highlight focused input
  },
  button: {
    padding: 19,
    borderRadius: 7,
    backgroundColor: Colors.PRIMARY,
    marginTop: 7,
    width: "100%",
    alignItems: "center",
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
});
