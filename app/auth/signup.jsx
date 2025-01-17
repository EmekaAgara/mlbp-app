import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
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
  const [role, setRole] = useState("");
  const [pickerVisible, setPickerVisible] = useState(false);
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
        publicMetadata: { role, phoneNumber },
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
        router.push("/(tabs)/home"); // Navigate to the tabs screen
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
        <Text style={styles.title}>Verify Your Email address</Text>
        <Text style={styles.subtitle}>
          Enter Verification code sent to your email
        </Text>
        <TextInput
          style={[styles.input, focusedField === "code" && styles.inputFocused]}
          value={code}
          placeholder="Enter verification code"
          placeholderTextColor="#000"
          onChangeText={(text) => setCode(text)}
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
      <Text style={styles.title}>Create Your account</Text>
      <Text style={styles.subtitle}>Fill in your details to continue</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={[
          styles.input,
          focusedField === "fullName" && styles.inputFocused,
        ]}
        value={fullName}
        placeholderTextColor="#000"
        placeholder="Enter your full name"
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
        placeholderTextColor="#000"
        placeholder="Enter a username"
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
        placeholderTextColor="#000"
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
        placeholderTextColor="#000"
        onChangeText={setPassword}
        onFocus={() => setFocusedField("password")}
        onBlur={() => setFocusedField("")}
        secureTextEntry
      />

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={[
          styles.input,
          focusedField === "phoneNumber" && styles.inputFocused,
        ]}
        value={phoneNumber}
        placeholder="Enter your phone number"
        placeholderTextColor="#000"
        onChangeText={setPhoneNumber}
        onFocus={() => setFocusedField("phoneNumber")}
        onBlur={() => setFocusedField("")}
        // keyboardType="phone-pad"
      />

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
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 2 },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12, // Reduced padding to make it more compact
    marginBottom: 12, // Reduced margin for compact spacing
    borderRadius: 8,
    height: 45, // Adjusted to make inputs more compact
  },
  inputFocused: {
    borderColor: Colors.PRIMARY,
  },
  button: {
    padding: 15,
    borderRadius: 7,
    backgroundColor: Colors.PRIMARY,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  picker: {
    fontSize: 15,
    backgroundColor: "#fff",
    color: "black", // Black text for Picker items
    height: 120, // Increased height for better scrollability
  },
  pickerItem: {
    color: "black", // Ensuring Picker item text is black
  },

  // start
  logoContainer: {
    alignItems: "center",
    // marginTop: -70,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: "2%",
    alignSelf: "flex-start",
  },

  subtitle: {
    fontSize: 14,
    fontWeight: "regular",
    marginBottom: 30,
    color: "gray",
  },
  label: { fontSize: 12, fontWeight: "bold", marginBottom: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { marginTop: 15, alignItems: "center" },
  linkText: { fontSize: 13, color: Colors.PRIMARY, fontWeight: "bold" },
  forgotlink: { marginTop: -10, marginBottom: 5, alignItems: "flex-end" },
  forgotlinkText: { fontSize: 12, color: Colors.PRIMARY },
});
