import { tokenCache } from "@/cache";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import {
  ClerkLoaded,
  ClerkProvider,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-expo";
import { Text } from "react-native";

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env");
  }

  const [fontsLoaded] = useFonts({
    manrope: require("../assets/fonts/Manrope-Regular.ttf"),
    "manrope-bold": require("../assets/fonts/Manrope-Bold.ttf"),
    "manrope-extrabold": require("../assets/fonts/Manrope-ExtraBold.ttf"),
    "manrope-extralight": require("../assets/fonts/Manrope-ExtraLight.ttf"),
    "manrope-light": require("../assets/fonts/Manrope-Light.ttf"),
    "manrope-medium": require("../assets/fonts/Manrope-Medium.ttf"),
    "manrope-semibold": require("../assets/fonts/Manrope-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>; // Add a loading fallback if fonts aren't ready
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <SignedIn>
          {/* Wrap `Stack` to define routes for signed-in users */}
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </SignedIn>
        <SignedOut>
          {/* Optionally, define separate routes for signed-out users */}
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            {/* Example: Redirect to a login screen */}
            <Stack.Screen name="login" redirect />
          </Stack>
        </SignedOut>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
